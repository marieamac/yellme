export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { upload_url } = req.body;

  if (!upload_url) {
    return res.status(400).json({ error: 'Falta el campo upload_url' });
  }

  try {
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': '4a57658e552c4206849da79cd79eb24a',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: upload_url
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Error al pedir transcripción', details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor', details: error.message });
  }
}
