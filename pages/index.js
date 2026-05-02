// pages/index.js - v6 Homepage completo
import { useState } from 'react';
import Head from 'next/head';

// Sistema de prompts
const PROMPTS = {
  deepReading: (planet, sign, degree, birthData) => `Eres un astrólogo experto con profundo conocimiento de la astrología moderna y psicológica.

Datos de la carta natal:
- Planeta: ${planet}
- Signo: ${sign}
- Grado: ${degree}°
- Fecha de nacimiento: ${birthData.date}
- Hora: ${birthData.time}
- Lugar: ${birthData.city}
- Género: ${birthData.gender}

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
- Adapta el lenguaje según el género: ${birthData.gender}

Mantén un tono cálido, sabio y compasivo, como un mentor astrológico experimentado.`,

  completeAnalysis: (chartData, birthData) => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                   'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    const getSignName = (degrees) => signs[Math.floor(degrees / 30)];
    
    const solSign = getSignName(chartData.sol);
    const lunaSign = getSignName(chartData.luna);
    const ascSign = getSignName(chartData.ascendente);
    const mercurioSign = getSignName(chartData.mercurio);
    const venusSign = getSignName(chartData.venus);
    const marteSign = getSignName(chartData.marte);
    
    return `Actúa como un astrólogo experto con enfoque psicológico y estratégico (NO místico superficial).

Datos: ${birthData.date} | ${birthData.time} | ${birthData.city} | ${birthData.gender}

Posiciones: Sol ${solSign} • Luna ${lunaSign} • Asc ${ascSign} • Mercurio ${mercurioSign} • Venus ${venusSign} • Marte ${marteSign}

Construye una lectura CONCISA pero PROFUNDA (600-700 palabras total). Cada sección debe ser directa, específica y sin relleno.

---

🌞 **Tu esencia: Sol en ${solSign}**

En 2-3 frases: quién eres en el núcleo, qué te mueve.

**Luz:** 2 fortalezas concretas
**Sombra:** 2 patrones limitantes reales

---

🌙 **Mundo emocional: Luna en ${lunaSign}**

Cómo sientes realmente (no lo que muestras). Qué necesitas para sentirte seguro/a.

👉 1 frase de cierre sobre tu patrón emocional

---

⬆️ **Ascendente: ${ascSign}**

Cómo te perciben vs. cómo eres por dentro. En 2 frases.

---

🧠 **Mente: Mercurio en ${mercurioSign}**

Cómo piensas y comunicas. 1 ejemplo concreto (trabajo/conversaciones).

---

❤️ **Amor: Venus en ${venusSign}**

Cómo amas y qué valoras. 1 patrón o riesgo específico.

---

🔥 **Acción: Marte en ${marteSign}**

Qué te motiva y cómo enfrentas conflicto. **Luz** y **sombra** en 1 frase cada una.

---

🧩 **Tema central**

👉 [Tensión X vs Y]
Explica en 2 frases cómo se vive en la realidad.

---

💡 **Lo más potente**

3 insights únicos (1 línea cada uno)

---

⚠️ **Desafíos**

3 patrones claros (1 línea cada uno)

---

🧭 **En simple**

"[Arquetipo/resumen en 1 frase potente]"

---

**REGLAS CRÍTICAS:**
- MÁXIMO 700 palabras TOTAL
- Cero relleno, cero misticismo
- Lenguaje directo y contemporáneo
- Conecta TODO con comportamiento real
- Usa segunda persona (tú/tu) según género: ${birthData.gender}
- Usa negritas (**texto**) para énfasis
- Cada sección BREVE pero PRECISA`;
  },

  loveReading: (chartData, birthData) => {
    const getZodiacSign = (degrees) => {
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                     'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      return signs[Math.floor(degrees / 30)];
    };
    
    return `Lectura especializada en amor y relaciones.
Fecha: ${birthData.date} | Hora: ${birthData.time} | Lugar: ${birthData.city} | Género: ${birthData.gender}
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
Fecha: ${birthData.date} | Hora: ${birthData.time} | Género: ${birthData.gender}
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
Fecha: ${birthData.date} | Género: ${birthData.gender}
Posiciones: Sol ${getZodiacSign(chartData.sol)}, Luna ${getZodiacSign(chartData.luna)}, Saturno ${getZodiacSign(chartData.saturno)}
Extensión: 600-700 palabras`;
  },
};

const calculatePlanetaryPositions = async (birthDate, birthTime, city) => {
  try {
    const response = await fetch('/api/calculate-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: birthDate,
        time: birthTime,
        city: city
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al calcular posiciones');
    }

    const data = await response.json();
    return data.positions;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const getZodiacSign = (degrees) => {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  
  // Validar que degrees sea un número válido
  if (degrees === undefined || degrees === null || isNaN(degrees)) {
    return 'undefined';
  }
  
  // Normalizar a rango 0-360
  let normalizedDegrees = degrees % 360;
  if (normalizedDegrees < 0) normalizedDegrees += 360;
  
  // Calcular índice del signo
  const index = Math.floor(normalizedDegrees / 30);
  
  return signs[index] || 'undefined';
};

const getPlanetEmoji = (planet) => {
  const emojis = {
    sol: '☉', luna: '☽', mercurio: '☿', venus: '♀',
    marte: '♂', jupiter: '♃', saturno: '♄', ascendente: '⇑'
  };
  return emojis[planet] || '●';
};

export default function Home() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'form', 'results'
  const [formData, setFormData] = useState({ date: '', time: '', city: '', gender: '' });
  const [chart, setChart] = useState(null);
  const [currentReading, setCurrentReading] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setCalculationError(null);
    
    try {
      const positions = await calculatePlanetaryPositions(formData.date, formData.time, formData.city);
      setChart(positions);
      setCurrentView('results');
    } catch (error) {
      setCalculationError(error.message);
      alert(`Error: ${error.message}\n\nPor favor verifica que la ciudad esté escrita correctamente.`);
    } finally {
      setIsCalculating(false);
    }
  };

  const generateReading = async (prompt, title) => {
    setIsGenerating(true);
    
    try {
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
    // Validar que degrees sea un número válido
    if (degrees === undefined || degrees === null || isNaN(degrees)) {
      alert('Error: No se pudo obtener la posición de ' + planet + '. Por favor intenta generar la carta nuevamente.');
      return;
    }
    
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

  const fillDemoData = () => {
    setFormData({
      date: '1990-09-20',
      time: '14:30',
      city: 'Santiago, Chile',
      gender: 'Femenino'
    });
  };

  return (
    <>
      <Head>
        <title>Carta Astral - Tu carta, pero explicada como si alguien realmente te conociera</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)',
        color: '#e2e8f0',
        fontFamily: "'Crimson Pro', Georgia, serif"
      }}>
        
        {/* HOMEPAGE */}
        {currentView === 'home' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: '100px' }}>
              <h1 style={{
                fontSize: '3.5rem',
                lineHeight: '1.2',
                background: 'linear-gradient(135deg, #d4af37, #f0c674)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '30px',
                fontWeight: 600
              }}>
                Tu carta astral, pero explicada<br/>como si alguien realmente te conociera.
              </h1>
              
              <p style={{
                fontSize: '1.3rem',
                color: '#b8a5d6',
                maxWidth: '800px',
                margin: '0 auto 50px',
                lineHeight: '1.8'
              }}>
                Ingresa tu fecha, hora y lugar de nacimiento y recibe una lectura clara, profunda y bajada a la vida real: cómo eres, qué te mueve, cómo amas, cómo piensas y qué patrones se repiten en ti.
              </p>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setCurrentView('form')}
                  style={{
                    padding: '18px 40px',
                    background: 'linear-gradient(135deg, #d4af37, #f0c674)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#1a0b2e',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  Leer mi carta astral
                </button>
                
                <button
                  onClick={() => {
                    fillDemoData();
                    setCurrentView('form');
                  }}
                  style={{
                    padding: '18px 40px',
                    background: 'transparent',
                    border: '2px solid #d4af37',
                    borderRadius: '12px',
                    color: '#d4af37',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Probar con una fecha
                </button>
              </div>
            </div>

            {/* No es solo tu signo */}
            <div style={{
              background: 'rgba(45, 27, 78, 0.4)',
              padding: '50px',
              borderRadius: '20px',
              marginBottom: '80px',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <h2 style={{ color: '#d4af37', fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>
                No es solo tu signo
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#b8a5d6', textAlign: 'center', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
                Tu signo solar es solo una parte. Tu Luna habla de tus emociones, tu Ascendente de cómo te ven, Venus de cómo amas y Marte de cómo actúas.
              </p>
            </div>

            {/* Qué vas a descubrir */}
            <h2 style={{ color: '#d4af37', fontSize: '2.5rem', marginBottom: '50px', textAlign: 'center' }}>
              Qué vas a descubrir
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              marginBottom: '100px'
            }}>
              {[
                { emoji: '🌞', title: 'Tu esencia', desc: 'Lo que te mueve en profundidad.' },
                { emoji: '🌙', title: 'Tu mundo emocional', desc: 'Cómo sientes, qué necesitas y cómo te proteges.' },
                { emoji: '⬆️', title: 'Cómo te perciben', desc: 'La energía que proyectas sin darte cuenta.' },
                { emoji: '❤️', title: 'Amor y vínculos', desc: 'Cómo amas, qué buscas y qué te cuesta soltar.' },
                { emoji: '🔥', title: 'Energía y acción', desc: 'Cómo decides, avanzas y enfrentas conflicto.' },
                { emoji: '🧩', title: 'Tu tema central', desc: 'La tensión interna que más marca tu vida.' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(45, 27, 78, 0.4)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{item.emoji}</div>
                  <h3 style={{ color: '#d4af37', fontSize: '1.5rem', marginBottom: '15px' }}>{item.title}</h3>
                  <p style={{ color: '#b8a5d6', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Ejemplo visual */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 165, 214, 0.1))',
              padding: '60px',
              borderRadius: '20px',
              marginBottom: '100px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.4rem',
                color: '#e2e8f0',
                lineHeight: '1.9',
                marginBottom: '30px',
                fontStyle: 'italic',
                maxWidth: '700px',
                margin: '0 auto 30px'
              }}>
                "Eres Libra, pero no solo buscas armonía. Hay en ti una necesidad profunda de construir vínculos justos, inteligentes y sostenibles. Con tu energía Capricornio, no te entregas fácil: observas, evalúas y eliges dónde poner tu energía."
              </p>
              <button
                onClick={() => setCurrentView('form')}
                style={{
                  padding: '15px 35px',
                  background: 'linear-gradient(135deg, #d4af37, #f0c674)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#1a0b2e',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Ver mi lectura completa
              </button>
            </div>

            {/* Tono de la app */}
            <div style={{ textAlign: 'center', marginBottom: '100px' }}>
              <p style={{
                fontSize: '1.3rem',
                color: '#b8a5d6',
                lineHeight: '1.8',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Astrología sin humo. Lecturas claras, humanas y accionables. Nada de frases genéricas: interpretaciones pensadas para entenderte mejor.
              </p>
            </div>

            {/* Cierre */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '2.5rem',
                color: '#d4af37',
                marginBottom: '40px'
              }}>
                A veces no necesitas cambiar.<br/>Solo entenderte mejor.
              </h2>
              <button
                onClick={() => setCurrentView('form')}
                style={{
                  padding: '18px 40px',
                  background: 'linear-gradient(135deg, #d4af37, #f0c674)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#1a0b2e',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                }}
              >
                Empezar mi lectura
              </button>
            </div>
          </div>
        )}

        {/* FORMULARIO */}
        {currentView === 'form' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '80px 20px' }}>
            <button
              onClick={() => setCurrentView('home')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#d4af37',
                fontSize: '1rem',
                cursor: 'pointer',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              ← Volver
            </button>

            <h1 style={{
              fontSize: '2.5rem',
              textAlign: 'center',
              color: '#d4af37',
              marginBottom: '20px'
            }}>
              Tu Carta Astral
            </h1>

            <p style={{
              textAlign: 'center',
              color: '#b8a5d6',
              marginBottom: '40px'
            }}>
              Ingresa tus datos de nacimiento
            </p>

            <form onSubmit={handleSubmit} style={{
              background: 'rgba(45, 27, 78, 0.4)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#b8a5d6' }}>
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
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#b8a5d6' }}>
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
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#b8a5d6' }}>
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
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#b8a5d6' }}>
                  👤 Género
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(26, 11, 46, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Selecciona...</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="No binario">No binario</option>
                  <option value="Prefiero no decir">Prefiero no decir</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: isCalculating ? 'rgba(212, 175, 55, 0.5)' : 'linear-gradient(135deg, #d4af37, #f0c674)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#1a0b2e',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: isCalculating ? 'wait' : 'pointer',
                  opacity: isCalculating ? 0.7 : 1
                }}
              >
                {isCalculating ? 'Calculando posiciones celestiales...' : 'Generar Carta Astral ✨'}
              </button>
            </form>
          </div>
        )}

        {/* RESULTADOS */}
        {currentView === 'results' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
            
            {/* HERO - Tu Configuración */}
            <div style={{
              textAlign: 'center',
              marginBottom: '70px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 165, 214, 0.05))',
                padding: '50px 40px',
                borderRadius: '25px',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                marginBottom: '40px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
                  {[
                    { planet: 'sol', label: 'Sol' },
                    { planet: 'luna', label: 'Luna' },
                    { planet: 'ascendente', label: 'Asc' }
                  ].map(({ planet, label }) => (
                    <div key={planet} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{getPlanetEmoji(planet)}</div>
                      <div style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 600 }}>
                        {getZodiacSign(chart[planet])}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <h1 style={{
                  fontSize: '2.5rem',
                  color: '#d4af37',
                  marginBottom: '20px',
                  fontWeight: 600,
                  lineHeight: '1.3'
                }}>
                  Tu carta astral completa
                </h1>
                
                <p style={{
                  fontSize: '1.3rem',
                  color: '#b8a5d6',
                  lineHeight: '1.7',
                  maxWidth: '700px',
                  margin: '0 auto 35px'
                }}>
                  Un mapa claro de quién eres, cómo amas y cómo te mueves en el mundo.
                </p>

                <button
                  onClick={generateCompleteAnalysis}
                  disabled={isGenerating}
                  style={{
                    padding: '20px 50px',
                    background: 'linear-gradient(135deg, #d4af37, #f0c674)',
                    border: 'none',
                    borderRadius: '15px',
                    color: '#1a0b2e',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    cursor: isGenerating ? 'wait' : 'pointer',
                    opacity: isGenerating ? 0.6 : 1,
                    boxShadow: '0 8px 30px rgba(212, 175, 55, 0.35)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isGenerating ? 'Generando...' : 'Ver mi análisis completo'}
                </button>
              </div>

              <p style={{
                color: '#9ca3af',
                fontSize: '0.95rem',
                fontStyle: 'italic'
              }}>
                Nada de esto es genérico. Está basado en tu fecha, tu hora y tu historia.
              </p>
            </div>

            {/* Secciones Temáticas - Cards Grandes */}
            <div style={{ marginBottom: '70px' }}>
              <h2 style={{
                color: '#d4af37',
                fontSize: '2rem',
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                O explora por temas
              </h2>
              <p style={{
                color: '#b8a5d6',
                textAlign: 'center',
                fontSize: '1.1rem',
                marginBottom: '40px'
              }}>
                Lecturas enfocadas en áreas específicas de tu vida
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {[
                  {
                    key: 'love',
                    emoji: '❤️',
                    title: 'Amor y vínculos',
                    desc: 'Cómo amas, qué buscas y por qué se repiten ciertos patrones',
                    buttonText: 'Ver mi análisis'
                  },
                  {
                    key: 'work',
                    emoji: '💼',
                    title: 'Trabajo y propósito',
                    desc: 'Cómo tomas decisiones, lideras y enfrentas desafíos',
                    buttonText: 'Explorar'
                  },
                  {
                    key: 'health',
                    emoji: '🌿',
                    title: 'Salud y energía',
                    desc: 'Tu ritmo interno, estrés y cómo recargarte',
                    buttonText: 'Ver insights'
                  }
                ].map(({ key, emoji, title, desc, buttonText }) => (
                  <div
                    key={key}
                    style={{
                      background: 'linear-gradient(135deg, rgba(45, 27, 78, 0.6), rgba(26, 11, 46, 0.4))',
                      padding: '40px',
                      borderRadius: '20px',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '30px',
                      transition: 'all 0.3s ease',
                      cursor: isGenerating ? 'wait' : 'pointer',
                      opacity: isGenerating ? 0.6 : 1,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                    onClick={() => generateCategoryReading(key)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    <div style={{ fontSize: '3.5rem', flexShrink: 0 }}>{emoji}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        color: '#d4af37',
                        fontSize: '1.8rem',
                        marginBottom: '12px',
                        fontWeight: 600
                      }}>
                        {title}
                      </h3>
                      <p style={{
                        color: '#b8a5d6',
                        fontSize: '1.15rem',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        {desc}
                      </p>
                      <div style={{
                        display: 'inline-block',
                        padding: '10px 25px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        borderRadius: '10px',
                        color: '#f0c674',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}>
                        {buttonText} →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explorar por Planeta - Renombrado */}
            <div style={{
              background: 'rgba(45, 27, 78, 0.3)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              marginBottom: '40px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{
                  color: '#d4af37',
                  fontSize: '1.8rem',
                  marginBottom: '10px'
                }}>
                  ✨ Explorar mi mapa interno
                </h2>
                <p style={{
                  color: '#b8a5d6',
                  fontSize: '1.05rem'
                }}>
                  Análisis profundo de cada planeta en tu carta
                </p>
              </div>

              <button
                onClick={() => setShowPlanetDetails(!showPlanetDetails)}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  color: '#d4af37',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                }}
              >
                {showPlanetDetails ? '▼ Ocultar planetas' : '▶ Ver todos los planetas'}
              </button>

              {showPlanetDetails && (
                <div style={{
                  marginTop: '30px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '20px'
                }}>
                  {Object.entries(chart).map(([planet, degrees]) => {
                    const sign = getZodiacSign(degrees);
                    const deg = (degrees % 30).toFixed(1);
                    
                    return (
                      <div
                        key={planet}
                        style={{
                          background: 'linear-gradient(135deg, rgba(26, 11, 46, 0.7), rgba(45, 27, 78, 0.5))',
                          padding: '25px',
                          borderRadius: '15px',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.15)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                            {getPlanetEmoji(planet)}
                          </div>
                          <h3 style={{
                            color: '#d4af37',
                            margin: 0,
                            textTransform: 'capitalize',
                            fontSize: '1.3rem',
                            fontWeight: 600,
                            marginBottom: '5px'
                          }}>
                            {planet}
                          </h3>
                          <p style={{
                            color: '#b8a5d6',
                            margin: 0,
                            fontSize: '1.05rem'
                          }}>
                            {sign} {deg}°
                          </p>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            generateDeepReading(planet, degrees);
                          }}
                          disabled={isGenerating}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: isGenerating ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.15)',
                            border: '1px solid rgba(212, 175, 55, 0.4)',
                            borderRadius: '10px',
                            color: '#f0c674',
                            cursor: isGenerating ? 'wait' : 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            opacity: isGenerating ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isGenerating) {
                              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.25)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isGenerating) {
                              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                            }
                          }}
                        >
                          {isGenerating ? 'Generando...' : 'Lectura profunda →'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Botón Inicio */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{
                  padding: '12px 30px',
                  background: 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  color: '#d4af37',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                }}
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* MODAL DE LECTURA */}
        {currentReading && (
          <div
            onClick={() => setCurrentReading(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.95)',
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
                background: 'linear-gradient(135deg, #1a0b2e, #2d1b4e)',
                padding: '40px',
                borderRadius: '20px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
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
                  background: 'rgba(45, 27, 78, 0.8)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: '#d4af37',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>

              <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>
                {currentReading.title}
              </h2>

              {isGenerating ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#b8a5d6', fontSize: '1.2rem' }}>
                    Analizando tu configuración...
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

        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Crimson Pro', Georgia, serif;
          }
          
          input:focus, select:focus {
            outline: none;
            border-color: rgba(212, 175, 55, 0.6) !important;
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
