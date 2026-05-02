// pages/api/calculate-chart.js
import { DateTime } from 'luxon';

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
    
    // 3. Calcular Julian Day (UTC aproximado para planetas)
    const dateTime = new Date(year, month - 1, day, hours, minutes);
    const JD = getJulianDay(dateTime);
    
    console.log('Julian Day:', JD);
    
    // 4. Calcular posiciones planetarias (mis cálculos - funcionan bien)
    const positions = {
      sol: getSunLongitude(JD),
      luna: getMoonLongitude(JD),
      mercurio: getPlanetLongitude('mercury', JD),
      venus: getPlanetLongitude('venus', JD),
      marte: getPlanetLongitude('mars', JD),
      jupiter: getPlanetLongitude('jupiter', JD),
      saturno: getPlanetLongitude('saturn', JD)
    };

    console.log('Planet positions calculated');

    // 5. USAR CLAUDE PARA CALCULAR ASCENDENTE
    console.log('Calculating ascendant with Claude...');
    
    const ascendente = await calculateAscendantWithClaude(
      year, month, day, hours, minutes,
      latitude, longitude, geoData[0].display_name
    );
    
    positions.ascendente = ascendente;

    console.log('=== FINAL POSITIONS ===');
    console.log(JSON.stringify(positions, null, 2));

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

// Función que usa Claude para calcular el ascendente
async function calculateAscendantWithClaude(year, month, day, hours, minutes, latitude, longitude, cityName) {
  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `Eres un calculador experto de astrología. Necesito que calcules el ASCENDENTE (grado eclíptico exacto) para los siguientes datos de nacimiento:

Fecha: ${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}
Hora: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} (hora local)
Ciudad: ${cityName}
Latitud: ${latitude}°
Longitud: ${longitude}°

INSTRUCCIONES CRÍTICAS:
1. Debes calcular el ascendente usando cálculos astronómicos precisos (tiempo sideral local, oblicuidad de la eclíptica, sistema de casas Placidus)
2. Ten en cuenta la zona horaria correcta para esta ciudad en esta fecha histórica
3. Devuelve SOLAMENTE el grado eclíptico del ascendente como un número entre 0 y 360

FORMATO DE RESPUESTA (solo el número, nada más):
XXX.XX

Por ejemplo: 285.45 o 120.30

NO incluyas explicaciones, NO incluyas el signo zodiacal, SOLO el número de grados.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{ role: 'user', content: prompt }]
    });

    const response = message.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('');

    console.log('Claude response for ascendant:', response);

    // Extraer el número
    const match = response.match(/(\d+\.?\d*)/);
    if (!match) {
      console.error('Could not parse ascendant from Claude response:', response);
      return 0;
    }

    const ascendant = parseFloat(match[0]);
    
    // Validar rango
    if (isNaN(ascendant) || ascendant < 0 || ascendant >= 360) {
      console.error('Invalid ascendant value:', ascendant);
      return 0;
    }

    console.log('Ascendant calculated by Claude:', ascendant);
    return ascendant;

  } catch (error) {
    console.error('Error calculating ascendant with Claude:', error);
    // Fallback a cálculo manual si Claude falla
    return getAscendantFallback(getJulianDay(new Date(year, month - 1, day, hours, minutes)), latitude, longitude);
  }
}

// Helper functions
function getJulianDay(date) {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  
  let jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y 
    + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  const hours = date.getHours() + date.getMinutes() / 60;
  return jdn + (hours - 12) / 24;
}

function normalize(angle) {
  let result = angle % 360;
  if (result < 0) result += 360;
  return result;
}

function getSunLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_rad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad)
          + 0.000289 * Math.sin(3 * M_rad);
  return normalize(L0 + C);
}

function getMoonLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const M = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const M_sun = 357.5291092 + 35999.0502909 * T;
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  
  const M_rad = M * Math.PI / 180;
  const M_sun_rad = M_sun * Math.PI / 180;
  const F_rad = F * Math.PI / 180;
  
  let moonLon = L 
    + 6.288774 * Math.sin(M_rad)
    + 1.274027 * Math.sin(2 * F_rad - M_rad)
    + 0.658314 * Math.sin(2 * F_rad)
    + 0.213618 * Math.sin(2 * M_rad)
    - 0.185116 * Math.sin(M_sun_rad)
    - 0.114332 * Math.sin(2 * F_rad);
  
  return normalize(moonLon);
}

function getPlanetLongitude(planet, JD) {
  const T = (JD - 2451545.0) / 36525.0;
  const orbitalElements = {
    mercury: { L0: 252.25, rate: 149472.67, e: 0.205635 },
    venus:   { L0: 181.98, rate: 58517.82, e: 0.006772 },
    mars:    { L0: 355.43, rate: 19140.30, e: 0.093377 },
    jupiter: { L0: 34.35, rate: 3034.74, e: 0.048892 },
    saturn:  { L0: 50.08, rate: 1222.11, e: 0.055581 }
  };
  
  const elem = orbitalElements[planet];
  if (!elem) return 0;
  
  const L = elem.L0 + elem.rate * T;
  const M = L - 102.94;
  const M_rad = M * Math.PI / 180;
  const C = (2 * elem.e - 0.25 * elem.e * elem.e * elem.e) * Math.sin(M_rad)
          + 1.25 * elem.e * elem.e * Math.sin(2 * M_rad);
  
  return normalize(L + C);
}

// Fallback si Claude falla
function getAscendantFallback(JD, latitude, longitude) {
  const T = (JD - 2451545.0) / 36525.0;
  const theta0 = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T;
  const theta = normalize(theta0 + longitude);
  const epsilon = 23.439291 - 0.0130042 * T;
  const epsilon_rad = epsilon * Math.PI / 180;
  const theta_rad = theta * Math.PI / 180;
  const lat_rad = latitude * Math.PI / 180;
  
  const y = -Math.sin(theta_rad);
  const x = Math.cos(theta_rad) * Math.cos(epsilon_rad) + Math.tan(lat_rad) * Math.sin(epsilon_rad);
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  
  return normalize(asc);
}
