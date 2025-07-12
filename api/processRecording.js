export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { upload_url, user_id } = req.body;

  if (!upload_url || !user_id) {
    return res.status(400).json({ error: 'Missing upload_url or user_id' });
  }

  try {
    // 1. Enviar a AssemblyAI para transcribir
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        Authorization: '4a57658e552c4206849da79cd79eb24a',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: upload_url
      })
    });

    const transcriptData = await transcriptRes.json();
    const transcriptId = transcriptData.id;

    // 2. Esperar a que se complete
    let completedTranscript;
    while (true) {
      const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          Authorization: '4a57658e552c4206849da79cd79eb24a'
        }
      });
      const data = await pollingRes.json();

      if (data.status === 'completed') {
        completedTranscript = data;
        break;
      } else if (data.status === 'error') {
        return res.status(500).json({ error: 'Transcription failed', details: data });
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 3. Guardar en Supabase
    const supabaseRes = await fetch('https://uuixsurstjvwrwbmyzjf.supabase.co/rest/v1/transcripts', {
      method: 'POST',
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXhzdXJzdGp2d3J3Ym15empmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NzEyNzIsImV4cCI6MjA2NDQ0NzI3Mn0.zXYK5LPa11Rawqq-kJHJudUHvB5NvFfW6MzZ1xshuKU',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXhzdXJzdGp2d3J3Ym15empmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NzEyNzIsImV4cCI6MjA2NDQ0NzI3Mn0.zXYK5LPa11Rawqq-kJHJudUHvB5NvFfW6MzZ1xshuKU',
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        user_id: user_id,
        transcript: completedTranscript.text,
        created_at: new Date().toISOString()
      })
    });

    const supabaseData = await supabaseRes.json();

    return res.status(200).json({
      message: 'Transcript guardado en Supabase',
      transcript: completedTranscript.text,
      supabase_id: supabaseData?.[0]?.id || null
    });

  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
