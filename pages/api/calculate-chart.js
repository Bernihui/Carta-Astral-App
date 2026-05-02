// pages/api/calculate-chart.js

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

    // 2. Parsear fecha y hora
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // 3. Llamar a FreeAstroAPI.com
    const apiUrl = 'https://api.freeastroapi.com/api/v1/natal/calculate';
    
    const apiPayload = {
      year,
      month,
      day,
      hour: hours,
      minute: minutes,
      lat: latitude,
      lng: longitude
    };

    console.log('Calling FreeAstroAPI with:', apiPayload);

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.FREEASTROAPI_KEY || '' // API key opcional para tier gratuito
      },
      body: JSON.stringify(apiPayload)
    });

    if (!apiResponse.ok) {
      console.error('FreeAstroAPI error:', apiResponse.status);
      const errorText = await apiResponse.text();
      console.error('Error details:', errorText);
      throw new Error(`API error: ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();
    
    console.log('FreeAstroAPI response received');
    console.log('Planets:', apiData.planets ? Object.keys(apiData.planets) : 'N/A');
    console.log('Houses:', apiData.houses ? 'Available' : 'N/A');

    // 4. Extraer posiciones
    // FreeAstroAPI devuelve en formato:
    // {
    //   planets: {
    //     sun: { longitude: 123.45, ... },
    //     moon: { longitude: 234.56, ... },
    //     ...
    //   },
    //   houses: {
    //     ascendant: { longitude: 345.67 },
    //     ...
    //   }
    // }

    const planets = apiData.planets || {};
    const houses = apiData.houses || {};

    const positions = {
      sol: planets.sun?.longitude || 0,
      luna: planets.moon?.longitude || 0,
      mercurio: planets.mercury?.longitude || 0,
      venus: planets.venus?.longitude || 0,
      marte: planets.mars?.longitude || 0,
      jupiter: planets.jupiter?.longitude || 0,
      saturno: planets.saturn?.longitude || 0,
      ascendente: houses.ascendant?.longitude || 0
    };

    console.log('=== FINAL POSITIONS ===');
    console.log(JSON.stringify(positions, null, 2));

    // Validar
    Object.keys(positions).forEach(key => {
      const val = positions[key];
      if (isNaN(val) || val < 0 || val >= 360) {
        console.error(`❌ Invalid value for ${key}: ${val}`);
      }
    });

    return res.status(200).json({
      positions,
      location: {
        city: geoData[0].display_name,
        latitude,
        longitude
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Error al calcular la carta astral',
      details: error.message
    });
  }
}
