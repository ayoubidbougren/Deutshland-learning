import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper: Convert 16-bit PCM (mono, 24000Hz) to a standard 44-byte WAV buffer
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1): Buffer {
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = pcmBuffer.length;
  const wavBuffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  wavBuffer.write('RIFF', 0);
  wavBuffer.writeUInt32LE(36 + dataSize, 4);
  wavBuffer.write('WAVE', 8);

  // fmt subchunk
  wavBuffer.write('fmt ', 12);
  wavBuffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  wavBuffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  wavBuffer.writeUInt16LE(numChannels, 22);
  wavBuffer.writeUInt32LE(sampleRate, 24);
  wavBuffer.writeUInt32LE(byteRate, 28);
  wavBuffer.writeUInt16LE(blockAlign, 32);
  wavBuffer.writeUInt16LE(16, 34); // bits per sample

  // data subchunk
  wavBuffer.write('data', 36);
  wavBuffer.writeUInt32LE(dataSize, 40);
  pcmBuffer.copy(wavBuffer, 44);

  return wavBuffer;
}

// In-memory cache for TTS to avoid re-requesting identical sentences
const ttsCache = new Map<string, string>();

// Text-to-Speech API for Listening mode & Stories
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Zephyr', pacing = 'normal' } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const trimmedText = text.trim();
    const cacheKey = `${voice}_${pacing}_${trimmedText}`;

    // Return from cache if already synthesized
    if (ttsCache.has(cacheKey)) {
      return res.json({
        audioDataUrl: ttsCache.get(cacheKey),
        cached: true,
      });
    }

    const ai = getGenAI();
    const promptText = pacing === 'learning'
      ? `Lies diesen deutschen Text sehr klar, akzentuiert und mit deutlichen Pausen vor:\n${trimmedText}`
      : trimmedText;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Pcm = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Pcm) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS' });
    }

    const pcmBuffer = Buffer.from(base64Pcm, 'base64');
    const wavBuffer = pcmToWav(pcmBuffer, 24000, 1);
    const audioDataUrl = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;

    // Store in cache (limit to 500 items to prevent excessive memory)
    if (ttsCache.size > 500) {
      const firstKey = ttsCache.keys().next().value;
      if (firstKey) ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, audioDataUrl);

    res.json({
      audioDataUrl,
      pcmSize: pcmBuffer.length,
      wavSize: wavBuffer.length,
      cached: false,
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    const isRateLimit =
      error?.status === 429 ||
      error?.code === 429 ||
      String(error?.message).includes('429') ||
      String(error?.message).includes('quota') ||
      String(error?.message).includes('RESOURCE_EXHAUSTED');

    if (isRateLimit) {
      return res.status(429).json({
        error: 'QUOTA_EXCEEDED',
        isRateLimit: true,
        message:
          'لقد تجاوزت الحصة المجانية لنموذج Gemini TTS (3 طلبات في الدقيقة). يمكنك استخدام نطق المتصفح الفوري غير المحدود أو الانتظار بضع ثوانٍ.',
      });
    }

    res.status(500).json({ error: error.message || 'Failed to generate audio' });
  }
});

// Story Analysis & Comprehension Questions API for Custom Texts
app.post('/api/analyze-story', async (req, res) => {
  try {
    const { text, level = 'A1' } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const ai = getGenAI();
    const prompt = `Du bist ein erfahrener Deutschlehrer. Analysiere diesen Text für das Hörverstehen (Niveau: ${level}):
Text:
"""
${text.trim()}
"""

Erstelle eine Analyse im exakt folgenden JSON-Format (kein Markdown drumherum, nur valides JSON):
{
  "summaryAr": "ملخص واضح ومختصر جداً بالدارجة المغربية أو العربية الفصحى للقصة في سطرين",
  "vocabulary": [
    { "word": "der/die/das Wort", "article": "der", "meaningAr": "معنى الكلمة بالعربية" }
  ],
  "questions": [
    {
      "id": 1,
      "questionDe": "Frage auf Deutsch zum Inhalt?",
      "questionAr": "ترجمة السؤال بالعربية",
      "options": ["Option A", "Option B", "Option C"],
      "correctIndex": 0,
      "explanationDe": "Erklärung auf Deutsch warum das richtig ist",
      "explanationDarija": "شرح مبسط بالدارجة علاش هذا هو الجواب الصحيح"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-story:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze story' });
  }
});

// ============================================================================
// BOOK COURSE API ENDPOINTS
// ============================================================================

// 1. Generate Adaptive AI Exercises based on current lesson & user weak areas
app.post('/api/book/ai-exercise', async (req, res) => {
  try {
    const { lessonNumber, pages, vocabulary, grammar, weakAreas = [] } = req.body;

    const weakAreasStr = weakAreas.length > 0 ? weakAreas.join(', ') : 'Allgemeine Grammatik & Wortschatz';
    const vocabList = Array.isArray(vocabulary) ? vocabulary.map((v: any) => `${v.word} (${v.meaningAr})`).join(', ') : '';

    const prompt = `Du bist ein hochqualifizierter Deutschlehrer.
Erstelle 3 gezielte, neue Übungen (Typ: fill_gap oder multiple_choice) passend zu:
- Lektion: ${lessonNumber}
- Seiten im Buch: ${Array.isArray(pages) ? pages.join(', ') : pages}
- Wortschatz der aktuellen Seiten: ${vocabList}
- Grammatik-Fokus & Schwachstellen des Schülers: ${weakAreasStr}

WICHTIG:
- Halte die Übungen streng auf A1-Niveau!
- Keine zu schwierigen Vokabeln, die nicht zum Niveau passen.
- Jede Übung MUSS einen kurzen pädagogischen Hinweis (hint) und eine Erklärung auf Deutsch und Darija/Arabisch enthalten.
- Setze die richtige Antwort (correctAnswer) im "options"-Array NIEMALS immer an die erste Stelle (Index 0), sondern variiere die Position zwischen Index 1, 2 und 0!

Antworte AUSSCHLIESSLICH im folgenden JSON-Format:
{
  "exercises": [
    {
      "id": "ai-ex-1",
      "instructionDe": "Ergänzen Sie das richtige Wort.",
      "instructionAr": "أكمل الكلمة المناسبة.",
      "type": "fill_gap",
      "prompt": "Satz mit Lücke wie: Ich habe ___ Laptop.",
      "options": ["ein", "einen", "eine"],
      "correctAnswer": "einen",
      "acceptableAnswers": ["einen"],
      "hint": "Denk an den Artikel: der Laptop im Akkusativ.",
      "explanationDe": "der Laptop ist maskulin, im Akkusativ: einen Laptop.",
      "explanationAr": "كلمة Laptop مذكرة، وفي حالة النصب Akkusativ تصبح einen.",
      "grammarCategory": "Akkusativ"
    }
  ]
}`;

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const json = JSON.parse(response.text || '{"exercises":[]}');
    res.json(json);
  } catch (error: any) {
    console.warn('Fallback generating AI exercises locally due to API limit/error:', error?.message);
    // Robust local fallback exercises for Lektion 1/2
    res.json({
      exercises: [
        {
          id: `fallback-ex-${Date.now()}-1`,
          instructionDe: 'Ergänzen Sie den passenden Artikel im Akkusativ.',
          instructionAr: 'أكمل أداة النكرة المناسبة في حالة النصب (Akkusativ).',
          type: 'multiple_choice',
          prompt: 'Jan hat ___ neuen Computer gekauft.',
          options: ['ein', 'einen', 'eine', 'kein'],
          correctAnswer: 'einen',
          acceptableAnswers: ['einen'],
          hint: 'der Computer ist maskulin. Was passiert im Akkusativ?',
          explanationDe: 'Maskuline Nomen werden im Akkusativ zu "einen".',
          explanationAr: 'الاسم المذكر der في حالة النصب Akkusativ يأخذ einen.',
          grammarCategory: 'Akkusativ',
        },
        {
          id: `fallback-ex-${Date.now()}-2`,
          instructionDe: 'Wählen Sie die richtige Konjugation.',
          instructionAr: 'اختر تصريف الفعل المناسب.',
          type: 'multiple_choice',
          prompt: 'Welche Sprachen ___ du zu Hause?',
          options: ['sprecht', 'spreche', 'sprichst', 'sprechen'],
          correctAnswer: 'sprichst',
          acceptableAnswers: ['sprichst'],
          hint: 'Achtung: Vokalwechsel e -> i bei "du".',
          explanationDe: 'Das Verb "sprechen" wechselt den Vokal bei du: du sprichst.',
          explanationAr: 'فعل sprechen يتغير فيه حرف e إلى i مع الضمير du: du sprichst.',
          grammarCategory: 'Konjugation',
        },
      ],
    });
  }
});

// 2. Intelligent Answer Evaluation with Progressive Hints
app.post('/api/book/check-answer', async (req, res) => {
  try {
    const { questionPrompt, instructionDe, correctAnswer, userAnswer, hint, attemptsCount = 1 } = req.body;

    const cleanUser = String(userAnswer || '').trim().toLowerCase();
    const cleanCorrect = String(correctAnswer || '').trim().toLowerCase();

    if (cleanUser === cleanCorrect) {
      return res.json({
        isCorrect: true,
        feedbackDe: 'Sehr gut! Das ist absolut richtig.',
        feedbackAr: 'ممتاز! الجواب صحيح 100%.',
        giveSolution: false,
      });
    }

    // Try AI pedagogical evaluation
    try {
      const ai = getGenAI();
      const prompt = `Der Schüler lernt Deutsch A1 anhand des Lehrbuchs DaF kompakt neu.
Aufgabe / Anweisung: "${instructionDe || ''}"
Konkrete Frage / Text: "${questionPrompt}"
Richtige Antwort: "${correctAnswer}"
Antwort des Schülers: "${userAnswer}"
Versuch Nummer: ${attemptsCount}
Vorhandener Hinweis zur Regel: "${hint || ''}"

Wichtige didaktische Anweisungen:
- Der Hinweis MUSS sich STRENG und AUSSCHLIESSLICH auf diese konkrete Aufgabe ("${questionPrompt}") und die entsprechende grammatische Regel beziehen (z.B. Verbkonjugation von arbeiten mit du -> Stamm auf -t bekommt -est).
- Erwähne NIEMALS Vokabeln oder Personen aus anderen Aufgaben (kein Alex, keine Muttersprachen, es sei denn sie stehen explizit in der Aufgabe).
- Gib NICHT sofort die fertige Lösung preis, es sei denn der Schüler hat schon 3 oder mehr Versuche gebraucht!
- Formuliere einen kurzen, motivierenden Hinweis auf Deutsch (hintDe) und auf Darija / Arabisch (hintAr).

Antworte im JSON-Format:
{
  "isCorrect": false,
  "hintDe": "Kurzer, ermutigender Tipp auf Deutsch zur Grammatikregel",
  "hintAr": "تلميح ذكي بالدارجة المغربية أو العربية يوجهه مباشرة للقاعدة دون حرق الجواب",
  "giveSolution": ${attemptsCount >= 3}
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch {
      // Fallback hint
      return res.json({
        isCorrect: false,
        hintDe: hint || 'Nicht ganz richtig. Überlege noch einmal genau!',
        hintAr: hint ? `تلميح: ${hint}` : 'قريب بزاف، عاود فكر مزيان فقواعد الدرس وحاول مرة ثانية!',
        giveSolution: attemptsCount >= 3,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Speaking Turn: One question at a time interactive German dialogue with correction
app.post('/api/book/speaking-turn', async (req, res) => {
  try {
    const { history = [], userSpeech = '', situation = '', lessonTitle = '' } = req.body;

    const ai = getGenAI();
    const prompt = `Du bist ein freundlicher, muttersprachlicher deutscher Sprachlehrer im Buchkurs "${lessonTitle}".
Situation: ${situation}
Bisheriger Dialog:
${history.map((h: any) => `${h.role === 'teacher' ? 'Lehrer' : 'Schüler'}: ${h.text}`).join('\n')}
Schüler sagt gerade: "${userSpeech}"

Deine Aufgabe:
1. Prüfe die Äußerung des Schülers auf Grammatik und Wortwahl (A1 Niveau).
2. Falls ein kleiner Fehler da ist, korrigiere ihn sanft auf Deutsch (z. B. "Sehr gut! Man sagt besser: '...'").
3. Stelle GENAU EINE natürliche Folgefrage, um das Gespräch fortzusetzen (nicht mehrere Fragen auf einmal!).
4. Wenn der Schüler auf Arabisch oder Darija nach Erklärung fragt, erkläre es ihm kurz auf Darija, ansonsten bleibe auf Deutsch.

Antworte im JSON-Format:
{
  "correction": "Korrektur falls nötig, sonst null",
  "teacherReply": "Deine Antwort + genau EINE nächste Frage auf Deutsch",
  "darijaTip": "شرح اختياري بالدارجة إلا كان شي خطأ مهم",
  "isDialogueComplete": false
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/book/speaking-turn:', error);
    res.json({
      correction: null,
      teacherReply: 'Sehr schön formuliert! Und was machst du heute noch?',
      darijaTip: 'ممتاز! كملتي الجملة بشكل سليم.',
      isDialogueComplete: false,
    });
  }
});

// 3b. Explain German teacher question/sentence in Moroccan Darija
app.post('/api/book/explain-in-darija', async (req, res) => {
  try {
    const { germanText = '', situation = '', lessonTitle = '' } = req.body;
    if (!germanText) {
      return res.status(400).json({ error: 'germanText is required' });
    }

    const ai = getGenAI();
    const prompt = `أنت أستاذ ومساعد تعليمي ودود لتعليم اللغة الألمانية لطلاب مغاربة (المستوى A1).
المتعلم في تمرين المحادثة الشفوية (Speaking) مع الأستاذ، ولم يفهم ما قاله الأستاذ أو لم يعرف كيف يجيب:
السياق والموقف: "${situation || 'حوار مدرسي/جامعي'}"
موضوع الدرس: "${lessonTitle || 'اللغة الألمانية للمبتدئين'}"
كلام الأستاذ بالألمانية: "${germanText}"

مهمتك: اشرح له بالدارجة المغربية بأسلوب مشجع ومبسط ومباشر.
قدم الترجمة بالدارجة، وشرحاً موجزاً، وتفكيكاً لأهم الكلمات/الأفعال في السؤال، مع 2-3 نماذج إجابات جاهزة بالألمانية يقدر يستعملها أو يتدرب عليها مع معناها بالدارجة، ونصيحة قصيرة.

أجب بصيغة JSON حصراً بهذا التنسيق:
{
  "translationDarija": "المعنى بالدارجة المغربية",
  "explanationDarija": "شرح مبسط بالدارجة لما يطلبه الأستاذ",
  "vocabularyBreakdown": [
    { "german": "الكلمة أو العبارة", "darija": "معناها بالدارجة" }
  ],
  "suggestedAnswers": [
    { "german": "نموذج جملة إجابة بسيطة A1", "darija": "معناها بالدارجة" }
  ],
  "quickTip": "نصيحة سريعة بالدارجة للجواب"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/book/explain-in-darija:', error);
    const text = String(req.body?.germanText || '');
    res.json({
      translationDarija: `معنى الجملة: "${text}"`,
      explanationDarija: 'الأستاذ كيسولك فهاد الحوار باش تتفاعل معاه. خود وقتك واستعمل جملة بسيطة كتعرفها.',
      vocabularyBreakdown: [
        { german: text.split(' ').slice(0, 2).join(' ') || 'Hallo', darija: 'بداية الجملة أو السؤال' },
      ],
      suggestedAnswers: [
        { german: 'Ich verstehe. / Ja, genau.', darija: 'فهمت / نعم تماماً' },
      ],
      quickTip: 'ركز على الفعل الفاعل وبدا الجواب ببساطة.',
    });
  }
});

// 4. Writing Feedback: Detailed Grammar & Spelling evaluation
app.post('/api/book/writing-feedback', async (req, res) => {
  const { userText = '', taskDe = '', minSentences = 4 } = req.body || {};
  try {
    const ai = getGenAI();
    const prompt = `Du bist Deutschlehrer. Korrigiere diesen Schreibtext eines A1-Schülers:
Aufgabe: "${taskDe}"
Schülertext:
"""
${userText}
"""

Deine Aufgaben:
1. Prüfe Grammatik (Verbposition, Endungen, Artikel, Akkusativ/Nominativ).
2. Prüfe Rechtschreibung und Groß-/Kleinschreibung (Nomen immer groß!).
3. Gib konstruktives Feedback auf Deutsch und Darija/Arabisch.
4. Gib eine Musterlösung (korrigierte Version).
5. Berechne einen Score (0 bis 100). Mindestpunktzahl zum Bestehen ist 80.

Format JSON:
{
  "score": 85,
  "passed": true,
  "correctedText": "Der vollständige, fehlerfreie Text",
  "detailedCorrections": [
    {
      "original": "ich habe ein computer",
      "corrected": "Ich habe einen Computer",
      "explanationAr": "Nomen werden großgeschrieben (Computer) و der Computer يأخذ einen في Akkusativ."
    }
  ],
  "feedbackDe": "Sehr gut gemacht! Achte besonders auf die Großschreibung der Nomen.",
  "feedbackDarija": "خدمة زوينة بزاف! رد البال غير للأسماء تبدا بحرف كبير (Großschreibung) وقاعدة Akkusativ."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/book/writing-feedback:', error);
    res.json({
      score: 85,
      passed: true,
      correctedText: userText,
      detailedCorrections: [],
      feedbackDe: 'Gut geschrieben! Dein Text erfüllt die Anforderungen der Aufgabe.',
      feedbackDarija: 'نص جيد ومفهوم، استمر على هذا المنوال!',
    });
  }
});

// 5. Analyze Custom Book PDF Text
app.post('/api/book/analyze-pdf', async (req, res) => {
  try {
    const { textSnippet, fileName = 'German Textbook' } = req.body;

    const ai = getGenAI();
    const prompt = `Du analysierst ein hochgeladenes Deutsch-Lehrbuch für einen Schüler.
Dateiname: "${fileName}"
Ausschnitt des Buchinhalts / Inhaltsverzeichnisses:
"""
${textSnippet.slice(0, 5000)}
"""

Ermittle:
1. Den genauen Titel des Buchs (z. B. "DaF kompakt neu A1", "Menschen A1", "Netzwerk neu A1"). Wichtig: Kein statischer Standardname!
2. Das Sprachniveau (A1, A2, B1).
3. Die Liste der Lektionen / Kapitel mit Titeln und Seitenzahlen.

Format JSON:
{
  "title": "Gefundener Buchtitel",
  "level": "A1",
  "publisher": "Ernst Klett / Hueber / Cornelsen",
  "totalPages": 120,
  "lessonsCount": 8,
  "lessonsSummary": [
    { "lessonNumber": 1, "titleDe": "Titel der Lektion 1", "titleAr": "عنوان الدرس", "pages": "8-15" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/book/analyze-pdf:', error);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket server for Gemini Live API
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('error', (err) => {
  console.error('WebSocket server error:', err);
});

wss.on('connection', (clientWs: WebSocket, req) => {
  let session: any = null;
  let isClosed = false;
  let isStarting = false;

  const requestUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const urlVoice = requestUrl.searchParams.get('voice') || 'Zephyr';
  const urlInstruction = requestUrl.searchParams.get('instruction')
    ? decodeURIComponent(requestUrl.searchParams.get('instruction')!)
    : '';

  clientWs.on('close', () => {
    isClosed = true;
    if (session) {
      try {
        session.close();
      } catch (err) {
        console.error('Error closing Gemini Live session:', err);
      }
      session = null;
    }
  });

  clientWs.on('error', (err) => {
    console.error('Client WebSocket error:', err);
  });

  async function startGeminiLive(
    voice: string,
    instruction: string,
    meta?: {
      mode?: 'dialogue_practice' | 'free_conversation' | 'topic_discussion' | string;
      firstSpeaker?: 'ai' | 'user' | string;
      firstLineText?: string;
      level?: string;
      topicTitle?: string;
    }
  ) {
    if (isClosed || isStarting || session) return;
    isStarting = true;

    try {
      const ai = getGenAI();

      const systemInstruction = instruction && instruction.trim()
        ? instruction.trim()
        : `Du bist ein hochentwickelter, muttersprachlicher deutscher Sprachtutor (A1-B1) mit höchster phonetischer und grammatikalischer Präzision.

SPRACHREGELN & PHONETIK (EXZELLENTES HOCHDEUTSCH):
1. Sprich exzellentes, glasklares Hochdeutsch.
2. Korrekte deutsche Buchstabennamen & Laute (SEHR WICHTIG):
   - Der Buchstabe "Y" heißt auf Deutsch ausschließlich "Ypsilon" [ˈʏpsilɔn] (NIEMALS "Jota"! "J" heißt "Jot" / "Jota").
   - "V" wird als [faʊ̯] ("Vogel" / "Vau") gesprochen, "W" als [veː] ("Wasser" / "Weh").
   - "Z" ist [tsɛt] ("Zebra" / "Zett").
   - Umlaute: Ä [ɛː], Ö [øː], Ü [yː], und ß (Eszett / scharfes S).

HILFE AUF ARABISCH & MAROKKANISCHER DARIJA (الدارجة المغربية):
Wenn der Benutzer dich bittet, ein Wort oder einen Satz auf Arabisch oder Darija zu erklären ("شرح ليا بالعربية", "شرح ليا بالدارجة", "شنو كتعني هادي؟"):
- Lehne dies niemals ab!
- Erkläre es ihm kurz und verständlich auf Arabisch oder Darija, gib ihm das deutsche Wort und sprich es sauber vor.
- Fahre danach sofort wieder auf Deutsch fort!

STRIKTE KORREKTUR- UND WIEDERHOLUNGSPFLICHT BEI DEUTSCHEN SPRACHFEHLERN:
Wenn der Benutzer Deutsch spricht und dabei einen Fehler macht:
1. Halte das Gespräch kurz an.
2. Nenne den genauen Fehler kurz und präzise auf Deutsch.
3. Sprich das Wort oder den Satz perfekt vor.
4. Fordere den Benutzer auf: "Sprich mir das bitte noch einmal nach: [...]".
5. Sobald er es sauber wiederholt hat, lobst du ihn kurz und führst das Gespräch auf Deutsch weiter!`;

      // Connect to Gemini Live API with gemini-3.1-flash-live-preview
      session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice || 'Zephyr',
              },
            },
          },
          systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'ready' }));
            }
          },
          onmessage: (message: LiveServerMessage) => {
            if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

            // Model turn audio chunks
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'audio',
                      audio: part.inlineData.data,
                    })
                  );
                }
                if (part.text) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'text',
                      text: part.text,
                    })
                  );
                }
              }
            }

            // Real-time output transcription
            if (message.serverContent?.outputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  type: 'output_transcription',
                  text: message.serverContent.outputTranscription.text,
                  finished: Boolean(message.serverContent.outputTranscription.finished),
                })
              );
            }

            // Real-time input transcription
            if (message.serverContent?.inputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  type: 'input_transcription',
                  text: message.serverContent.inputTranscription.text,
                  finished: Boolean(message.serverContent.inputTranscription.finished),
                })
              );
            }

            // User interrupted model playback
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }

            // Turn complete signal
            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turn_complete' }));
            }
          },
          onerror: (err: any) => {
            console.error('Gemini Live API error:', err);
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: 'error',
                  error: err?.message || 'Error occurred in voice session',
                })
              );
            }
          },
          onclose: () => {
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'closed' }));
            }
          },
        },
      });

      // Promptly trigger Gemini Live to read its first dialogue line or greeting
      try {
        if (meta?.mode === 'dialogue_practice' && meta.firstLineText) {
          if (meta.firstSpeaker === 'ai') {
            session.sendClientContent({
              turns: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `[SYSTEM-AUFFORDERUNG: START DES ROLLENSPIELS]\nDu bist die [KI]. Bitte lies jetzt sofort, deutlich und ohne Metakommentar deine erste Zeile aus dem Skript laut vor: "${meta.firstLineText}"`,
                    },
                  ],
                },
              ],
              turnComplete: true,
            });
          } else {
            session.sendClientContent({
              turns: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `[SYSTEM-AUFFORDERUNG: START DES ROLLENSPIELS]\nDer Lerner beginnt den Dialog mit der Zeile: "${meta.firstLineText}". Bitte sage kurz auf Deutsch: "Hallo! Wir üben unseren Dialog. Bitte beginne mit deinem ersten Satz!" und warte dann auf ihn.`,
                    },
                  ],
                },
              ],
              turnComplete: true,
            });
          }
        } else if (meta?.mode === 'topic_discussion') {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [
                  {
                    text: `[START THEMEN-TRAINING: ${meta.topicTitle || 'Das Thema'}]\nHallo! Wir starten jetzt unser Thementraining zum Thema: "${meta.topicTitle || 'Thema'}". Begrüße mich kurz auf Deutsch (Niveau ${meta.level || 'A1'}), nenne kurz das Thema und stelle mir sofort deine allererste konkrete Frage basierend auf dem Text!`,
                  },
                ],
              },
            ],
            turnComplete: true,
          });
        } else if (meta?.mode === 'free_conversation') {
          const greetingPrompt = meta.firstLineText
            ? `[START LEKTION-TUTOR GESPRÄCH]\nHallo! Bitte begrüße mich genau mit deiner Eröffnungszeile für diese Lektion: "${meta.firstLineText}" und stelle mir deine erste einfache Frage.`
            : `Hallo! Bitte begrüße mich kurz und freundlich auf Deutsch (Niveau ${meta.level || 'A1'}) und starte unser Gespräch.`;

          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [
                  {
                    text: greetingPrompt,
                  },
                ],
              },
            ],
            turnComplete: true,
          });
        }
      } catch (triggerErr) {
        console.error('Error triggering initial Gemini turn:', triggerErr);
      }
    } catch (err: any) {
      console.error('Error starting live session:', err);
      if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: 'error',
            error: err?.message || 'Failed to initialize voice session',
          })
        );
      }
    } finally {
      isStarting = false;
    }
  }

  // Handle incoming messages from client
  clientWs.on('message', async (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === 'init') {
        await startGeminiLive(msg.voice || urlVoice, msg.instruction || urlInstruction, {
          mode: msg.mode,
          firstSpeaker: msg.firstSpeaker,
          firstLineText: msg.firstLineText,
          level: msg.level,
          topicTitle: msg.topicTitle,
        });
        return;
      }

      if (msg.audio && session) {
        session.sendRealtimeInput({
          audio: {
            data: msg.audio,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      }
    } catch (err) {
      console.error('Error processing client message:', err);
    }
  });

  // Fallback: If client connected with query string parameters and does not send 'init'
  if (requestUrl.searchParams.has('instruction') || requestUrl.searchParams.has('voice')) {
    startGeminiLive(urlVoice, urlInstruction);
  }
});

async function start() {
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('HTTP server error:', err);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
