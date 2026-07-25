const express = require('express');
const path = require('path');
const aiRouter = require('./routes/ai');

const app = express();
const port = process.env.PORT || 3000;
const publicRoot = path.resolve(__dirname, '../..');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicRoot));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    app: 'ElimuAI',
    status: 'ready',
    message: 'ElimuAI backend iko tayari kusaidia wanafunzi wa Tanzania.',
  });
});

app.use('/api/ai', aiRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(publicRoot, 'index.html'));
});

app.listen(port, () => {
  console.log(`ElimuAI server running on http://localhost:${port}`);
});
