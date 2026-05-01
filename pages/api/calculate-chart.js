// pages/api/calculate-chart.js
import Astronomy from 'astronomy-engine';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, time, city } = req.body;

  if (!date || !time || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Geocoding - Obtener coordenadas de la ciudad
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    
    const geoResponse = await fetch(geocodeUrl, {
      headers: {
        'User-Agent': 'CartaAstralApp/1.0'
      }
    });
    
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }

    const latitude = parseFloat(geoData[0].lat);
    const longitude = parseFloat(geoData[0].lon);

    // 2. Crear fecha y hora en UTC
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    const dateTime = new Date(year, month - 1, day, hours, minutes);
    
    // 3. Calcular posiciones planetarias
    const positions = {
      sol: Astronomy.EclipticLongitude(Astronomy.SunPosition(dateTime)),
      luna: Astronomy.EclipticLongitude(Astronomy.GeoMoon(dateTime)),
      mercurio: getPlanetLongitude('Mercury', dateTime),
      venus: getPlanetLongitude('Venus', dateTime),
      marte: getPlanetLongitude('Mars', dateTime),
      jupiter: getPlanetLongitude('Jupiter', dateTime),
      saturno: getPlanetLongitude('Saturn', dateTime),
      ascendente: calculateAscendant(dateTime, latitude, longitude)
    };

    return res.status(200).json({
      positions,
      location: {
        city: geoData[0].display_name,
        latitude,
        longitude
      }
    });

  } catch (error) {
    console.error('Error calculating chart:', error);
    return res.status(500).json({ 
      error: 'Error al calcular la carta astral',
      details: error.message 
    });
  }
}

// Helper: Obtener longitud eclíptica de un planeta
function getPlanetLongitude(planetName, date) {
  const body = Astronomy.HelioVector(planetName, date);
  const geo = Astronomy.GeoVector(planetName, date, true);
  
  // Convertir a coordenadas eclípticas
  const ecliptic = Astronomy.Ecliptic(geo);
  
  // Normalizar a 0-360 grados
  let lon = ecliptic.elon;
  while (lon < 0) lon += 360;
  while (lon >= 360) lon -= 360;
  
  return lon;
}

// Helper: Calcular Ascendente
function calculateAscendant(date, latitude, longitude) {
  // Calcular el tiempo sideral local
  const jd = Astronomy.MakeTime(date).ut;
  const gmst = Astronomy.SiderealTime(date);
  
  // Tiempo sideral local = GMST + longitud
  let lst = gmst + (longitude / 15.0);
  while (lst < 0) lst += 24;
  while (lst >= 24) lst -= 24;
  
  // Calcular RAMC (Right Ascension of the Midheaven)
  const ramc = lst * 15; // Convertir horas a grados
  
  // Calcular ascendente usando fórmula simplificada
  // Para mayor precisión se debería usar la oblicuidad de la eclíptica
  const obliquity = 23.4397; // Oblicuidad media de la eclíptica
  
  const latRad = latitude * Math.PI / 180;
  const ramcRad = ramc * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // Fórmula del ascendente
  const num = Math.cos(ramcRad);
  const den = -Math.sin(ramcRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad);
  
  let asc = Math.atan2(num, den) * 180 / Math.PI;
  
  // Normalizar a 0-360
  while (asc < 0) asc += 360;
  while (asc >= 360) asc -= 360;
  
  return asc;
}
