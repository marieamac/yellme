export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  try {
    const response = await fetch('https://api.assemblyai.com/ai/analyze', {
      method: 'POST',
      headers: {
        'Authorization': '130872bc2c04401982daf1e28fb47b3a', // tu API Key correcta
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript: {
          text: text
        },
        features: {
          sentiment_analysis: {},
          summarization: {}
        }
      })
    });

    const data = await response.json();

    // Verifica si AssemblyAI devolvió un error
    if (data.error) {
      return res.status(400).json({ error: 'Invalid JSON received from AssemblyAI', details: data.error });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong while processing your request' });
  }
}
