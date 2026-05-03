// pages/index.js - VERSIÓN OPTIMIZADA CON NUEVO ONBOARDING
import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

// ========== SISTEMA DE PROMPTS (MANTENER IGUAL) ==========
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
1. **Energía Core**: Explica la esencia y cómo se manifiesta
2. **Manifestación Práctica**: Cómo se expresa en la vida diaria
3. **Desafíos y Oportunidades**: Los retos y cómo aprovecharlos
4. **Integración**: Consejos prácticos
5. **Potencial Evolutivo**: Hacia dónde puede desarrollarse

La lectura debe ser profunda pero accesible, personalizada, empoderadora, ~400-500 palabras, en segunda persona.`,

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
    
    return `Actúa como un astrólogo experto con enfoque psicológico.
Datos: ${birthData.date} | ${birthData.time} | ${birthData.city}
Posiciones: Sol ${solSign} • Luna ${lunaSign} • Asc ${ascSign} • Mercurio ${mercurioSign} • Venus ${venusSign} • Marte ${marteSign}

Construye una lectura CONCISA pero PROFUNDA (600-700 palabras total).`;
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
Posiciones: Sol ${getZodiacSign(chartData.sol)}, Saturno ${getZodiacSign(chartData.saturno)}
Extensión: 600-700 palabras`;
  },

  healthReading: (chartData, birthData) => {
    const getZodiacSign = (degrees) => {
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                     'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      return signs[Math.floor(degrees / 30)];
    };
    
    return `Lectura de salud holística.
Posiciones: Sol ${getZodiacSign(chartData.sol)}, Luna ${getZodiacSign(chartData.luna)}
Extensión: 600-700 palabras`;
  },

  // NUEVO: Insight diario accionable
  dailyInsight: (chartData, birthData) => {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                   'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    const getSignName = (degrees) => signs[Math.floor(degrees / 30)];
    
    const solSign = getSignName(chartData.sol);
    const lunaSign = getSignName(chartData.luna);
    
    return `Genera un insight CORTO y ACCIONABLE para HOY basado en:
- Sol en ${solSign}
- Luna en ${lunaSign}
- Fecha: ${birthData.date}

Estructura OBLIGATORIA (máximo 150 palabras total):

1. VALIDACIÓN (2 frases): Qué podrían estar sintiendo hoy
2. CONTEXTO (1 frase): Por qué (posición lunar/planetaria)
3. ACCIÓN (1 frase concreta): Qué hacer específicamente hoy

Ejemplo:
"Hoy podrías sentir más sensibilidad en lo emocional. La Luna transitando tu signo amplifica tus emociones. Tómate 5 minutos antes de responder algo importante."

CRÍTICO: Debe ser ACCIONABLE, no solo descriptivo. Segunda persona. Máximo 150 palabras.`;
  }
};

// ========== FUNCIONES AUXILIARES (MANTENER) ==========
const calculatePlanetaryPositions = async (birthDate, birthTime, city) => {
  try {
    const response = await fetch('/api/calculate-chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: birthDate, time: birthTime, city: city }),
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
  
  if (degrees === undefined || degrees === null || isNaN(degrees)) return 'undefined';
  
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

// ========== COMPONENTE PRINCIPAL ==========
export default function Home() {
  // Estados
  const [currentView, setCurrentView] = useState('home'); // home, form, loading, wow, results
  const [formData, setFormData] = useState({ date: '', time: '', city: '' });
  const [userInfo, setUserInfo] = useState({ name: '', gender: '' }); // Se captura DESPUÉS
  const [chart, setChart] = useState(null);
  const [dailyInsightText, setDailyInsightText] = useState(null);
  const [currentReading, setCurrentReading] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [compatibilityData, setCompatibilityData] = useState({ date: '', time: '', city: '', gender: '' });
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [compatibilityTab, setCompatibilityTab] = useState('love');

  // Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentView('loading');
    
    try {
      const positions = await calculatePlanetaryPositions(formData.date, formData.time, formData.city);
      setChart(positions);
      
      // Generar insight diario
      const insightPrompt = PROMPTS.dailyInsight(positions, formData);
      const insightResponse = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: insightPrompt }),
      });
      
      const insightData = await insightResponse.json();
      setDailyInsightText(insightData.content);
      
      // Ir al WOW moment
      setTimeout(() => {
        setCurrentView('wow');
      }, 2000);
      
    } catch (error) {
      alert(`Error: ${error.message}`);
      setCurrentView('form');
    }
  };

  const continueToResults = () => {
    setCurrentView('results');
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

      setCurrentReading({ title, content: data.content, prompt });
    } catch (error) {
      console.error('Error:', error);
      setCurrentReading({
        title,
        content: 'Lo siento, hubo un error. Por favor intenta nuevamente.',
        error: true
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDeepReading = (planet, degrees) => {
    if (degrees === undefined || degrees === null || isNaN(degrees)) {
      alert('Error: No se pudo obtener la posición');
      return;
    }
    
    const sign = getZodiacSign(degrees);
    const degree = (degrees % 30).toFixed(1);
    const prompt = PROMPTS.deepReading(planet, sign, degree, formData);
    generateReading(prompt, `${planet} en ${sign}`);
  };

  const generateCompleteAnalysis = () => {
    const prompt = PROMPTS.completeAnalysis(chart, formData);
    generateReading(prompt, 'Análisis Completo');
  };

  const generateCategoryReading = (category) => {
    const titles = {
      love: 'Amor y Relaciones',
      work: 'Trabajo y Vocación',
      health: 'Salud y Bienestar'
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

  return (
    <>
      <Head>
        <title>Carta Astral</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.container}>
        
        {/* ===== HOME ===== */}
        {currentView === 'home' && (
          <div className={styles.pageContainer}>
            <div className={styles.header}>
              <div className={styles.logo}>Carta Astral</div>
              
              <h1 className={styles.headline}>
                Entiende lo que te está pasando hoy.
              </h1>
              
              <p className={styles.subheadline}>
                Ingresa tu fecha, hora y lugar de nacimiento y recibe una lectura clara y accionable.
              </p>

              <div className={styles.buttonGroup}>
                <button
                  onClick={() => setCurrentView('form')}
                  className={styles.buttonPrimary}
                >
                  Comenzar
                </button>
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Features */}
            <div className={styles.features}>
              <h2 className={styles.featuresTitle}>Qué vas a descubrir</h2>
              
              <div className={styles.featuresList}>
                {[
                  { emoji: '🌞', title: 'Tu esencia', desc: 'Lo que te mueve en profundidad.' },
                  { emoji: '🌙', title: 'Tu mundo emocional', desc: 'Cómo sientes y qué necesitas.' },
                  { emoji: '⬆️', title: 'Cómo te perciben', desc: 'La energía que proyectas.' },
                  { emoji: '❤️', title: 'Amor y vínculos', desc: 'Cómo amas y qué buscas.' },
                  { emoji: '🔥', title: 'Energía y acción', desc: 'Cómo decides y avanzas.' },
                  { emoji: '🧩', title: 'Tu tema central', desc: 'La tensión que más te marca.' }
                ].map((item, i) => (
                  <div key={i} className={styles.feature}>
                    <div className={styles.featureEmoji}>{item.emoji}</div>
                    <h3 className={styles.featureTitle}>{item.title}</h3>
                    <p className={styles.featureDesc}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Example */}
            <div className={styles.exampleBox}>
              <p className={styles.exampleText}>
                "Eres Libra, pero no solo buscas armonía. Hay en ti una necesidad profunda de construir vínculos justos, inteligentes y sostenibles."
              </p>
            </div>
            <p className={styles.exampleCaption}>
              Astrología sin humo. Lecturas claras y accionables.
            </p>

            <div style={{ textAlign: 'center', marginTop: '80px' }}>
              <h2 className={styles.headline} style={{ fontSize: '28px' }}>
                A veces no necesitas cambiar.<br/>Solo entenderte mejor.
              </h2>
              <button
                onClick={() => setCurrentView('form')}
                className={styles.buttonPrimary}
                style={{ marginTop: '32px' }}
              >
                Empezar mi lectura
              </button>
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        {currentView === 'form' && (
          <div className={styles.pageContainerForm}>
            <button
              onClick={() => setCurrentView('home')}
              className={styles.backButton}
            >
              ← Volver
            </button>

            <h1 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '48px' }}>
              Tu Carta Astral
            </h1>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Fecha de nacimiento</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hora de nacimiento</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                  className={styles.formInput}
                />
                <p style={{ fontSize: '14px', color: '#999999', marginTop: '8px' }}>
                  Si no conoces tu hora exacta, usa 12:00
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Lugar de nacimiento</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Santiago, Chile"
                  required
                  className={styles.formInput}
                />
              </div>

              <button
                type="submit"
                className={styles.buttonPrimary}
                style={{ width: '100%', marginTop: '24px' }}
              >
                Generar Carta Astral
              </button>
            </form>
          </div>
        )}

        {/* ===== LOADING ===== */}
        {currentView === 'loading' && (
          <div className={styles.pageContainer}>
            <div style={{ textAlign: 'center', paddingTop: '120px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '16px' }}>
                Estamos preparando tu lectura personalizada...
              </h2>
              <p style={{ color: '#666666', fontSize: '16px' }}>
                Esto tomará solo unos segundos
              </p>
            </div>
          </div>
        )}

        {/* ===== WOW MOMENT ===== */}
        {currentView === 'wow' && dailyInsightText && (
          <div className={styles.pageContainer}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '40px' }}>
                Hoy para ti
              </h2>
              
              <div style={{
                padding: '40px',
                background: '#F5F5F5',
                borderLeft: '4px solid #000000',
                textAlign: 'left',
                marginBottom: '40px'
              }}>
                <p style={{ fontSize: '18px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {dailyInsightText}
                </p>
              </div>

              <p style={{ color: '#666666', marginBottom: '32px' }}>
                Esto es solo una parte de tu carta
              </p>

              <button
                onClick={continueToResults}
                className={styles.buttonPrimary}
              >
                Ver más sobre ti →
              </button>
            </div>
          </div>
        )}

        {/* ===== RESULTS ===== */}
        {currentView === 'results' && chart && (
          <div className={styles.pageContainer}>
            
            {/* Big 3 */}
            <div className={styles.big3Container}>
              <div className={styles.big3Grid}>
                {[
                  { planet: 'sol', label: 'Sol' },
                  { planet: 'luna', label: 'Luna' },
                  { planet: 'ascendente', label: 'Asc' }
                ].map(({ planet, label }) => (
                  <div key={planet} className={styles.big3Item}>
                    <div className={styles.big3Label}>{label}</div>
                    <div className={styles.big3Value}>
                      {getZodiacSign(chart[planet])}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={generateCompleteAnalysis}
                disabled={isGenerating}
                className={styles.buttonPrimary}
              >
                {isGenerating ? 'Generando...' : 'Ver análisis completo'}
              </button>
            </div>

            <div className={styles.divider}></div>

            {/* Temas */}
            <div>
              <h2 className={styles.featuresTitle}>O explora por temas</h2>

              <div className={styles.themesList}>
                {[
                  { key: 'love', emoji: '❤️', title: 'Amor y vínculos' },
                  { key: 'work', emoji: '💼', title: 'Trabajo y propósito' },
                  { key: 'health', emoji: '🌿', title: 'Salud y energía' }
                ].map(({ key, emoji, title }) => (
                  <button
                    key={key}
                    onClick={() => generateCategoryReading(key)}
                    disabled={isGenerating}
                    className={styles.themeButton}
                  >
                    <span className={styles.themeEmoji}>{emoji}</span>
                    <span className={styles.themeTitle}>{title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.divider}></div>

            {/* Compatibilidad */}
            <div className={styles.compatBox}>
              <h3 className={styles.compatTitle}>Analiza compatibilidad</h3>
              <p className={styles.compatDesc}>
                Descubre la dinámica con otra persona
              </p>
              
              {!showCompatibility && (
                <button
                  onClick={() => setShowCompatibility(true)}
                  className={styles.buttonPrimary}
                >
                  Analizar compatibilidad
                </button>
              )}

              {showCompatibility && !compatibilityResult && (
                <div className={styles.compatForm}>
                  <h4 className={styles.compatFormTitle}>
                    Datos de la otra persona
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Fecha de nacimiento</label>
                      <input
                        type="date"
                        value={compatibilityData.date}
                        onChange={(e) => setCompatibilityData({...compatibilityData, date: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Hora de nacimiento</label>
                      <input
                        type="time"
                        value={compatibilityData.time}
                        onChange={(e) => setCompatibilityData({...compatibilityData, time: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Ciudad de nacimiento</label>
                      <input
                        type="text"
                        value={compatibilityData.city}
                        onChange={(e) => setCompatibilityData({...compatibilityData, city: e.target.value})}
                        placeholder="Santiago, Chile"
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Género</label>
                      <select
                        value={compatibilityData.gender}
                        onChange={(e) => setCompatibilityData({...compatibilityData, gender: e.target.value})}
                        className={styles.formInput}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="No binario">No binario</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button
                        onClick={analyzeCompatibility}
                        disabled={isGenerating}
                        className={styles.buttonPrimary}
                        style={{ flex: 1 }}
                      >
                        {isGenerating ? 'Analizando...' : 'Analizar'}
                      </button>
                      <button
                        onClick={() => {
                          setShowCompatibility(false);
                          setCompatibilityData({ date: '', time: '', city: '', gender: '' });
                        }}
                        className={styles.buttonSecondary}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {compatibilityResult && (
                <div style={{ marginTop: '32px' }}>
                  <div className={styles.compatTabs}>
                    {[
                      { key: 'love', label: 'Amor' },
                      { key: 'friendship', label: 'Amistad' },
                      { key: 'work', label: 'Trabajo' }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setCompatibilityTab(key)}
                        className={`${styles.compatTab} ${compatibilityTab === key ? styles.compatTabActive : ''}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className={styles.compatContent}>
                    {compatibilityResult[compatibilityTab]}
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                      onClick={() => {
                        setShowCompatibility(false);
                        setCompatibilityResult(null);
                        setCompatibilityData({ date: '', time: '', city: '', gender: '' });
                        setCompatibilityTab('love');
                      }}
                      className={styles.buttonSecondary}
                    >
                      Hacer otro análisis
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Planetas */}
            <div>
              <button
                onClick={() => setShowPlanetDetails(!showPlanetDetails)}
                className={styles.planetsToggle}
              >
                {showPlanetDetails ? '▼ Ocultar planetas' : '▶ Ver todos los planetas'}
              </button>

              {showPlanetDetails && (
                <div className={styles.planetsGrid}>
                  {Object.entries(chart).map(([planet, degrees]) => {
                    const sign = getZodiacSign(degrees);
                    const deg = (degrees % 30).toFixed(1);
                    
                    return (
                      <div key={planet} className={styles.planetCard}>
                        <div className={styles.planetEmoji}>
                          {getPlanetEmoji(planet)}
                        </div>
                        <h3 className={styles.planetName}>{planet}</h3>
                        <p className={styles.planetPosition}>
                          {sign} {deg}°
                        </p>
                        
                        <button
                          onClick={() => generateDeepReading(planet, degrees)}
                          disabled={isGenerating}
                          className={styles.planetButton}
                        >
                          {isGenerating ? 'Generando...' : 'Ver lectura'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '80px' }}>
              <button
                onClick={() => setCurrentView('home')}
                className={styles.buttonSecondary}
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
            className={styles.modal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.modalContent}
            >
              <button
                onClick={() => setCurrentReading(null)}
                className={styles.modalClose}
              >
                ✕
              </button>

              <h2 className={styles.modalTitle}>
                {currentReading.title}
              </h2>

              {isGenerating ? (
                <div className={styles.loading}>
                  <p>Generando lectura...</p>
                </div>
              ) : (
                <div className={styles.modalBody}>
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
