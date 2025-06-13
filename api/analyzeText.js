export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  try {
    const response = await fetch('https://api.assemblyai.com/v2/analyze', {
      method: 'POST',
      headers: {
        'Authorization': '130872bc2c04401982daf1e28fb47b3a',
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

    console.log('AssemblyAI response:', data);

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: data });
    }

  } catch (error) {
    console.error('Error en el servidor:', error);
    // 👇 Esto te muestra el error exacto
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
