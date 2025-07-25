// Vercel serverless function to proxy API requests securely
export default async function handler(req: any, res: any) {
  const apiUrl = process.env.SECRET_API_URL;
  if (!apiUrl) {
    res.status(500).json({ error: 'API URL not configured' });
    return;
  }

  // Build the target URL
  const targetUrl = apiUrl + req.url;

  // Prepare fetch options
  const fetchOptions = {
    method: req.method,
    headers: { ...req.headers, host: undefined }, // Remove host header for proxy
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  };

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get('content-type');
    res.status(response.status);
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
