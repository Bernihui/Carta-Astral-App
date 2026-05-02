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

    // 2. Calcular timezone offset (aproximado basado en longitud)
    const timezoneOffset = Math.round(longitude / 15 * 2) / 2; // Redondear a .0 o .5
    
    // 3. Parsear fecha y hora
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // 4. Llamar a FreeAstrologyAPI.com - Western Planets endpoint
    const apiUrl = 'https://json.freeastrologyapi.com/western/planets';
    
    const apiPayload = {
      year,
      month,
      date: day,
      hours,
      minutes,
      seconds: 0,
      latitude,
      longitude,
      timezone: timezoneOffset,
      config: {
        observation_point: 'topocentric',
        ayanamsha: 'tropical'
      }
    };

    console.log('Calling FreeAstrologyAPI with:', apiPayload);

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.FREEASTROLOGY_API_KEY
      },
      body: JSON.stringify(apiPayload)
    });

    if (!apiResponse.ok) {
      console.error('FreeAstrologyAPI error:', apiResponse.status);
      const errorText = await apiResponse.text();
      console.error('Error details:', errorText);
      throw new Error(`API error: ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();
    
    console.log('FreeAstrologyAPI response received');
    console.log('Status:', apiData.statusCode);

    if (apiData.statusCode !== 200) {
      throw new Error('API returned non-200 status');
    }

    // 5. Extraer posiciones
    // FreeAstrologyAPI devuelve en formato:
    // {
    //   statusCode: 200,
    //   output: [
    //     { planet: { en: "Ascendant" }, fullDegree: 52.47, ... },
    //     { planet: { en: "Sun" }, fullDegree: 342.41, ... },
    //     ...
    //   ]
    // }

    const planets = apiData.output || [];

    const findPlanet = (name) => {
      const planet = planets.find(p => 
        p.planet && p.planet.en && p.planet.en.toLowerCase() === name.toLowerCase()
      );
      return planet ? planet.fullDegree : 0;
    };

    const positions = {
      sol: findPlanet('Sun'),
      luna: findPlanet('Moon'),
      mercurio: findPlanet('Mercury'),
      venus: findPlanet('Venus'),
      marte: findPlanet('Mars'),
      jupiter: findPlanet('Jupiter'),
      saturno: findPlanet('Saturn'),
      ascendente: findPlanet('Ascendant')
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
