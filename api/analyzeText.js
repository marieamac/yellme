export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { audio_url } = req.body;

  if (!audio_url) {
    return res.status(400).json({ error: 'Missing audio_url in request body' });
  }

  const API_KEY = '4a57658e552c420684979cd79eb24a'; // Reemplaza si cambias tu API key

  try {
    // 1. Enviar solicitud para transcribir
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url,
        sentiment_analysis: true,
        summarization: true
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: 'Error from AssemblyAI', details: data.error });
    }

    // 2. Retornar el ID de transcripción para que luego puedas hacer un GET con él
    res.status(200).json({
      message: 'Transcription request sent successfully',
      transcript_id: data.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error in the server', details: error.message });
  }
}
