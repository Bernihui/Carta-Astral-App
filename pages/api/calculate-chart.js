// pages/api/calculate-chart.js
const swisseph = require('swisseph');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, time, city } = req.body;

  console.log('=== CALCULATE CHART ===');
  console.log('Input:', { date, time, city });

  if (!date || !time || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Geocoding
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    
    const geoResponse = await fetch(geocodeUrl, {
      headers: { 'User-Agent': 'CartaAstralApp/1.0' }
    });
    
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }

    const latitude = parseFloat(geoData[0].lat);
    const longitude = parseFloat(geoData[0].lon);
    
    console.log('Location:', { latitude, longitude, name: geoData[0].display_name });

    // 2. Convertir fecha a Julian Day
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Crear hora decimal
    const hourDecimal
