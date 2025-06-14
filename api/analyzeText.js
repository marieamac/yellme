export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided in request body' });
  }

  try {
    const response = await fetch('https://api.assemblyai.com/v2/ai/analyze', {
      method: 'POST',
      headers: {
        'Authorization': '4a57658e552c4206849da79cd79eb24a',
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
      // Devuelve el error de AssemblyAI si lo hay
      return res.status(response.status).json({
        error: 'AssemblyAI returned an error',
        status: response.status,
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Unexpected error in the server', details: error.message });
  }
}


