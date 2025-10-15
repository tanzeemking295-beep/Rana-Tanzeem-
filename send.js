// api/send.js
// Serverless wrapper preserving your original send.js logic.
// Behavior: accepts POST with JSON body { phone }
// Normalizes phone (0/3/92 -> 92...), calls external API URL and returns response.

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    let { phone } = req.body || {};

    if (!phone) {
      return res.status(400).json({ status: 'error', message: 'Phone number is required' });
    }

    // Convert to string and trim
    phone = String(phone).trim();

    // Normalize number (same logic as your original)
    if (phone.startsWith('0')) {
      phone = '92' + phone.substring(1);
    } else if (phone.startsWith('3')) {
      phone = '92' + phone;
    } else if (!phone.startsWith('92')) {
      return res.status(400).json({ status: 'error', message: 'Wrong format. Must start with 0, 3, or 92' });
    }

    // Build external API URL (same as original)
    const apiUrl = `https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=${encodeURIComponent(phone)}`;

    // Use global fetch if available (Node 18+ / Vercel). Fallback to dynamic import of node-fetch if necessary.
    let fetchFn = global.fetch;
    if (!fetchFn) {
      // dynamic import node-fetch v2-compatible API
      try {
        // Note: If you deploy to Vercel, global fetch should exist; this fallback is for local older Node versions.
        // If you use node-fetch@3, you'd need ESM import; keeping this for broad compatibility.
        // If running locally, install node-fetch@2: npm i node-fetch@2
        // eslint-disable-next-line no-unused-vars
        const nodeFetch = await import('node-fetch');
        fetchFn = nodeFetch.default || nodeFetch;
      } catch (e) {
        console.error('fetch not available and node-fetch import failed:', e);
        return res.status(500).json({ status: 'error', message: 'Server cannot perform HTTP request' });
      }
    }

    // Call external API
    const response = await fetchFn(apiUrl, { method: 'GET' });

    // Try to parse JSON, otherwise fallback to simulated success like your original
    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = { status: 'success', message: 'Request submitted (simulated)' };
    }

    if (data && (data.status === 'success' || data.success === true)) {
      return res.status(200).json({ status: 'success', message: data.message || 'Your request successfully submitted.' });
    } else {
      return res.status(200).json({ status: 'error', message: data.message || 'Error submitting request.' });
    }

  } catch (err) {
    console.error('api/send error:', err);
    return res.status(500).json({ status: 'error', message: 'Unstable internet connection or API unreachable' });
  }
}
