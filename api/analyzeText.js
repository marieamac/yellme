export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  try {
    const response = await fetch('https://api.assemblyai.com/v2/ai/analyze', {
      method: 'POST',
      headers: {
        'Authorization': '4a57658e552c4206849da79cd79eb24a', // ← Reemplaza esto con tu API KEY nueva
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

    if (!response.ok) {
      return res.status(500).json({
        error: 'Invalid JSON received from AssemblyAI',
        details: data
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong while processing your request' });
  }
}
