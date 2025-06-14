export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  // Simular una respuesta como si viniera de AssemblyAI
  res.status(200).json({
    message: "Texto recibido correctamente",
    input: text,
    sentiment: "Positive",
    summary: "Resumen de prueba"
  });
}
