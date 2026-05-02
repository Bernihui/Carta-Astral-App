// pages/api/compatibility.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { person1, person2, analysisType, gender1, gender2 } = req.body;

  console.log('=== COMPATIBILITY ANALYSIS ===');
  console.log('Person 1:', person1);
  console.log('Person 2:', person2);
  console.log('Analysis type:', analysisType);

  if (!person1 || !person2 || !analysisType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Importar Anthropic SDK
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Construir prompt según el tipo de análisis
    const prompts = {
      love: buildLovePrompt(person1, person2, gender1, gender2),
      friendship: buildFriendshipPrompt(person1, person2, gender1, gender2),
      work: buildWorkPrompt(person1, person2, gender1, gender2)
    };

    const prompt = prompts[analysisType];

    if (!prompt) {
      return res.status(400).json({ error: 'Invalid analysis type' });
    }

    console.log('Calling Claude API for compatibility...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const reading = message.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n\n');

    console.log('Compatibility analysis generated');

    return res.status(200).json({ reading });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Error al generar análisis de compatibilidad',
      details: error.message 
    });
  }
}

// PROMPTS ESPECIALIZADOS

function buildLovePrompt(person1, person2, gender1, gender2) {
  return `Analiza la compatibilidad amorosa entre estas dos personas basándote en sus posiciones planetarias.

PERSONA 1 (${gender1 || 'sin especificar'}):
- Sol: ${getSignFromDegree(person1.sol)}
- Luna: ${getSignFromDegree(person1.luna)}
- Venus: ${getSignFromDegree(person1.venus)}
- Marte: ${getSignFromDegree(person1.marte)}
- Ascendente: ${getSignFromDegree(person1.ascendente)}

PERSONA 2 (${gender2 || 'sin especificar'}):
- Sol: ${getSignFromDegree(person2.sol)}
- Luna: ${getSignFromDegree(person2.luna)}
- Venus: ${getSignFromDegree(person2.venus)}
- Marte: ${getSignFromDegree(person2.marte)}
- Ascendente: ${getSignFromDegree(person2.ascendente)}

INSTRUCCIONES:
Escribe un análisis de compatibilidad amorosa de 500-600 palabras, directo y psicológico.

ESTRUCTURA:
1. **Química y atracción** (Sol-Sol, Ascendentes)
   - Qué los atrae el uno del otro
   - Primera impresión y magnetismo

2. **Conexión emocional** (Luna-Luna)
   - Cómo procesan las emociones juntos
   - Necesidades emocionales: ¿se entienden o chocan?

3. **Amor y deseo** (Venus-Marte)
   - Estilo de amar y ritmo de cada uno
   - Dinámica sexual y tensión
   - Lo que uno da vs lo que el otro necesita

4. **Puntos de fricción**
   - Dónde pueden frustrarse
   - Patrones que se repiten

5. **Potencial a largo plazo**
   - ¿Esto es intenso pero corto, o crece con el tiempo?
   - Qué necesitan trabajar para que funcione

TONO: Directo, contemporáneo, sin misticismo. Como si fueras un psicólogo analizando la dinámica de pareja.
NO uses frases como "la relación", "esta pareja", "ustedes". Habla directamente: "Tú sientes X, mientras que la otra persona..."

LONGITUD: 500-600 palabras. Sé específico, no genérico.`;
}

function buildFriendshipPrompt(person1, person2, gender1, gender2) {
  return `Analiza la compatibilidad de AMISTAD entre estas dos personas.

PERSONA 1 (${gender1 || 'sin especificar'}):
- Sol: ${getSignFromDegree(person1.sol)}
- Luna: ${getSignFromDegree(person1.luna)}
- Mercurio: ${getSignFromDegree(person1.mercurio)}
- Ascendente: ${getSignFromDegree(person1.ascendente)}

PERSONA 2 (${gender2 || 'sin especificar'}):
- Sol: ${getSignFromDegree(person2.sol)}
- Luna: ${getSignFromDegree(person2.luna)}
- Mercurio: ${getSignFromDegree(person2.mercurio)}
- Ascendente: ${getSignFromDegree(person2.ascendente)}

INSTRUCCIONES:
Escribe un análisis de compatibilidad de amistad de 500-600 palabras.

ESTRUCTURA:
1. **Sintonía y energía** (Sol-Sol)
   - ¿Se entienden fácil o necesitan esfuerzo?
   - Ritmo: ¿uno drena al otro o se complementan?

2. **Comunicación** (Mercurio-Mercurio)
   - Cómo conversan: ¿fluye o se malinterpretan?
   - Temas que los conectan vs temas que los aburren

3. **Apoyo emocional** (Luna-Luna)
   - ¿Uno entiende los momentos difíciles del otro?
   - Cómo se contienen (o no) mutuamente

4. **Intereses compartidos**
   - Qué los une: ¿ideas, actividades, humor?
   - Dónde cada uno va por su lado

5. **Durabilidad**
   - ¿Amistad que dura décadas o intensa pero corta?
   - Qué podría alejarlos con el tiempo

TONO: Natural, como si hablaras con alguien sobre su amigo. Sin misticismo.
NO uses "esta amistad", "ustedes". Habla directo: "Te vas a reír mucho con esta persona, pero..."

LONGITUD: 500-600 palabras.`;
}

function buildWorkPrompt(person1, person2, gender1, gender2) {
  return `Analiza la compatibilidad LABORAL entre estas dos personas.

PERSONA 1 (${gender1 || 'sin especificar'}):
- Sol: ${getSignFromDegree(person1.sol)}
- Marte: ${getSignFromDegree(person1.marte)}
- Mercurio: ${getSignFromDegree(person1.mercurio)}
- Saturno: ${getSignFromDegree(person1.saturno)}

PERSONA 2 (${gender2 || 'sin especificar'}):
- Sol: ${getSignFromDegree(person2.sol)}
- Marte: ${getSignFromDegree(person2.marte)}
- Mercurio: ${getSignFromDegree(person2.mercurio)}
- Saturno: ${getSignFromDegree(person2.saturno)}

INSTRUCCIONES:
Escribe un análisis de compatibilidad laboral de 500-600 palabras.

ESTRUCTURA:
1. **Estilos de trabajo** (Sol-Sol, Marte-Marte)
   - Ritmo: ¿uno es rápido y el otro detallista?
   - Enfoque: ¿ideas grandes vs ejecución práctica?

2. **Comunicación profesional** (Mercurio-Mercurio)
   - Cómo se pasan info: ¿claro o se malentienden?
   - Reuniones: ¿productivas o frustrantes?

3. **Roles naturales** (Marte-Saturno)
   - ¿Quién lidera y quién ejecuta?
   - ¿Uno empuja y el otro frena, o se complementan?

4. **Conflictos potenciales**
   - Dónde van a chocar
   - Qué irrita a cada uno del estilo del otro

5. **Mejor forma de trabajar juntos**
   - ¿Co-líderes, jerarquía clara, o cada uno en su área?
   - Cómo maximizar lo bueno y minimizar la fricción

TONO: Profesional pero directo. Como un consultor de equipos.
NO uses "el equipo", "la dupla". Sé específico: "Uno va a querer avanzar rápido mientras el otro..."

LONGITUD: 500-600 palabras.`;
}

// Helper function
function getSignFromDegree(degree) {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  const signIndex = Math.floor(degree / 30);
  return signs[signIndex] || 'Desconocido';
}
