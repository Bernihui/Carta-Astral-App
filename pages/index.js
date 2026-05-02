// pages/index.js - VERSIÓN MINIMALISTA
// 100% funcionalidad original, diseño ultra-limpio
import { useState } from 'react';
import Head from 'next/head';

// [TODO EL CÓDIGO DE PROMPTS SE MANTIENE IGUAL]
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

// [TODAS LAS FUNCIONES SE MANTIENEN IGUALES]
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
  
  if (degrees === undefined || degrees === null || isNaN(degrees)) {
    return 'undefined';
  }
  
  let normalizedDegrees = degrees % 360;
  if (normalizedDegrees < 0) normalizedDegrees += 360;
  
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
  const [currentView, setCurrentView] = useState('home');
  const [formData, setFormData] = useState({ date: '', time: '', city: '', gender: '' });
  const [chart, setChart] = useState(null);
  const [currentReading, setCurrentReading] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState(null);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [compatibilityData, setCompatibilityData] = useState({
    date: '',
    time: '',
    city: '',
    gender: ''
  });
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [compatibilityTab, setCompatibilityTab] = useState('love');

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

  const analyzeCompatibility = async () => {
    if (!compatibilityData.date || !compatibilityData.time || !compatibilityData.city) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsGenerating(true);
    
    try {
      const chartResponse = await fetch('/api/calculate-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: compatibilityData.date,
          time: compatibilityData.time,
          city: compatibilityData.city
        })
      });

      if (!chartResponse.ok) throw new Error('Error al calcular carta');
      
      const { positions: person2Positions } = await chartResponse.json();

      const analyses = await Promise.all([
        fetch('/api/compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            person1: chart,
            person2: person2Positions,
            analysisType: 'love',
            gender1: formData.gender,
            gender2: compatibilityData.gender
          })
        }).then(r => r.json()),
        
        fetch('/api/compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            person1: chart,
            person2: person2Positions,
            analysisType: 'friendship',
            gender1: formData.gender,
            gender2: compatibilityData.gender
          })
        }).then(r => r.json()),
        
        fetch('/api/compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            person1: chart,
            person2: person2Positions,
            analysisType: 'work',
            gender1: formData.gender,
            gender2: compatibilityData.gender
          })
        }).then(r => r.json())
      ]);

      setCompatibilityResult({
        love: analyses[0].reading,
        friendship: analyses[1].reading,
        work: analyses[2].reading
      });

    } catch (error) {
      console.error('Error:', error);
      alert('Error al analizar compatibilidad');
    } finally {
      setIsGenerating(false);
    }
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
        <title>Carta Astral</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* ESTILOS MINIMALISTAS */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #FFFFFF;
          color: #000000;
        }
        
        input, select {
          -webkit-appearance: none;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #000000 !important;
        }
        
        button:hover:not(:disabled) {
          opacity: 0.8;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#000000', fontFamily: 'Inter, sans-serif' }}>
        
        {/* ===== HOMEPAGE ===== */}
        {currentView === 'home' && (
          <div style={{ maxWidth: '680px', margin: '0 auto', padding: '120px 24px 80px' }}>
            
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '60px', letterSpacing: '0.02em' }}>
                Carta Astral
              </h1>
              
              <h2 style={{ fontSize: '42px', lineHeight: '1.2', fontWeight: 400, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Tu carta astral, pero explicada como si alguien realmente te conociera.
              </h2>
              
              <p style={{ fontSize: '18px', color: '#666666', lineHeight: '1.7', marginBottom: '48px' }}>
                Ingresa tu fecha, hora y lugar de nacimiento y recibe una lectura clara, profunda y bajada a la vida real.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentView('form')}
                  style={{ padding: '14px 32px', background: '#000000', border: 'none', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Leer mi carta astral
                </button>
                
                <button
                  onClick={() => { fillDemoData(); setCurrentView('form'); }}
                  style={{ padding: '14px 32px', background: 'transparent', border: '1px solid #000000', color: '#000000', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Probar con ejemplo
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: '#E5E5E5', margin: '80px 0' }} />

            {/* Features */}
            <div style={{ marginBottom: '80px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '40px', textAlign: 'center' }}>
                Qué vas a descubrir
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {[
                  { emoji: '🌞', title: 'Tu esencia', desc: 'Lo que te mueve en profundidad.' },
                  { emoji: '🌙', title: 'Tu mundo emocional', desc: 'Cómo sientes, qué necesitas y cómo te proteges.' },
                  { emoji: '⬆️', title: 'Cómo te perciben', desc: 'La energía que proyectas sin darte cuenta.' },
                  { emoji: '❤️', title: 'Amor y vínculos', desc: 'Cómo amas, qué buscas y qué te cuesta soltar.' },
                  { emoji: '🔥', title: 'Energía y acción', desc: 'Cómo decides, avanzas y enfrentas conflicto.' },
                  { emoji: '🧩', title: 'Tu tema central', desc: 'La tensión interna que más marca tu vida.' }
                ].map((item, i) => (
                  <div key={i} style={{ paddingBottom: '48px', borderBottom: i < 5 ? '1px solid #F5F5F5' : 'none' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.emoji}</div>
                    <h4 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>{item.title}</h4>
                    <p style={{ color: '#666666', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: '#E5E5E5', margin: '80px 0' }} />

            {/* Ejemplo */}
            <div style={{ marginBottom: '80px' }}>
              <div style={{ padding: '40px', background: '#F5F5F5', borderLeft: '4px solid #000000' }}>
                <p style={{ fontSize: '20px', lineHeight: '1.7', color: '#000000', fontStyle: 'italic' }}>
                  "Eres Libra, pero no solo buscas armonía. Hay en ti una necesidad profunda de construir vínculos justos, inteligentes y sostenibles. Con tu energía Capricornio, no te entregas fácil: observas, evalúas y eliges dónde poner tu energía."
                </p>
              </div>
              <p style={{ fontSize: '14px', color: '#999999', marginTop: '16px', textAlign: 'center' }}>
                Astrología sin humo. Lecturas claras, humanas y accionables.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '16px' }}>
                A veces no necesitas cambiar.<br/>Solo entenderte mejor.
              </h3>
              <button
                onClick={() => setCurrentView('form')}
                style={{ padding: '14px 32px', background: '#000000', border: 'none', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, cursor: 'pointer', marginTop: '32px', fontFamily: 'inherit' }}
              >
                Empezar mi lectura
              </button>
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        {currentView === 'form' && (
          <div style={{ maxWidth: '480px', margin: '0 auto', padding: '80px 24px' }}>
            <button
              onClick={() => setCurrentView('home')}
              style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '15px', cursor: 'pointer', marginBottom: '40px', fontFamily: 'inherit', padding: '8px 0' }}
            >
              ← Volver
            </button>

            <h1 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '48px' }}>
              Tu Carta Astral
            </h1>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Hora de nacimiento
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Lugar de nacimiento
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Santiago, Chile"
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Género
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
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
                style={{ width: '100%', padding: '14px', background: isCalculating ? '#CCCCCC' : '#000000', border: 'none', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, cursor: isCalculating ? 'wait' : 'pointer', fontFamily: 'inherit' }}
              >
                {isCalculating ? 'Calculando...' : 'Generar Carta Astral'}
              </button>
            </form>
          </div>
        )}

        {/* ===== RESULTS ===== */}
        {currentView === 'results' && (
          <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px' }}>
            
            {/* Big 3 */}
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '48px', flexWrap: 'wrap' }}>
                {[
                  { planet: 'sol', label: 'Sol' },
                  { planet: 'luna', label: 'Luna' },
                  { planet: 'ascendente', label: 'Asc' }
                ].map(({ planet, label }) => (
                  <div key={planet}>
                    <div style={{ fontSize: '14px', color: '#999999', marginBottom: '8px' }}>{label}</div>
                    <div style={{ fontSize: '24px', fontWeight: 500 }}>
                      {getZodiacSign(chart[planet])}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={generateCompleteAnalysis}
                disabled={isGenerating}
                style={{ padding: '14px 32px', background: isGenerating ? '#CCCCCC' : '#000000', border: 'none', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, cursor: isGenerating ? 'wait' : 'pointer', fontFamily: 'inherit' }}
              >
                {isGenerating ? 'Generando...' : 'Ver análisis completo'}
              </button>
            </div>

            <div style={{ height: '1px', background: '#E5E5E5', margin: '80px 0' }} />

            {/* Temas */}
            <div style={{ marginBottom: '80px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '48px', textAlign: 'center' }}>
                O explora por temas
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { key: 'love', emoji: '❤️', title: 'Amor y vínculos' },
                  { key: 'work', emoji: '💼', title: 'Trabajo y propósito' },
                  { key: 'health', emoji: '🌿', title: 'Salud y energía' }
                ].map(({ key, emoji, title }) => (
                  <button
                    key={key}
                    onClick={() => generateCategoryReading(key)}
                    disabled={isGenerating}
                    style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #DDDDDD', textAlign: 'left', cursor: isGenerating ? 'wait' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '16px' }}
                  >
                    <span style={{ fontSize: '28px' }}>{emoji}</span>
                    <span style={{ fontSize: '18px', fontWeight: 500 }}>{title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Compatibilidad */}
            <div style={{ marginBottom: '80px' }}>
              <div style={{ padding: '40px', background: '#F5F5F5', textAlign: 'center' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '16px' }}>
                  Analiza compatibilidad
                </h3>
                <p style={{ color: '#666666', marginBottom: '32px' }}>
                  Descubre la dinámica con otra persona
                </p>
                
                {!showCompatibility && (
                  <button
                    onClick={() => setShowCompatibility(true)}
                    style={{ padding: '14px 32px', background: '#000000', border: 'none', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Analizar compatibilidad
                  </button>
                )}

                {showCompatibility && !compatibilityResult && (
                  <div style={{ background: '#FFFFFF', padding: '32px', marginTop: '32px', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '24px' }}>
                      Datos de la otra persona
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                          Fecha de nacimiento
                        </label>
                        <input
                          type="date"
                          value={compatibilityData.date}
                          onChange={(e) => setCompatibilityData({...compatibilityData, date: e.target.value})}
                          style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500' }}>
                          Hora de nacimiento
                        </label>
                        <input
                          type="time"
                          value={compatibilityData.time}
                          onChange={(e) => setCompatibilityData({...compatibilityData, time: e.target.value})}
                          style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500' }}>
                          Ciudad de nacimiento
                        </label>
                        <input
                          type="text"
                          value={compatibilityData.city}
                          onChange={(e) => setCompatibilityData({...compatibilityData, city: e.target.value})}
                          placeholder="Santiago, Chile"
                          style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500' }}>
                          Género
                        </label>
                        <select
                          value={compatibilityData.gender}
                          onChange={(e) => setCompatibilityData({...compatibilityData, gender: e.target.value})}
                          style={{ width: '100%', padding: '12px', border: '1px solid #DDDDDD', fontSize: '16px', fontFamily: 'inherit' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Femenino">Femenino</option>
                          <option value="Masculino">Masculino</option>
                          <option value="No binario">No binario</option>
                          <option value="Prefiero no decir">Prefiero no decir</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                          onClick={analyzeCompatibility}
                          disabled={isGenerating}
                          style={{ flex: 1, padding: '14px', background: isGenerating ? '#CCCCCC' : '#000000', border: 'none', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, cursor: isGenerating ? 'wait' : 'pointer', fontFamily: 'inherit' }}
                        >
                          {isGenerating ? 'Analizando...' : 'Analizar'}
                        </button>
                        <button
                          onClick={() => { setShowCompatibility(false); setCompatibilityData({ date: '', time: '', city: '', gender: '' }); }}
                          style={{ padding: '14px 24px', background: 'transparent', border: '1px solid #000000', color: '#000000', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {compatibilityResult && (
                  <div style={{ marginTop: '32px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {[
                        { key: 'love', label: 'Amor' },
                        { key: 'friendship', label: 'Amistad' },
                        { key: 'work', label: 'Trabajo' }
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setCompatibilityTab(key)}
                          style={{ padding: '12px 24px', background: compatibilityTab === key ? '#000000' : 'transparent', border: `1px solid #000000`, color: compatibilityTab === key ? '#FFFFFF' : '#000000', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '32px', fontSize: '16px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {compatibilityResult[compatibilityTab]}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                      <button
                        onClick={() => { setShowCompatibility(false); setCompatibilityResult(null); setCompatibilityData({ date: '', time: '', city: '', gender: '' }); setCompatibilityTab('love'); }}
                        style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #000000', color: '#000000', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Hacer otro análisis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Planetas */}
            <div style={{ marginBottom: '80px' }}>
              <button
                onClick={() => setShowPlanetDetails(!showPlanetDetails)}
                style={{ width: '100%', padding: '16px', background: 'transparent', border: '1px solid #DDDDDD', cursor: 'pointer', fontSize: '15px', fontFamily: 'inherit', fontWeight: 500 }}
              >
                {showPlanetDetails ? '▼ Ocultar planetas' : '▶ Ver todos los planetas'}
              </button>

              {showPlanetDetails && (
                <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                  {Object.entries(chart).map(([planet, degrees]) => {
                    const sign = getZodiacSign(degrees);
                    const deg = (degrees % 30).toFixed(1);
                    
                    return (
                      <div key={planet} style={{ border: '1px solid #E5E5E5', padding: '24px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                            {getPlanetEmoji(planet)}
                          </div>
                          <h3 style={{ fontSize: '16px', fontWeight: 500, textTransform: 'capitalize', marginBottom: '4px' }}>
                            {planet}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#666666' }}>
                            {sign} {deg}°
                          </p>
                        </div>
                        
                        <button
                          onClick={() => generateDeepReading(planet, degrees)}
                          disabled={isGenerating}
                          style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #000000', color: '#000000', cursor: isGenerating ? 'wait' : 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 500 }}
                        >
                          {isGenerating ? 'Generando...' : 'Ver lectura'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Volver */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #000000', color: '#000000', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', fontWeight: 500 }}
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* ===== MODAL ===== */}
        {currentReading && (
          <div
            onClick={() => setCurrentReading(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 1000 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', background: '#FFFFFF', padding: '48px', overflow: 'auto', position: 'relative' }}
            >
              <button
                onClick={() => setCurrentReading(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', width: '32px', height: '32px', padding: 0 }}
              >
                ✕
              </button>

              <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '32px' }}>
                {currentReading.title}
              </h2>

              {isGenerating ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#666666' }}>Generando lectura...</p>
                </div>
              ) : (
                <div style={{ fontSize: '16px', lineHeight: '1.7', color: '#000000', whiteSpace: 'pre-wrap' }}>
                  {currentReading.content}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
