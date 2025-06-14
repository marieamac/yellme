export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': '4a57658e552c4206849da79cd79eb24a', // 
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Error from AssemblyAI', details: data });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
