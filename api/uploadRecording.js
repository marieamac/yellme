export const config = {
  api: {
    bodyParser: false,
  },
};

import { Readable } from 'stream';
import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the file' });
    }

    const file = files.file;
    const fileStream = fs.createReadStream(file[0].filepath);

    try {
      const response = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': '4a57658e552c4206849da79cd79eb24a',
          'Transfer-Encoding': 'chunked',
        },
        body: fileStream,
        duplex: 'half',
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(500).json({ error: 'Upload failed', details: data });
      }

      res.status(200).json(data);

    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });
}
