const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
module.exports = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/kami_token=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return res.status(401).json({ error: 'Not authorized' });
  try { jwt.verify(token, JWT_SECRET); } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing url' });
  const allowed = ['cdn12isb.tamashaweb.com','cdn07isb.tamashaweb.com','cdn22lhr.tamashaweb.com','cdn23lhr.tamashaweb.com','cdn06khi.tamashaweb.com'];
  try {
    const u = new URL(decodeURIComponent(url));
    if (!allowed.includes(u.hostname)) return res.status(403).json({ error: 'Host not allowed' });
  } catch(err){
    return res.status(400).json({ error: 'Invalid url' });
  }
  try {
    const upstream = await fetch(decodeURIComponent(url), { headers: { 'User-Agent':'KamiFlexProxy/1.0' } });
    res.status(upstream.status);
    upstream.headers.forEach((v,k) => {
      if (['content-length','transfer-encoding','connection'].includes(k.toLowerCase())) return;
      res.setHeader(k, v);
    });
    const buf = await upstream.arrayBuffer();
    res.send(Buffer.from(buf));
  } catch(err){
    res.status(502).json({ error: 'Upstream fetch failed' });
  }
};
