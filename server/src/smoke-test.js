const { generateStudyContent, buildPrompt } = require('./services/aiService');

async function main() {
  const payload = {
    type: 'quiz',
    level: 'secondary',
    length: 'medium',
    input: 'Sheria za Newton',
  };
  const prompt = buildPrompt(payload);
  const data = await generateStudyContent(payload);

  if (!prompt.includes('wanafunzi wa Tanzania')) {
    throw new Error('Prompt is missing Tanzania learner guidance.');
  }

  if (!data.result.includes('Maswali')) {
    throw new Error('Fallback response did not include quiz content.');
  }

  console.log(JSON.stringify({ ok: true, provider: data.provider, demo: data.demo }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
