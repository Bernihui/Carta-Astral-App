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
    generateReading(prompt, 'Análisis Completo de tu Carta Natal');
  };

  const generateCategoryReading = (category) => {
    const titles = {
      love: '💕 Lectura de Amor y Relaciones',
      work: '💼 Lectura de Trabajo y Vocación',
      health: '🌿 Lectura de Salud y Bienestar'
    };
    
    const prompts = {
      love: PROMPTS.loveReading(chart, formData),
      work: PROMPTS.workReading(chart, formData),
      health: PROMPTS.healthReading(chart, formData)
    };
    
    generateReading(prompts[category], titles[category]);
  };

  return (
    <>
      <Head>
        <title>Carta Astral - Lectura Personalizada</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0f172a, #1e293b, #0f172a)',
        color: '#e2e8f0',
        fontFamily: "'Crimson Pro', Georgia, serif",
        padding: '60px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Carta Astral
          </h1>
          <p style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#94a3b8',
            marginBottom: '40px'
          }}>
            Descubre los secretos escritos en las estrellas ✨
          </p>

          {!showChart ? (
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    📅 Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    ⏰ Hora de Nacimiento
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>
                    🌍 Lugar de Nacimiento
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Santiago, Chile"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Generar Carta Astral ✨
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={generateCompleteAnalysis}
                  disabled={isGenerating}
                  style={{
                    width: '100%',
                    padding: '15px',
                    marginBottom: '15px',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: isGenerating ? 'wait' : 'pointer',
                    opacity: isGenerating ? 0.6 : 1
                  }}
                >
                  ✨ Análisis Completo
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                  {['love', 'work', 'health'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => generateCategoryReading(cat)}
                      disabled={isGenerating}
                      style={{
                        padding: '12px',
                        background: 'rgba(30, 41, 59, 0.8)',
                        border: '2px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '10px',
                        color: '#cbd5e1',
                        cursor: isGenerating ? 'wait' : 'pointer',
                        opacity: isGenerating ? 0.6 : 1
                      }}
                    >
                      {cat === 'love' && '💕 Amor'}
                      {cat === 'work' && '💼 Trabajo'}
                      {cat === 'health' && '🌿 Salud'}
                    </button>
                  ))}
                </div>
              </div>

              {Object.entries(chart).map(([planet, degrees]) => {
                const sign = getZodiacSign(degrees);
                const deg = (degrees % 30).toFixed(1);
                
                return (
                  <div
                    key={planet}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      padding: '20px',
                      borderRadius: '15px',
                      marginBottom: '15px',
                      borderLeft: '4px solid #fbbf24'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{getPlanetEmoji(planet)}</span>
                      <div>
                        <h3 style={{ color: '#fbbf24', margin: 0, textTransform: 'capitalize' }}>{planet}</h3>
                        <p style={{ color: '#94a3b8', margin: 0 }}>{sign} {deg}°</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => generateDeepReading(planet, degrees)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(251, 191, 36, 0.2)',
                        border: '1px solid rgba(251, 191, 36, 0.4)',
                        borderRadius: '8px',
                        color: '#fbbf24',
                        cursor: 'pointer'
                      }}
                    >
                      🔮 Lectura Profunda
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => setShowChart(false)}
                style={{
                  marginTop: '20px',
                  padding: '12px 30px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '2px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '10px',
                  color: '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                ← Nueva Carta
              </button>
            </div>
          )}

          {/* Modal de Lectura */}
          {currentReading && (
            <div
              onClick={() => setCurrentReading(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 1000
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '800px',
                  width: '100%',
                  maxHeight: '90vh',
                  background: 'rgba(30, 41, 59, 0.95)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  overflow: 'auto',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => setCurrentReading(null)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    color: '#cbd5e1',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>

                <h2 style={{ color: '#fbbf24', marginBottom: '20px' }}>
                  {currentReading.title}
                </h2>

                {isGenerating ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>
                      Consultando las estrellas...
                    </p>
                  </div>
                ) : (
                  <div style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    color: '#e2e8f0',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {currentReading.content}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Crimson Pro', Georgia, serif;
          }
          
          input:focus {
            outline: none;
            border-color: rgba(251, 191, 36, 0.6) !important;
          }
          
          button:hover:not(:disabled) {
            opacity: 0.9;
            transform: scale(1.02);
          }
          
          button {
            transition: all 0.3s ease;
          }
        `}</style>
      </div>
    </>
  );
}
