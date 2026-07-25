const ElimuApi = {
  async generateStudyContent(payload) {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ombi la AI limeshindikana. Jaribu tena.');
    }

    return data;
  },
};
