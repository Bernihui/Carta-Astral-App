// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

// Sistema de prompts (igual que antes)
const PROMPTS = {
  deepReading: (planet, sign, degree, birthData) => `Eres un astrólogo experto con profundo conocimiento de la astrología moderna y psicológica.

Datos de la carta natal:
- Planeta: ${planet}
- Signo: ${sign}
- Grado: ${degree}°
- Fecha de nacimiento: ${birthData.date}
- Hora: ${birthData.time}
- Lugar: ${birthData.city}

Genera una lectura profunda y personalizada de ${planet} en ${sign} que incluya:

1. **Energía Core**: Explica la esencia de esta colocación y cómo se manifiesta en la personalidad
2. **Manifestación Práctica**: Cómo se expresa esto en la vida diaria con ejemplos concretos
3. **Desafíos y Oportunidades**: Los retos que puede presentar y cómo aprovecharlos para crecimiento
4. **Integración**: Consejos prácticos para trabajar conscientemente con esta energía
5. **Potencial Evolutivo**: Hacia dónde puede desarrollarse esta colocación con trabajo personal

La lectura debe ser:
- Profunda pero accesible, evitando jerga excesiva
- Personalizada, no genérica
- Empoderadora y orientada al crecimiento
- Aproximadamente 400-500 palabras
- Escrita en segunda persona (tú/tu) para crear conexión

Mantén un tono cálido, sabio y compasivo, como un mentor astrológico experimentado.`,

  completeAnalysis: (chartData, birthData) => {
    const getZodiacSign = (degrees) => {
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                     'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      return signs[Math.floor(degrees / 30)];
    };
    
    const planetsText = Object.entries(chartData)
      .map(([planet, degrees]) => `- ${planet}: ${getZodiacSign(degrees)} ${(degrees % 30).toFixed(1)}°`)
      .join('\n');
    
    return `Eres un astrólogo experto realizando una lectura completa de carta natal.

Datos del nativo:
- Fecha de nacimiento: ${birthData.date}
- Hora: ${birthData.time}
- Lugar: ${birthData.city}

Configuración planetaria:
${planetsText}

Realiza un análisis integral de esta carta natal que incluya:

1. **Esencia del Alma (Sol, Luna, Ascendente)**
2. **Dones y Talentos Naturales**
3. **Áreas de Trabajo Personal**
4. **Temas de Vida Principales**
5. **Síntesis Integradora**

Extensión: 800-1000 palabras
Tono: Sabio, compasivo, empoderante`;
  },

  loveReading: (chartData, birthData) => {
    const getZodiacSign = (degrees) => {
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                     'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      return signs[Math.floor(degrees / 30)];
    };
    
    return `Lectura especializada en amor y relaciones.
Fecha: ${birthData.date} | Hora: ${birthData.time} | Lugar: ${birthData.city}
Posiciones: Venus ${getZodiacSign(chartData.venus)}, Marte ${getZodiacSign(chartData.marte)}, Luna ${getZodiacSign(chartData.luna)}
Extensión: 600-700 palabras`;
  },

  workReading: (chartData, birthData) => {
    const getZodiacSign = (degrees) => {
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                     'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      return signs[Math.floor(degrees / 30)];
    };
    
    return `Lectura de trabajo y vocación.
Fecha: ${birthData.date} | Hora: ${birthData.time}
Posiciones: Sol ${getZodiacSign(chartData.sol)}, Saturno ${getZodiacSign(chartData.saturno)}, Mercurio ${getZodiacSign(chartData.mercurio)}
Extensión: 600-700 palabras`;
  },

  healthReading: (chartData, birthData) => {
    const getZodiacSign = (degrees) => {
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                     'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      return signs[Math.floor(degrees / 30)];
    };
    
    return `Lectura de salud holística (NO diagnosticar enfermedades).
Fecha: ${birthData.date}
Posiciones: Sol ${getZodiacSign(chartData.sol)}, Luna ${getZodiacSign(chartData.luna)}, Saturno ${getZodiacSign(chartData.saturno)}
Extensión: 600-700 palabras`;
  },
};

// Utilidades astronómicas
const calculatePlanetaryPositions = (birthDate, birthTime) => {
  const date = new Date(`${birthDate}T${birthTime}`);
  const jd = (date.getTime() / 86400000) + 2440587.5;
  
  return {
    sol: (280.466 + 0.9856474 * (jd - 2451545.0)) % 360,
    luna: (218.316 + 13.176396 * (jd - 2451545.0)) % 360,
    mercurio: (252.25 + 1.602131 * (jd - 2451545.0)) % 360,
    venus: (181.98 + 0.524024 * (jd - 2451545.0)) % 360,
    marte: (355.43 + 0.524070 * (jd - 2451545.0)) % 360,
    jupiter: (34.35 + 0.083056 * (jd - 2451545.0)) % 360,
    saturno: (50.08 + 0.033371 * (jd - 2451545.0)) % 360,
    ascendente: (((date.getHours() + date.getMinutes() / 60) * 15) + 90) % 360,
  };
};

const getZodiacSign = (degrees) => {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  return signs[Math.floor(degrees / 30)];
};

const getPlanetEmoji = (planet) => {
  const emojis = {
    sol: '☉', luna: '☽', mercurio: '☿', venus: '♀',
    marte: '♂', jupiter: '♃', saturno: '♄', ascendente: '⇑'
  };
  return emojis[planet] || '●';
};

export default function Home() {
  const [formData, setFormData] = useState({ date: '', time: '', city: '' });
  const [chart, setChart] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [currentReading, setCurrentReading] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const positions = calculatePlanetaryPositions(formData.date, formData.time);
    setChart(positions);
    setShowChart(true);
  };

  const generateReading = async (prompt, title) => {
    setIsGenerating(true);
    
    try {
      // Llamar a NUESTRA API route (no directamente a Anthropic)
      const response = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar lectura');
      }

      setCurrentReading({
        title,
        content: data.content,
        prompt
      });
    } catch (error) {
      console.error('Error:', error);
      setCurrentReading({
        title,
        content: 'Lo siento, hubo un error al generar la lectura. Por favor intenta nuevamente.',
        prompt,
        error: true
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDeepReading = (planet, degrees) => {
    const sign = getZodiacSign(degrees);
    const degree = (degrees % 30).toFixed(1);
    const prompt = PROMPTS.deepReading(planet, sign, degree, formData);
    generateReading(prompt, `Lectura Profunda: ${planet} en ${sign}`);
  };

  const generateCompleteAnalysis = () => {
    const prompt = PROMPTS.completeAnalysis(chart, formData);
    generateReadin
