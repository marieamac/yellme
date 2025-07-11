import getRawBody from 'raw-body';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const audioBuffer = await getRawBody(req);
    console.log("🟡 Audio recibido. Tamaño:", audioBuffer.length);

    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': '4a57658e552c4206849da79cd79eb24a',
        'Content-Type': 'application/octet-stream'
      },
      body: audioBuffer
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error desde AssemblyAI:", data);
      return res.status(500).json({ error: 'Fallo en la subida', details: data });
    }

    console.log("✅ Audio subido correctamente:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ ERROR en uploadRecording:", error);
    res.status(500).json({ error: 'Error del servidor', details: error.message });
  }
}

