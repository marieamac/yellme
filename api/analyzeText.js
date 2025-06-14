export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten solicitudes POST' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Falta el campo text en el body' });
  }

  try {
    const response = await fetch('https://api.assemblyai.com/v2/ai/analyze', {
      method: 'POST',
      headers: {
        'Authorization': '4a57658e552c4206849da79cd79eb24a', // revisa que esté bien completa
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript: text,
        features: ['sentiment_analysis', 'summarization']
      })
    });

    if (!response.ok) {
      const textResponse = await response.text();
      return res.status(response.status).json({ error: 'Error de AssemblyAI', details: textResponse });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}

