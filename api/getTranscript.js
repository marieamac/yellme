export default async function handler(req, res) {
  // 1. Leer el parámetro `id` de la URL: ?id=TRANSCRIPT_ID
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing transcript id' });
  }

  try {
    // 2. Llamar a AssemblyAI para obtener el resultado
    const response = await fetch(
      `https://api.assemblyai.com/v2/transcript/${id}`,
      {
        headers: {
          'Authorization': '4a57658e552c420684979cd79eb24a',
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    // 3. Si AssemblyAI devolvió error, lo reenviamos
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Error from AssemblyAI', details: data });
    }

    // 4. Devolver al cliente el JSON completo
    return res.status(200).json(data);

  } catch (error) {
    // Error interno del servidor
    return res
      .status(500)
      .json({ error: 'Server error', details: error.message });
  }
}
