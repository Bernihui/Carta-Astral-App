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
    // 1. Geocoding + Timezone
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

    // 2. Obtener timezone desde TimezoneDB API (gratis)
    const timezoneUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=demo&format=json&by=position&lat=${latitude}&lng=${longitude}`;
    
    let timezone = 'UTC';
    try {
      const tzResponse = await fetch(timezoneUrl);
      const tzData = await tzResponse.json();
      if (tzData.status === 'OK') {
        timezone = tzData.zoneName;
        console.log('Timezone detected:', timezone);
      }
    } catch (e) {
      console.warn('Could not detect timezone, using UTC');
    }

    // 3. Convertir fecha local a UTC
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Crear fecha en timezone local
    const localTime = DateTime.fromObject(
      { year, month, day, hour: hours, minute: minutes },
      { zone: timezone }
    );
    
    // Convertir a UTC
    const utcTime = localTime.toUTC();
    
    console.log('Local time:', localTime.toISO());
    console.log('UTC time:', utcTime.toISO());
    
    // 4. Calcular Julian Day en UTC
    const JD = getJulianDay(utcTime.toJSDate());
    console.log('Julian Day:', JD);
    
    // 5. Calcular posiciones planetarias
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

    console.log('=== FINAL POSITIONS ===');
    console.log(JSON.stringify(positions, null, 2));

    return res.status(200).json({
      positions,
      location: {
        city: geoData[0].display_name,
        latitude,
        longitude,
        timezone
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

// Helper functions
function getJulianDay(date) {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;
  
  let jdn = date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y 
    + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
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

function getAscendant(JD, latitude, longitude) {
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
