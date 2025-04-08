export default function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;

    res.status(200).json({ result: `Bias detected: ${text}` });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
