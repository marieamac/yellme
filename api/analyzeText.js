export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  try {
    const response = await fetch('https://api.assemblyai.com/v2/ai/analyze', {
      method: 'POST',
      headers: {
        'Authorization': '130872bc2c04401982daf1e28fb47b3a',  // <- Aquí tu API Key de AssemblyAI
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

    // Si la respuesta no es exitosa (status 200-299)
    if (!response.ok) {
      const errorBody = await response.text();  // leemos texto plano para ver error
      console.error('Error response from AssemblyAI:', errorBody);
      return res.status(response.status).json({ error: errorBody });
    }

    // Si todo está bien, parseamos JSON y respondemos
    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error catch:', error.message);
    res.status(500).json({ error: 'Something went wrong while processing your request', details: error.message });
  }
}
