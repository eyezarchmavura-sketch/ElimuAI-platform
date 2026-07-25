const labels = {
  summary: 'Muhtasari',
  explain: 'Maelezo Rahisi',
  quiz: 'Maswali ya Mazoezi',
  essay: 'Insha',
  notes: 'Madokezo ya Somo',
  translate: 'Tafsiri ya Kiswahili',
};

const levels = {
  primary: 'Msingi (Darasa 1–7)',
  secondary: 'Sekondari (Form 1–6)',
  university: 'Chuo Kikuu',
  adult: 'Watu Wazima',
};

const lengths = {
  short: 'mfupi',
  medium: 'wa wastani',
  long: 'wa kina',
};

function buildPrompt({ type, level, length, input }) {
  return `Wewe ni ElimuAI, msaidizi wa elimu kwa wanafunzi wa Tanzania. Jibu kwa Kiswahili sanifu, rahisi kueleweka, lenye mifano ya maisha ya Tanzania inapofaa. Aina ya kazi: ${labels[type]}. Kiwango: ${levels[level]}. Urefu: ${lengths[length]}. Ikiwa ni maswali, tengeneza maswali ya mazoezi yenye mtindo wa NECTA na majibu mafupi. Usibuni ukweli usio na uhakika; toa tahadhari mwanafunzi athibitishe na mwalimu au kitabu rasmi inapohitajika. Mada/Maandishi: ${input}`;
}

function localStudyDraft({ type, level, length, input }) {
  const title = labels[type] || labels.summary;
  const levelLabel = levels[level] || levels.secondary;
  const lengthLabel = lengths[length] || lengths.medium;
  const topic = input.length > 140 ? `${input.slice(0, 140)}...` : input;

  if (type === 'quiz') {
    return `${title} — ${levelLabel}\n\nMada: ${topic}\n\n1. Eleza maana kuu ya mada hii kwa maneno yako mwenyewe.\nJibu fupi: Taja hoja kuu 2–3 na mfano mmoja wa maisha halisi.\n\n2. Kwa nini mada hii ni muhimu kwa mwanafunzi wa Tanzania?\nJibu fupi: Inaonyesha matumizi yake shuleni, nyumbani, au katika jamii.\n\n3. Toa mfano mmoja unaohusiana na mazingira ya Tanzania.\nJibu fupi: Mfano uwe rahisi, kama shamba, sokoni, darasani, usafiri, au afya.\n\n4. Andika tofauti kati ya dhana mbili muhimu katika mada hii.\nJibu fupi: Linganisha maana, matumizi, na matokeo yake.\n\n5. Swali la kujipima: mwanafunzi anawezaje kutumia maarifa haya kutatua tatizo?\nJibu fupi: Eleza hatua 3 za kutatua tatizo.\n\nKumbuka: Hili ni jibu la mfano la ndani. Weka OPENAI_API_KEY ili kupata majibu ya AI yaliyozalishwa moja kwa moja.`;
  }

  return `${title} — ${levelLabel}\n\nMada: ${topic}\n\nHili ni jibu ${lengthLabel} lililoandaliwa kwa Kiswahili rahisi kwa mwanafunzi wa Tanzania.\n\nHoja kuu:\n• Anza kwa kuelewa maana ya mada badala ya kukariri.\n• Gawa mada katika vipengele vidogo: maana, sababu, mifano, matumizi, na hitimisho.\n• Tumia mifano ya kila siku kama darasa, familia, kilimo, biashara ndogo, afya, au mazingira.\n• Baada ya kusoma, jibu maswali mafupi ili kujipima.\n\nMfano wa kuelewa:\nIkiwa mada ni ya sayansi, jiulize: kitu gani kinatokea, kwa nini kinatokea, na tunawezaje kukiona katika maisha ya kawaida? Ikiwa ni historia au uraia, jiulize: tukio lilitokea lini, nani walihusika, kwa nini ni muhimu, na linafundisha nini leo?\n\nHatua za kusoma vizuri:\n1. Soma maelezo ya msingi.\n2. Andika maneno mapya na maana zake.\n3. Tengeneza mfano wako mwenyewe.\n4. Jibu maswali 3–5 bila kuangalia majibu.\n5. Muulize mwalimu sehemu ambayo bado hujaielewa.\n\nKumbuka: Hili ni jibu la mfano la ndani. Weka OPENAI_API_KEY ili kupata majibu ya AI yaliyozalishwa moja kwa moja.`;
}

async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: prompt,
      temperature: 0.4,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI request failed');
  }

  return data.output_text || data.output?.flatMap((item) => item.content || []).map((content) => content.text || '').join('\n').trim();
}

async function generateStudyContent(payload) {
  const prompt = buildPrompt(payload);

  if (!process.env.OPENAI_API_KEY) {
    return {
      result: localStudyDraft(payload),
      demo: true,
      provider: 'local-fallback',
    };
  }

  const result = await callOpenAI(prompt);

  return {
    result,
    demo: false,
    provider: 'openai',
  };
}

module.exports = { generateStudyContent, buildPrompt, localStudyDraft };
