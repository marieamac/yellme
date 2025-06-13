export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "text" in request body' });
  }

  try {
    const response = await fetch('https://api.assemblyai.com/v2/ai/analyze', {
      method: 'POST',
      headers: {
        'Authorization': '130872bc2c04401982daf1e28fb47b3a',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript: { text: text },
        features: {
          sentiment_analysis: {},
          summarization: {}
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'AssemblyAI API error' });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Catch error:', error);
    res.status(500).json({ error: 'Something went wrong while processing your request' });
  }
}
