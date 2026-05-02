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

    // 2. Crear fecha y hora
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Crear objeto Date en timezone local
    const dateTime = new Date(year, month - 1, day, hours, minutes);
    
    // Convertir a objeto AstroTime de astronomy-engine
    const astroTime = Astronomy.MakeTime(dateTime);
    
    // 3. Calcular posiciones planetarias
    const positions = {
      sol: getPlanetEclipticLongitude('Sun', astroTime),
      luna: getMoonEclipticLongitude(astroTime),
      mercurio: getPlanetEclipticLongitude('Mercury', astroTime),
      venus: getPlanetEclipticLongitude('Venus', astroTime),
      marte: getPlanetEclipticLongitude('Mars', astroTime),
      jupiter: getPlanetEclipticLongitude('Jupiter', astroTime),
      saturno: getPlanetEclipticLongitude('Saturn', astroTime),
      ascendente: calculateAscendant(astroTime, latitude, longitude)
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
function getPlanetEclipticLongitude(bodyName, time) {
  // Obtener la posición ecuatorial del planeta
  const equator = Astronomy.Equator(bodyName, time, null, true, true);
  
  // Convertir a coordenadas eclípticas
  const ecliptic = Astronomy.Ecliptic(equator);
  
  // La longitud eclíptica - normalizar a 0-360 grados
  let lon = ecliptic.elon;
  
  // Asegurar que esté en rango 0-360
  lon = lon % 360;
  if (lon < 0) lon += 360;
  
  return lon;
}

// Helper: Obtener longitud eclíptica de la Luna
function getMoonEclipticLongitude(time) {
  const equator = Astronomy.Equator('Moon', time, null, true, true);
  const ecliptic = Astronomy.Ecliptic(equator);
  
  let lon = ecliptic.elon;
  
  // Asegurar que esté en rango 0-360
  lon = lon % 360;
  if (lon < 0) lon += 360;
  
  return lon;
}

// Helper: Calcular Ascendente
function calculateAscendant(time, latitude, longitude) {
  // Obtener el tiempo sideral local en horas
  const siderealTime = Astronomy.SiderealTime(time);
  
  // Convertir longitud a horas (15 grados = 1 hora)
  const localSiderealTime = siderealTime + (longitude / 15.0);
  
  // Normalizar a 0-24 horas
  let lst = localSiderealTime % 24;
  if (lst < 0) lst += 24;
  
  // Convertir LST a grados (RAMC - Right Ascension of Midheaven)
  const ramc = lst * 15.0;
  
  // Oblicuidad de la eclíptica para esta fecha
  const obliquity = 23.4397; // Aproximación (podría mejorarse con cálculo exacto)
  
  // Convertir a radianes
  const latRad = latitude * Math.PI / 180;
  const ramcRad = ramc * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // Fórmula para calcular el ascendente
  const y = -Math.sin(ramcRad);
  const x = Math.cos(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  
  // Asegurar que esté en rango 0-360
  asc = asc % 360;
  if (asc < 0) asc += 360;
  
  return asc;
}
