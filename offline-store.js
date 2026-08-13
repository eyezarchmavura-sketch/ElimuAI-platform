/* Elimu AI offline storage facade.
 *
 * Responsibilities:
 * - Register the service worker when served from localhost or HTTPS.
 * - Persist catalog metadata, text-first topic packs, learner sessions, and download manifests in IndexedDB.
 * - Delegate HTTP response caching and learner-pinned files to the service worker.
 * - Expose storage estimates without forcing a persistent-storage prompt.
 */
(function () {
  'use strict';

  const DB_NAME = 'elimu-ai-offline';
  const DB_VERSION = 1;
  const STORES = {
    catalog: 'catalog',
    topicPacks: 'topicPacks',
    sessions: 'sessions',
    downloads: 'downloads'
  };

  let databasePromise;
  let registrationPromise;

  function openDatabase() {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB is not supported in this browser.'));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        Object.values(STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed.'));
    });
    return databasePromise;
  }

  async function put(storeName, value) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(value);
      tx.oncomplete = () => resolve(value);
      tx.onerror = () => reject(tx.error || new Error('IndexedDB write failed.'));
    });
  }

  async function get(storeName, id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const request = tx.objectStore(storeName).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('IndexedDB read failed.'));
    });
  }

  async function remove(storeName, id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error('IndexedDB delete failed.'));
    });
  }

  function postToWorker(message) {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return false;
    navigator.serviceWorker.controller.postMessage(message);
    return true;
  }

  async function register() {
    if (registrationPromise) return registrationPromise;
    registrationPromise = (async () => {
      if (!('serviceWorker' in navigator)) return { supported: false };
      try {
        const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        await navigator.serviceWorker.ready;
        document.documentElement.dataset.offlineReady = 'true';
        window.dispatchEvent(new CustomEvent('elimu:offline-ready', { detail: registration }));
        return { supported: true, registration };
      } catch (error) {
        document.documentElement.dataset.offlineReady = 'false';
        window.dispatchEvent(new CustomEvent('elimu:offline-error', { detail: error }));
        return { supported: true, error };
      }
    })();
    return registrationPromise;
  }

  async function saveCatalog(data) {
    const record = { id: 'current', data, savedAt: new Date().toISOString() };
    await put(STORES.catalog, record);
    postToWorker({ type: 'CACHE_CATALOG', payload: data });
    return record;
  }

  async function getCatalog() {
    const record = await get(STORES.catalog, 'current');
    return record ? record.data : null;
  }

  async function saveTopicPack(pack) {
    const record = {
      id: pack.id || `${pack.sourceId || 'topic'}:${pack.topicId || 'unknown'}:${pack.language || 'sw'}`,
      ...pack,
      savedAt: new Date().toISOString()
    };
    await put(STORES.topicPacks, record);
    postToWorker({ type: 'CACHE_TEXT', key: record.id, payload: record });
    return record;
  }

  async function getTopicPack(id) {
    return get(STORES.topicPacks, id);
  }

  async function saveSession(session) {
    if (!session || !session.id) return null;
    return put(STORES.sessions, { id: session.id, session, savedAt: new Date().toISOString() });
  }

  async function pinSource(metadata) {
    if (!metadata || !metadata.id || !metadata.url) throw new Error('A source id and URL are required.');
    const record = {
      id: metadata.id,
      ...metadata,
      status: 'queued',
      requestedAt: new Date().toISOString()
    };
    await put(STORES.downloads, record);
    postToWorker({ type: 'PIN_SOURCE', metadata: record });
    return record;
  }

  async function clearPinnedSource(id) {
    await remove(STORES.downloads, id);
    postToWorker({ type: 'REMOVE_SOURCE', id });
  }

  async function storageEstimate() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    return navigator.storage.estimate();
  }

  window.ElimuOffline = {
    STORES,
    openDatabase,
    register,
    saveCatalog,
    getCatalog,
    saveTopicPack,
    getTopicPack,
    saveSession,
    pinSource,
    clearPinnedSource,
    storageEstimate,
    postToWorker
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', register, { once: true });
  } else {
    register();
  }
})();
