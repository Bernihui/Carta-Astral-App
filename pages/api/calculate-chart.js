// pages/api/calculate-chart.js

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
    
    // Crear fecha UTC
    const dateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    
    // 3. Calcular día juliano
    const JD = getJulianDay(dateTime);
    
    // 4. Calcular posiciones planetarias usando fórmulas astronómicas
    const positions = {
      sol: getSunLongitude(JD),
      luna: getMoonLongitude(JD),
      mercurio: getPlanetLongitude('mercury', JD),
      venus: getPlanetLongitude('venus', JD),
      marte: getPlanetLongitude('mars', JD),
      jupiter: getPlanetLongitude('jupiter', JD),
      saturno: getPlanetLongitude('saturn', JD),
      ascendente: getAscendant(JD, latitude, longitude)
    };

    // Log para debugging
    console.log('Calculated positions:', positions);
    console.log('Date:', dateTime);
    console.log('JD:', JD);
    console.log('Location:', { latitude, longitude });

    // Validar que todos los valores sean números válidos
    Object.keys(positions).forEach(key => {
      if (isNaN(positions[key]) || positions[key] < 0 || positions[key] >= 360) {
        console.error(`Invalid position for ${key}:`, positions[key]);
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
    console.error('Error calculating chart:', error);
    return res.status(500).json({ 
      error: 'Error al calcular la carta astral',
      details: error.message 
    });
  }
}

// Calcular día juliano
function getJulianDay(date) {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;
  
  let jdn = date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  return jdn + (hours - 12) / 24;
}

// Normalizar ángulo a rango 0-360
function normalize(angle) {
  let result = angle % 360;
  if (result < 0) result += 360;
  return result;
}

// Calcular longitud del Sol
function getSunLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  
  // Longitud media del Sol
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  
  // Anomalía media del Sol
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_rad = M * Math.PI / 180;
  
  // Ecuación del centro
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad)
          + 0.000289 * Math.sin(3 * M_rad);
  
  // Longitud verdadera
  const sunLon = L0 + C;
  
  return normalize(sunLon);
}

// Calcular longitud de la Luna
function getMoonLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  
  // Longitud media de la Luna
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  
  // Anomalía media de la Luna
  const M = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  
  // Anomalía media del Sol
  const M_sun = 357.5291092 + 35999.0502909 * T;
  
  // Argumento de latitud
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  
  const M_rad = M * Math.PI / 180;
  const M_sun_rad = M_sun * Math.PI / 180;
  const F_rad = F * Math.PI / 180;
  
  // Términos principales de perturbación
  let moonLon = L 
    + 6.288774 * Math.sin(M_rad)
    + 1.274027 * Math.sin(2 * F_rad - M_rad)
    + 0.658314 * Math.sin(2 * F_rad)
    + 0.213618 * Math.sin(2 * M_rad)
    - 0.185116 * Math.sin(M_sun_rad)
    - 0.114332 * Math.sin(2 * F_rad);
  
  return normalize(moonLon);
}

// Calcular longitud de planetas (aproximación simplificada)
function getPlanetLongitude(planet, JD) {
  const T = (JD - 2451545.0) / 36525.0;
  
  const orbitalElements = {
    mercury: { L0: 252.25, rate: 149472.67, e: 0.205635, a: 0.387098 },
    venus:   { L0: 181.98, rate: 58517.82, e: 0.006772, a: 0.723330 },
    mars:    { L0: 355.43, rate: 19140.30, e: 0.093377, a: 1.523688 },
    jupiter: { L0: 34.35, rate: 3034.74, e: 0.048892, a: 5.202603 },
    saturn:  { L0: 50.08, rate: 1222.11, e: 0.055581, a: 9.554909 }
  };
  
  const elem = orbitalElements[planet];
  if (!elem) return 0;
  
  // Longitud media
  const L = elem.L0 + elem.rate * T;
  
  // Anomalía media
  const M = L - 102.94;
  const M_rad = M * Math.PI / 180;
  
  // Ecuación del centro (simplificada)
  const C = (2 * elem.e - 0.25 * elem.e * elem.e * elem.e) * Math.sin(M_rad)
          + 1.25 * elem.e * elem.e * Math.sin(2 * M_rad);
  
  const lon = L + C;
  
  return normalize(lon);
}

// Calcular Ascendente
function getAscendant(JD, latitude, longitude) {
  // Tiempo sideral de Greenwich
  const T = (JD - 2451545.0) / 36525.0;
  const theta0 = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T;
  
  // Tiempo sideral local
  const theta = normalize(theta0 + longitude);
  
  // Oblicuidad de la eclíptica
  const epsilon = 23.439291 - 0.0130042 * T;
  const epsilon_rad = epsilon * Math.PI / 180;
  
  // Convertir a radianes
  const theta_rad = theta * Math.PI / 180;
  const lat_rad = latitude * Math.PI / 180;
  
  // Calcular ascendente
  const y = -Math.sin(theta_rad);
  const x = Math.cos(theta_rad) * Math.cos(epsilon_rad) + Math.tan(lat_rad) * Math.sin(epsilon_rad);
  
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  
  return normalize(asc);
}
