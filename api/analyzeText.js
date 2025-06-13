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
        transcript: { text },
        features: {
          sentiment_analysis: {},
          summarization: {}
        }
      })
    });

    const responseText = await response.text(); // ← vemos el texto crudo de la respuesta

    console.log('Raw response from AssemblyAI:', responseText);

    try {
      const data = JSON.parse(responseText);
      if (!response.ok) {
        return res.status(response.status).json({ error: data.error || 'AssemblyAI API error' });
      }
      return res.status(200).json(data);
    } catch (jsonError) {
      return res.status(500).json({
        error: 'Invalid JSON received from AssemblyAI',
        details: responseText
      });
    }

  } catch (error) {
    console.error('Catch error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}

