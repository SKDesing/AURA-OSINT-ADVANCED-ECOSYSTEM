const express = require('express');
const router = express.Router();

router.post('/investigate', async (req, res) => {
  const { target, type } = req.body;
  res.json({ status: 'success', target, type, message: 'Investigation lancée' });
});

router.post('/username', async (req, res) => {
  const { username } = req.body;
  res.json({ status: 'success', tool: 'sherlock', username });
});

router.post('/domain', async (req, res) => {
  const { domain } = req.body;
  res.json({ status: 'success', tools: ['theHarvester', 'whois'], domain });
});

module.exports = router;
