export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const audioBuffer = Buffer.concat(chunks);

  try {
    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': '4a57658e552c4206849da79cd79eb24a',
        'Transfer-Encoding': 'chunked',
      },
      body: audioBuffer,
      duplex: 'half',
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Fallo en la subida', details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor', details: error.message });
  }
}
