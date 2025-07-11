export const config = {
  api: {
    bodyParser: false,
  },
};

import { Readable } from 'stream';

export default async function handler(req, res) {
 res.setHeader("Access-Control-Allow-Origin", "*");
   if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: '4a57658e552c4206849da79cd79eb24a',
        'transfer-encoding': 'chunked',
      },
      body: Readable.from(audioBuffer),
      duplex: "half"
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
}
