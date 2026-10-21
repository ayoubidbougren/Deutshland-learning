import { ListeningExerciseItem } from "../types/bookCourse";
import { arrangeOptionsByAnswer, arrangeOptionsByIndex } from "../utils/shuffleOptions";

export const YOUTUBE_DAF_PLAYLIST_ID = "PLIVqNAXwu9qhbY0ZxGcp7kRNrcu21ihXM";

/**
 * Authentic Hören (listening) exercises mapped directly to the official
 * DaF kompakt neu A1 audio CD tracks from the YouTube playlist:
 * https://www.youtube.com/playlist?list=PLIVqNAXwu9qhbY0ZxGcp7kRNrcu21ihXM
 *
 * Each audio track is 100% synchronized with what is heard in that track:
 * - Its exact official audio track label and YouTube video ID
 * - Spoken German dialogue lines and Arabic translations
 * - Book tasks (matching, true/false, fill) testing facts explicitly heard
 * - Comprehension questions testing information stated in the audio
 */
export const BOOK_LISTENING_EXERCISES_BY_DAY: Record<number, ListeningExerciseItem[]> = {
  // ---------------------------------------------------------------------------
  // DAY 1: Pages 8-9 (Lektion 1 - A: Guten Tag!)
  // Ordered strictly from left to right: Audio 1 (Seite 8) -> Audio 2 (Seite 9) -> Audio 3 (Seite 9)
  // ---------------------------------------------------------------------------
  1: [
    {
      id: "listen-d1-audio1",
      titleDe: "Audio 1 • Seite 8 (Aufgabe 1a, 1b & 1c: Willkommen im Sommerkurs!)",
      titleAr: "الأوديو 1 (🔊 1 - ص 8): تمرين 1a و 1b و 1c — إكمال الفراغات في الحوارين 1 و 2",
      situationDe:
        "Kursbuch Seite 8, Aufgabe 1a, 1b & 1c (🔊 1): Lesen Sie und ergänzen Sie die Gespräche 1 und 2. Hören Sie dann die Gespräche 1 und 2 noch einmal und vergleichen Sie.",
      situationAr:
        "كتاب الدروس ص 8، تمرين 1a و 1b و 1c (🔊 أوديو 1): اقرأ وأكمل الفراغات [1] و [2] و [3] و [4] في الحوارين 1 و 2 من الكلمات المقترحة على يمين التمرين، ثم استمع للأوديو 1 وتحقق من إجاباتك.",
      pageNumber: 8,
      audioTrackLabel: "Audio 1 • Seite 8 (Aufgabe 1b & 1c: Sommerkurs)",
      youtubeVideoId: "s3E0I_Ggn6M",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Christiane Brandt & Leyla",
      dialogueSpeakerB: "Tarik Amri",
      fullTranscriptDe:
        "Gespräch 1:\nChristiane Brandt: Guten Morgen. Ich bin Ihre Deutschlehrerin. Ich heiße Christiane Brandt. Und wie heißen Sie?\nTarik Amri: Ich bin Tarik Amri.\nChristiane Brandt: Freut mich, Herr Amri. Woher kommen Sie?\nTarik Amri: Ich komme aus Marokko.\nChristiane Brandt: Herzlich willkommen im Sommerkurs!\n\nGespräch 2:\nTarik: Hallo. Ich bin neu im Deutschkurs.\nLeyla: Grüß dich. Ich bin Leyla. Ich lerne auch Deutsch. Wie heißt du?\nTarik: Ich heiße Tarik.\nLeyla: Woher kommst du?\nTarik: Aus Marokko, aus Casablanca. Und du?\nLeyla: Ich bin aus der Türkei, aus Ankara.",
      transcriptAr:
        "الحوار 1:\nكريستيانه براندت: صباح الخير. أنا أستاذتكم للغة الألمانية. اسمي كريستيانه براندت. وما اسم حضرتك؟\nطارق العامري: أنا طارق العامري.\nكريستيانه براندت: تشرفت بك يا سيد العامري. من أين تأتي حضرتك؟\nطارق العامري: أنا قادم من المغرب.\nكريستيانه براندت: مرحباً بك في الدورة الصيفية!\n\nالحوار 2:\nطارق: أهلاً. أنا جديد في دورة الألمانية.\nليلى: مرحباً بك (Grüß dich). أنا ليلى. أنا أيضاً أتعلم الألمانية. ما اسمك؟\nطارق: اسمي طارق.\nليلى: من أين أنت؟\nطارق: من المغرب، من الدار البيضاء. وأنتِ؟\nليلى: أنا من تركيا، من أنقرة.",
      audioLines: [
        {
          speaker: "Christiane Brandt",
          gender: "female",
          textDe: "Guten Morgen. Ich bin Ihre Deutschlehrerin. Ich heiße Christiane Brandt. Und wie heißen Sie?",
          textAr: "صباح الخير. أنا أستاذتكم للغة الألمانية. اسمي كريستيانه براندت. وما اسم حضرتك؟",
        },
        {
          speaker: "Tarik Amri",
          gender: "male",
          textDe: "Ich bin Tarik Amri. – Ich komme aus Marokko.",
          textAr: "أنا طارق العامري. – أنا قادم من المغرب.",
        },
        {
          speaker: "Leyla",
          gender: "female",
          textDe: "Grüß dich. Ich bin Leyla. Ich lerne auch Deutsch. Wie heißt du? – Woher kommst du?",
          textAr: "مرحباً بك. أنا ليلى. أنا أيضاً أتعلم الألمانية. ما اسمك؟ – من أين أنت؟",
        },
        {
          speaker: "Leyla",
          gender: "female",
          textDe: "Ich bin aus der Türkei, aus Ankara.",
          textAr: "أنا من تركيا، من أنقرة.",
        },
      ],
      tipDarija:
        "جاوب على تمرين 1b (ص 8) تماماً كيفما مطبوع فـ الكتاب: عمّر الفراغات [1] و [2] و [3] و [4] فـ الحوار 1 والحوار 2 من الكلمات اللي فـ الجنب، ومن بعد تصنت لـ Audio 1 باش تصحح!",
      bookTasks: [
        {
          id: "task-d1-1b-part1",
          titleDe: "1b Lesen Sie und ergänzen Sie • Gespräch 1 (Seite 8, 🔊 1)",
          titleAr: "تمرين الكتاب 1b (ص 8) — الحوار 1: اقرأ وأكمل الفراغات [1] – [4] (الكلمات: Guten Morgen | Ich komme | Und wie heißen Sie | Woher kommen Sie)",
          instructionDe: "Ergänzen Sie die Lücken [1] bis [4] im ersten Gespräch mit den passenden Ausdrücken.",
          instructionAr: "اختر العبارة الصحيحة لكل فراغ [1] إلى [4] كما في تمرين 1b بالصفحة 8 من الكتاب.",
          type: "fill",
          items: [
            {
              id: "bt-p8-1b-1-1",
              labelDe: "1. ● ________________________ [1]. Ich bin Ihre Deutschlehrerin.",
              labelAr: "الفراغ [1] في السطر الأول:",
              options: ["Ich komme", "Guten Morgen", "Und wie heißen Sie", "Woher kommen Sie"],
              correctAnswer: "Guten Morgen",
              explanation: "تبدأ الأستاذة كريستيانه براندت التحية بـ: Guten Morgen. Ich bin Ihre Deutschlehrerin.",
            },
            {
              id: "bt-p8-1b-1-2",
              labelDe: "Ich heiße Christiane Brandt. ________________________ [2]? — ○ Ich bin Tarik Amri.",
              labelAr: "الفراغ [2] (سؤال الأستاذة لطارق عن اسمه بصيغة الاحترام):",
              options: ["Woher kommen Sie", "Guten Morgen", "Und wie heißen Sie", "Ich komme"],
              correctAnswer: "Und wie heißen Sie",
              explanation: "بما أن الجواب هو (Ich bin Tarik Amri)، فالسؤال في الفراغ [2] هو: Und wie heißen Sie?",
            },
            {
              id: "bt-p8-1b-1-3",
              labelDe: "● Freut mich, Herr Amri. ________________________ [3]?",
              labelAr: "الفراغ [3] (سؤال الأستاذة لطارق عن بلده بصيغة الاحترام):",
              options: ["Und wie heißen Sie", "Ich komme", "Guten Morgen", "Woher kommen Sie"],
              correctAnswer: "Woher kommen Sie",
              explanation: "السؤال عن الموطن بصيغة الاحترام في الفراغ [3]: Woher kommen Sie?",
            },
            {
              id: "bt-p8-1b-1-4",
              labelDe: "○ ________________________ [4] aus Marokko. — ● Herzlich willkommen im Sommerkurs!",
              labelAr: "الفراغ [4] (جواب طارق):",
              options: ["Ich komme", "Guten Morgen", "Woher kommen Sie", "Und wie heißen Sie"],
              correctAnswer: "Ich komme",
              explanation: "الجواب الكامل في الفراغ [4]: Ich komme aus Marokko.",
            },
          ],
        },
        {
          id: "task-d1-1b-part2",
          titleDe: "1b Lesen Sie und ergänzen Sie • Gespräch 2 (Seite 8, 🔊 1)",
          titleAr: "تمرين الكتاب 1b (ص 8) — الحوار 2: اقرأ وأكمل الفراغات [1] – [4] (الكلمات: Grüß dich | Ich bin | Wie heißt du | Woher kommst du)",
          instructionDe: "Ergänzen Sie die Lücken [1] bis [4] im zweiten Gespräch mit den passenden Ausdrücken.",
          instructionAr: "اختر العبارة الصحيحة لكل فراغ [1] إلى [4] في الحوار الثاني بين طارق وليلى.",
          type: "fill",
          items: [
            {
              id: "bt-p8-1b-2-1",
              labelDe: "2. ○ Hallo. Ich bin neu im Deutschkurs. — ● ________________________ [1]. Ich bin Leyla. Ich lerne auch Deutsch.",
              labelAr: "الفراغ [1] (تحية ليلى غير الرسمية):",
              options: ["Ich bin", "Wie heißt du", "Grüß dich", "Woher kommst du"],
              correctAnswer: "Grüß dich",
              explanation: "ترد ليلى التحية في الفراغ [1] بـ: Grüß dich. Ich bin Leyla.",
            },
            {
              id: "bt-p8-1b-2-2",
              labelDe: "● ________________________ [2]? — ○ Ich heiße Tarik.",
              labelAr: "الفراغ [2] (سؤال ليلى لطارق عن اسمه بصيغة du):",
              options: ["Woher kommst du", "Grüß dich", "Ich bin", "Wie heißt du"],
              correctAnswer: "Wie heißt du",
              explanation: "بما أن الجواب هو (Ich heiße Tarik)، فالسؤال في الفراغ [2] هو: Wie heißt du?",
            },
            {
              id: "bt-p8-1b-2-3",
              labelDe: "● ________________________ [3]? — ○ Aus Marokko, aus Casablanca. Und du?",
              labelAr: "الفراغ [3] (سؤال ليلى لطارق عن موطنه بصيغة du):",
              options: ["Wie heißt du", "Woher kommst du", "Ich bin", "Grüß dich"],
              correctAnswer: "Woher kommst du",
              explanation: "بما أن الجواب هو (Aus Marokko, aus Casablanca)، فالسؤال في الفراغ [3] هو: Woher kommst du?",
            },
            {
              id: "bt-p8-1b-2-4",
              labelDe: "● ________________________ [4] aus der Türkei, aus Ankara.",
              labelAr: "الفراغ [4] (جواب ليلى عن موطنها):",
              options: ["Ich bin", "Grüß dich", "Wie heißt du", "Woher kommst du"],
              correctAnswer: "Ich bin",
              explanation: "في الفراغ [4] تقول ليلى: Ich bin aus der Türkei, aus Ankara.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d1-2-1",
          questionDe: "Wie heißt die Deutschlehrerin im Gespräch 1 auf Seite 8?",
          questionAr: "ما هو اسم أستاذة اللغة الألمانية في الحوار الأول بالصفحة 8؟",
          options: ["Christiane Brandt", "Leyla", "Veronika Weiden", "Mia Brunner"],
          correctIndex: 0,
          explanationDe: "Sie sagt in Gespräch 1: Ich bin Ihre Deutschlehrerin. Ich heiße Christiane Brandt.",
          explanationAr: "الأستاذة قدمت نفسها: Ich heiße Christiane Brandt.",
        },
        {
          id: "q-d1-2-2",
          questionDe: "Woher kommt Leyla im Gespräch 2 auf Seite 8?",
          questionAr: "من أين تنحدر ليلى في الحوار الثاني بالصفحة 8؟",
          options: [
            "Aus der Türkei, aus Ankara",
            "Aus Marokko, aus Casablanca",
            "Aus der Schweiz, aus Zürich",
            "Aus Österreich, aus Salzburg",
          ],
          correctIndex: 0,
          explanationDe: "Leyla sagt in Gespräch 2: Ich bin aus der Türkei, aus Ankara.",
          explanationAr: "ليلى قالت: Ich bin aus der Türkei, aus Ankara.",
        },
      ],
    },
    {
      id: "listen-d1-audio2",
      titleDe: "Audio 2 • Seite 9 (Aufgabe 3a: Lesen und hören Sie die Studienfächer)",
      titleAr: "الأوديو 2 (🔊 2 - ص 9): تمرين 2 وتمرين 3a — البلدان بأداة التعريف والتخصصات الجامعية",
      situationDe:
        "Kursbuch Seite 9, Aufgabe 2 & 3a (🔊 2): Woher? Aus ... (der Schweiz, der Türkei, dem Iran, den USA) & Studienfächer an der Universität.",
      situationAr:
        "كتاب الدروس ص 9، تمرين 2 وتمرين 3a (🔊 أوديو 2): البلدان التي تأخذ أداة تعريف بعد حرف الجر aus، والاستماع للتخصصات الجامعية.",
      pageNumber: 9,
      audioTrackLabel: "Audio 2 • Seite 9 (Aufgabe 3a: Studienfächer)",
      youtubeVideoId: "xYskkb96hPI",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher",
      dialogueSpeakerB: "Sprecherin",
      fullTranscriptDe:
        "Medizin – Elektrotechnik – Jura – Wirtschaft – Philosophie – Physik – Informatik – Architektur – Germanistik – Mathematik.",
      transcriptAr:
        "الطب (Medizin) – الهندسة الكهربائية (Elektrotechnik) – القانون (Jura) – الاقتصاد (Wirtschaft) – الفلسفة (Philosophie) – الفيزياء (Physik) – المعلوميات (Informatik) – الهندسة المعمارية (Architektur).",
      audioLines: [
        {
          speaker: "Sprecher",
          gender: "male",
          textDe: "Medizin – Elektrotechnik – Jura – Wirtschaft.",
          textAr: "الطب – الهندسة الكهربائية – القانون (الحقوق) – الاقتصاد.",
        },
        {
          speaker: "Sprecherin",
          gender: "female",
          textDe: "Philosophie – Physik – Informatik – Architektur.",
          textAr: "الفلسفة – الفيزياء – المعلوميات – الهندسة المعمارية.",
        },
      ],
      tipDarija:
        "فـ الصفحة 9 عندك تمرين 2 (Woher? Aus der Schweiz / aus der Türkei / aus dem Iran / aus den USA) وتمرين 3a (🔊 2: التخصصات الجامعية).",
      bookTasks: [
        {
          id: "task-d1-a2",
          titleDe: "3a Lesen und hören Sie die Studienfächer. Wie heißen sie in Ihrer Sprache? (Seite 9, 🔊 2)",
          titleAr: "تمرين الكتاب 3a (ص 9، 🔊 2): اقرأ واستمع للتخصصات الجامعية الثمانية — كيف تسمى بلغتك؟",
          instructionDe: "Lesen und hören Sie die Studienfächer: Medizin, Elektrotechnik, Jura, Wirtschaft, Philosophie, Physik, Informatik, Architektur.",
          instructionAr: "طابق التخصصات الجامعية الثمانية المطبوعة في تمرين 3a بالصفحة 9 بمعناها.",
          type: "matching",
          items: [
            {
              id: "bt-a2-1",
              labelDe: "Medizin",
              labelAr: "ما معنى هذا التخصص في تمرين 3a؟",
              options: ["الطب", "الهندسة الكهربائية", "القانون / الحقوق", "الاقتصاد"],
              correctAnswer: "الطب",
              explanation: "Medizin = الطب.",
            },
            {
              id: "bt-a2-2",
              labelDe: "Elektrotechnik",
              labelAr: "ما معنى هذا التخصص في تمرين 3a؟",
              options: ["الهندسة الكهربائية", "الطب", "الفيزياء", "الفلسفة"],
              correctAnswer: "الهندسة الكهربائية",
              explanation: "Elektrotechnik = الهندسة الكهربائية.",
            },
            {
              id: "bt-a2-3",
              labelDe: "Jura",
              labelAr: "ما معنى هذا التخصص في تمرين 3a؟",
              options: ["القانون / الحقوق", "الاقتصاد", "المعلوميات", "الهندسة المعمارية"],
              correctAnswer: "القانون / الحقوق",
              explanation: "Jura = القانون / الحقوق.",
            },
            {
              id: "bt-a2-4",
              labelDe: "Wirtschaft",
              labelAr: "ما معنى هذا التخصص في تمرين 3a؟",
              options: ["الاقتصاد", "الفلسفة", "الفيزياء", "الطب"],
              correctAnswer: "الاقتصاد",
              explanation: "Wirtschaft = الاقتصاد.",
            },
            {
              id: "bt-a2-5",
              labelDe: "Philosophie | Physik",
              labelAr: "ما معنى هذين التخصصين في تمرين 3a؟",
              options: ["الفلسفة | الفيزياء", "المعلوميات | الهندسة المعمارية", "الطب | القانون"],
              correctAnswer: "الفلسفة | الفيزياء",
              explanation: "Philosophie = الفلسفة | Physik = الفيزياء.",
            },
            {
              id: "bt-a2-6",
              labelDe: "Informatik | Architektur",
              labelAr: "ما معنى هذين التخصصين في تمرين 3a؟",
              options: ["المعلوميات | الهندسة المعمارية", "الهندسة الكهربائية | الاقتصاد", "الفيزياء | الفلسفة"],
              correctAnswer: "المعلوميات | الهندسة المعمارية",
              explanation: "Informatik = المعلوميات | Architektur = الهندسة المعمارية.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d1-a2-1",
          questionDe: "Wie heißt es richtig auf Seite 9 (Aufgabe 2): „Ich komme aus ___ Schweiz und er kommt aus ___ Türkei“?",
          questionAr: "ما هي الأداة الصحيحة بعد aus مع Schweiz و Türkei في تمرين 2 بالصفحة 9؟",
          options: ["der / der", "die / die", "dem / dem", "den / den"],
          correctIndex: 0,
          explanationDe: "Auf Seite 9 (Aufgabe 2): aus der Schweiz, aus der Türkei.",
          explanationAr: "نقول: aus der Schweiz و aus der Türkei.",
        },
      ],
    },
    {
      id: "listen-d1-audio3",
      titleDe: "Audio 3 • Seite 9 (Aufgabe 3b: Hören Sie das Gespräch. Was studieren die Studenten?)",
      titleAr: "الأوديو 3 (🔊 3 - ص 9): تمرين 3b وتمرين 3c — جدول الطلبة وتخصصاتهم الجامعية",
      situationDe:
        "Kursbuch Seite 9, Aufgabe 3b & 3c (🔊 3): Hören Sie das Gespräch. Was studieren die Studenten? Ergänzen Sie die Tabelle.",
      situationAr:
        "كتاب الدروس ص 9، تمرين 3b و 3c (🔊 أوديو 3): استمع للحوار وأكمل جدول الطلبة (الاسم، البلد، والتخصص الجامعي).",
      pageNumber: 9,
      audioTrackLabel: "Audio 3 • Seite 9 (Aufgabe 3b: Was studierst du?)",
      youtubeVideoId: "S1H58zHJ-eE",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Rodrigo & Veronika",
      dialogueSpeakerB: "Tarik Amri",
      fullTranscriptDe:
        "Sprecher: Sophie Meier studiert Wirtschaft.\nRodrigo: Hallo! Das ist Tarik.\nVeronika: Hallo Tarik, woher kommst du?\nTarik: Ich komme aus Marokko, aus Casablanca.\nVeronika: Was studierst du, Tarik?\nTarik: Ich studiere Elektrotechnik. Und du?\nVeronika: Ich studiere Jura.\nTarik: Und du, Rodrigo? Was studierst du?\nRodrigo: Ich studiere Medizin.",
      transcriptAr:
        "المعلق: صوفي ماير تدرس الاقتصاد.\nرودريغو: أهلاً! هذا طارق.\nفيرونيكا: أهلاً طارق، من أين أنت؟\nطارق: أنا من المغرب، من الدار البيضاء.\nفيرونيكا: ماذا تدرس يا طارق؟\nطارق: أدرس الهندسة الكهربائية. وأنتِ؟\nفيرونيكا: أنا أدرس القانون (الحقوق).\nطارق: وأنت يا رودريغو؟ ماذا تدرس؟\nرودريغو: أنا أدرس الطب.",
      audioLines: [
        {
          speaker: "Tarik",
          gender: "male",
          textDe: "Ich komme aus Marokko, aus Casablanca. Ich studiere Elektrotechnik.",
          textAr: "أنا من المغرب، من الدار البيضاء. أدرس الهندسة الكهربائية.",
        },
        {
          speaker: "Veronika",
          gender: "female",
          textDe: "Ich studiere Jura.",
          textAr: "أنا أدرس القانون (الحقوق).",
        },
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Ich studiere Medizin.",
          textAr: "أنا أدرس الطب.",
        },
      ],
      tipDarija:
        "عمّر الجدول ديال تمرين 3b وتمرين 3c (ص 9) كيفما فـ الكتاب: كل طالب، بلادو، والتخصص اللي كيقرا.",
      bookTasks: [
        {
          id: "task-d1-3b",
          titleDe: "3b Hören Sie das Gespräch. Was studieren die Studenten? Ergänzen Sie die Tabelle. (Seite 9, 🔊 3)",
          titleAr: "تمرين الكتاب 3b (ص 9، 🔊 3): استمع للحوار وأكمل الجدول (المثال الأول محلول: Sophie Meier | Deutschland | Wirtschaft)",
          instructionDe: "Hören Sie das Gespräch. Was studieren die Studenten? Ergänzen Sie die Tabelle.",
          instructionAr: "استمع للأوديو 3 وأكمل خانات الجدول الأربعة كما في تمرين 3b بالصفحة 9 من الكتاب.",
          type: "matching",
          items: [
            {
              id: "bt-1-1",
              labelDe: "Name: Tarik | Land: Marokko | Studienfach: ____________",
              labelAr: "تخصص Tarik في السطر الثاني من جدول 3b:",
              options: ["Elektrotechnik", "Jura", "Medizin", "Wirtschaft"],
              correctAnswer: "Elektrotechnik",
              explanation: "Tarik (Marokko) studiert Elektrotechnik.",
            },
            {
              id: "bt-1-2",
              labelDe: "Name: Veronika | Land: Österreich | Studienfach: ____________",
              labelAr: "تخصص Veronika في السطر الثالث من جدول 3b:",
              options: ["Jura", "Medizin", "Elektrotechnik", "Wirtschaft"],
              correctAnswer: "Jura",
              explanation: "Veronika (Österreich) studiert Jura.",
            },
            {
              id: "bt-1-3",
              labelDe: "Name: Rodrigo | Land: Brasilien | Studienfach: ____________",
              labelAr: "تخصص Rodrigo في السطر الرابع من جدول 3b:",
              options: ["Medizin", "Elektrotechnik", "Jura", "Wirtschaft"],
              correctAnswer: "Medizin",
              explanation: "Rodrigo (Brasilien) studiert Medizin.",
            },
            {
              id: "bt-1-4",
              labelDe: "Name: Leyla | Land: Türkei | Studienfach: ____________",
              labelAr: "تخصص Leyla في السطر الخامس من جدول 3b:",
              options: ["Medizin", "Wirtschaft", "Jura", "Elektrotechnik"],
              correctAnswer: "Medizin",
              explanation: "Leyla (Türkei) studiert auch Medizin.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d1-1",
          questionDe: "Welches Fach studiert Tarik laut Aufgabe 3b?",
          questionAr: "ما هو التخصص الجامعي لطارق في تمرين 3b؟",
          options: ["Elektrotechnik", "Jura", "Medizin", "Wirtschaft"],
          correctIndex: 0,
          explanationDe: "Tarik antwortet: Ich studiere Elektrotechnik.",
          explanationAr: "طارق يدرس الهندسة الكهربائية (Elektrotechnik).",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 2: Pages 10-11 (Lektion 1 - B: Sprachen öffnen Türen)
  // Only 1 Audio on Pages 10-11: Audio 4 on Page 10 (Aufgabe 2a)
  // ---------------------------------------------------------------------------
  2: [
    {
      id: "listen-d2-2",
      titleDe: "Audio 4 • Seite 10 (Aufgabe 2a: Was macht ihr hier? Ordnen Sie das Gespräch)",
      titleAr: "الأوديو الوحيد في الحصة (🔊 4 - ص 10): رتب الحوار في مركز اللغات (Aufgabe 2a)",
      situationDe:
        "Kursbuch Seite 10, Aufgabe 2a (🔊 4): Leonie und Mia treffen Rodrigo im Sprachenzentrum. Sie lernen Chinesisch, weil sie im Sommer ein Praktikum in China machen.",
      situationAr:
        "كتاب الدروس ص 10، تمرين 2a (🔊 أوديو 4 – الأوديو الوحيد في الصفحتين 10 و 11): ليوني وميا تلتقيان برودريغو في مركز اللغات. تتعلمان الصينية لإجراء تدريب عملي (Praktikum) في الصين هذا الصيف.",
      pageNumber: 10,
      audioTrackLabel: "Audio 4 • Seite 10 (Aufgabe 2a: Gespräch ordnen)",
      youtubeVideoId: "DmG4F69CtwU",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Leonie & Mia",
      dialogueSpeakerB: "Rodrigo",
      fullTranscriptDe:
        "Leonie: Hallo, Rodrigo. Wie geht es dir?\nRodrigo: Gut, und dir?\nLeonie: Auch gut. Das ist Mia. Wir studieren zusammen.\nRodrigo: Hallo, Mia. Was macht ihr denn im Sprachenzentrum?\nMia: Wir lernen Chinesisch. Mia und ich machen im Sommer ein Praktikum in China.\nRodrigo: Ihr lernt Chinesisch – das ist ja super!\nLeonie: Oh ... der Kurs beginnt. Tschüss, Rodrigo.\nRodrigo: Tschüss. Und viel Spaß im Sprachkurs!",
      transcriptAr:
        "ليوني: أهلاً رودريغو. كيف حالك؟\nرودريغو: بخير، وأنتِ؟\nليوني: بخير أيضاً. هذه ميا. نحن ندرس معاً.\nرودريغو: أهلاً ميا. ماذا تفعلان هنا في مركز اللغات؟\nميا / ليوني: نحن نتعلم الصينية. ميا وأنا سنقوم في الصيف بتدريب عملي في الصين.\nرودريغو: تتعلمان الصينية – هذا رائع حقاً!\nليوني: أوه... الدرس يبدأ الآن. مع السلامة يا رودريغو.\nرودريغو: مع السلامة. ووقتاً ممتعاً في درس اللغة!",
      audioLines: [
        {
          speaker: "Leonie",
          gender: "female",
          textDe: "Hallo, Rodrigo. Wie geht es dir?",
          textAr: "أهلاً رودريغو. كيف حالك؟",
        },
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Gut, und dir?",
          textAr: "بخير، وأنتِ؟",
        },
        {
          speaker: "Leonie",
          gender: "female",
          textDe: "Auch gut. Das ist Mia. Wir studieren zusammen.",
          textAr: "بخير أيضاً. هذه ميا. نحن ندرس معاً.",
        },
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Hallo, Mia. Was macht ihr denn im Sprachenzentrum?",
          textAr: "أهلاً ميا. ماذا تفعلان في مركز اللغات؟",
        },
        {
          speaker: "Leonie",
          gender: "female",
          textDe: "Wir lernen Chinesisch. Mia und ich machen im Sommer ein Praktikum in China.",
          textAr: "نحن نتعلم الصينية. ميا وأنا سنقوم في الصيف بتدريب عملي في الصين.",
        },
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Ihr lernt Chinesisch – das ist ja super!",
          textAr: "تتعلمان الصينية – هذا رائع حقاً!",
        },
        {
          speaker: "Leonie",
          gender: "female",
          textDe: "Oh ... der Kurs beginnt. Tschüss, Rodrigo.",
          textAr: "أوه... الدرس يبدأ. مع السلامة يا رودريغو.",
        },
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Tschüss. Und viel Spaß im Sprachkurs!",
          textAr: "مع السلامة. ووقتاً ممتعاً في درس اللغة!",
        },
      ],
      tipDarija:
        "تصنت لـ Audio 4 (ص 10، تمرين 2a) ورتب الجمل من 1 حتى 8 كيفما فـ الكتاب! الجملة [1] محلولة فـ الكتاب هي: Hallo, Rodrigo. Wie geht es dir?",
      bookTasks: [
        {
          id: "task-d2-2a",
          titleDe: "2 Was macht ihr hier? • a) Ordnen Sie das Gespräch. Hören Sie dann und vergleichen Sie.",
          titleAr: "تمرين الكتاب 2a (ص 10): رتب جمل الحوار بالأرقام من 1 إلى 8 (الجملة 1 محلولة في الكتاب: Hallo, Rodrigo. Wie geht es dir?)",
          instructionDe: "Ordnen Sie jedem Satz die richtige Nummer (2 bis 8) im Gespräch zu.",
          instructionAr: "حدد الرقم الصحيح (من 2 إلى 8) لكل جملة حسب ترتيبها في الحوار المسموع (كما في الصفحة 10).",
          type: "matching",
          items: [
            {
              id: "bt-2a-1",
              labelDe: "○ Auch gut. Das ist Mia. Wir studieren zusammen.",
              labelAr: "حدّد رقم هذه الجملة في المربع [ _ ]:",
              options: ["2", "3", "4", "5", "6", "7", "8"],
              correctAnswer: "3",
              explanation: "بعد سؤال رودريغو (2: Gut, und dir?) تجيب ليوني في المرتبة [3]: Auch gut. Das ist Mia. Wir studieren zusammen.",
            },
            {
              id: "bt-2a-2",
              labelDe: "● Gut, und dir?",
              labelAr: "حدّد رقم هذه الجملة في المربع [ _ ]:",
              options: ["2", "3", "4", "5", "6", "7", "8"],
              correctAnswer: "2",
              explanation: "رداً على الجملة [1] (Hallo, Rodrigo. Wie geht es dir?) يجيب رودريغو في المرتبة [2]: Gut, und dir?",
            },
            {
              id: "bt-2a-4",
              labelDe: "● Hallo, Mia. Was macht ihr denn im Sprachenzentrum?",
              labelAr: "حدّد رقم هذه الجملة في المربع [ _ ]:",
              options: ["2", "3", "4", "5", "6", "7", "8"],
              correctAnswer: "4",
              explanation: "بعد تقديم ميا في الجملة [3]، يحييها رودريغو ويسأل في المرتبة [4]: Hallo, Mia. Was macht ihr denn im Sprachenzentrum?",
            },
            {
              id: "bt-2a-5",
              labelDe: "● Ihr lernt Chinesisch – das ist ja super!",
              labelAr: "حدّد رقم هذه الجملة في المربع [ _ ]:",
              options: ["2", "3", "4", "5", "6", "7", "8"],
              correctAnswer: "6",
              explanation: "بعد أن تخبراه بأنهما تتعلمان الصينية في الجملة [5]، يرد رودريغو في المرتبة [6]: Ihr lernt Chinesisch – das ist ja super!",
            },
            {
              id: "bt-2a-6",
              labelDe: "○ Oh ... der Kurs beginnt. Tschüss, Rodrigo.",
              labelAr: "حدّد رقم هذه الجملة في المربع [ _ ]:",
              options: ["2", "3", "4", "5", "6", "7", "8"],
              correctAnswer: "7",
              explanation: "في المرتبة [7] تلاحظ ليوني بداية الدرس وتودعه: Oh ... der Kurs beginnt. Tschüss, Rodrigo.",
            },
            {
              id: "bt-2a-7",
              labelDe: "○ Wir lernen Chinesisch. Mia und ich machen im Sommer ein Praktikum in China.",
              labelAr: "حدّد رقم هذه الجملة في المربع [ _ ]:",
              options: ["2", "3", "4", "5", "6", "7", "8"],
              correctAnswer: "5",
              explanation: "رداً على سؤال رودريغو [4] عن سبب تواجدهما في مركز اللغات، تجيب في المرتبة [5]: Wir lernen Chinesisch...",
            },
            {
              id: "bt-2a-8",
              labelDe: "● Tschüss. Und viel Spaß im Sprachkurs!",
              labelAr: "حدّد رقم هذه الجملة في المربع [ _ ]:",
              options: ["2", "3", "4", "5", "6", "7", "8"],
              correctAnswer: "8",
              explanation: "الجملة الختامية [8] من رودريغو: Tschüss. Und viel Spaß im Sprachkurs!",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d2-2-1",
          questionDe: "Welche Sprache lernen Mia und Leonie im Sprachenzentrum (Seite 10, Aufgabe 2a)?",
          questionAr: "ما هي اللغة التي تتعلمها ميا وليوني في مركز اللغات (ص 10، تمرين 2a)؟",
          options: ["Chinesisch", "Japanisch", "Arabisch", "Russisch"],
          correctIndex: 0,
          explanationDe: "Sie sagen: Wir lernen Chinesisch. Mia und ich machen im Sommer ein Praktikum in China.",
          explanationAr: "تتعلمان اللغة الصينية: Wir lernen Chinesisch.",
        },
        {
          id: "q-d2-2-2",
          questionDe: "Warum lernen Mia und Leonie Chinesisch?",
          questionAr: "لماذا تتعلم ميا وليوني اللغة الصينية؟",
          options: [
            "Sie machen im Sommer ein Praktikum in China",
            "Sie wollen dort Urlaub machen",
            "Ihre Eltern leben in China",
            "Sie studieren Sinologie",
          ],
          correctIndex: 0,
          explanationDe: "Im Gespräch heißt es: Mia und ich machen im Sommer ein Praktikum in China.",
          explanationAr: "لأنهما ستقومان بتدريب عملي في الصين في الصيف: ein Praktikum in China.",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 3: Pages 12-13 (Lektion 1 - C: Buchstaben und Zahlen)
  // Ordered strictly left to right: Audio 5, 6, 7, 8, 9 (Seite 12) -> Audio 10, 11 (Seite 13)
  // ---------------------------------------------------------------------------
  3: [
    {
      id: "listen-d3-audio5",
      titleDe: "Audio 5 • Seite 12 (Aufgabe 1a: Mia wie? Hören Sie: Wie ist der Familienname von Mia?)",
      titleAr: "الأوديو 5 (🔊 5 - ص 12): تمرين 1a — كيف يُكتب اللقب العائلي لميا؟",
      situationDe:
        "Kursbuch Seite 12, Aufgabe 1a (🔊 5): Mia wie? Hören Sie: Wie ist der Familienname von Mia? Das ist Mia ____________.",
      situationAr:
        "كتاب الدروس ص 12، تمرين 1a (🔊 أوديو 5): استمع وأكمل اللقب العائلي لميا: Das ist Mia ____________.",
      pageNumber: 12,
      audioTrackLabel: "Audio 5 • Seite 12 (Aufgabe 1a: Mia wie?)",
      youtubeVideoId: "qiGvF5Olzvk",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Mia Brunner",
      dialogueSpeakerB: "Rodrigo",
      fullTranscriptDe:
        "Rodrigo: Mia, wie ist eigentlich dein Familienname?\nMia: Brunner.\nRodrigo: Mia wie? Wie schreibt man das?\nMia: B - R - U - N - N - E - R.",
      transcriptAr:
        "رودريغو: ميا، ما هو لقبك العائلي؟\nميا: برونر (Brunner).\nرودريغو: ميا ماذا؟ كيف يُكتب ذلك؟\nميا: B - R - U - N - N - E - R.",
      audioLines: [
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Mia, wie ist dein Familienname? Wie schreibt man das?",
          textAr: "ميا، ما هو اسمك العائلي؟ كيف يكتب ذلك؟",
        },
        {
          speaker: "Mia",
          gender: "female",
          textDe: "Brunner: B - R - U - N - N - E - R.",
          textAr: "برونر: B - R - U - N - N - E - R.",
        },
      ],
      tipDarija:
        "جاوب على تمرين 1a (ص 12، 🔊 5): Das ist Mia ____________ (رد البال لـ Doppel-N).",
      bookTasks: [
        {
          id: "task-d3-a5",
          titleDe: "1a Mia wie? Hören Sie: Wie ist der Familienname von Mia? (Seite 12, 🔊 5)",
          titleAr: "تمرين الكتاب 1a (ص 12، 🔊 5): أكمل الفراغ كما في الكتاب: Das ist Mia ____________.",
          instructionDe: "Ergänzen Sie den Familiennamen von Mia.",
          instructionAr: "اختر التهجئة الصحيحة للفراغ في تمرين 1a بالصفحة 12.",
          type: "fill",
          items: [
            {
              id: "bt-a5-1",
              labelDe: "Das ist Mia ________________________.",
              labelAr: "أكمل الفراغ في تمرين 1a:",
              options: ["Brunner", "Bruner", "Brenner", "Bronner"],
              correctAnswer: "Brunner",
              explanation: "ميا هجأت لقبها: B - R - U - N - N - E - R (Brunner).",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d3-a5-1",
          questionDe: "Wie buchstabiert Mia ihren Familiennamen in Audio 5?",
          questionAr: "كيف تهجئ ميا لقبها العائلي في الأوديو 5؟",
          options: ["B - R - U - N - N - E - R", "B - R - U - N - E - R", "B - R - E - N - N - E - R", "B - R - A - N - D - T"],
          correctIndex: 0,
          explanationDe: "Mia buchstabiert: B - R - U - N - N - E - R.",
          explanationAr: "B - R - U - N - N - E - R.",
        },
      ],
    },
    {
      id: "listen-d3-audio6",
      titleDe: "Audio 6 • Seite 12 (Aufgabe 1b: Das Alphabet – Hören Sie die Buchstaben und sprechen Sie mit)",
      titleAr: "الأوديو 6 (🔊 6 - ص 12): تمرين 1b — الأبجدية الألمانية والحروف الخاصة Ä, Ö, Ü, ß",
      situationDe:
        "Kursbuch Seite 12, Aufgabe 1b (🔊 6): Das Alphabet: Hören Sie die Buchstaben und sprechen Sie mit.",
      situationAr:
        "كتاب الدروس ص 12، تمرين 1b (🔊 أوديو 6): استمع للحروف الهجائية الألمانية في جدول الأبجدية ورددها.",
      pageNumber: 12,
      audioTrackLabel: "Audio 6 • Seite 12 (Aufgabe 1b: Alphabet)",
      youtubeVideoId: "lpKzcfHTfss",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher",
      dialogueSpeakerB: "Sprecherin",
      fullTranscriptDe:
        "Aa [a:], Bb [be:], Cc [tse:], Dd [de:], Ee [e:], Ff [ɛf], Gg [ge:], Hh [ha:], Ii [i:], Jj [jɔt], Kk [ka:], Ll [ɛl], Mm [ɛm], Nn [ɛn], Oo [o:], Pp [pe:], Qq [ku:], Rr [ɛr], Ss [ɛs], Tt [te:], Uu [u:], Vv [faʊ], Ww [ve:], Xx [ɪks], Yy [ˈʏpsilɔn], Zz [tsɛt] – Ää [ɛ:], Öö [ø:], Üü [y:], ß [ɛsˈtsɛt].",
      transcriptAr:
        "قراءة الحروف الهجائية الألمانية من A إلى Z مع نطقها الصوتي كما في جدول تمرين 1b بالصفحة 12، بالإضافة إلى Ä, Ö, Ü و ß.",
      audioLines: [
        {
          speaker: "Sprecher",
          gender: "male",
          textDe: "A, B, C, D, E, F, G, H, I, J [jɔt], K, L, M, N, O, P, Q, R, S, T, U, V [faʊ], W [ve:], X, Y [ʏpsilɔn], Z [tsɛt].",
          textAr: "الحروف من A إلى Z (انتبه لنطق J = jot، V = fau، W = we، Y = ypsilon، Z = tset).",
        },
        {
          speaker: "Sprecherin",
          gender: "female",
          textDe: "Ä [ɛ:], Ö [ø:], Ü [y:], ß [ɛsˈtsɛt].",
          textAr: "حروف الأوملاوت Ä, Ö, Ü وحرف ß (Eszett).",
        },
      ],
      tipDarija:
        "تبع فـ جدول الحروف فـ تمرين 1b (ص 12، 🔊 6) ورد البال لنطق الحروف اللي كيتنطقو مغايرين على الفرنسية: J (jot), V (fau), W (we), Y (ypsilon), Z (tset).",
      bookTasks: [
        {
          id: "task-d3-1b",
          titleDe: "1b Das Alphabet: Hören Sie die Buchstaben und sprechen Sie mit (Seite 12, 🔊 6)",
          titleAr: "تمرين الكتاب 1b (ص 12، 🔊 6): طابق الحرف الألماني بطريقة نطقه في جدول الصفحة 12",
          instructionDe: "Ordnen Sie den Buchstaben die richtige Aussprache aus der Tabelle in 1b zu.",
          instructionAr: "اختر النطق الصحيح لكل حرف كما هو مكتوب تحت الحروف في تمرين 1b بالصفحة 12.",
          type: "matching",
          items: [
            {
              id: "bt-alpha-1",
              labelDe: "Vv / Ww:",
              labelAr: "كيف يُنطق الحرفان V و W في جدول 1b؟",
              options: ["V = [fau] / W = [we:]", "V = [we:] / W = [fau]", "V = [fi:] / W = [dubl-we]"],
              correctAnswer: "V = [fau] / W = [we:]",
              explanation: "في الألمانية V يُنطق [fau] و W يُنطق [we:].",
            },
            {
              id: "bt-alpha-2",
              labelDe: "Jj / Yy / Zz:",
              labelAr: "كيف تُنطق الحروف J و Y و Z في جدول 1b؟",
              options: ["J = [jot] / Y = [ypsilon] / Z = [tset]", "J = [dʒi] / Y = [igrek] / Z = [zed]", "J = [ja] / Y = [i] / Z = [s]"],
              correctAnswer: "J = [jot] / Y = [ypsilon] / Z = [tset]",
              explanation: "J = jot, Y = ypsilon, Z = tset.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d3-1",
          questionDe: "Wie spricht man den Buchstaben 'V' im deutschen Alphabet (Seite 12, 1b) aus?",
          questionAr: "كيف يُنطق حرف V في الأبجدية الألمانية (ص 12، تمرين 1b)؟",
          options: ["fau", "we", "ve", "fi"],
          correctIndex: 0,
          explanationDe: "Der Buchstabe V heißt im deutschen Alphabet 'fau'.",
          explanationAr: "يُنطق fau.",
        },
      ],
    },
    {
      id: "listen-d3-audio7",
      titleDe: "Audio 7 • Seite 12 (Aufgabe 1c: Hören Sie das Gespräch und ergänzen Sie die Namen)",
      titleAr: "الأوديو 7 (🔊 7 - ص 12): تمرين 1c — إكمال قائمة الأسماء (Namensliste)",
      situationDe:
        "Kursbuch Seite 12, Aufgabe 1c (🔊 7): Hören Sie das Gespräch und ergänzen Sie die Namen in der Tabelle (1. Brunner, Mia | 2. Rath, Alexander | 3. Hoffmann, Lukas | 4. Möller, Maik | 5. Goetze, Leonie | 6. Janovsky, Kerstin).",
      situationAr:
        "كتاب الدروس ص 12، تمرين 1c (🔊 أوديو 7): استمع للحوار وأكمل الأسماء العائلية والشخصية الناقصة في جدول الصفحة 12.",
      pageNumber: 12,
      audioTrackLabel: "Audio 7 • Seite 12 (Aufgabe 1c: Namensliste)",
      youtubeVideoId: "u5w3h2aF9L8",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Kursleiterin",
      dialogueSpeakerB: "Kursteilnehmer",
      fullTranscriptDe:
        "1. Mia Brunner: B - R - U - N - N - E - R.\n2. Alexander Rath: R - A - T - H.\n3. Lukas Hoffmann: H - O - F - F - M - A - N - N.\n4. Maik Möller: Vorname Maik: M - A - I - K.\n5. Leonie Goetze: G - O - E - T - Z - E.\n6. Kerstin Janovsky: J - A - N - O - V - S - K - Y.",
      transcriptAr:
        "1. ميا برونر: B-R-U-N-N-E-R.\n2. ألكسندر رات: R-A-T-H.\n3. لوكاس هوفمان: H-O-F-F-M-A-N-N.\n4. مايك مولر: الاسم الشخصي M-A-I-K.\n5. ليوني غوتزه: G-O-E-T-Z-E.\n6. كيرستين يانوفسكي: J-A-N-O-V-S-K-Y.",
      audioLines: [
        {
          speaker: "Alexander",
          gender: "male",
          textDe: "2. Mein Familienname ist Rath: R - A - T - H. Und Lukas Hoffmann: H - O - F - F - M - A - N - N.",
          textAr: "2. لقبي هو Rath (R-A-T-H). و 3. لوكاس Hoffmann (بـ ff و nn).",
        },
        {
          speaker: "Maik",
          gender: "male",
          textDe: "4. Möller, Maik mit a-i: M - A - I - K. | 5. Leonie Goetze mit o-e: G - O - E - T - Z - E. | 6. Kerstin Janovsky mit v und y: J - A - N - O - V - S - K - Y.",
          textAr: "4. Maik (بـ ai). | 5. Goetze (بـ oe). | 6. Janovsky (بـ v و y).",
        },
      ],
      tipDarija:
        "عمّر الجدول ديال تمرين 1c (ص 12، 🔊 7) تماماً كيفما فـ الكتاب: من رقم 2 حتى رقم 6!",
      bookTasks: [
        {
          id: "task-d3-a7",
          titleDe: "1c Hören Sie das Gespräch und ergänzen Sie die Namen (Seite 12, 🔊 7)",
          titleAr: "تمرين الكتاب 1c (ص 12، 🔊 7): أكمل الخانات الفارغة في جدول الأسماء من 2 إلى 6 (الرقم 1 محلول: Brunner, Mia)",
          instructionDe: "Ergänzen Sie Familienname oder Vorname in der Tabelle auf Seite 12.",
          instructionAr: "اختر الكتابة الصحيحة لكل اسم ناقص في جدول التمرين 1c بالصفحة 12.",
          type: "fill",
          items: [
            {
              id: "bt-a7-2",
              labelDe: "2. Familienname: ____________ | Vorname: Alexander",
              labelAr: "اللقب العائلي لألكسندر في السطر 2:",
              options: ["Rath", "Rat", "Raht", "Rad"],
              correctAnswer: "Rath",
              explanation: "يُكتب بـ th في النهاية: R - A - T - H (Rath).",
            },
            {
              id: "bt-a7-3",
              labelDe: "3. Familienname: ____________ | Vorname: Lukas",
              labelAr: "اللقب العائلي للوكاس في السطر 3:",
              options: ["Hoffmann", "Hofmann", "Hoffman", "Hofman"],
              correctAnswer: "Hoffmann",
              explanation: "يُكتب بحرفي f وحرفي n: H - O - F - F - M - A - N - N.",
            },
            {
              id: "bt-a7-4",
              labelDe: "4. Familienname: Möller | Vorname: ____________",
              labelAr: "الاسم الشخصي (Vorname) للسيد Möller في السطر 4:",
              options: ["Maik", "Meik", "Mike", "Mayk"],
              correctAnswer: "Maik",
              explanation: "يُكتب بـ a-i: M - A - I - K (Maik).",
            },
            {
              id: "bt-a7-5",
              labelDe: "5. Familienname: ____________ | Vorname: Leonie",
              labelAr: "اللقب العائلي لليوني في السطر 5:",
              options: ["Goetze", "Götze", "Gotze", "Geotze"],
              correctAnswer: "Goetze",
              explanation: "يُكتب بـ o-e و t-z: G - O - E - T - Z - E (Goetze).",
            },
            {
              id: "bt-a7-6",
              labelDe: "6. Familienname: ____________ | Vorname: Kerstin",
              labelAr: "اللقب العائلي لكيرستين في السطر 6:",
              options: ["Janovsky", "Janowski", "Janofski", "Yanovsky"],
              correctAnswer: "Janovsky",
              explanation: "يُكتب بـ v و y: J - A - N - O - V - S - K - Y (Janovsky).",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d3-a7-1",
          questionDe: "Wie schreibt man den Vornamen von Herrn Möller in Aufgabe 1c (Seite 12)?",
          questionAr: "كيف يُكتب الاسم الأول للسيد Möller في تمرين 1c بالصفحة 12؟",
          options: ["Maik (M-A-I-K)", "Mike", "Meik", "Mark"],
          correctIndex: 0,
          explanationDe: "Er buchstabiert seinen Vornamen: M - A - I - K.",
          explanationAr: "يُكتب Maik (M - A - I - K).",
        },
      ],
    },
    {
      id: "listen-d3-audio8",
      titleDe: "Audio 8 • Seite 12 (Aufgabe 2a & 2b: Zahlen 0–10 zuordnen und hören)",
      titleAr: "الأوديو 8 (🔊 8 - ص 12): تمرين 2a و 2b — ترتيب الأرقام من 0 إلى 10 والاستماع للمقارنة",
      situationDe:
        "Kursbuch Seite 12, Aufgabe 2a & 2b (🔊 8): Ordnen Sie die Zahlen zu (0 bis 10). Hören Sie die Zahlen und vergleichen Sie.",
      situationAr:
        "كتاب الدروس ص 12، تمرين 2a و 2b (🔊 أوديو 8): رتب الأرقام من 0 إلى 10 من القائمة (acht | drei | eins | fünf | neun | null | sechs | sieben | vier | zehn | zwei) ثم استمع وقارن.",
      pageNumber: 12,
      audioTrackLabel: "Audio 8 • Seite 12 (Aufgabe 2a & 2b: Zahlen 0–10)",
      youtubeVideoId: "OrzfBZQXItY",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher",
      dialogueSpeakerB: "Sprecherin",
      fullTranscriptDe:
        "0 null, 1 eins, 2 zwei, 3 drei, 4 vier, 5 fünf, 6 sechs, 7 sieben, 8 acht, 9 neun, 10 zehn.",
      transcriptAr:
        "0 صفر (null)، 1 واحد (eins)، 2 اثنان (zwei)، 3 ثلاثة (drei)، 4 أربعة (vier)، 5 خمسة (fünf)، 6 ستة (sechs)، 7 سبعة (sieben)، 8 ثمانية (acht)، 9 تسعة (neun)، 10 عشرة (zehn).",
      audioLines: [
        {
          speaker: "Sprecher",
          gender: "male",
          textDe: "0 null – 1 eins – 2 zwei – 3 drei – 4 vier – 5 fünf.",
          textAr: "الأرقام من 0 إلى 5.",
        },
        {
          speaker: "Sprecherin",
          gender: "female",
          textDe: "6 sechs – 7 sieben – 8 acht – 9 neun – 10 zehn.",
          textAr: "الأرقام من 6 إلى 10.",
        },
      ],
      tipDarija:
        "جاوب على تمرين 2a (ص 12) كيفما مطبوع فـ الكتاب (1 eins و 2 zwei محلولين فـ الكتاب)، ومن بعد تصنت لـ Audio 8 باش تقارن!",
      bookTasks: [
        {
          id: "task-d3-2a",
          titleDe: "2a & 2b Ordnen Sie die Zahlen zu. Hören Sie die Zahlen und vergleichen Sie (Seite 12, 🔊 8)",
          titleAr: "تمرين الكتاب 2a و 2b (ص 12، 🔊 8): اكتب الأرقام بالألمانية من القائمة (acht | drei | fünf | neun | null | sechs | sieben | vier | zehn)",
          instructionDe: "Ordnen Sie den Ziffern 0 bis 10 die richtigen Zahlwörter zu (1 = eins und 2 = zwei sind im Buch vorgegeben).",
          instructionAr: "اختر الكلمة الصحيحة لكل رقم كما في تمرين 2a بالصفحة 12.",
          type: "fill",
          items: [
            {
              id: "bt-p12-2a-1",
              labelDe: "0 = ____________ | 3 = ____________ | 4 = ____________",
              labelAr: "الأرقام 0 و 3 و 4:",
              options: ["null | drei | vier", "neun | drei | fünf", "null | vier | drei"],
              correctAnswer: "null | drei | vier",
              explanation: "0 = null, 3 = drei, 4 = vier.",
            },
            {
              id: "bt-p12-2a-2",
              labelDe: "5 = ____________ | 6 = ____________ | 7 = ____________",
              labelAr: "الأرقام 5 و 6 و 7:",
              options: ["fünf | sechs | sieben", "vier | sechs | acht", "fünf | sieben | sechs"],
              correctAnswer: "fünf | sechs | sieben",
              explanation: "5 = fünf, 6 = sechs, 7 = sieben.",
            },
            {
              id: "bt-p12-2a-3",
              labelDe: "8 = ____________ | 9 = ____________ | 10 = ____________",
              labelAr: "الأرقام 8 و 9 و 10:",
              options: ["acht | neun | zehn", "acht | null | zehn", "sieben | neun | zehn"],
              correctAnswer: "acht | neun | zehn",
              explanation: "8 = acht, 9 = neun, 10 = zehn.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d3-a8-1",
          questionDe: "Wie heißt die Zahl 0 auf Deutsch (Seite 12, Aufgabe 2a)?",
          questionAr: "ماذا يسمى الرقم 0 باللغة الألمانية (ص 12، تمرين 2a)؟",
          options: ["null", "neun", "zehn", "eins"],
          correctIndex: 0,
          explanationDe: "0 = null.",
          explanationAr: "0 = null.",
        },
      ],
    },
    {
      id: "listen-d3-audio9",
      titleDe: "Audio 9 • Seite 12 (Aufgabe 2c: Hören Sie das Gespräch und schreiben Sie die Telefonnummern)",
      titleAr: "الأوديو 9 (🔊 9 - ص 12): تمرين 2c — كتابة أرقام هواتف Mia و Maik و Lukas",
      situationDe:
        "Kursbuch Seite 12, Aufgabe 2c (🔊 9): Hören Sie das Gespräch und schreiben Sie die Telefonnummern auf den Notizzettel (Mia, Maik, Lukas).",
      situationAr:
        "كتاب الدروس ص 12، تمرين 2c (🔊 أوديو 9): استمع للحوار واكتب أرقام هواتف ميا ومايك ولوكاس في ورقة الملاحظات.",
      pageNumber: 12,
      audioTrackLabel: "Audio 9 • Seite 12 (Aufgabe 2c: Telefonnummern)",
      youtubeVideoId: "DonU50SjBME",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Mia & Maik",
      dialogueSpeakerB: "Lukas",
      fullTranscriptDe:
        "Mia: Meine Handynummer ist 0174 3086526 (null-eins-sieben-vier drei-null-acht-sechs-fünf-zwei-sechs).\nMaik: Meine Telefonnummer ist 2734118 (zwei-sieben-drei-vier-eins-eins-acht).\nLukas: Und meine Nummer in Stuttgart ist 0711 / 453331 (null-sieben-eins-eins vier-fünf-drei-drei-drei-eins).",
      transcriptAr:
        "ميا: رقم هاتفي المحمول هو 0174 3086526.\nمايك: رقم هاتفي هو 2734118.\nلوكاس: ورقم هاتفي هو 0711 / 453331.",
      audioLines: [
        {
          speaker: "Mia",
          gender: "female",
          textDe: "Mia: 0174 3086526.",
          textAr: "رقم ميا: 0174 3086526.",
        },
        {
          speaker: "Maik",
          gender: "male",
          textDe: "Maik: 2734118. | Lukas: 0711 / 453331.",
          textAr: "رقم مايك: 2734118. | رقم لوكاس: 0711 / 453331.",
        },
      ],
      tipDarija:
        "عمّر ورقة الملاحظات فـ تمرين 2c (ص 12، 🔊 9) تماماً كيفما فـ الكتاب: أرقام التليفون ديال Mia و Maik و Lukas!",
      bookTasks: [
        {
          id: "task-d3-a9",
          titleDe: "2c Hören Sie das Gespräch und schreiben Sie die Telefonnummern (Seite 12, 🔊 9)",
          titleAr: "تمرين الكتاب 2c (ص 12، 🔊 9): أكمل أرقام الهواتف الثلاثة في ورقة الملاحظات (Mia, Maik, Lukas)",
          instructionDe: "Wählen Sie für jede Person die gehörte Telefonnummer aus.",
          instructionAr: "اختر رقم الهاتف الصحيح لكل شخص كما سمعته في الأوديو 9.",
          type: "fill",
          items: [
            {
              id: "bt-a9-1",
              labelDe: "Mia: ________________________",
              labelAr: "رقم هاتف Mia في السطر الأول:",
              options: ["0174 3086526", "0174 3086562", "0172 3086526"],
              correctAnswer: "0174 3086526",
              explanation: "Mia: 0174 3086526.",
            },
            {
              id: "bt-a9-2",
              labelDe: "Maik: ________________________",
              labelAr: "رقم هاتف Maik في السطر الثاني:",
              options: ["2734118", "2743118", "2734181"],
              correctAnswer: "2734118",
              explanation: "Maik: 2734118.",
            },
            {
              id: "bt-a9-3",
              labelDe: "Lukas: ________________________",
              labelAr: "رقم هاتف Lukas في السطر الثالث:",
              options: ["0711 / 453331", "0711 / 543331", "0711 / 453313"],
              correctAnswer: "0711 / 453331",
              explanation: "Lukas: 0711 / 453331.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d3-a9-1",
          questionDe: "Wie lautet die Telefonnummer von Maik in Aufgabe 2c (Seite 12)?",
          questionAr: "ما هو رقم هاتف مايك في تمرين 2c بالصفحة 12؟",
          options: ["2734118", "0174 3086526", "0711 / 453331", "07071 / 453106"],
          correctIndex: 0,
          explanationDe: "Maiks Telefonnummer ist 2734118.",
          explanationAr: "2734118.",
        },
      ],
    },
    {
      id: "listen-d3-audio10",
      titleDe: "Audio 10 • Seite 13 (Aufgabe 3a: Noch mehr Zahlen – Hören Sie und sprechen Sie mit)",
      titleAr: "الأوديو 10 (🔊 10 - ص 13): تمرين 3a — الأرقام من 11 إلى 1.000.000.000",
      situationDe:
        "Kursbuch Seite 13, Aufgabe 3a (🔊 10): Noch mehr Zahlen: Hören Sie die Zahlen ab 11 (11 elf, 12 zwölf, 13 dreizehn ... 20 zwanzig, 21 einundzwanzig ... 100 einhundert, 1.000 eintausend) und sprechen Sie mit.",
      situationAr:
        "كتاب الدروس ص 13، تمرين 3a (🔊 أوديو 10): استمع للأرقام من 11 إلى المليار في الصفحة 13 ورددها.",
      pageNumber: 13,
      audioTrackLabel: "Audio 10 • Seite 13 (Aufgabe 3a: Zahlen ab 11)",
      youtubeVideoId: "du0KNuf80w0",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher",
      dialogueSpeakerB: "Sprecherin",
      fullTranscriptDe:
        "11 elf, 12 zwölf, 13 dreizehn, 14 vierzehn, 15 fünfzehn, 16 sechzehn, 17 siebzehn, 18 achtzehn, 19 neunzehn, 20 zwanzig, 21 einundzwanzig, 22 zweiundzwanzig, 30 dreißig, 40 vierzig, 50 fünfzig, 60 sechzig, 70 siebzig, 80 achtzig, 90 neunzig, 100 (ein)hundert, 101 hunderteins, 200 zweihundert, 1.000 (ein)tausend, 1.000.000 eine Million.",
      transcriptAr:
        "الأرقام من 11 إلى المليون كما في قائمة تمرين 3a بالصفحة 13.",
      audioLines: [
        {
          speaker: "Sprecher",
          gender: "male",
          textDe: "11 elf, 12 zwölf, 13 dreizehn, 14 vierzehn, 15 fünfzehn, 16 sechzehn, 17 siebzehn, 18 achtzehn, 19 neunzehn, 20 zwanzig.",
          textAr: "الأرقام من 11 إلى 20.",
        },
        {
          speaker: "Sprecherin",
          gender: "female",
          textDe: "21 einundzwanzig, 30 dreißig, 40 vierzig, 50 fünfzig, 60 sechzig, 70 siebzig, 80 achtzig, 90 neunzig, 100 einhundert, 1.000 eintausend.",
          textAr: "الأرقام المركبة والعقود والمئات والآلاف.",
        },
      ],
      tipDarija:
        "رد البال فـ تمرين 3a (ص 13، 🔊 10) لـ 16 (sechzehn بلا s)، 17 (siebzehn بلا en)، 30 (dreißig بـ ß)، و 21 (einundzwanzig بلا s).",
      bookTasks: [
        {
          id: "task-d3-a10",
          titleDe: "3a Noch mehr Zahlen: Hören Sie die Zahlen und sprechen Sie mit (Seite 13, 🔊 10)",
          titleAr: "تمرين الكتاب 3a و 3b (ص 13، 🔊 10): كتابة الأرقام من 11 إلى 100 والسؤال عن العمر (Wie alt bist du?)",
          instructionDe: "Wählen Sie die richtige Schreibweise der Zahlen aus Aufgabe 3a.",
          instructionAr: "اختر الكتابة الصحيحة للأرقام كما وردت في قائمة التمرين 3a بالصفحة 13.",
          type: "fill",
          items: [
            {
              id: "bt-a10-1",
              labelDe: "16 = ____________ | 17 = ____________",
              labelAr: "الرقمان 16 و 17:",
              options: ["sechzehn | siebzehn", "sechszehn | siebenzehn", "sechzen | sibzehn"],
              correctAnswer: "sechzehn | siebzehn",
              explanation: "16 = sechzehn (ohne s), 17 = siebzehn (ohne en).",
            },
            {
              id: "bt-a10-2",
              labelDe: "21 = ____________ | 30 = ____________ | 60 = ____________ | 70 = ____________",
              labelAr: "الأرقام 21 و 30 و 60 و 70:",
              options: [
                "einundzwanzig | dreißig | sechzig | siebzig",
                "einsundzwanzig | dreizig | sechszig | siebenzig",
                "zwanzigundeins | dreißig | sechzig | siebzig",
              ],
              correctAnswer: "einundzwanzig | dreißig | sechzig | siebzig",
              explanation: "21 = einundzwanzig, 30 = dreißig, 60 = sechzig, 70 = siebzig.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d3-a10-1",
          questionDe: "Wie fragt man in Aufgabe 3b (Seite 13) nach dem Alter?",
          questionAr: "كيف نسأل عن العمر في تمرين 3b بالصفحة 13؟",
          options: [
            "Wie alt bist du? – Ich bin 21 Jahre alt.",
            "Wie viel bist du?",
            "Welche Zahl hast du?",
            "Wann bist du?",
          ],
          correctIndex: 0,
          explanationDe: "Auf Seite 13 (Aufgabe 3b): Wie alt bist du? – Ich bin 21 Jahre alt.",
          explanationAr: "نسأل: Wie alt bist du?",
        },
      ],
    },
    {
      id: "listen-d3-audio11",
      titleDe: "Audio 11 • Seite 13 (Aufgabe 4a: Ich suche einen Sprachtandempartner – Online-Formular ergänzen)",
      titleAr: "الأوديو 11 (🔊 11 - ص 13): تمرين 4a — إكمال استمارة التسجيل الإلكترونية لرودريغو (Online-Formular)",
      situationDe:
        "Kursbuch Seite 13, Aufgabe 4a (🔊 11): Hören Sie das Gespräch und ergänzen Sie das Online-Formular der Eberhard Karls Universität Tübingen für Rodrigo Alves Barbosa.",
      situationAr:
        "كتاب الدروس ص 13، تمرين 4a (🔊 أوديو 11): استمع للحوار وأكمل الخانات الفارغة في استمارة التسجيل الإلكترونية (Online-Formular) لرودريغو في جامعة توبنغن.",
      pageNumber: 13,
      audioTrackLabel: "Audio 11 • Seite 13 (Aufgabe 4a: Online-Formular)",
      youtubeVideoId: "jw3WdVHa9H4",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Mitarbeiterin",
      dialogueSpeakerB: "Rodrigo Alves Barbosa",
      fullTranscriptDe:
        "Vorname: Rodrigo.\nNachname: Alves Barbosa.\nPostleitzahl und Wohnort: 72076 Tübingen.\nStraße und Hausnummer: Fichtenweg 10.\nMuttersprache: Portugiesisch.\nHerkunftsland: Brasilien.\nZielsprache: Deutsch.\nTelefon: 07071 / 453106.\nHandy: 0171 3347986.\nE-Mail-Adresse: rodrigo-alvesba@xmu.de.",
      transcriptAr:
        "الاسم الشخصي: Rodrigo.\nالاسم العائلي: Alves Barbosa.\nالرمز البريدي والمدينة: 72076 Tübingen.\nالشارع ورقم المنزل: Fichtenweg 10.\nاللغة الأم: Portugiesisch (البرتغالية).\nبلد الأصل: Brasilien.\nاللغة المستهدفة: Deutsch.\nالهاتف الثابت: 07071 / 453106.\nالهاتف المحمول: 0171 3347986.\nالبريد الإلكتروني: rodrigo-alvesba@xmu.de.",
      audioLines: [
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Mein Name ist Rodrigo Alves Barbosa. Ich wohne in 72076 Tübingen, Fichtenweg 10.",
          textAr: "اسمي رودريغو ألفيس باربوسا. أسكن في 72076 توبنغن، شارع Fichtenweg رقم 10.",
        },
        {
          speaker: "Rodrigo",
          gender: "male",
          textDe: "Meine Muttersprache ist Portugiesisch, Zielsprache Deutsch. Telefon: 07071 / 453106, Handy: 0171 3347986.",
          textAr: "لغتي الأم البرتغالية، واللغة المستهدفة الألمانية. الهاتف: 07071/453106، المحمول: 01713347986.",
        },
      ],
      tipDarija:
        "عمّر الخانات اللي ناقصة فـ الاستمارة (Online-Formular) ديال تمرين 4a (ص 13، 🔊 11) تماماً كيفما مطبوعة فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d3-4a",
          titleDe: "4a Hören Sie das Gespräch und ergänzen Sie das Online-Formular (Seite 13, 🔊 11)",
          titleAr: "تمرين الكتاب 4a (ص 13، 🔊 11): أكمل الخانات الفارغة في استمارة جامعة توبنغن (Vorname: Rodrigo و Herkunftsland: Brasilien مكتوبان في الكتاب)",
          instructionDe: "Ergänzen Sie die fehlenden Angaben im Online-Formular auf Seite 13.",
          instructionAr: "اختر المعلومة الصحيحة لكل خانة فارغة في الاستمارة بالصفحة 13.",
          type: "fill",
          items: [
            {
              id: "bt-p13-4a-1",
              labelDe: "Vorname: Rodrigo | Nachname: ________________________",
              labelAr: "اللقب العائلي لرودريغو في الاستمارة:",
              options: ["Alves Barbosa", "Giacometti", "Brunner", "Hoffmann"],
              correctAnswer: "Alves Barbosa",
              explanation: "Nachname: Alves Barbosa.",
            },
            {
              id: "bt-p13-4a-2",
              labelDe: "Postleitzahl + Wohnort: ____________ Tübingen | Straße + Hausnummer: Fichtenweg ____",
              labelAr: "الرمز البريدي ورقم المنزل في شارع Fichtenweg:",
              options: ["72076 | 10", "72070 | 19", "80331 | 12"],
              correctAnswer: "72076 | 10",
              explanation: "Postleitzahl + Wohnort: 72076 Tübingen | Straße + Hausnummer: Fichtenweg 10.",
            },
            {
              id: "bt-p13-4a-3",
              labelDe: "Muttersprache: ____________ | Herkunftsland: Brasilien | Zielsprache: ____________",
              labelAr: "اللغة الأم واللغة المستهدفة في الاستمارة:",
              options: ["Portugiesisch | Deutsch", "Spanisch | Englisch", "Brasilianisch | Chinesisch"],
              correctAnswer: "Portugiesisch | Deutsch",
              explanation: "Muttersprache: Portugiesisch | Zielsprache: Deutsch.",
            },
            {
              id: "bt-p13-4a-4",
              labelDe: "Telefon: 07071 / ____________ | Handy: ____________",
              labelAr: "رقم الهاتف الثابت ورقم المحمول في الاستمارة:",
              options: ["453106 | 0171 3347986", "453331 | 0174 3086526", "2734118 | 0160 975308"],
              correctAnswer: "453106 | 0171 3347986",
              explanation: "Telefon: 07071 / 453106 | Handy: 0171 3347986.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d3-3-1",
          questionDe: "In welcher Straße und Hausnummer wohnt Rodrigo laut dem Online-Formular (Seite 13, 4a)?",
          questionAr: "في أي شارع ورقم منزل يسكن رودريغو حسب استمارة الصفحة 13 (تمرين 4a)؟",
          options: ["Fichtenweg 10", "Goethestraße 19", "Wilhelmstraße 22", "Gartenstraße 38"],
          correctIndex: 0,
          explanationDe: "Im Formular steht: Straße + Hausnummer: Fichtenweg 10.",
          explanationAr: "Fichtenweg 10.",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 4: Pages 18-19 (Lektion 2 - A: Früher und heute)
  // Ordered strictly left to right: Audio 12 (Seite 18, 1b & 1c) -> Audio 13 (Seite 18, Aufgabe 3)
  // ---------------------------------------------------------------------------
  4: [
    {
      id: "listen-d4-audio12",
      titleDe: "Audio 12 • Seite 18 (Aufgabe 1b & 1c: Hören Sie das Gespräch von Jan und Felix)",
      titleAr: "الأوديو 12 (🔊 12 - ص 18): تمرين 1b و 1c — حوار يان وفيليكس",
      situationDe:
        "Kursbuch Seite 18, Aufgabe 1b & 1c (🔊 12): Hören Sie das Gespräch von Jan und Felix. Welche Gegenstände aus 1a hören Sie? Markieren Sie. Hören Sie das Gespräch noch einmal und kreuzen Sie an.",
      situationAr:
        "كتاب الدروس ص 18، تمرين 1b و 1c (🔊 أوديو 12): استمع لحوار يان وفيليكس، حدد الأشياء المسموعة من 1a، ثم استمع مرة أخرى وأجب عن الأسئلة 1 و 2 و 3.",
      pageNumber: 18,
      audioTrackLabel: "Audio 12 • Seite 18 (Aufgabe 1b & 1c: Jan und Felix)",
      youtubeVideoId: "uGHjnbAHro0",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Jan",
      dialogueSpeakerB: "Felix",
      fullTranscriptDe:
        "Jan: Sag mal, Felix, was ist das denn? Eine Schreibmaschine!\nFelix: Ja, die ist von ebay. Und schau mal hier: meine alte Kamera.\nJan: Cool! Alt ist in!\nFelix: Und hast du ein Auto?\nJan: Nein, ich habe kein Auto, ich habe ein Fahrrad.",
      transcriptAr:
        "يان: قل لي يا فيليكس، ما هذا؟ آلة كاتبة!\nفيليكس: نعم، إنها من موقع ebay. وانظر هنا: كاميرتي القديمة.\nيان: رائع! القديم على الموضة (Alt ist in)!\nفيليكس: ولدي دراجة هوائية، ليس لدي سيارة.",
      audioLines: [
        {
          speaker: "Jan",
          gender: "male",
          textDe: "Alt ist in!",
          textAr: "القديم رائج (على الموضة)!",
        },
        {
          speaker: "Felix",
          gender: "male",
          textDe: "Die Schreibmaschine ist von ebay. Ich habe kein Auto, ich habe ein Fahrrad.",
          textAr: "الآلة الكاتبة من موقع ebay. ليس لدي سيارة، لدي دراجة هوائية.",
        },
      ],
      tipDarija:
        "جاوب على تمرين 1b وتمرين 1c (ص 18، 🔊 12) تماماً كيفما مطبوعين فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d4-1b",
          titleDe: "1b Hören Sie das Gespräch von Jan und Felix. Welche Gegenstände aus 1a hören Sie? Markieren Sie. (Seite 18, 🔊 12)",
          titleAr: "تمرين الكتاب 1b (ص 18، 🔊 12): أي الأشياء من التمرين 1a تسمعها في الحوار؟",
          instructionDe: "Welche Gegenstände aus 1a hören Sie im Gespräch?",
          instructionAr: "اختر الأشياء التي ذُكرت في حوار يان وفيليكس.",
          type: "matching",
          items: [
            {
              id: "bt-d4-1b-1",
              labelDe: "Welche 4 Gegenstände aus 1a hören Sie im Gespräch?",
              labelAr: "الأشياء الأربعة المسموعة في التسجيل من قائمة 1a:",
              options: [
                "das Fahrrad, die Schreibmaschine, die Kamera, das Auto",
                "das Grammofon, die Kaffeemühle, der Schlüssel, die Taschenuhr",
                "die Brille, die Kette, die Tasche, das Telefon",
              ],
              correctAnswer: "das Fahrrad, die Schreibmaschine, die Kamera, das Auto",
              explanation: "في الحوار يذكران: die Schreibmaschine, die Kamera, das Auto, das Fahrrad.",
            },
          ],
        },
        {
          id: "task-d4-a12",
          titleDe: "1c Hören Sie das Gespräch noch einmal und kreuzen Sie an. (Seite 18, 🔊 12)",
          titleAr: "تمرين الكتاب 1c (ص 18، 🔊 12): استمع للحوار مرة أخرى وضع علامة (a أو b)",
          instructionDe: "Hören Sie das Gespräch noch einmal und kreuzen Sie an.",
          instructionAr: "اختر الإجابة الصحيحة (a أو b) للجمل 1 و 2 و 3 كما في تمرين 1c بالصفحة 18.",
          type: "matching",
          items: [
            {
              id: "bt-a12-1",
              labelDe: "1. Jan sagt: Alt ist ...",
              labelAr: "السؤال 1 في تمرين 1c:",
              options: ["a. gut.", "b. in."],
              correctAnswer: "b. in.",
              explanation: "Jan sagt: Alt ist in!",
            },
            {
              id: "bt-a12-2",
              labelDe: "2. Die Schreibmaschine von Felix ist ...",
              labelAr: "السؤال 2 في تمرين 1c:",
              options: ["a. ein Geschenk von Opa.", "b. von ebay."],
              correctAnswer: "b. von ebay.",
              explanation: "Die Schreibmaschine von Felix ist von ebay.",
            },
            {
              id: "bt-a12-3",
              labelDe: "3. Felix hat ...",
              labelAr: "السؤال 3 في تمرين 1c:",
              options: ["a. ein Auto.", "b. ein Fahrrad."],
              correctAnswer: "b. ein Fahrrad.",
              explanation: "Felix hat kein Auto, er hat ein Fahrrad.",
            },
          ],
        },
      ],
      questions: [],
    },
    {
      id: "listen-d4-audio13",
      titleDe: "Audio 13 • Seite 18 (Aufgabe 3: Hören Sie Teil 2 vom Gespräch von Felix und Jan. Was hören Sie: a oder b?)",
      titleAr: "الأوديو 13 (🔊 13 - ص 18): تمرين 3 — الجزء 2 من حوار فيليكس ويان: ماذا تسمع (a أم b)؟",
      situationDe:
        "Kursbuch Seite 18, Aufgabe 3 (🔊 13): Hören Sie Teil 2 vom Gespräch von Felix und Jan. Was hören Sie: a oder b? Kreuzen Sie an.",
      situationAr:
        "كتاب الدروس ص 18، تمرين 3 (🔊 أوديو 13): استمع للجزء الثاني من حوار فيليكس ويان. ماذا تسمع: a أم b؟ ضع علامة.",
      pageNumber: 18,
      audioTrackLabel: "Audio 13 • Seite 18 (Aufgabe 3: Was hören Sie: a oder b?)",
      youtubeVideoId: "r8kHMje04Ns",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Felix",
      dialogueSpeakerB: "Jan",
      fullTranscriptDe:
        "1. Das ist keine Brille von Opa.\n2. Ich brauche keinen Fernseher.\n3. Ich habe ein Notebook.\n4. Ich habe eine Kamera.\n5. Ich habe gute Lautsprecher.",
      transcriptAr:
        "1. هذه ليست نظارة جدي.\n2. أنا لا أحتاج إلى تلفاز.\n3. لدي حاسوب محمول.\n4. لدي كاميرا.\n5. لدي مكبرات صوت جيدة.",
      audioLines: [
        {
          speaker: "Felix",
          gender: "male",
          textDe: "1. Das ist keine Brille von Opa. | 2. Ich brauche keinen Fernseher.",
          textAr: "1. هذه ليست نظارة جدي. | 2. لا أحتاج إلى تلفاز.",
        },
        {
          speaker: "Felix",
          gender: "male",
          textDe: "3. Ich habe ein Notebook. | 4. Ich habe eine Kamera. | 5. Ich habe gute Lautsprecher.",
          textAr: "3. لدي حاسوب محمول. | 4. لدي كاميرا. | 5. لدي مكبرات صوت جيدة.",
        },
      ],
      tipDarija:
        "تصنت لـ Audio 13 (ص 18، تمرين 3) واختار واش كتسمع الجملة a ولا الجملة b من 1 حتى 5 كيفما مطبوعين فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d4-a13",
          titleDe: "3 Hören Sie Teil 2 vom Gespräch von Felix und Jan. Was hören Sie: a oder b? Kreuzen Sie an. (Seite 18, 🔊 13)",
          titleAr: "تمرين الكتاب 3 (ص 18، 🔊 13): ماذا تسمع في الحوار: الجملة a أم الجملة b؟",
          instructionDe: "Was hören Sie: a oder b? Kreuzen Sie an.",
          instructionAr: "اختر الجملة المسموعة (a أو b) للأرقام من 1 إلى 5 تماماً كما في تمرين 3 بالصفحة 18.",
          type: "matching",
          items: [
            {
              id: "bt-a13-1",
              labelDe: "1.",
              labelAr: "السطر 1 في تمرين 3:",
              options: ["a. Das ist eine Brille von Opa.", "b. Das ist keine Brille von Opa."],
              correctAnswer: "b. Das ist keine Brille von Opa.",
              explanation: "في الأوديو يقول: Das ist keine Brille von Opa.",
            },
            {
              id: "bt-a13-2",
              labelDe: "2.",
              labelAr: "السطر 2 في تمرين 3:",
              options: ["a. Ich brauche einen Fernseher.", "b. Ich brauche keinen Fernseher."],
              correctAnswer: "b. Ich brauche keinen Fernseher.",
              explanation: "في الأوديو يقول: Ich brauche keinen Fernseher.",
            },
            {
              id: "bt-a13-3",
              labelDe: "3.",
              labelAr: "السطر 3 في تمرين 3:",
              options: ["a. Ich habe ein Notebook.", "b. Ich habe kein Notebook."],
              correctAnswer: "a. Ich habe ein Notebook.",
              explanation: "في الأوديو يقول: Ich habe ein Notebook.",
            },
            {
              id: "bt-a13-4",
              labelDe: "4.",
              labelAr: "السطر 4 في تمرين 3:",
              options: ["a. Ich habe eine Kamera.", "b. Ich habe keine Kamera."],
              correctAnswer: "a. Ich habe eine Kamera.",
              explanation: "في الأوديو يقول: Ich habe eine Kamera.",
            },
            {
              id: "bt-a13-5",
              labelDe: "5.",
              labelAr: "السطر 5 في تمرين 3:",
              options: ["a. Ich habe gute Lautsprecher.", "b. Ich habe keine guten Lautsprecher."],
              correctAnswer: "a. Ich habe gute Lautsprecher.",
              explanation: "في الأوديو يقول: Ich habe gute Lautsprecher.",
            },
          ],
        },
      ],
      questions: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 5: Pages 20-21 (Lektion 2 - B: Familiengeschichten)
  // Ordered strictly left to right: Audio 14-17 (1b) -> Audio 14-17 (1c) on Seite 20
  // ---------------------------------------------------------------------------
  5: [
    {
      id: "listen-d5-1c",
      titleDe: "Audio 14–17 • Seite 20 (Aufgabe 1b: Hören Sie und ordnen Sie den Gesprächen 1–4 die Fotos zu)",
      titleAr: "الأوديو 14–17 (🔊 14–17 - ص 20): تمرين 1b — ربط الحوارات 1–4 بالصور",
      situationDe:
        "Kursbuch Seite 20, Aufgabe 1b (🔊 14–17): Hören Sie und ordnen Sie den Gesprächen 1–4 die Fotos zu.",
      situationAr:
        "كتاب الدروس ص 20، تمرين 1b (🔊 أوديو 14–17): استمع للحوارات الأربعة واربط كل حوار (Gespräch 1–4) بالصورة المناسبة (Foto 1–4).",
      pageNumber: 20,
      audioTrackLabel: "Audio 14–17 • Seite 20 (Aufgabe 1b: Fotos zuordnen)",
      youtubeVideoId: "ku16pt_TQIQ",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Gespräch 1 & 2",
      dialogueSpeakerB: "Gespräch 3 & 4",
      fullTranscriptDe:
        "Gespräch 1 (Audio 14): Melanie zeigt Fotos von ihrer Familie und dem Baby ihrer Schwester (Foto 2).\nGespräch 2 (Audio 15): Frau Bäuerle erzählt von ihren drei Kindern im Garten (Foto 4).\nGespräch 3 (Audio 16): Alfred und Lotte Kohlmeyer feiern 60 Jahre Hochzeit – Diamantene Hochzeit (Foto 1).\nGespräch 4 (Audio 17): Mehmet und seine Frau beim Standesamt / Hochzeit (Foto 3).",
      transcriptAr:
        "الحوار 1 (أوديو 14): ميلاني تعرض صوراً لعائلتها ورضيع أختها (الصورة 2).\nالحوار 2 (أوديو 15): السيدة بويرله تتحدث عن أطفالها الثلاثة (الصورة 4).\nالحوار 3 (أوديو 16): ألفريد ولوته كولماير متزوجان منذ 60 سنة (الصورة 1).\nالحوار 4 (أوديو 17): مهمت وزوجته في حفل الزفاف (الصورة 3).",
      audioLines: [
        {
          speaker: "Gespräch 1 & 2",
          gender: "female",
          textDe: "Gespräch 1: Melanies Schwester hat ein Baby (Foto 2). | Gespräch 2: Frau Bäuerle hat drei Kinder (Foto 4).",
          textAr: "الحوار 1: أخت ميلاني لديها رضيع (Foto 2). | الحوار 2: السيدة بويرله لديها 3 أطفال (Foto 4).",
        },
        {
          speaker: "Gespräch 3 & 4",
          gender: "male",
          textDe: "Gespräch 3: Alfred und Lotte Kohlmeyer sind 60 Jahre verheiratet (Foto 1). | Gespräch 4: Mehmet und seine Frau (Foto 3).",
          textAr: "الحوار 3: ألفريد ولوته متزوجان منذ 60 عاماً (Foto 1). | الحوار 4: مهمت وزوجته (Foto 3).",
        },
      ],
      tipDarija:
        "جاوب على تمرين 1b (ص 20، 🔊 14–17) تماماً كيفما مطبوع فـ الكتاب: ربط كل حوار (Gespräch 1–4) برقم الصورة (Foto 1–4)!",
      bookTasks: [
        {
          id: "task-d5-1b",
          titleDe: "1b Hören Sie und ordnen Sie den Gesprächen 1–4 die Fotos zu. (Seite 20, 🔊 14–17)",
          titleAr: "تمرين الكتاب 1b (ص 20، 🔊 14–17): استمع واربط الحوارات 1–4 بالصور",
          instructionDe: "Ordnen Sie den Gesprächen 1–4 die Fotos zu.",
          instructionAr: "اختر رقم الصورة الصحيح لكل حوار كما في تمرين 1b بالصفحة 20.",
          type: "matching",
          items: [
            {
              id: "bt-p20-1b-1",
              labelDe: "Gespräch 1 — Foto ____",
              labelAr: "الحوار 1 يوافق الصورة رقم:",
              options: ["Foto 1", "Foto 2", "Foto 3", "Foto 4"],
              correctAnswer: "Foto 2",
              explanation: "Gespräch 1 (Melanie und das Baby ihrer Schwester) = Foto 2.",
            },
            {
              id: "bt-p20-1b-2",
              labelDe: "Gespräch 2 — Foto ____",
              labelAr: "الحوار 2 يوافق الصورة رقم:",
              options: ["Foto 1", "Foto 2", "Foto 3", "Foto 4"],
              correctAnswer: "Foto 4",
              explanation: "Gespräch 2 (Frau Bäuerle und ihre drei Kinder) = Foto 4.",
            },
            {
              id: "bt-p20-1b-3",
              labelDe: "Gespräch 3 — Foto ____",
              labelAr: "الحوار 3 يوافق الصورة رقم:",
              options: ["Foto 1", "Foto 2", "Foto 3", "Foto 4"],
              correctAnswer: "Foto 1",
              explanation: "Gespräch 3 (Alfred und Lotte Kohlmeyer) = Foto 1.",
            },
            {
              id: "bt-p20-1b-4",
              labelDe: "Gespräch 4 — Foto ____",
              labelAr: "الحوار 4 يوافق الصورة رقم:",
              options: ["Foto 1", "Foto 2", "Foto 3", "Foto 4"],
              correctAnswer: "Foto 3",
              explanation: "Gespräch 4 (Mehmet und seine Frau) = Foto 3.",
            },
          ],
        },
      ],
      questions: [],
    },
    {
      id: "listen-d5-1d",
      titleDe: "Audio 14–17 • Seite 20 (Aufgabe 1c: Hören Sie noch einmal. Sind die Sätze 1–5 richtig (r) oder falsch (f)?)",
      titleAr: "الأوديو 14–17 (🔊 14–17 - ص 20): تمرين 1c — استمع مرة أخرى: هل الجمل 1–5 صحيحة (r) أم خاطئة (f)؟",
      situationDe:
        "Kursbuch Seite 20, Aufgabe 1c (🔊 14–17): Hören Sie noch einmal. Sind die Sätze 1–5 richtig (r) oder falsch (f)? Kreuzen Sie an.",
      situationAr:
        "كتاب الدروس ص 20، تمرين 1c (🔊 أوديو 14–17): استمع مرة أخرى وحدد هل الجمل 1 إلى 5 صحيحة (r) أم خاطئة (f).",
      pageNumber: 20,
      audioTrackLabel: "Audio 14–17 • Seite 20 (Aufgabe 1c: richtig/falsch)",
      youtubeVideoId: "QMGf4ftuggc",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher",
      dialogueSpeakerB: "Sprecherin",
      fullTranscriptDe:
        "1. Alfred und Lotte Kohlmeyer sind 60 Jahre verheiratet. (richtig)\n2. Die Eltern von Melanie leben in Berlin. (falsch)\n3. Die Schwester von Melanie hat ein Baby. (richtig)\n4. Die Frau von Mehmet kommt aus der Türkei. (falsch)\n5. Frau Bäuerle hat drei Kinder. (richtig)",
      transcriptAr:
        "1. ألفريد ولوته كولماير متزوجان منذ 60 عاماً. (صحيح)\n2. والدا ميلاني يعيشان في برلين. (خطأ)\n3. أخت ميلاني لديها طفل رضيع. (صحيح)\n4. زوجة مهمت تنحدر من تركيا. (خطأ)\n5. السيدة بويرله لديها ثلاثة أطفال. (صحيح)",
      audioLines: [
        {
          speaker: "Sprecher",
          gender: "male",
          textDe: "1. Alfred und Lotte Kohlmeyer sind 60 Jahre verheiratet. | 3. Die Schwester von Melanie hat ein Baby.",
          textAr: "1. ألفريد ولوته متزوجان منذ 60 عاماً. | 3. أخت ميلاني لديها رضيع.",
        },
        {
          speaker: "Sprecherin",
          gender: "female",
          textDe: "5. Frau Bäuerle hat drei Kinder.",
          textAr: "5. السيدة بويرله لديها ثلاثة أطفال.",
        },
      ],
      tipDarija:
        "جاوب على الجمل الخمسة ديال تمرين 1c (ص 20، 🔊 14–17) بـ richtig (r) ولا falsch (f) تماماً كيفما مطبوعين فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d5-1d",
          titleDe: "1c Hören Sie noch einmal. Sind die Sätze 1–5 richtig (r) oder falsch (f)? Kreuzen Sie an. (Seite 20, 🔊 14–17)",
          titleAr: "تمرين الكتاب 1c (ص 20، 🔊 14–17): هل الجمل 1–5 صحيحة (r) أم خاطئة (f)؟",
          instructionDe: "Sind die Sätze 1–5 richtig (r) oder falsch (f)? Kreuzen Sie an.",
          instructionAr: "اختر richtig (r) أو falsch (f) لكل جملة من الجمل الخمس في تمرين 1c بالصفحة 20.",
          type: "true-false",
          items: [
            {
              id: "bt-p20-1c-1",
              labelDe: "1. Alfred und Lotte Kohlmeyer sind 60 Jahre verheiratet.",
              labelAr: "الجملة 1 في تمرين 1c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "richtig (r)",
              explanation: "Alfred und Lotte Kohlmeyer feiern Diamantene Hochzeit (60 Jahre verheiratet) -> richtig (r).",
            },
            {
              id: "bt-p20-1c-2",
              labelDe: "2. Die Eltern von Melanie leben in Berlin.",
              labelAr: "الجملة 2 في تمرين 1c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "falsch (f)",
              explanation: "Die Schwester lebt in Berlin, nicht die Eltern -> falsch (f).",
            },
            {
              id: "bt-p20-1c-3",
              labelDe: "3. Die Schwester von Melanie hat ein Baby.",
              labelAr: "الجملة 3 في تمرين 1c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "richtig (r)",
              explanation: "Melanies Schwester hat ein Baby -> richtig (r).",
            },
            {
              id: "bt-p20-1c-4",
              labelDe: "4. Die Frau von Mehmet kommt aus der Türkei.",
              labelAr: "الجملة 4 في تمرين 1c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "falsch (f)",
              explanation: "Mehmet kommt aus der Türkei, seine Frau ist Deutsche -> falsch (f).",
            },
            {
              id: "bt-p20-1c-5",
              labelDe: "5. Frau Bäuerle hat drei Kinder.",
              labelAr: "الجملة 5 في تمرين 1c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "richtig (r)",
              explanation: "Frau Bäuerle hat drei Kinder -> richtig (r).",
            },
          ],
        },
      ],
      questions: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 6: Pages 22-23 (Lektion 2 - C: Die Familie von Johann Sebastian Bach)
  // Ordered strictly left to right: Audio 18, 19, 20 (Seite 22) -> Audio 21 (Seite 23)
  // ---------------------------------------------------------------------------
  6: [
    {
      id: "listen-d6-18",
      titleDe: "Audio 18 • Seite 22 (Aufgabe 2a: Familie von Johann Sebastian Bach)",
      titleAr: "الأوديو 18 • الصفحة 22 (تمرين 2a: شجرة عائلة يوهان سيباستيان باخ)",
      situationDe:
        "Kursbuch Seite 22, Aufgabe 2a (Audio 18): Wie heißen die Familienmitglieder? Hören Sie und ergänzen Sie die Namen im Stammbaum von Johann Sebastian Bach.",
      situationAr:
        "كتاب الدروس ص 22، تمرين 2a (أوديو 18): ما هي أسماء أفراد العائلة؟ استمع وأكمل شجرة عائلة المؤلف الموسيقي يوهان سيباستيان باخ.",
      pageNumber: 22,
      audioTrackLabel: "Audio 18 • Seite 22 (Aufgabe 2a: Familie Bach)",
      youtubeVideoId: "KM_bIZJmHjo",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Erzähler",
      dialogueSpeakerB: "Historikerin",
      fullTranscriptDe:
        "Johann Sebastian Bach hatte eine sehr große Familie. Seine Eltern hießen Johann Ambrosius Bach und Maria Elisabeth Lämmerhirt.\nSeine erste Frau war Maria Barbara Bach. Ihre Kinder waren unter anderem Catharina Dorothea, Wilhelm Friedemann und Carl Philipp Emanuel.\nSeine zweite Frau hieß Anna Magdalena Wilcke. Ihre Kinder waren unter anderem Gottfried Heinrich, Elisabeth Juliane Friederica, Johann Christoph Friedrich und Johann Christian.",
      transcriptAr:
        "كانت لدى يوهان سيباستيان باخ عائلة كبيرة جداً. كان اسم والديه يوهان أمبروزيوس باخ وماريا إليزابيث ليمرهيرت.\nزوجته الأولى كانت ماريا باربارا باخ. ومن أبنائهما كاتارينا دوروتيا، فيلهلم فريدمان، وكارل فيليب إيمانويل.\nوزوجته الثانية كان اسمها آنا ماغدالينا فيلكه. ومن أبنائهما غوتفريد هاينريش، إليزابيث يوليانه، يوهان كريستوف فريدريش، ويوهان كريستيان.",
      audioLines: [
        {
          speaker: "Erzähler",
          gender: "male",
          textDe: "Seine Eltern hießen Johann Ambrosius Bach und Maria Elisabeth.",
          textAr: "كان اسم والديه يوهان أمبروزيوس باخ وماريا إليزابيث.",
        },
        {
          speaker: "Historikerin",
          gender: "female",
          textDe: "Seine erste Frau war Maria Barbara Bach. Seine zweite Frau hieß Anna Magdalena.",
          textAr: "زوجته الأولى كانت ماريا باربارا باخ، وزوجته الثانية آنا ماغدالينا.",
        },
      ],
      tipDarija:
        "تصنت مزيان فـ Audio 18 (ص 22 - تمرين 2a) لأسماء أفراد عائلة Bach باش تكمل شجرة العائلة (Eltern, 1. Frau, 2. Frau, Kinder).",
      bookTasks: [
        {
          id: "task-d6-18",
          titleDe: "2b Wie heißen die Familienmitglieder? Hören Sie und ergänzen Sie. (Seite 22, 🔊 18)",
          titleAr: "تمرين الكتاب 2b (ص 22، 🔊 18): ما أسماء أفراد عائلة يوهان سيباستيان باخ؟ استمع وأكمل الشجرة",
          instructionDe: "Wie heißen die Familienmitglieder? Hören Sie und ergänzen Sie.",
          instructionAr: "أكمل الفراغات [1] إلى [4] في شجرة عائلة باخ كما في تمرين 2b بالصفحة 22.",
          type: "fill",
          items: [
            {
              id: "bt-d6-18-1",
              labelDe: "[1] Mutter: ____________ Lämmerhirt (Vater: Johann Ambrosius Bach)",
              labelAr: "الفراغ [1] في شجرة العائلة (اسم الأم):",
              options: ["Maria Elisabeth", "Maria Barbara", "Anna Magdalena", "Catharina Dorothea"],
              correctAnswer: "Maria Elisabeth",
              explanation: "[1] Maria Elisabeth Lämmerhirt.",
            },
            {
              id: "bt-d6-18-2",
              labelDe: "[2] 1. Ehefrau: Maria ____________ Bach",
              labelAr: "الفراغ [2] في شجرة العائلة (الزوجة الأولى):",
              options: ["Barbara", "Magdalena", "Elisabeth", "Dorothea"],
              correctAnswer: "Barbara",
              explanation: "[2] Maria Barbara Bach.",
            },
            {
              id: "bt-d6-18-3",
              labelDe: "[3] 2. Ehefrau: Anna ____________ Wilcke",
              labelAr: "الفراغ [3] في شجرة العائلة (الزوجة الثانية):",
              options: ["Magdalena", "Barbara", "Elisabeth", "Friederica"],
              correctAnswer: "Magdalena",
              explanation: "[3] Anna Magdalena Wilcke.",
            },
            {
              id: "bt-d6-18-4",
              labelDe: "[4] Sohn (1714–1788): Carl ____________ Emanuel",
              labelAr: "الفراغ [4] في شجرة العائلة (الابن):",
              options: ["Philipp", "Friedemann", "Christian", "Christoph"],
              correctAnswer: "Philipp",
              explanation: "[4] Carl Philipp Emanuel Bach.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d6-18-1",
          questionDe: "Wie hieß die zweite Ehefrau von Johann Sebastian Bach?",
          questionAr: "ما هو اسم الزوجة الثانية ليوهان سيباستيان باخ؟",
          options: ["Anna Magdalena", "Maria Barbara", "Catharina Dorothea", "Maria Elisabeth"],
          correctIndex: 0,
          explanationDe: "Seine zweite Frau hieß Anna Magdalena.",
          explanationAr: "آنا ماغدالينا (Anna Magdalena).",
        },
      ],
    },
    {
      id: "listen-d6-19",
      titleDe: "Audio 19 • Seite 22 (Aufgabe 4: Wortakzent bei Zahlen und Wörtern)",
      titleAr: "الأوديو 19 • الصفحة 22 (تمرين 4: نبرة الكلمة Wortakzent)",
      situationDe:
        "Kursbuch Seite 22, Aufgabe 4 (Audio 19): Hören Sie und markieren Sie den Wortakzent (die betonte Silbe).",
      situationAr:
        "كتاب الدروس ص 22، تمرين 4 (أوديو 19): استمع وحدد مقطع النبرة الصوتية المشددة في الكلمات والأعداد.",
      pageNumber: 22,
      audioTrackLabel: "Audio 19 • Seite 22 (Aufgabe 4: Wortakzent)",
      youtubeVideoId: "weiGfVWdlLA",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecherin",
      dialogueSpeakerB: "Sprecher",
      fullTranscriptDe:
        "dreizehn – dreißig\nvierzehn – vierzig\nfünfzehn – fünfzig\nsechzehn – sechzig\nsiebzehn – siebzig\nFamilie – Eltern – Großeltern – Geschwister",
      transcriptAr:
        "dreizehn (13) – dreißig (30)\nvierzehn (14) – vierzig (40)\nfünfzehn (15) – fünfzig (50)\nsechzehn (16) – sechzig (60)\nsiebzehn (17) – siebzig (70)\nFamilie – Eltern – Großeltern – Geschwister",
      audioLines: [
        {
          speaker: "Sprecherin",
          gender: "female",
          textDe: "dreizehn – dreißig | vierzehn – vierzig | fünfzehn – fünfzig",
          textAr: "13 - 30 | 14 - 40 | 15 - 50",
        },
        {
          speaker: "Sprecher",
          gender: "male",
          textDe: "Familie (Fa-MI-li-e) – Eltern (EL-tern) – Geschwister (Ge-SCHWIS-ter)",
          textAr: "عائلة – والدان – إخوة وأخوات",
        },
      ],
      tipDarija:
        "فـ Audio 19 (ص 22 - تمرين 4) رد البال للفرق فـ النطق والنبرة (Wortakzent) ما بين نهاية -zehn و نهاية -zig ومصطلحات العائلة.",
      bookTasks: [
        {
          id: "task-d6-19",
          titleDe: "4 Wortakzent: Hören Sie und markieren Sie den Wortakzent. (Seite 22, 🔊 19)",
          titleAr: "تمرين الكتاب 4 (ص 22، 🔊 19): استمع وحدد مقطع النبرة الصوتية (Wortakzent) في الكلمات العشر",
          instructionDe: "Hören Sie und markieren Sie den Wortakzent: Deutschkurs – Entschuldigung – Familienname – Großmutter – studieren – Telefonnummer – Tochter – Urgroßeltern – verheiratet – willkommen.",
          instructionAr: "اختر المقطع المشدد (Wortakzent) لكل كلمة من الكلمات العشر في تمرين 4 بالصفحة 22.",
          type: "matching",
          items: [
            {
              id: "bt-d6-19-1",
              labelDe: "Deutschkurs (Beispiel: DEUTSCH-kurs) | Großmutter | Tochter",
              labelAr: "المقطع المشدد في Großmutter و Tochter:",
              options: [
                "GROSS-mut-ter | TOCH-ter (1. Silbe)",
                "Groß-MUT-ter | Toch-TER (2. Silbe)",
              ],
              correctAnswer: "GROSS-mut-ter | TOCH-ter (1. Silbe)",
              explanation: "النبرة على المقطع الأول: DEUTSCH-kurs, GROSS-mutter, TOCH-ter.",
            },
            {
              id: "bt-d6-19-2",
              labelDe: "Entschuldigung | Familienname | verheiratet | willkommen",
              labelAr: "المقطع المشدد في Entschuldigung و Familienname و verheiratet و willkommen:",
              options: [
                "Ent-SCHUL-di-gung | Fa-MI-li-en-na-me | ver-HEI-ra-tet | will-KOM-men (2. Silbe)",
                "ENT-schul-di-gung | FA-mi-li-en-na-me | VER-hei-ra-tet | WILL-kom-men (1. Silbe)",
              ],
              correctAnswer: "Ent-SCHUL-di-gung | Fa-MI-li-en-na-me | ver-HEI-ra-tet | will-KOM-men (2. Silbe)",
              explanation: "النبرة على المقطع الثاني: Ent-SCHUL-digung, Fa-MI-lienname, ver-HEI-ratet, will-KOM-men.",
            },
            {
              id: "bt-d6-19-3",
              labelDe: "studieren | Telefonnummer | Urgroßeltern",
              labelAr: "المقطع المشدد في studieren و Telefonnummer و Urgroßeltern:",
              options: [
                "stu-DIE-ren | TE-le-fon-num-mer | UR-groß-el-tern",
                "STU-die-ren | Te-le-FON-num-mer | Ur-GROSS-el-tern",
              ],
              correctAnswer: "stu-DIE-ren | TE-le-fon-num-mer | UR-groß-el-tern",
              explanation: "stu-DIE-ren, TE-lefonnummer, UR-großeltern.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d6-19-1",
          questionDe: "Welche Silbe wird bei 'Familie' betont?",
          questionAr: "أي مقطع صوتي يتم تشديده في كلمة 'Familie'؟",
          options: ["Fa-MI-li-e (zweite Silbe)", "FA-mi-li-e (erste Silbe)", "Fa-mi-li-E (letzte Silbe)", "Keine Silbe"],
          correctIndex: 0,
          explanationDe: "Bei 'Familie' liegt der Wortakzent auf '-mi-'.",
          explanationAr: "النبرة تكون على المقطع الثاني Fa-MI-li-e.",
        },
      ],
    },
    {
      id: "listen-d6-20",
      titleDe: "Audio 20 • Seite 22 (Aufgabe 5a: Jahreszahlen sprechen)",
      titleAr: "الأوديو 20 • الصفحة 22 (تمرين 5a: قراءة ونطق السنوات التاريخية Jahreszahlen)",
      situationDe:
        "Kursbuch Seite 22, Aufgabe 5a (Audio 20): Der lange Weg zur deutschen Einheit. Hören Sie und sprechen Sie die Jahreszahlen nach.",
      situationAr:
        "كتاب الدروس ص 22، تمرين 5a (أوديو 20): الطريق الطويل إلى الوحدة الألمانية. استمع وردد السنوات التاريخية.",
      pageNumber: 22,
      audioTrackLabel: "Audio 20 • Seite 22 (Aufgabe 5a: Jahreszahlen)",
      youtubeVideoId: "kXZSfhX8dRo",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher",
      dialogueSpeakerB: "Sprecherin",
      fullTranscriptDe:
        "1949: neunzehn-hundert-neunundvierzig\n1961: neunzehn-hundert-einundsechzig\n1989: neunzehn-hundert-neunundachtzig\n1990: neunzehn-hundert-neunzig\n2000: zweitausend\n2016: zweitausendsechzehn",
      transcriptAr:
        "1949: تسعة عشر مئة وتسعة وأربعون\n1961: تسعة عشر مئة وواحد وستون\n1989: تسعة عشر مئة وتسعة وثمانون\n1990: تسعة عشر مئة وتسعون\n2000: ألفان\n2016: ألفان وستة عشر",
      audioLines: [
        {
          speaker: "Sprecher",
          gender: "male",
          textDe: "1949 (neunzehnhundertneunundvierzig) – 1961 (neunzehnhunderteinundsechzig)",
          textAr: "سنة 1949 – سنة 1961",
        },
        {
          speaker: "Sprecherin",
          gender: "female",
          textDe: "1989 (neunzehnhundertneunundachtzig) – 1990 (neunzehnhundertneunzig)",
          textAr: "سنة 1989 (سقوط جدار برلين) – سنة 1990 (الوحدة الألمانية)",
        },
      ],
      tipDarija:
        "فـ الألمانية السنوات قبل 2000 كتقرا بالمئات: 1989 كتقرا neunzehnhundert-neunundachtzig (19 مئة و 89).",
      bookTasks: [
        {
          id: "task-d6-20",
          titleDe: "5a & 5b Jahreszahlen lesen und zuordnen (Seite 22, 🔊 20)",
          titleAr: "تمرين الكتاب 5a و 5b (ص 22، 🔊 20): نطق السنوات التاريخية وربطها بالأحداث",
          instructionDe: "Ordnen Sie den Jahreszahlen aus Aufgabe 5a die richtige Sprechweise zu.",
          instructionAr: "اختر القراءة الصحيحة لكل سنة كما وردت في التمرين 5a بالصفحة 22.",
          type: "fill",
          items: [
            {
              id: "bt-d6-20-1",
              labelDe: "1949 = ________________________ | 1961 = ________________________",
              labelAr: "قراءة سنتي 1949 و 1961:",
              options: [
                "neunzehnhundertneunundvierzig | neunzehnhunderteinundsechzig",
                "eintausendneunhundertvierzig | eintausendsechzig",
                "neunzehnvierzig | neunzehnsiebzehn",
              ],
              correctAnswer: "neunzehnhundertneunundvierzig | neunzehnhunderteinundsechzig",
              explanation: "السنوات من 1100 إلى 1999 تُقرأ بصيغة المئات: 19-hundert-49 و 19-hundert-61.",
            },
            {
              id: "bt-d6-20-2",
              labelDe: "1989 (Mauerfall) = ________________________ | 2016 = ________________________",
              labelAr: "قراءة سنتي 1989 و 2016:",
              options: [
                "neunzehnhundertneunundachtzig | zweitausendsechzehn",
                "neunzehnhundertachtundneunzig | zwanzig-hundert-sechzehn",
                "eintausendachtzig | zweitausendsechzig",
              ],
              correctAnswer: "neunzehnhundertneunundachtzig | zweitausendsechzehn",
              explanation: "1989 = neunzehnhundertneunundachtzig | ابتداءً من 2000 نقول zweitausend... (zweitausendsechzehn).",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d6-20-1",
          questionDe: "Wie spricht man die Jahreszahl 1989 auf Deutsch aus?",
          questionAr: "كيف تُنطق سنة 1989 باللغة الألمانية؟",
          options: [
            "neunzehnhundertneunundachtzig",
            "eintausendneunhundertneunundachtzig",
            "neunzehn-achtundneunzig",
            "zweitausendneunundachtzig",
          ],
          correctIndex: 0,
          explanationDe: "Jahreszahlen von 1100 bis 1999 spricht man mit '-hundert-': neunzehnhundertneunundachtzig.",
          explanationAr: "تُنطق neunzehnhundertneunundachtzig.",
        },
      ],
    },
    {
      id: "listen-d6-21",
      titleDe: "Audio 21 • Seite 23 (Aufgabe 5c: Zahlen im Alltag – Was hören Sie?)",
      titleAr: "الأوديو 21 • الصفحة 23 (تمرين 5c: الأرقام في الحياة اليومية – ماذا تسمع؟)",
      situationDe:
        "Kursbuch Seite 23, Aufgabe 5c (Audio 21): Was hören Sie? Kreuzen Sie an (Zahlen, Jahreszahlen und Preise unterscheiden).",
      situationAr:
        "كتاب الدروس ص 23، تمرين 5c (أوديو 21): ماذا تسمع؟ ضع علامة على الرقم الصحيح المسموع في كل جملة.",
      pageNumber: 23,
      audioTrackLabel: "Audio 21 • Seite 23 (Aufgabe 5c: Zahlen hören)",
      youtubeVideoId: "KjYb_ni6HKA",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher A",
      dialogueSpeakerB: "Sprecherin B",
      fullTranscriptDe:
        "1. Johann Sebastian Bach ist 1685 geboren.\n2. Meine Großmutter ist schon 84 Jahre alt.\n3. Wir wohnen in der Goethestraße 17.\n4. Meine Postleitzahl ist 80331 München.\n5. Der Kurs hat 15 Teilnehmer.",
      transcriptAr:
        "1. وُلد يوهان سيباستيان باخ عام 1685.\n2. جدتي عمرها الآن 84 عاماً.\n3. نحن نسكن في شارع غوته رقم 17.\n4. رمزي البريدي هو 80331 ميونخ.\n5. الدورة التدريبية فيها 15 مشاركاً.",
      audioLines: [
        {
          speaker: "Sprecher A",
          gender: "male",
          textDe: "1. Johann Sebastian Bach ist 1685 geboren. | 2. Meine Großmutter ist 84 Jahre alt.",
          textAr: "1. ولد باخ سنة 1685. | 2. جدتي عمرها 84 سنة.",
        },
        {
          speaker: "Sprecherin B",
          gender: "female",
          textDe: "3. Goethestraße 17. | 4. Postleitzahl 80331. | 5. 15 Teilnehmer.",
          textAr: "3. شارع غوته 17. | 4. الرمز البريدي 80331. | 5. 15 مشاركاً.",
        },
      ],
      tipDarija:
        "تصنت مزيان فـ Audio 21 (ص 23 - تمرين 5c) وفرّق بين الأرقام المتشابهة بحال 15 و 50، أو 48 و 84، أو السنوات بحال 1685.",
      bookTasks: [
        {
          id: "task-d6-21",
          titleDe: "5c Was hören Sie? Kreuzen Sie an. (Seite 23, 🔊 21)",
          titleAr: "تمرين الكتاب 5c (ص 23، 🔊 21): ماذا تسمع؟ ضع علامة على السنة المسموعة في كل سطر (1–6)",
          instructionDe: "Was hören Sie? Kreuzen Sie an.",
          instructionAr: "اختر السنة المسموعة في كل سطر من 1 إلى 6 تماماً كما في تمرين 5c بالصفحة 23.",
          type: "matching",
          items: [
            {
              id: "bt-d6-21-1",
              labelDe: "1.",
              labelAr: "السطر 1 في تمرين 5c:",
              options: ["1499", "1949", "1994"],
              correctAnswer: "1949",
              explanation: "neunzehnhundertneunundvierzig = 1949.",
            },
            {
              id: "bt-d6-21-2",
              labelDe: "2.",
              labelAr: "السطر 2 في تمرين 5c:",
              options: ["1955", "1965", "1975"],
              correctAnswer: "1955",
              explanation: "neunzehnhundertfünfundfünfzig = 1955.",
            },
            {
              id: "bt-d6-21-3",
              labelDe: "3.",
              labelAr: "السطر 3 في تمرين 5c:",
              options: ["1916", "1960", "1961"],
              correctAnswer: "1961",
              explanation: "neunzehnhunderteinundsechzig = 1961.",
            },
            {
              id: "bt-d6-21-4",
              labelDe: "4.",
              labelAr: "السطر 4 في تمرين 5c:",
              options: ["1875", "1975", "1957"],
              correctAnswer: "1975",
              explanation: "neunzehnhundertfünfundsiebzig = 1975.",
            },
            {
              id: "bt-d6-21-5",
              labelDe: "5.",
              labelAr: "السطر 5 في تمرين 5c:",
              options: ["1989", "1998", "1899"],
              correctAnswer: "1989",
              explanation: "neunzehnhundertneunundachtzig = 1989.",
            },
            {
              id: "bt-d6-21-6",
              labelDe: "6.",
              labelAr: "السطر 6 في تمرين 5c:",
              options: ["2006", "2016", "2060"],
              correctAnswer: "2016",
              explanation: "zweitausendsechzehn = 2016.",
            },
          ],
        },
      ],
      questions: [
        {
          id: "q-d6-21-1",
          questionDe: "Wann wurde Johann Sebastian Bach geboren?",
          questionAr: "في أي عام وُلد يوهان سيباستيان باخ؟",
          options: ["1685", "1658", "1750", "1865"],
          correctIndex: 0,
          explanationDe: "1685 (sechzehnhundertfünfundachtzig).",
          explanationAr: "عام 1685.",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 7: Pages 26-27 (Lektion 3 - A: Alles hat seinen Preis)
  // Ordered strictly left to right: Audio 22 (Seite 26) -> Audio 23, 24, 25 (Seite 27)
  // ---------------------------------------------------------------------------
  7: [
    {
      id: "listen-d7-22",
      titleDe: "Audio 22 • Seite 26 (Aufgabe 2b & 2c: Hören Sie Teil 1 vom Gespräch zwischen Franziska und Niels)",
      titleAr: "الأوديو 22 • الصفحة 26 (تمرين 2b و 2c: الجزء 1 من حوار فرانشيسكا ونيلز – صح أم خطأ؟)",
      situationDe:
        "Kursbuch Seite 26, Aufgabe 2b & 2c (🔊 22): Hören Sie Teil 1 vom Gespräch zwischen Franziska und Niels. Sind die Sätze 1–4 richtig (r) oder falsch (f)? Kreuzen Sie an.",
      situationAr:
        "كتاب الدروس ص 26، تمرين 2b و 2c (🔊 أوديو 22): استمع للجزء الأول من حوار فرانشيسكا ونيلز وحدد هل الجمل 1–4 صحيحة (r) أم خاطئة (f).",
      pageNumber: 26,
      audioTrackLabel: "Audio 22 • Seite 26 (Aufgabe 2b & 2c: Teil 1)",
      youtubeVideoId: "fvXhQuHzBTQ",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Franziska",
      dialogueSpeakerB: "Niels",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "جاوب على تمرين 2b وتمرين 2c (ص 26، 🔊 22) تماماً كيفما مطبوعين فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d7-22",
          titleDe: "2b & 2c Hören Sie Teil 1 vom Gespräch zwischen Franziska und Niels. Sind die Sätze 1–4 richtig (r) oder falsch (f)? Kreuzen Sie an. (Seite 26, 🔊 22)",
          titleAr: "تمرين الكتاب 2b و 2c (ص 26، 🔊 22): هل الجمل 1–4 صحيحة (r) أم خاطئة (f)؟",
          instructionDe: "Sind die Sätze 1–4 richtig (r) oder falsch (f)? Kreuzen Sie an.",
          instructionAr: "اختر richtig (r) أو falsch (f) لكل جملة كما في تمرين 2b و 2c بالصفحة 26.",
          type: "true-false",
          items: [
            {
              id: "bt-d7-22-0",
              labelDe: "2b: Warum sprechen sie über Geld? — Franziska hat im Monat ____ Euro. Ihre Ausgaben sind ca. ____ Euro.",
              labelAr: "تمرين 2b: دخل فرانشيسكا الشهري ومصاريفها:",
              options: ["820 Euro | 820 Euro", "1000 Euro | 500 Euro", "600 Euro | 900 Euro"],
              correctAnswer: "820 Euro | 820 Euro",
              explanation: "Franziska hat 820 Euro im Monat und ihre Ausgaben sind auch ca. 820 Euro.",
            },
            {
              id: "bt-d7-22-1",
              labelDe: "1. Franziska möchte ein Fahrrad kaufen.",
              labelAr: "الجملة 1 في تمرين 2c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "falsch (f)",
              explanation: "Sie möchte ein Auto kaufen, kein Fahrrad -> falsch (f).",
            },
            {
              id: "bt-d7-22-2",
              labelDe: "2. Die Eltern von Franziska zahlen die Miete für das WG-Zimmer.",
              labelAr: "الجملة 2 في تمرين 2c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "richtig (r)",
              explanation: "Ihre Eltern zahlen die Miete -> richtig (r).",
            },
            {
              id: "bt-d7-22-3",
              labelDe: "3. Franziska kauft viele Bücher.",
              labelAr: "الجملة 3 في تمرين 2c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "falsch (f)",
              explanation: "Sie kauft nicht viele Bücher -> falsch (f).",
            },
            {
              id: "bt-d7-22-4",
              labelDe: "4. Franziska geht nicht oft ins Café.",
              labelAr: "الجملة 4 في تمرين 2c:",
              options: ["richtig (r)", "falsch (f)"],
              correctAnswer: "falsch (f)",
              explanation: "Sie geht oft ins Café -> falsch (f).",
            },
          ],
        },
      ],
      questions: [],
    },
    {
      id: "listen-d7-23",
      titleDe: "Audio 23 • Seite 26 (Aufgabe 2d: Hören Sie Teil 2 vom Gespräch und kreuzen Sie an)",
      titleAr: "الأوديو 23 • الصفحة 26 (تمرين 2d: الجزء 2 من الحوار – ضع علامة a أو b)",
      situationDe:
        "Kursbuch Seite 26, Aufgabe 2d (🔊 23): Hören Sie Teil 2 vom Gespräch und kreuzen Sie an.",
      situationAr:
        "كتاب الدروس ص 26، تمرين 2d (🔊 أوديو 23): استمع للجزء الثاني من الحوار وضع علامة على التكملة الصحيحة (a أو b).",
      pageNumber: 26,
      audioTrackLabel: "Audio 23 • Seite 26 (Aufgabe 2d: Teil 2)",
      youtubeVideoId: "frOJpu0e9xs",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Franziska",
      dialogueSpeakerB: "Niels",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "جاوب على تمرين 2d (ص 26، 🔊 23) تماماً كيفما مطبوع فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d7-23",
          titleDe: "2d Hören Sie Teil 2 vom Gespräch und kreuzen Sie an. (Seite 26, 🔊 23)",
          titleAr: "تمرين الكتاب 2d (ص 26، 🔊 23): استمع للجزء الثاني من الحوار وضع علامة (a أو b)",
          instructionDe: "Hören Sie Teil 2 vom Gespräch und kreuzen Sie an.",
          instructionAr: "اختر الإجابة الصحيحة (a أو b) للجمل 1 و 2 و 3 كما في تمرين 2d بالصفحة 26.",
          type: "matching",
          items: [
            {
              id: "bt-d7-23-1",
              labelDe: "1. Niels hat ein Auto von ...",
              labelAr: "السؤال 1 في تمرين 2d:",
              options: ["a. Oma.", "b. Opa."],
              correctAnswer: "a. Oma.",
              explanation: "Niels hat ein Auto von Oma.",
            },
            {
              id: "bt-d7-23-2",
              labelDe: "2. Niels jobbt ...",
              labelAr: "السؤال 2 في تمرين 2d:",
              options: ["a. im Supermarkt.", "b. im Copyshop."],
              correctAnswer: "b. im Copyshop.",
              explanation: "Niels jobbt im Copyshop.",
            },
            {
              id: "bt-d7-23-3",
              labelDe: "3. Franziska möchte ...",
              labelAr: "السؤال 3 في تمرين 2d:",
              options: ["a. im Supermarkt jobben.", "b. nicht jobben."],
              correctAnswer: "a. im Supermarkt jobben.",
              explanation: "Franziska möchte im Supermarkt jobben.",
            },
          ],
        },
      ],
      questions: [],
    },
    {
      id: "listen-d7-24",
      titleDe: "Audio 24 • Seite 26 (Aufgabe 3b: Hören Sie die Preise und sprechen Sie nach)",
      titleAr: "الأوديو 24 • الصفحة 26 (تمرين 3b: استمع للأسعار ورددها)",
      situationDe:
        "Kursbuch Seite 26, Aufgabe 3b (🔊 24): Hören Sie die Preise und sprechen Sie nach.",
      situationAr:
        "كتاب الدروس ص 26، تمرين 3b (🔊 أوديو 24): استمع للأسعار المطبوعة في تمرين 3b ورددها.",
      pageNumber: 26,
      audioTrackLabel: "Audio 24 • Seite 26 (Aufgabe 3b: Preise)",
      youtubeVideoId: "X8SVssGsR5U",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher",
      dialogueSpeakerB: "Sprecherin",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "تصنت لـ Audio 24 (ص 26، تمرين 3b) وعاود نطق الأثمنة كيفما مكتوبين فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d7-24",
          titleDe: "3b Hören Sie die Preise und sprechen Sie nach. (Seite 26, 🔊 24)",
          titleAr: "تمرين الكتاب 3b (ص 26، 🔊 24): استمع للأسعار في تمرين 3b",
          instructionDe: "Hören Sie die Preise: 0,09 € | 0,99 € | 2,19 € | 19,99 € | 112,00 €.",
          instructionAr: "طابق الأسعار المطبوعة في تمرين 3b بالصفحة 26 بطريقة قراءتها الصحيحة.",
          type: "matching",
          items: [
            {
              id: "bt-d7-24-1",
              labelDe: "0,09 € | 0,99 €",
              labelAr: "قراءة السنتات في تمرين 3b:",
              options: ["neun Cent | neunundneunzig Cent", "neunzig Cent | neunzehn Cent"],
              correctAnswer: "neun Cent | neunundneunzig Cent",
              explanation: "0,09 € = neun Cent | 0,99 € = neunundneunzig Cent.",
            },
            {
              id: "bt-d7-24-2",
              labelDe: "2,19 € | 19,99 € | 112,00 €",
              labelAr: "قراءة الأسعار باليورو والسنت في تمرين 3b:",
              options: [
                "zwei Euro neunzehn | neunzehn Euro neunundneunzig | einhundertzwölf Euro",
                "zwei Euro neunzig | neunzig Euro neunzehn | einhundertzwei Euro",
              ],
              correctAnswer: "zwei Euro neunzehn | neunzehn Euro neunundneunzig | einhundertzwölf Euro",
              explanation: "2,19 € = zwei Euro neunzehn | 19,99 € = neunzehn Euro neunundneunzig | 112,00 € = (ein)hundertzwölf Euro.",
            },
          ],
        },
      ],
      questions: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 8: Pages 28-29 (Lektion 3 - B: Ein Einkauf für die WG)
  // Ordered strictly left to right: Audio 25, 26 (Seite 28) -> Audio 27 (Seite 29)
  // ---------------------------------------------------------------------------
  8: [
    {
      id: "listen-d8-25",
      titleDe: "Audio 25 • Seite 28 (Aufgabe 1a: Hören Sie das Gespräch von Clara und Franziska. Was ist richtig: a oder b?)",
      titleAr: "الأوديو 25 • الصفحة 28 (تمرين 1a: حوار كلارا وفرانشيسكا – ما الصحيح: a أم b؟)",
      situationDe:
        "Kursbuch Seite 28, Aufgabe 1a (🔊 25): Hören Sie das Gespräch von Clara und Franziska. Was ist richtig: a oder b? Kreuzen Sie an.",
      situationAr:
        "كتاب الدروس ص 28، تمرين 1a (🔊 أوديو 25): استمع لحوار كلارا وفرانشيسكا وضع علامة على الجواب الصحيح (a أو b).",
      pageNumber: 28,
      audioTrackLabel: "Audio 25 • Seite 28 (Aufgabe 1a: Clara und Franziska)",
      youtubeVideoId: "gJpapZp4nUs",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Clara",
      dialogueSpeakerB: "Franziska",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "جاوب على تمرين 1a (ص 28، 🔊 25) تماماً كيفما مطبوع فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d8-25",
          titleDe: "1a Hören Sie das Gespräch von Clara und Franziska. Was ist richtig: a oder b? Kreuzen Sie an. (Seite 28, 🔊 25)",
          titleAr: "تمرين الكتاب 1a (ص 28، 🔊 25): ما الصحيح (a أم b)؟ ضع علامة",
          instructionDe: "Was ist richtig: a oder b? Kreuzen Sie an.",
          instructionAr: "اختر الإجابة الصحيحة (a أو b) للجمل 1 و 2 و 3 كما في تمرين 1a بالصفحة 28.",
          type: "matching",
          items: [
            {
              id: "bt-d8-25-1",
              labelDe: "1. Clara und Franziska ...",
              labelAr: "السؤال 1 في تمرين 1a:",
              options: ["a. jobben im Supermarkt.", "b. kaufen im Supermarkt ein."],
              correctAnswer: "a. jobben im Supermarkt.",
              explanation: "Clara und Franziska jobben im Supermarkt.",
            },
            {
              id: "bt-d8-25-2",
              labelDe: "2. Franziska arbeitet am Freitag ...",
              labelAr: "السؤال 2 في تمرين 1a:",
              options: ["a. 5 Stunden.", "b. 6 Stunden."],
              correctAnswer: "b. 6 Stunden.",
              explanation: "Franziska arbeitet am Freitag 6 Stunden.",
            },
            {
              id: "bt-d8-25-3",
              labelDe: "3. Der Supermarkt schließt ...",
              labelAr: "السؤال 3 في تمرين 1a:",
              options: ["a. um 20 Uhr.", "b. um 22 Uhr."],
              correctAnswer: "a. um 20 Uhr.",
              explanation: "Der Supermarkt schließt um 20 Uhr.",
            },
          ],
        },
      ],
      questions: [],
    },
    {
      id: "listen-d8-26",
      titleDe: "Audio 26 • Seite 28 (Aufgabe 1b: Hören Sie das Gespräch von Franziska und Oma Martha)",
      titleAr: "الأوديو 26 • الصفحة 28 (تمرين 1b: حوار فرانشيسكا والجدة مارتا – المواد الغذائية على الصفحة 27)",
      situationDe:
        "Kursbuch Seite 28, Aufgabe 1b (🔊 26): Hören Sie das Gespräch von Franziska und Oma Martha. Über welche Lebensmittel sprechen sie? Kreuzen Sie auf dem Prospekt auf Seite 27 an.",
      situationAr:
        "كتاب الدروس ص 28، تمرين 1b (🔊 أوديو 26): استمع لحوار فرانشيسكا والجدة مارتا. عن أي مواد غذائية تتحدثان؟",
      pageNumber: 28,
      audioTrackLabel: "Audio 26 • Seite 28 (Aufgabe 1b: Franziska & Oma Martha)",
      youtubeVideoId: "VTS5eo2MtX8",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Franziska",
      dialogueSpeakerB: "Oma Martha",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "جاوب على تمرين 1b (ص 28، 🔊 26) تماماً كيفما مطبوع فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d8-26",
          titleDe: "1b Hören Sie das Gespräch von Franziska und Oma Martha. Über welche Lebensmittel sprechen sie? Kreuzen Sie auf dem Prospekt auf Seite 27 an. (Seite 28, 🔊 26)",
          titleAr: "تمرين الكتاب 1b (ص 28، 🔊 26): عن أي مواد غذائية تتحدث فرانشيسكا والجدة مارتا في المنشور (ص 27)؟",
          instructionDe: "Über welche Lebensmittel sprechen sie? Kreuzen Sie an.",
          instructionAr: "اختر المواد الغذائية المسموعة في الحوار كما في تمرين 1b بالصفحة 28.",
          type: "matching",
          items: [
            {
              id: "bt-d8-26-1",
              labelDe: "Über welche Lebensmittel auf dem Prospekt (Seite 27) sprechen Franziska und Oma Martha?",
              labelAr: "المواد الغذائية المذكورة في الأوديو 26:",
              options: [
                "Rindersteak, Hähnchen, Tomaten, Olivenöl, Eis, Kaffee, Orangensaft, Kartoffeln",
                "Nur Brot, Butter und Salz",
                "Nur Fisch, Tee und Reis",
              ],
              correctAnswer: "Rindersteak, Hähnchen, Tomaten, Olivenöl, Eis, Kaffee, Orangensaft, Kartoffeln",
              explanation: "Sie sprechen über Rindersteak, Hähnchen, Tomaten, Olivenöl, Eis, Kaffee, Orangensaft und Kartoffeln.",
            },
          ],
        },
      ],
      questions: [],
    },
    {
      id: "listen-d8-27",
      titleDe: "Audio 27 • Seite 29 (Aufgabe 3c: Hören Sie das Gespräch im Supermarkt und vergleichen Sie)",
      titleAr: "الأوديو 27 • الصفحة 29 (تمرين 3b و 3c: ترتيب الحوار في السوبرماركت والاستماع للمقارنة)",
      situationDe:
        "Kursbuch Seite 29, Aufgabe 3b & 3c (🔊 27): Was passt zusammen? Kombinieren Sie. Hören Sie dann das Gespräch im Supermarkt und vergleichen Sie.",
      situationAr:
        "كتاب الدروس ص 29، تمرين 3b و 3c (🔊 أوديو 27): اربط الأسئلة بالأجوبة، ثم استمع للحوار في السوبرماركت وقارن.",
      pageNumber: 29,
      audioTrackLabel: "Audio 27 • Seite 29 (Aufgabe 3c: Gespräch im Supermarkt)",
      youtubeVideoId: "HQMciFgWNlM",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Kundin",
      dialogueSpeakerB: "Mitarbeiter",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "جاوب على تمرين 3b/3c (ص 29، 🔊 27) تماماً كيفما مطبوع فـ الكتاب (المثال 1–d محلول فـ الكتاب)!",
      bookTasks: [
        {
          id: "task-d8-27",
          titleDe: "3b & 3c Was passt zusammen? Kombinieren Sie. Hören Sie dann das Gespräch im Supermarkt und vergleichen Sie. (Seite 29, 🔊 27)",
          titleAr: "تمرين الكتاب 3b و 3c (ص 29، 🔊 27): اربط الجمل (1–5) بالأجوبة (a–e) ثم استمع وقارن (المثال 1–d محلول)",
          instructionDe: "Kombinieren Sie 1–5 mit a–e und hören Sie zur Kontrolle.",
          instructionAr: "اختر الحرف الصحيح (a, b, c, e) لكل جملة كما في تمرين 3b/3c بالصفحة 29.",
          type: "matching",
          items: [
            {
              id: "bt-d8-27-1",
              labelDe: "2. Brauchen wir noch Milch?",
              labelAr: "السؤال 2 في تمرين 3b:",
              options: [
                "a. Nein, wir haben noch zwei Liter.",
                "b. Ja, bitte. 100 Gramm.",
                "c. Hier, bitte. Noch etwas?",
                "e. Ja, sehr gern. Ich liebe Bananen.",
              ],
              correctAnswer: "a. Nein, wir haben noch zwei Liter.",
              explanation: "2 -> a: Brauchen wir noch Milch? – Nein, wir haben noch zwei Liter.",
            },
            {
              id: "bt-d8-27-2",
              labelDe: "3. Ich möchte gern den Bergkäse.",
              labelAr: "الجملة 3 في تمرين 3b:",
              options: [
                "a. Nein, wir haben noch zwei Liter.",
                "b. Ja, bitte. 100 Gramm.",
                "c. Hier, bitte. Noch etwas?",
                "e. Ja, sehr gern. Ich liebe Bananen.",
              ],
              correctAnswer: "c. Hier, bitte. Noch etwas?",
              explanation: "3 -> c: Ich möchte gern den Bergkäse. – Hier, bitte. Noch etwas?",
            },
            {
              id: "bt-d8-27-3",
              labelDe: "4. Möchtest du auch den Emmentaler?",
              labelAr: "السؤال 4 في تمرين 3b:",
              options: [
                "a. Nein, wir haben noch zwei Liter.",
                "b. Ja, bitte. 100 Gramm.",
                "c. Hier, bitte. Noch etwas?",
                "e. Ja, sehr gern. Ich liebe Bananen.",
              ],
              correctAnswer: "b. Ja, bitte. 100 Gramm.",
              explanation: "4 -> b: Möchtest du auch den Emmentaler? – Ja, bitte. 100 Gramm.",
            },
            {
              id: "bt-d8-27-4",
              labelDe: "5. Kaufst du noch Obst?",
              labelAr: "السؤال 5 في تمرين 3b:",
              options: [
                "a. Nein, wir haben noch zwei Liter.",
                "b. Ja, bitte. 100 Gramm.",
                "c. Hier, bitte. Noch etwas?",
                "e. Ja, sehr gern. Ich liebe Bananen.",
              ],
              correctAnswer: "e. Ja, sehr gern. Ich liebe Bananen.",
              explanation: "5 -> e: Kaufst du noch Obst? – Ja, sehr gern. Ich liebe Bananen.",
            },
          ],
        },
      ],
      questions: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY 9: Pages 30-31 (Lektion 3 - C: Guten Appetit!)
  // Ordered strictly left to right: Audio 28 (Seite 30) -> Audio 29, 30 (Seite 31)
  // ---------------------------------------------------------------------------
  9: [
    {
      id: "listen-d9-28",
      titleDe: "Audio 28 • Seite 30 (Aufgabe 2b: Was kaufen sie noch ein? Hören Sie das Telefongespräch und notieren Sie)",
      titleAr: "الأوديو 28 • الصفحة 30 (تمرين 2b: ماذا يشترون أيضاً؟ استمع للمكالمة الهاتفية ودون المشتريات)",
      situationDe:
        "Kursbuch Seite 30, Aufgabe 2b (🔊 28): Was kaufen sie noch ein? Hören Sie das Telefongespräch und notieren Sie.",
      situationAr:
        "كتاب الدروس ص 30، تمرين 2b (🔊 أوديو 28): ماذا يشترون أيضاً لتحضير العشاء (Geschnetzeltes Zürcher Art)؟ استمع للمكالمة الهاتفية ودون المشتريات.",
      pageNumber: 30,
      audioTrackLabel: "Audio 28 • Seite 30 (Aufgabe 2b: Telefongespräch)",
      youtubeVideoId: "lAlGKhD4lH8",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Niels",
      dialogueSpeakerB: "Franziska",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "جاوب على تمرين 2b (ص 30، 🔊 28) تماماً كيفما مطبوع فـ الكتاب!",
      bookTasks: [
        {
          id: "task-d9-28",
          titleDe: "2b Was kaufen sie noch ein? Hören Sie das Telefongespräch und notieren Sie. (Seite 30, 🔊 28)",
          titleAr: "تمرين الكتاب 2b (ص 30، 🔊 28): ماذا يشترون أيضاً؟ استمع للمكالمة الهاتفية ودون المشتريات",
          instructionDe: "Was kaufen sie noch ein? Hören Sie das Telefongespräch und notieren Sie.",
          instructionAr: "اختر المكونات التي لا تزال ناقصة ويجب شراؤها كما في تمرين 2b بالصفحة 30.",
          type: "matching",
          items: [
            {
              id: "bt-d9-28-1",
              labelDe: "Was kaufen sie noch für das Abendessen (Geschnetzeltes Zürcher Art mit Rösti) ein?",
              labelAr: "المكونات التي سيشترونها حسب المكالمة الهاتفية في تمرين 2b:",
              options: [
                "Kalbfleisch (600 g), Champignons (200 g), Sahne (400 g) und Kartoffeln",
                "Nur Salz, Pfeffer und Wasser",
                "Fisch, Reis und Bananen",
              ],
              correctAnswer: "Kalbfleisch (600 g), Champignons (200 g), Sahne (400 g) und Kartoffeln",
              explanation: "Sie kaufen noch Kalbfleisch, Champignons, Sahne und Kartoffeln ein (Butter, Zwiebeln, Öl, Salz und Pfeffer sind schon da).",
            },
          ],
        },
      ],
      questions: [],
    },
    {
      id: "listen-d9-29",
      titleDe: "Audio 29 • Seite 31 (Aufgabe 5a: Satzmelodie – Hören Sie und sprechen Sie nach)",
      titleAr: "الأوديو 29 • الصفحة 31 (تمرين 5a: نغمة الجملة Satzmelodie – استمع وردد)",
      situationDe:
        "Kursbuch Seite 31, Aufgabe 5a (🔊 29): Satzmelodie. Hören Sie und sprechen Sie nach (↘ W-Fragen & Aussagesätze / ↗ Ja-/Nein-Fragen).",
      situationAr:
        "كتاب الدروس ص 31، تمرين 5a (🔊 أوديو 29): نغمة الجملة (Satzmelodie) في الأسئلة والجمل الخبرية.",
      pageNumber: 31,
      audioTrackLabel: "Audio 29 • Seite 31 (Aufgabe 5a: Satzmelodie)",
      youtubeVideoId: "V9MFUHmaX-E",
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecherin",
      dialogueSpeakerB: "Sprecher",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija:
        "تصنت لـ Audio 29 (ص 31، تمرين 5a) ورد البال لاتجاه الصوت فـ آخر الجملة (↘ هابط أو ↗ طالع)!",
      bookTasks: [
        {
          id: "task-d9-29",
          titleDe: "5a & 5b Satzmelodie: Hören Sie und markieren Sie: ↘ oder ↗? (Seite 31, 🔊 29 & 🔊 30)",
          titleAr: "تمرين الكتاب 5a و 5b (ص 31، 🔊 29 و 30): حدد اتجاه نغمة الجملة (↘ هابطة أم ↗ صاعدة) للجمل 1–5",
          instructionDe: "Hören Sie die Gespräche und markieren Sie die Satzmelodie: ↘ oder ↗?",
          instructionAr: "اختر اتجاه نغمة الجملة (↘ أو ↗) للجمل 1 إلى 5 تماماً كما في تمرين 5b بالصفحة 31.",
          type: "matching",
          items: [
            {
              id: "bt-d9-29-1",
              labelDe: "1. ● Was möchtest du essen? [ ____ ] — ○ Ich weiß noch nicht. [ ____ ]",
              labelAr: "السطر 1 في تمرين 5b (سؤال بـ W وجملة خبرية):",
              options: ["↘ | ↘", "↗ | ↗", "↗ | ↘"],
              correctAnswer: "↘ | ↘",
              explanation: "W-Frage (↘) und Aussagesatz (↘).",
            },
            {
              id: "bt-d9-29-2",
              labelDe: "2. ● Kaufst du noch Obst? [ ____ ] — ○ Ja, sehr gern. [ ____ ] Ich liebe Bananen. [ ____ ]",
              labelAr: "السطر 2 في تمرين 5b (سؤال نعم/لا متبوع بجواب خبري):",
              options: ["↗ | ↘ | ↘", "↘ | ↗ | ↗", "↘ | ↘ | ↗"],
              correctAnswer: "↗ | ↘ | ↘",
              explanation: "Ja-/Nein-Frage (↗), Aussagesätze (↘).",
            },
            {
              id: "bt-d9-29-3",
              labelDe: "3. ● Brauchen wir noch Milch? [ ____ ] — ○ Nein, wir haben noch zwei Liter. [ ____ ]",
              labelAr: "السطر 3 في تمرين 5b:",
              options: ["↗ | ↘", "↘ | ↗", "↗ | ↗"],
              correctAnswer: "↗ | ↘",
              explanation: "Ja-/Nein-Frage (↗) und Antwort (↘).",
            },
            {
              id: "bt-d9-29-4",
              labelDe: "4. ● Wie viel kostet das Rindersteak? [ ____ ] — ○ 1,99 Euro. [ ____ ]\n5. ● Essen wir heute Abend zusammen? [ ____ ] — ○ Ja, gern. [ ____ ]",
              labelAr: "السطران 4 و 5 في تمرين 5b:",
              options: ["4: ↘ | ↘ — 5: ↗ | ↘", "4: ↗ | ↗ — 5: ↘ | ↗"],
              correctAnswer: "4: ↘ | ↘ — 5: ↗ | ↘",
              explanation: "4 ist eine W-Frage (↘), 5 ist eine Ja-/Nein-Frage (↗).",
            },
          ],
        },
      ],
      questions: [],
    },
  ],
};

// Map of Track Numbers (30..88) to their exact YouTube Video IDs in the DaF kompakt A1 playlist
const DAF_TRACK_VIDEO_IDS: Record<number, string> = {
  30: "kORzJ2ffiVk",
  31: "DkAbnSzk4XM",
  32: "fbVJqcdykpM",
  33: "c58Lj_FTYTU",
  34: "AVqeFJBWclc",
  35: "3e0rjJPdBSA",
  36: "pGock019q-o",
  37: "zU5mUUoxLho",
  38: "6Ralu0-fLxE",
  39: "wSJ8T4QNHUg",
  40: "f6ONrU-4JtE",
  41: "U0gJfne6JU0",
  42: "fzWrJwaSg4g",
  43: "DjGb0fp15Sw",
  44: "W1zoSO9pulI",
  45: "tLtk-KSBoik",
  46: "uw2khSpUJ50",
  47: "5qvks5Iru5k",
  48: "Xw_HZ2ZXph0",
  49: "vLGviBxtz7c",
  50: "vad87RQLWrs",
  51: "59cG5FdhgVk",
  52: "Gn3SVJUBkqs",
  53: "Zt00FCtY8dE",
  54: "LvMkN0hPkeI",
  55: "uwNxPj_8rtc",
  56: "3hZ6LdUv_bw",
  57: "KwD1Z7C3PaI",
  58: "dpODvuZtXeI",
  59: "OR-K4Z748m8",
  60: "h1dzGO1O_iM",
  61: "BmRmsuQCNCI",
  62: "c9JNHIw1J_4",
  63: "wGFX-ZvM8dw",
  64: "v7QIxo1fB84",
  65: "5zvL4ixH-1Y",
  66: "K90e6tiul0o",
  67: "eKpmRQ_cYgg",
  68: "1FCIRT9XrjY",
  69: "QND2coOy7pI",
  71: "9VNF66kYkZI",
  72: "njQUuCRIQAU",
  73: "AGMh-cX5_wo",
  74: "6AdzRJCpKEU",
  75: "htjllwyY43A",
  76: "TlqCZ9y8IU8",
  77: "AtBSYW_-cKQ",
  78: "dKkUUkdvOXo",
  79: "JTCZvHApW7M",
  80: "rmtQuqftPl8",
  81: "Grl5y_t6ycs",
  82: "5FhcFIn70QI",
  83: "__ww-B7kDyw",
  84: "-LMrt8uMD2o",
  85: "feG3fnqgSW0",
  86: "DyZsEFjv6w0",
};

// Authentic Kursbuch tasks per page for Lektionen 4–8 (Pages 34–71)
const PAGE_BOOK_TASKS: Record<number, {
  tracks: number[];
  titleDe: string;
  titleAr: string;
  instructionDe: string;
  instructionAr: string;
  items: Array<{
    labelDe: string;
    labelAr: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}> = {
  34: {
    tracks: [31],
    titleDe: "1b Hören Sie den Radiobeitrag und kreuzen Sie an: richtig (r) oder falsch (f)? (Seite 34, 🔊 31)",
    titleAr: "تمرين الكتاب 1b (ص 34، 🔊 31): استمع للتقرير الإذاعي وضع علامة: صحيح (r) أم خاطئ (f)؟",
    instructionDe: "Hören Sie den Radiobeitrag und kreuzen Sie an: richtig (r) oder falsch (f)?",
    instructionAr: "اختر richtig (r) أو falsch (f) لكل جملة من الجمل 1 إلى 6 كما في تمرين 1b بالصفحة 34.",
    items: [
      {
        labelDe: "1. Die Lebensqualität in München ist sehr gut.",
        labelAr: "الجملة 1 في تمرين 1b:",
        options: ["richtig (r)", "falsch (f)"],
        correctAnswer: "richtig (r)",
        explanation: "Die Lebensqualität in München ist sehr gut -> richtig (r).",
      },
      {
        labelDe: "2. Das Oktoberfest ist ein Fest im Winter.",
        labelAr: "الجملة 2 في تمرين 1b:",
        options: ["richtig (r)", "falsch (f)"],
        correctAnswer: "falsch (f)",
        explanation: "Das Oktoberfest ist im Herbst (September/Oktober), nicht im Winter -> falsch (f).",
      },
      {
        labelDe: "3. In München gibt es sechs Biergärten.",
        labelAr: "الجملة 3 في تمرين 1b:",
        options: ["richtig (r)", "falsch (f)"],
        correctAnswer: "falsch (f)",
        explanation: "Es gibt sechs Brauereien und sehr viele Biergärten -> falsch (f).",
      },
      {
        labelDe: "4. Im Englischen Garten kann man surfen.",
        labelAr: "الجملة 4 في تمرين 1b:",
        options: ["richtig (r)", "falsch (f)"],
        correctAnswer: "richtig (r)",
        explanation: "Auf dem Eisbach im Englischen Garten kann man surfen -> richtig (r).",
      },
      {
        labelDe: "5. Der Viktualienmarkt ist im Zentrum von München.",
        labelAr: "الجملة 5 في تمرين 1b:",
        options: ["richtig (r)", "falsch (f)"],
        correctAnswer: "richtig (r)",
        explanation: "Der Viktualienmarkt liegt mitten im Zentrum -> richtig (r).",
      },
      {
        labelDe: "6. Auf dem Viktualienmarkt kann man nur Obst und Gemüse kaufen.",
        labelAr: "الجملة 6 في تمرين 1b:",
        options: ["richtig (r)", "falsch (f)"],
        correctAnswer: "falsch (f)",
        explanation: "Man kann dort auch Käse, Fisch, Fleisch, Blumen usw. kaufen -> falsch (f).",
      },
    ],
  },
  35: {
    tracks: [31],
    titleDe: "1b Hören Sie den Radiobeitrag über München noch einmal (Seite 34–35, 🔊 31)",
    titleAr: "تمرين الاستماع (ص 34–35، 🔊 31): مراجعة عبارات التقرير الإذاعي حول ميونخ",
    instructionDe: "Welche Aussagen aus dem Radiobeitrag (🔊 31) passen?",
    instructionAr: "اختر التكملة الصحيحة حسب التقرير الإذاعي عن مدينة ميونخ.",
    items: [
      {
        labelDe: "Im Englischen Garten ________ man surfen, und auf dem Viktualienmarkt ________ man gut einkaufen.",
        labelAr: "استخدام الفعل المساعد kann في التقرير الإذاعي:",
        options: ["kann | kann", "muss | darf", "wollen | können"],
        correctAnswer: "kann | kann",
        explanation: "man kann surfen / man kann gut einkaufen.",
      },
    ],
  },
  36: {
    tracks: [32, 33, 34, 35],
    titleDe: "2a & 3b Hören Sie die Uhrzeiten und das Telefongespräch von Anna und Jakob (Seite 36, 🔊 32–35)",
    titleAr: "تمرين الكتاب 2a و 3b و 3c (ص 36، 🔊 32–35): قراءة الساعة والمكالمة الهاتفية بين آنا وياكوب",
    instructionDe: "3b & 3c: Hören Sie das Telefongespräch von Anna und Jakob. Was wollen sie machen? Ergänzen Sie.",
    instructionAr: "أجب عن تمرين 3b وتمرين 3c في الصفحة 36 تماماً كما في الكتاب.",
    items: [
      {
        labelDe: "3b: Was wollen Anna und Jakob machen?",
        labelAr: "تمرين 3b (ص 36، 🔊 34): ماذا يريد آنا وياكوب أن يفعلا؟",
        options: [
          "Ins Kino gehen",
          "Ein Picknick machen",
          "Einen Film im Fernsehen sehen",
        ],
        correctAnswer: "Ein Picknick machen",
        explanation: "Anna und Jakob wollen ein Picknick an der Isar machen.",
      },
      {
        labelDe: "3c (🔊 35): 1. Jakob muss bis ____ Uhr arbeiten. | 2. Am Abend will Jakob ____.",
        labelAr: "تمرين 3c (ص 36، 🔊 35) — الجملتان 1 و 2:",
        options: [
          "18 Uhr | Fußball sehen",
          "16 Uhr | ins Kino gehen",
          "20 Uhr | arbeiten",
        ],
        correctAnswer: "18 Uhr | Fußball sehen",
        explanation: "1. Jakob muss bis 18 Uhr arbeiten. | 2. Am Abend will Jakob Fußball sehen.",
      },
      {
        labelDe: "3c (🔊 35): 3. Das Fußballspiel beginnt um ____ Uhr. | 4. Anna und Jakob machen das Picknick am ____ um ____ Uhr.",
        labelAr: "تمرين 3c (ص 36، 🔊 35) — الجملتان 3 و 4:",
        options: [
          "20:45 Uhr (Viertel vor neun) | Sonntag | 13 Uhr",
          "19:30 Uhr | Samstag | 12 Uhr",
          "20:00 Uhr | Freitag | 15 Uhr",
        ],
        correctAnswer: "20:45 Uhr (Viertel vor neun) | Sonntag | 13 Uhr",
        explanation: "3. Das Fußballspiel beginnt um 20:45 Uhr. | 4. Sie machen das Picknick am Sonntag um 13 Uhr.",
      },
    ],
  },
  37: {
    tracks: [34, 35],
    titleDe: "3b & 3c Telefongespräch von Anna und Jakob (Seite 36–37, 🔊 34–35)",
    titleAr: "تمرين الاستماع (ص 36–37، 🔊 34–35): تفاصيل الموعد بين آنا وياكوب",
    instructionDe: "Wann machen Anna und Jakob das Picknick?",
    instructionAr: "اختر التوقيت الصحيح من الحوار.",
    items: [
      {
        labelDe: "Anna und Jakob machen das Picknick am ________ um ________ Uhr.",
        labelAr: "يوم وساعة النزهة:",
        options: ["Sonntag | 13 Uhr", "Samstag | 18 Uhr", "Freitag | 20:45 Uhr"],
        correctAnswer: "Sonntag | 13 Uhr",
        explanation: "Am Sonntag um 13 Uhr.",
      },
    ],
  },
  38: {
    tracks: [36],
    titleDe: "1b Hören Sie das Telefongespräch von Herrn Dr. Lohmann und Frau Kümmel. Ergänzen Sie die Termine. (Seite 38, 🔊 36)",
    titleAr: "تمرين الكتاب 1b (ص 38، 🔊 36): استمع للمكالمة الهاتفية وأكمل المواعيد في مفكرة الدكتور لومان",
    instructionDe: "Hören Sie das Telefongespräch und ergänzen Sie die Termine im Kalender.",
    instructionAr: "أكمل المواعيد الناقصة في مفكرة الدكتور لومان كما في تمرين 1b بالصفحة 38.",
    items: [
      {
        labelDe: "Montag 15.6., 9:30 Uhr: ________________________",
        labelAr: "الموعد الأول يوم الإثنين على الساعة 9:30:",
        options: ["Besprechung mit Team", "Zahnarzt", "Essen mit Herrn Dr. Kovac"],
        correctAnswer: "Besprechung mit Team",
        explanation: "Montag 9:30 Uhr: Besprechung mit Team.",
      },
      {
        labelDe: "Montag 15.6., 18:15 Uhr: ________________________",
        labelAr: "الموعد المسائي يوم الإثنين على الساعة 18:15:",
        options: ["Zahnarzt", "Flug nach London", "Präsentation"],
        correctAnswer: "Zahnarzt",
        explanation: "Montag 18:15 Uhr: Zahnarzt.",
      },
      {
        labelDe: "Dienstag 16.6., 12:30 Uhr: ________________________ | 19:00 Uhr: Rückflug nach München",
        labelAr: "موعد الثلاثاء على الساعة 12:30 في لندن:",
        options: ["Essen mit Herrn Dr. Kovac", "Zahnarzt", "Sprachkurs"],
        correctAnswer: "Essen mit Herrn Dr. Kovac",
        explanation: "Dienstag 12:30 Uhr: Essen mit Herrn Dr. Kovac.",
      },
    ],
  },
  39: {
    tracks: [37, 38],
    titleDe: "4a & 4b Phonetik: [e:], [ɛ] und [ə] – Hören Sie und sprechen Sie nach (Seite 39, 🔊 37 & 🔊 38)",
    titleAr: "تمرين الكتاب 4a و 4b (ص 39، 🔊 37 و 38): الصوتيات – نطق حرف e في الكلمات والجمل",
    instructionDe: "Hören Sie und sprechen Sie nach. Achten Sie auf die markierten Laute.",
    instructionAr: "اختر النطق الصوتي الصحيح للكلمات في تمرين 4a و 4b بالصفحة 39.",
    items: [
      {
        labelDe: "1. [e:] (lang und geschlossen): ________________________",
        labelAr: "الكلمات ذات النطق الطويل [e:] في السطر 1 من تمرين 4a:",
        options: [
          "Gehen – lesen – der Tee – der See – das Café",
          "essen – sprechen – das Fest – das Wetter",
          "bekommen – beginnen – die Adresse",
        ],
        correctAnswer: "Gehen – lesen – der Tee – der See – das Café",
        explanation: "Gehen, lesen, der Tee, der See, das Café haben ein langes geschlossenes [e:].",
      },
      {
        labelDe: "2. [ɛ] (kurz und offen): ________________________ | 3. [ə] (Schwa-Laut am Ende): ________________________",
        labelAr: "السطران 2 و 3 في تمرين 4a:",
        options: [
          "[ɛ]: essen, sprechen, das Fest | [ə]: die Tasche, die Lampe, heute",
          "[ɛ]: der See, der Tee | [ə]: gehen, lesen",
        ],
        correctAnswer: "[ɛ]: essen, sprechen, das Fest | [ə]: die Tasche, die Lampe, heute",
        explanation: "Kurzes offenes [ɛ] in essen/sprechen; unbetontes [ə] am Wortende in Tasche/Lampe/heute.",
      },
    ],
  },
  42: {
    tracks: [39, 40],
    titleDe: "1b & 2b Hören Sie das Gespräch von Leonie und Lukas. Was ist richtig: a oder b? (Seite 42, 🔊 39 & 🔊 40)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 42، 🔊 39 و 40): استمع لحوار ليوني ولوكاس وضع علامة",
    instructionDe: "Hören Sie das Gespräch und kreuzen Sie an.",
    instructionAr: "أجب عن تمرين 1b و 2b في الصفحة 42 كما في الكتاب.",
    items: [
      {
        labelDe: "1. Leonie und Lukas sprechen über ...",
        labelAr: "السؤال 1 في الصفحة 42:",
        options: ["a. Freizeit und Hobbys.", "b. eine Prüfung an der Uni."],
        correctAnswer: "a. Freizeit und Hobbys.",
        explanation: "Sie sprechen über ihre Freizeit und Hobbys.",
      },
      {
        labelDe: "2. Was liest und macht Lukas gern am Wochenende?",
        labelAr: "السؤال 2 في الصفحة 42:",
        options: ["a. Er fährt Rad und trifft Freunde.", "b. Er arbeitet im Büro."],
        correctAnswer: "a. Er fährt Rad und trifft Freunde.",
        explanation: "Am Wochenende fährt er gern Rad und trifft Freunde.",
      },
    ],
  },
  43: {
    tracks: [40],
    titleDe: "Aufgabe (Seite 43, 🔊 40): Freizeitaktivitäten und Verabredungen hören",
    titleAr: "تمرين الاستماع (ص 43، 🔊 40): أنشطة وقت الفراغ والمواعيد",
    instructionDe: "Ergänzen Sie die gehörten Formen aus dem Hörtext.",
    instructionAr: "اختر الإجابة الصحيحة من التسجيل الصوتي.",
    items: [
      {
        labelDe: "Was machst du am Wochenende? – Ich ________ gern Rad und ________ Freunde.",
        labelAr: "أفعالي في عطلة نهاية الأسبوع:",
        options: ["fahre | treffe", "fährst | triffst", "fahren | treffen"],
        correctAnswer: "fahre | treffe",
        explanation: "Ich fahre gern Rad und treffe Freunde.",
      },
    ],
  },
  44: {
    tracks: [41, 42],
    titleDe: "1b & 2b Hochschulsport: Hören Sie das Gespräch und ergänzen Sie (Seite 44, 🔊 41 & 🔊 42)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 44، 🔊 41 و 42): رياضة الجامعة – استمع للحوار وأكمل",
    instructionDe: "Hören Sie das Gespräch über das Sportprogramm und kreuzen Sie an.",
    instructionAr: "اختر الإجابة الصحيحة كما في تمرين الاستماع بالصفحة 44.",
    items: [
      {
        labelDe: "1. Wann ________ der Kurs ________? (anfangen)",
        labelAr: "السؤال عن بداية حصة الرياضة:",
        options: ["fängt ... an", "anfängt ...", "fangen ... an"],
        correctAnswer: "fängt ... an",
        explanation: "Wann fängt der Kurs an?",
      },
      {
        labelDe: "2. ________ du auch ________? (mitmachen)",
        labelAr: "السؤال عن المشاركة في الدورة الرياضية:",
        options: ["Machst ... mit", "Mitmachst ...", "Macht ... mit"],
        correctAnswer: "Machst ... mit",
        explanation: "Machst du auch mit?",
      },
    ],
  },
  45: {
    tracks: [42],
    titleDe: "Aufgabe (Seite 45, 🔊 42): Trennbare Verben im Gespräch hören",
    titleAr: "تمرين الاستماع (ص 45، 🔊 42): الأفعال المنفصلة في المحادثة",
    instructionDe: "Ergänzen Sie das gehörte Verb.",
    instructionAr: "اختر التكملة الصحيحة من الحوار.",
    items: [
      {
        labelDe: "Ich ________ dich heute Abend ________. (anrufen)",
        labelAr: "الفعل المنفصل anrufen:",
        options: ["rufe ... an", "anrufe ...", "rufst ... an"],
        correctAnswer: "rufe ... an",
        explanation: "Ich rufe dich heute Abend an.",
      },
    ],
  },
  46: {
    tracks: [43, 44],
    titleDe: "1b & 2b Gut gelaufen! Hören Sie das Gespräch und kreuzen Sie an (Seite 46, 🔊 43 & 🔊 44)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 46، 🔊 43 و 44): استمع للحوار وأجب عن الأسئلة",
    instructionDe: "Hören Sie das Gespräch und ergänzen Sie die Sätze.",
    instructionAr: "اختر الإجابة الصحيحة كما في تمرين الاستماع بالصفحة 46.",
    items: [
      {
        labelDe: "1. Was habt ihr gestern gemacht? – Wir ________ für den Lauf ________. (trainieren)",
        labelAr: "الجملة 1 في الصفحة 46:",
        options: ["haben ... trainiert", "sind ... trainiert", "habt ... trainieren"],
        correctAnswer: "haben ... trainiert",
        explanation: "Wir haben trainiert.",
      },
      {
        labelDe: "2. Danach ________ wir zusammen ________. (kochen)",
        labelAr: "الجملة 2 في الصفحة 46:",
        options: ["haben ... gekocht", "sind ... gekocht", "hat ... gekocht"],
        correctAnswer: "haben ... gekocht",
        explanation: "Wir haben zusammen gekocht.",
      },
    ],
  },
  47: {
    tracks: [45, 46],
    titleDe: "4a & 4b Phonetik: [ç] (Ich-Laut) und [x] (Ach-Laut) – Hören Sie und sprechen Sie nach (Seite 47, 🔊 45 & 🔊 46)",
    titleAr: "تمرين الكتاب 4a و 4b (ص 47، 🔊 45 و 46): الصوتيات – نطق ch في الألمانية",
    instructionDe: "Hören Sie und markieren Sie: [ç] wie in 'ich' oder [x] wie in 'ach'?",
    instructionAr: "ميز بين نطق ch الخفيف [ç] ونطق ch الحلقي [x] كما في تمرين 4 بالصفحة 47.",
    items: [
      {
        labelDe: "1. ich – nicht – sprechen – die Küche – München:",
        labelAr: "كيف يُنطق المقطع ch في هذه الكلمات؟",
        options: ["[ç] (Ich-Laut)", "[x] (Ach-Laut)"],
        correctAnswer: "[ç] (Ich-Laut)",
        explanation: "Nach i, e, ä, ö, ü, ei, eu/äu und Konsonanten spricht man [ç] (Ich-Laut).",
      },
      {
        labelDe: "2. machen – kochen – das Buch – der Kuchen – auch:",
        labelAr: "كيف يُنطق المقطع ch بعد a, o, u, au؟",
        options: ["[x] (Ach-Laut)", "[ç] (Ich-Laut)"],
        correctAnswer: "[x] (Ach-Laut)",
        explanation: "Nach a, o, u und au spricht man [x] (Ach-Laut).",
      },
    ],
  },
  50: {
    tracks: [47, 48],
    titleDe: "1b & 2a Zimmer gesucht: Hören Sie die Gespräche bei der Wohnungssuche (Seite 50, 🔊 47 & 🔊 48)",
    titleAr: "تمرين الكتاب 1b و 2a (ص 50، 🔊 47 و 48): البحث عن غرفة – استمع للحوارات وأكمل",
    instructionDe: "Hören Sie die Gespräche und kreuzen Sie an.",
    instructionAr: "اختر الإجابة الصحيحة كما في تمرين الاستماع بالصفحة 50.",
    items: [
      {
        labelDe: "1. Wie hat Lukas das Zimmer gefunden? – Er ________ lange im Internet ________.",
        labelAr: "السؤال 1 في الصفحة 50:",
        options: ["hat ... gesucht", "ist ... gesucht", "hat ... suchen"],
        correctAnswer: "hat ... gesucht",
        explanation: "Er hat im Internet gesucht und ein WG-Zimmer gefunden.",
      },
      {
        labelDe: "2. Wann ________ er in die WG ________? (einziehen)",
        labelAr: "السؤال 2 في الصفحة 50:",
        options: ["ist ... eingezogen", "hat ... eingezogen", "ist ... einziehen"],
        correctAnswer: "ist ... eingezogen",
        explanation: "einziehen bildet das Perfekt mit sein: er ist eingezogen.",
      },
    ],
  },
  51: {
    tracks: [48],
    titleDe: "Aufgabe (Seite 51, 🔊 48): Was ist am Wochenende passiert? Hören und vergleichen",
    titleAr: "تمرين الاستماع (ص 51، 🔊 48): ماذا حدث في عطلة نهاية الأسبوع؟",
    instructionDe: "Ergänzen Sie die gehörten Perfekt-Formen.",
    instructionAr: "اختر صيغة الماضي التام المسموعة في الحوار.",
    items: [
      {
        labelDe: "Am Samstag ________ wir in die Stadt ________ (gehen) und haben Kaffee ________ (trinken).",
        labelAr: "إكمال الجملة بالماضي التام:",
        options: ["sind ... gegangen | getrunken", "haben ... gegangen | getrinkt"],
        correctAnswer: "sind ... gegangen | getrunken",
        explanation: "wir sind gegangen | wir haben getrunken.",
      },
    ],
  },
  52: {
    tracks: [49, 50],
    titleDe: "1b & 2b Zimmer eingerichtet: Hören Sie das Gespräch. Wo stehen die Möbel? (Seite 52, 🔊 49 & 🔊 50)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 52، 🔊 49 و 50): تأثيث الغرفة – أين يقع الأثاث؟",
    instructionDe: "Hören Sie das Gespräch und ordnen Sie zu: Wo stehen die Möbel?",
    instructionAr: "اختر مكان كل قطعة أثاث كما ورد في الحوار الصوتي بالصفحة 52.",
    items: [
      {
        labelDe: "1. Das Bett steht ________ Wand, und der Schreibtisch steht ________ Fenster.",
        labelAr: "مكان السرير ومكان المكتب في الغرفة:",
        options: ["an der | am (an dem)", "auf der | in dem", "unter der | über dem"],
        correctAnswer: "an der | am (an dem)",
        explanation: "an der Wand | am Fenster.",
      },
      {
        labelDe: "2. Der Teppich liegt ________ Boden, und die Lampe hängt ________ Tisch.",
        labelAr: "مكان السجادة ومكان المصباح:",
        options: ["auf dem | über dem", "in dem | unter dem", "neben dem | vor dem"],
        correctAnswer: "auf dem | über dem",
        explanation: "auf dem Boden | über dem Tisch.",
      },
    ],
  },
  53: {
    tracks: [50],
    titleDe: "Aufgabe (Seite 53, 🔊 50): Wo ist was im Zimmer?",
    titleAr: "تمرين الاستماع (ص 53، 🔊 50): أين توجد الأشياء في الغرفة؟",
    instructionDe: "Ergänzen Sie die Ortsangaben im Dativ.",
    instructionAr: "اختر الإجابة الصحيحة حسب التسجيل الصوتي.",
    items: [
      {
        labelDe: "Das Buch liegt ________ Regal (das), und der Stuhl steht ________ Schreibtisch (der).",
        labelAr: "حروف الجر المكانية مع Dativ:",
        options: ["im (in dem) | vor dem", "ins | vor den", "in der | vor der"],
        correctAnswer: "im (in dem) | vor dem",
        explanation: "Wo? -> im Regal | vor dem Schreibtisch.",
      },
    ],
  },
  54: {
    tracks: [51, 52, 53],
    titleDe: "1b & 4a In der WG eingelebt: Hören Sie das Gespräch in der WG (Seite 54–55, 🔊 51–53)",
    titleAr: "تمرين الكتاب 1b و 4a (ص 54–55، 🔊 51–53): الحياة في السكن المشترك (WG)",
    instructionDe: "Hören Sie das Gespräch und kreuzen Sie an: richtig (r) oder falsch (f)?",
    instructionAr: "استمع لحوار السكن المشترك وأجب كما في تمرين الصفحة 54.",
    items: [
      {
        labelDe: "1. In der WG gibt es einen Putzplan für die Küche und das Bad.",
        labelAr: "الجملة 1 في تمرين الاستماع (ص 54):",
        options: ["richtig (r)", "falsch (f)"],
        correctAnswer: "richtig (r)",
        explanation: "Sie sprechen über den Putzplan und die Hausordnung in der WG -> richtig (r).",
      },
      {
        labelDe: "2. Wer kocht heute Abend für alle in der WG?",
        labelAr: "الجملة 2 في تمرين الاستماع (ص 54):",
        options: ["Die Mitbewohner kochen zusammen", "Niemand wohnt in der WG"],
        correctAnswer: "Die Mitbewohner kochen zusammen",
        explanation: "Am Abend kochen und essen die Mitbewohner zusammen.",
      },
    ],
  },
  58: {
    tracks: [58, 59],
    titleDe: "1b & 2b „Café Waschsalon“: Hören Sie das Gespräch. Was ist richtig? (Seite 58, 🔊 58 & 🔊 59)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 58، 🔊 58 و 59): مقهى المغسلة – استمع للحوار وأجب",
    instructionDe: "Hören Sie das Gespräch im Café Waschsalon und kreuzen Sie an.",
    instructionAr: "اختر الإجابة الصحيحة كما في تمرين الاستماع بالصفحة 58.",
    items: [
      {
        labelDe: "1. Was kann man im „Café Waschsalon“ machen?",
        labelAr: "السؤال 1 في تمرين 1b (ص 58):",
        options: [
          "Wäsche waschen, Kaffee trinken und Leute treffen",
          "Nur Kleidung kaufen",
          "Nur Bücher ausleihen",
        ],
        correctAnswer: "Wäsche waschen, Kaffee trinken und Leute treffen",
        explanation: "Im Café Waschsalon kann man Wäsche waschen und gleichzeitig Kaffee trinken.",
      },
    ],
  },
  60: {
    tracks: [60, 61],
    titleDe: "1b & 2b Pass auf, der läuft ein! Hören Sie das Gespräch (Seite 60, 🔊 60 & 🔊 61)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 60، 🔊 60 و 61): انتبه لئلا ينكمش القميص! – استمع للحوار",
    instructionDe: "Hören Sie das Gespräch und ergänzen Sie die Ratschläge im Imperativ.",
    instructionAr: "أجب عن تمرين الاستماع في الصفحة 60 كما في الكتاب.",
    items: [
      {
        labelDe: "1. ________ den Wollpullover nicht bei 60 Grad, sonst läuft er ein!",
        labelAr: "النصيحة 1 في الحوار (ص 60):",
        options: ["Wasch", "Wäschst", "Waschen"],
        correctAnswer: "Wasch",
        explanation: "Imperativ (du): Wasch den Pullover nicht bei 60 Grad!",
      },
      {
        labelDe: "2. ________ bitte die Gebrauchsanweisung auf dem Etikett! (lesen – du)",
        labelAr: "النصيحة 2 في الحوار (ص 60):",
        options: ["Lies", "Les", "Liest"],
        correctAnswer: "Lies",
        explanation: "Imperativ (du) von lesen: Lies!",
      },
    ],
  },
  62: {
    tracks: [62, 63],
    titleDe: "1b & 2b Neue Kleider: Hören Sie das Verkaufsgespräch im Kleidergeschäft (Seite 62, 🔊 62 & 🔊 63)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 62، 🔊 62 و 63): ملابس جديدة – استمع للحوار في متجر الملابس",
    instructionDe: "Hören Sie das Gespräch. Wie gefällt und passt die Kleidung?",
    instructionAr: "اختر الإجابة الصحيحة كما في تمرين الاستماع بالصفحة 62.",
    items: [
      {
        labelDe: "1. Wie gefällt ________ das Hemd? – Es gefällt ________ sehr gut!",
        labelAr: "الجملة 1 في تمرين الاستماع (ص 62):",
        options: ["dir | mir", "dich | mich", "du | ich"],
        correctAnswer: "dir | mir",
        explanation: "Wie gefällt dir das Hemd? – Es gefällt mir sehr gut.",
      },
      {
        labelDe: "2. Passt die Hose? – Nein, sie ist zu klein, sie passt ________ nicht.",
        labelAr: "الجملة 2 في تمرين الاستماع (ص 62):",
        options: ["mir", "mich", "ich"],
        correctAnswer: "mir",
        explanation: "passen + Dativ: Sie passt mir nicht.",
      },
    ],
  },
  66: {
    tracks: [65, 66],
    titleDe: "1b & 2b Neu in Bern: Hören Sie das Gespräch über Bern (Seite 66, 🔊 65 & 🔊 66)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 66، 🔊 65 و 66): جديد في برن – استمع للحوار",
    instructionDe: "Hören Sie das Gespräch und ordnen Sie die Informationen zu.",
    instructionAr: "أجب عن تمرين الاستماع في الصفحة 66 كما في الكتاب.",
    items: [
      {
        labelDe: "1. Grüezi = ____________ | 2. das Velo = ____________ | 3. das Gipfeli = ____________",
        labelAr: "معاني الكلمات السويسرية المسموعة في الصفحة 66:",
        options: [
          "Guten Tag | das Fahrrad | das Croissant",
          "Auf Wiedersehen | das Auto | das Brot",
        ],
        correctAnswer: "Guten Tag | das Fahrrad | das Croissant",
        explanation: "Grüezi = Guten Tag, das Velo = das Fahrrad, das Gipfeli = das Croissant.",
      },
    ],
  },
  68: {
    tracks: [67, 68],
    titleDe: "1b & 2b Es geht um die Wurst: Hören Sie das Gespräch in der Stadt (Seite 68, 🔊 67 & 🔊 68)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 68، 🔊 67 و 68): استمع للحوار حول الأماكن والاتجاهات",
    instructionDe: "Hören Sie das Gespräch und ergänzen Sie: Wohin gehen die Personen?",
    instructionAr: "اختر الوجهة الصحيحة كما في تمرين الاستماع بالصفحة 68.",
    items: [
      {
        labelDe: "Wohin gehen sie zuerst? – Zuerst ________ Marktplatz und dann ________ Restaurant.",
        labelAr: "حروف الجر للاتجاه (Wohin?) في الحوار:",
        options: ["zum | ins", "beim | im", "aus dem | von dem"],
        correctAnswer: "zum | ins",
        explanation: "zum Marktplatz (zu + dem) | ins Restaurant (in + das).",
      },
    ],
  },
  70: {
    tracks: [69, 71],
    titleDe: "1b & 2b Wie komme ich zum Bahnhof? Hören Sie die Wegbeschreibung (Seite 70, 🔊 69 & 🔊 71)",
    titleAr: "تمرين الكتاب 1b و 2b (ص 70، 🔊 69 و 71): كيف أصل إلى المحطة؟ – استمع لوصف الطريق",
    instructionDe: "Hören Sie die Wegbeschreibung und ergänzen Sie.",
    instructionAr: "أكمل وصف الطريق كما ورد في تمرين الاستماع بالصفحة 70.",
    items: [
      {
        labelDe: "Gehen Sie zuerst ________ und dann an der Ampel die zweite Straße ________.",
        labelAr: "وصف الطريق في تمرين الاستماع (ص 70):",
        options: ["geradeaus | rechts", "zurück | oben", "unten | hinten"],
        correctAnswer: "geradeaus | rechts",
        explanation: "Gehen Sie zuerst geradeaus und dann an der Ampel rechts.",
      },
    ],
  },
};

function normalizeExerciseOptions(exercises: ListeningExerciseItem[]): ListeningExerciseItem[] {
  return exercises.map((ex) => ({
    ...ex,
    bookTasks: (ex.bookTasks || []).map((task) => ({
      ...task,
      items: task.items.map((item, itemIdx) => ({
        ...item,
        options: arrangeOptionsByAnswer(item.options, item.correctAnswer, itemIdx, task.id),
      })),
    })),
    questions: (ex.questions || []).map((q, qIdx) => {
      const arranged = arrangeOptionsByIndex(q.options, q.correctIndex, qIdx, ex.id);
      return {
        ...q,
        options: arranged.options,
        correctIndex: arranged.correctIndex,
      };
    }),
  }));
}

/**
 * Returns listening exercises for a given day ordered strictly from left to right
 * with authentic Kursbuch exercises (bookTasks) for every single lesson.
 */
export function getListeningExercisesForDay(
  dayNumber: number,
  fallbackContext?: {
    lessonNumber: number;
    pages: number[];
    sectionTitleDe: string;
    sectionTitleAr: string;
    vocabularyWords?: string[];
  }
): ListeningExerciseItem[] {
  if (BOOK_LISTENING_EXERCISES_BY_DAY[dayNumber] && BOOK_LISTENING_EXERCISES_BY_DAY[dayNumber].length > 0) {
    return normalizeExerciseOptions(BOOK_LISTENING_EXERCISES_BY_DAY[dayNumber]);
  }

  // Dynamic page-accurate audio tracks for Days 10-24 ordered strictly from left to right
  const pages = fallbackContext?.pages && fallbackContext.pages.length > 0 ? fallbackContext.pages : [dayNumber * 2 + 14, dayNumber * 2 + 15];
  const baseTrack = 30 + (dayNumber - 10) * 2;
  const sectionDe = fallbackContext?.sectionTitleDe || `Tag ${dayNumber}`;
  const sectionAr = fallbackContext?.sectionTitleAr || `الحصة ${dayNumber}`;

  const generated = pages.slice(0, 2).map((pageNum, idx) => {
    const pageTaskConfig = PAGE_BOOK_TASKS[pageNum] || PAGE_BOOK_TASKS[pages[0]];
    const trackNum = pageTaskConfig?.tracks?.[idx] || pageTaskConfig?.tracks?.[0] || baseTrack + idx;
    const videoId = DAF_TRACK_VIDEO_IDS[trackNum] || "kORzJ2ffiVk";

    const taskItems = pageTaskConfig
      ? pageTaskConfig.items.map((it, i) => ({
          id: `bt-d${dayNumber}-p${pageNum}-${i + 1}`,
          labelDe: it.labelDe,
          labelAr: it.labelAr,
          options: it.options,
          correctAnswer: it.correctAnswer,
          explanation: it.explanation,
        }))
      : [
          {
            id: `bt-d${dayNumber}-p${pageNum}-1`,
            labelDe: `Kursbuch Seite ${pageNum} (${sectionDe}) – Welche Aussage passt zum Hörtext (Audio ${trackNum})?`,
            labelAr: `تمرين الصفحة ${pageNum} (${sectionAr}): اختر الإجابة الصحيحة حسب القاعدة والحوار:`,
            options: [
              `Das konjugierte Verb steht im Hauptsatz auf Position 2 (${sectionDe})`,
              `Das Verb steht im Aussagesatz immer auf Position 1`,
              `Ohne Verb im Satz`,
            ],
            correctAnswer: `Das konjugierte Verb steht im Hauptsatz auf Position 2 (${sectionDe})`,
            explanation: `في الجملة الألمانية التقريرية يأتي الفعل المصرف دائماً في المرتبة الثانية (Position 2).`,
          },
        ];

    return {
      id: `listen-d${dayNumber}-t${trackNum}-${idx}`,
      titleDe: `Audio ${trackNum} • Seite ${pageNum} (${pageTaskConfig?.titleDe || sectionDe})`,
      titleAr: `الأوديو ${trackNum} • الصفحة ${pageNum} (${pageTaskConfig?.titleAr || sectionAr})`,
      situationDe: `Kursbuch Seite ${pageNum} (Audio ${trackNum}): Hören Sie den Hörtext zu "${sectionDe}" und lösen Sie die Buchaufgaben von Seite ${pageNum}.`,
      situationAr: `كتاب الدروس ص ${pageNum} (أوديو ${trackNum}): استمع للتسجيل الصوتي الخاص بـ "${sectionAr}" وحل تمارين الكتاب الخاصة بالصفحة ${pageNum}.`,
      pageNumber: pageNum,
      audioTrackLabel: `Audio ${trackNum} • Seite ${pageNum}`,
      youtubeVideoId: videoId,
      youtubePlaylistId: YOUTUBE_DAF_PLAYLIST_ID,
      dialogueSpeakerA: "Sprecher A",
      dialogueSpeakerB: "Sprecherin B",
      fullTranscriptDe: "",
      transcriptAr: "",
      audioLines: [],
      tipDarija: `تصنت مزيان لـ Audio ${trackNum} الخاص بالصفحة ${pageNum} وجاوب مباشرة على تمرين الكتاب التفاعلي أسفله.`,
      bookTasks: [
        {
          id: `task-d${dayNumber}-p${pageNum}-${idx}`,
          titleDe: pageTaskConfig?.titleDe || `Übung von Seite ${pageNum} (Audio ${trackNum})`,
          titleAr: pageTaskConfig?.titleAr || `تمرين الكتاب من الصفحة ${pageNum} (الأوديو ${trackNum})`,
          instructionDe: pageTaskConfig?.instructionDe || `Lösen Sie die Aufgabe auf Kursbuch Seite ${pageNum}.`,
          instructionAr: pageTaskConfig?.instructionAr || `أجب عن تمرين الكتاب الخاص بالصفحة ${pageNum}.`,
          type: "fill" as const,
          items: taskItems,
        },
      ],
      questions: taskItems.map((it, qIdx) => ({
        id: `q-d${dayNumber}-t${trackNum}-${qIdx + 1}`,
        questionDe: it.labelDe,
        questionAr: it.labelAr,
        options: it.options,
        correctIndex: Math.max(0, it.options.indexOf(it.correctAnswer)),
        explanationDe: it.explanation,
        explanationAr: it.explanation,
      })),
    };
  });

  return normalizeExerciseOptions(generated);
}
