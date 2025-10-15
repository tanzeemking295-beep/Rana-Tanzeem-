const jwt = require('jsonwebtoken');
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const body = req.body || {};
  const key = body.key;
  const ACCESS_KEY = process.env.ACCESS_KEY;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!key) return res.status(400).json({ error: 'No key' });
  if (!ACCESS_KEY || !JWT_SECRET) return res.status(500).json({ error: 'Server not configured' });
  if (key !== ACCESS_KEY) return res.status(401).json({ error: 'Invalid key' });
  const token = jwt.sign({ access: true }, JWT_SECRET, { expiresIn: '1h' });
  res.setHeader('Set-Cookie', `kami_token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);
  res.status(200).json({ ok: true });
};
