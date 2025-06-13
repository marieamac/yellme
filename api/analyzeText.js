export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }
  
  // Esto solo regresa un mensaje simple para probar que la función está activa y recibe el POST bien
  res.status(200).json({ message: 'La función analyzeText.js está funcionando correctamente' });
}

