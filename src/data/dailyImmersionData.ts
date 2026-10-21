export interface VideoSegment {
  startSeconds: number;
  endSeconds: number;
  startFormatted: string; // e.g. "00:00"
  endFormatted: string;   // e.g. "04:19"
  durationSeconds: number; // 259
  durationFormatted: string; // "4 دقائق و 19 ثانية"
  youtubeId: string;       // "4-eDoThe6qo"
  youtubeDirectUrl: string; // "https://www.youtube.com/watch?v=4-eDoThe6qo&t=..."
  embedUrl: string;        // "https://www.youtube.com/embed/4-eDoThe6qo?start=...&end=..."
  segmentTitleAr?: string;
  segmentTitleDe?: string;
}

export const NICOS_WEG_FULL_MOVIE_ID = '4-eDoThe6qo';
export const TOTAL_MOVIE_SECONDS = 6216; // 1 hour 43 minutes 36 seconds
export const SECONDS_PER_DAY = 259; // 4 minutes 19 seconds per day (6216 / 24)

export function calculateVideoSegment(day: number): VideoSegment {
  const safeDay = Math.min(Math.max(day, 1), 24);
  const startSeconds = (safeDay - 1) * SECONDS_PER_DAY;
  const endSeconds = safeDay === 24 ? TOTAL_MOVIE_SECONDS : safeDay * SECONDS_PER_DAY;

  const formatSecs = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startFormatted = formatSecs(startSeconds);
  const endFormatted = formatSecs(endSeconds);
  const durationSeconds = endSeconds - startSeconds;
  const durMins = Math.floor(durationSeconds / 60);
  const durSecs = durationSeconds % 60;
  const durationFormatted = `${durMins} دقيقة و ${durSecs} ثانية`;

  return {
    startSeconds,
    endSeconds,
    startFormatted,
    endFormatted,
    durationSeconds,
    durationFormatted,
    youtubeId: NICOS_WEG_FULL_MOVIE_ID,
    youtubeDirectUrl: `https://www.youtube.com/watch?v=${NICOS_WEG_FULL_MOVIE_ID}&t=${startSeconds}s`,
    embedUrl: `https://www.youtube.com/embed/${NICOS_WEG_FULL_MOVIE_ID}?start=${startSeconds}&end=${endSeconds}&autoplay=0&enablejsapi=1&rel=0`,
    segmentTitleAr: `مقطع اليوم ${safeDay} من فيلم Nicos Weg A1 (من ${startFormatted} إلى ${endFormatted})`,
    segmentTitleDe: `Nicos Weg A1 Film - Tag ${safeDay} (${startFormatted} - ${endFormatted})`,
  };
}

export interface DailyImmersionData {
  dayNumber: number;
  themeTitleDe: string;
  themeTitleAr: string;
  recommendedMinutes: number; // usually 15
  videoSession: {
    titleDe: string;
    titleAr: string;
    sourceName: string; // e.g. "Nicos Weg (Deutsche Welle)" or "Easy German"
    youtubeId: string; // YouTube Video ID for direct player
    fallbackUrl: string;
    durationEstimate: string; // "10 - 15 Min."
    listeningMissionAr: string;
    keyPhrasesToListenFor: Array<{ german: string; darija: string }>;
    segment?: VideoSegment;
  };
  readingSession: {
    titleDe: string;
    titleAr: string;
    germanText: string;
    darijaTranslation: string;
    vocabularyHighlight: string[]; // words to highlight from today's list
    comprehensionQuiz: Array<{
      questionAr: string;
      options: string[];
      correctIndex: number;
      explanationAr: string;
    }>;
  };
  writingSession: {
    titleDe: string;
    titleAr: string;
    instructionAr: string;
    targetWordCount: { min: number; max: number };
    starterPromptDe: string;
    suggestedWords: string[];
    sampleModelAnswerDe: string;
    sampleModelAnswerAr: string;
  };
}

export const DAILY_IMMERSION_RESOURCES: Record<number, DailyImmersionData> = {
  1: {
    dayNumber: 1,
    themeTitleDe: 'Erste Begegnungen & Das Alphabet',
    themeTitleAr: 'اللقاءات الأولى والتحية والأبجدية',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Nicos Weg A1 - Folge 1: Hallo!',
      titleAr: 'نيكو يصل إلى المانيا - الحلقة 1: مرحباً!',
      sourceName: 'Deutsche Welle (Nicos Weg A1)',
      youtubeId: '2bcdZX5W7eA',
      fallbackUrl: 'https://learngerman.dw.com/de/hallo/l-37250531',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'ركز على طريقة التحية، كيف يقدم نيكو والآخرون أسماءهم، وكيف ينطقون الحروف عند التهجئة (Buchstabieren). سجل 3 عبارات سمعتها!',
      keyPhrasesToListenFor: [
        { german: 'Guten Tag! Wie heißen Sie?', darija: 'نهار مبروك! ما اسمك؟' },
        { german: 'Ich heiße Nico.', darija: 'أنا اسمي نيكو.' },
        { german: 'Wie bitte? Können Sie das buchstabieren?', darija: 'عفواً؟ واش ممكن تهجّي هاد الاسم؟' },
      ],
    },
    readingSession: {
      titleDe: 'Am Flughafen Frankfurt',
      titleAr: 'في مطار فرانكفورت',
      germanText:
        'Guten Tag! Mein Name ist Karim El Amrani. Ich komme aus Marokko und bin neu in Deutschland. Am Flughafen treffe ich Herrn Müller. Herr Müller sagt: „Herzlich willkommen in Frankfurt! Wie geht es Ihnen?“ Ich antworte: „Sehr gut, danke! Und Ihnen?“ Er lächelt und buchstabiert seinen Namen: M-Ü-L-L-E-R. Deutsch lernen macht großen Spaß!',
      darijaTranslation:
        'نهار مبروك! سميتي كريم العمراني. أنا جاي من المغرب وجديد هنا فـ ألمانيا. فـ المطار تلاقيت مع السيد مولر. السيد مولر قال: "مرحباً بك في فرانكفورت! كيف داير؟" جاوبتو: "مزيان بزاف، شكراً! وأنت؟" ابتسم وهو كيهجي كنيتو: M-Ü-L-L-E-R. تعلم الألمانية ممتع بزاف!',
      vocabularyHighlight: ['Guten Tag', 'heißen', 'buchstabieren', 'der Name', 'willkommen'],
      comprehensionQuiz: [
        {
          questionAr: 'من أين أتى كريم حسب النص؟',
          options: ['من ألمانيا', 'من المغرب', 'من سويسرا'],
          correctIndex: 1,
          explanationAr: 'النص يقول بوضوح: "Ich komme aus Marokko".',
        },
        {
          questionAr: 'ماذا فعل السيد مولر في النص؟',
          options: ['شرب قهوة', 'هجى حروف اسمه (M-Ü-L-L-E-R)', 'اشترى تذكرة طائرة'],
          correctIndex: 1,
          explanationAr: 'السيد مولر قام بتهجئة اسمه: "Er buchstabiert seinen Namen".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Sich vorstellen & Begrüßen',
      titleAr: 'مهمة الكتابة: تقديم نفسك والتحية بالتهجئة',
      instructionAr:
        'اكتب حواراً قصيراً أو فقرة من 4 إلى 6 جمل تقدم فيها نفسك: التحية، اسمك الكامل، تهجئة اسمك الشخصي، وسؤال الطرف الآخر عن حاله.',
      targetWordCount: { min: 25, max: 50 },
      starterPromptDe: 'Guten Tag! Mein Name ist ...',
      suggestedWords: ['Guten Tag', 'heißen', 'mein Name', 'buchstabieren', 'danke', 'wie geht es'],
      sampleModelAnswerDe:
        'Guten Tag! Mein Name ist Yassine. Ich buchstabiere: Y-A-S-S-I-N-E. Ich lerne jetzt Deutsch. Wie heißen Sie? Freut mich sehr, Sie kennenzulernen!',
      sampleModelAnswerAr:
        'نهار مبروك! سميتي ياسين. غانهجي: Y-A-S-S-I-N-E. دابا كنتعلم الألمانية. شنو سميتك؟ متشرف بمعرفتك بزاف!',
    },
  },

  2: {
    dayNumber: 2,
    themeTitleDe: 'Herkunft, Sprachen & Zahlen bis 20',
    themeTitleAr: 'البلد الأصلي واللغات والأرقام حتى 20',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Nicos Weg A1 - Woher kommst du?',
      titleAr: 'نيكو في النزل: من أين أنت؟ وماذا تتحدث؟',
      sourceName: 'Deutsche Welle (Nicos Weg)',
      youtubeId: 'Z19c0G2k20k',
      fallbackUrl: 'https://learngerman.dw.com/de/woher-kommst-du/l-37254559',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'استمع للأسئلة: Woher kommst du? Welche Sprachen sprichst du? وركز على استعمال حروف الجر aus و in وطريقة نطق الأرقام من 1 إلى 20.',
      keyPhrasesToListenFor: [
        { german: 'Woher kommst du? – Aus Spanien.', darija: 'منين نتا؟ – من إسبانيا.' },
        { german: 'Ich spreche Arabisch, Französisch und ein bisschen Deutsch.', darija: 'كنتكلم العربية والفرنسية وشوية د الألمانية.' },
        { german: 'Ich bin zwanzig Jahre alt.', darija: 'عندي عشرين عام.' },
      ],
    },
    readingSession: {
      titleDe: 'Neue Freunde im Deutschkurs',
      titleAr: 'أصدقاء جدد في دورة اللغة الألمانية',
      germanText:
        'Im Sprachkurs sind heute fünfzehn Studenten. Wir kommen aus verschiedenen Ländern. Sarah kommt aus Marokko und spricht perfekt Arabisch und Französisch. Lukas kommt aus Deutschland und spricht natürlich Deutsch und Englisch. Wir lernen zusammen die Zahlen von eins bis zwanzig: eins, zwei, drei, vier, fünf... Deutsch ist eine wunderschöne Sprache!',
      darijaTranslation:
        'فـ حصة اللغة كاينين اليوم 15 طالب. حنا جايين من بلدان مختلفة. سارة جاية من المغرب وكتكلم مزيان العربية والفرنسية. لوكاس جاي من ألمانيا وكيتكلم طبعاً الألمانية والإنجليزية. كنتعلمو مجموعين الأرقام من 1 حتى 20: واحد، جوج، تلاتة، ربعة، خمسة... الألمانية لغة زوينة بزاف!',
      vocabularyHighlight: ['das Land', 'die Sprache', 'sprechen', 'ein bisschen', 'fünfzehn'],
      comprehensionQuiz: [
        {
          questionAr: 'كم عدد الطلاب الحاضرين في الدورة اليوم؟',
          options: ['عشرة (10)', 'خمسة عشر (15)', 'عشرون (20)'],
          correctIndex: 1,
          explanationAr: 'مكتوب في النص: "heute fünfzehn Studenten" (15 طالباً).',
        },
        {
          questionAr: 'ما هي اللغات التي تتحدث بها سارة؟',
          options: ['فقط الإنجليزية', 'العربية والفرنسية', 'الإسبانية والروسية'],
          correctIndex: 1,
          explanationAr: 'مذكور: "spricht perfekt Arabisch und Französisch".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Steckbrief & Sprachen',
      titleAr: 'مهمة الكتابة: تقديم بلدك الأصلي ولغاتك وعمرك بالأرقام',
      instructionAr:
        'اكتب فقرة من 4 إلى 6 جمل تتحدث فيها عن نفسك: بلدك الأصلي (aus ...)، المدينة التي تسكن فيها حالياً (in ...)، اللغات التي تتقنها، واللغات التي تتعلمها، وعمرك باستعمال الأرقام الألمانية كتابةً.',
      targetWordCount: { min: 25, max: 55 },
      starterPromptDe: 'Hallo zusammen! Ich komme aus ...',
      suggestedWords: ['kommen aus', 'wohnen in', 'sprechen', 'Arabisch', 'Deutsch', 'Zahlen'],
      sampleModelAnswerDe:
        'Hallo! Ich heiße Amina und ich komme aus Marokko. Ich wohne jetzt in Casablanca. Ich spreche Arabisch, Französisch und lerne Deutsch. Ich bin neunzehn Jahre alt. Mein Deutschkurs macht mir sehr viel Spaß!',
      sampleModelAnswerAr:
        'أهلاً! سميتي أمينة وأنا من المغرب. كنسكن دابا فـ كازابلانكا. كنتكلم العربية والفرنسية وكنتعلم الألمانية. عندي 19 عام. الدورة ديالي د الألمانية عاجباني بزاف!',
    },
  },

  3: {
    dayNumber: 3,
    themeTitleDe: 'Im Café: Bestellen, Bezahlen & Zahlen bis 100',
    themeTitleAr: 'في المقهى: الطلب والدفع والحساب بالأرقام حتى 100',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Easy German - Bestellen im Café & Restaurant',
      titleAr: 'كيف تطلب وتدفع في مقهى ألماني',
      sourceName: 'Easy German (A1 Dialoge)',
      youtubeId: '9UqH5T0yqK8',
      fallbackUrl: 'https://www.youtube.com/results?search_query=easy+german+im+cafe+bestellen',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'انتبه لصيغ الطلب المهذبة: "Ich möchte bitte...", "Ich nehme...", وللسؤال عن الحساب: "Zusammen oder getrennt? Was macht das?" وكيف ينطق النادل الأسعار بالأرقام.',
      keyPhrasesToListenFor: [
        { german: 'Ich möchte bitte einen Kaffee mit Milch.', darija: 'بغيت عافاك قهوة بالحليب.' },
        { german: 'Was kostet das? – Das macht vier Euro fünfzig.', darija: 'بشحال هادشي؟ – الحساب ربعة يورو وخمسين سنت.' },
        { german: 'Zusammen oder getrennt? – Zusammen, bitte!', darija: 'مجموع ولا مفرق؟ – مجموع عافاك!' },
      ],
    },
    readingSession: {
      titleDe: 'Pause im Café Schiller',
      titleAr: 'استراحة في مقهى شيلر',
      germanText:
        'Es ist vierzehn Uhr. David und Maria gehen ins Café Schiller. Der Kellner kommt und fragt: „Was möchten Sie trinken?“ David antwortet: „Ich trinke einen Kaffee und nehme ein Stück Apfelkuchen.“ Maria möchte ein Mineralwasser ohne Kohlensäure. Der Kellner bringt die Bestellung schnell. Am Ende sagt David: „Wir möchten bitte bezahlen!“ Die Rechnung beträgt acht Euro achtzig. David bezahlt und gibt zwei Euro Trinkgeld.',
      darijaTranslation:
        'الساعة هي جوج د العشية (14:00). دافيد وماريا مشاو لمقهى شيلر. السرباي جا وسولهم: "شنو تحبو تشربو؟" دافيد جاوب: "غنشرب قهوة وناخد طريف ديال كيكة التفاح." ماريا بغات ماء معدني بلا غاز. السرباي جاب الطلب بسرعة. فـ الأخير قال دافيد: "بغينا نخلصو عافاك!" الفاتورة فيها 8 يورو و80 سنت. دافيد خلص وخلا جوج يورو بوربوار.',
      vocabularyHighlight: ['der Kaffee', 'das Wasser', 'bestellen', 'bezahlen', 'die Rechnung'],
      comprehensionQuiz: [
        {
          questionAr: 'ماذا طلبت ماريا في المقهى؟',
          options: ['عصير برتقال', 'ماء معدني بدون غاز', 'شاي أخضر'],
          correctIndex: 1,
          explanationAr: 'في النص: "Maria möchte ein Mineralwasser ohne Kohlensäure".',
        },
        {
          questionAr: 'كم كان المجموع الإجمالي للفاتورة؟',
          options: ['أربعة يورو وخمسين (4,50 €)', 'ثمانية يورو وثمانين (8,80 €)', 'عشرون يورو (20 €)'],
          correctIndex: 1,
          explanationAr: 'المجموع مذكور: "acht Euro achtzig" (8,80 €).',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Dialog im Café',
      titleAr: 'مهمة الكتابة: حوار طلب المشروبات ودفع الحساب',
      instructionAr:
        'اكتب حواراً من 6 إلى 8 أسطر بينك وبين النادل في مقهى: تلقي التحية، تطلب مشروباً وقطعة حلوى بأدب (möchte / nehme)، تسأل عن السعر، وتطلب دفع الحساب (zahlen / die Rechnung).',
      targetWordCount: { min: 30, max: 60 },
      starterPromptDe: 'Kellner: Guten Tag, was darf es sein?\nIch: Guten Tag, ich möchte bitte ...',
      suggestedWords: ['der Kaffee', 'der Tee', 'das Wasser', 'möchten', 'zahlen', 'die Rechnung'],
      sampleModelAnswerDe:
        'Kellner: Guten Tag! Was möchten Sie bestellen?\nIch: Guten Tag! Ich nehme bitte einen schwarzen Kaffee und ein Croissant.\nKellner: Gerne! Möchten Sie noch etwas?\nIch: Nein danke, das ist alles.\nIch: Wir möchten bitte zahlen.\nKellner: Das macht zusammen fünf Euro fünfzig.\nIch: Hier bitte, sechs Euro. Stimmt so!',
      sampleModelAnswerAr:
        'النادل: نهار مبروك! شنو تحب تطلب؟\nأنا: نهار مبروك! بغيت عافاك قهوة كحلة وكرواسون.\nالنادل: بكل سرور! واش خاصاك شي حاجة أخرى؟\nأنا: لا شكراً، هادشي كافي.\nأنا: بغينا نخلصو عافاك.\nالنادل: المجموع 5 يورو وخمسين سنت.\nأنا: تفضل، هاك ستة يورو وخلي الباقي عندك!',
    },
  },

  4: {
    dayNumber: 4,
    themeTitleDe: 'Wohnen & Möbel: Mein Zimmer',
    themeTitleAr: 'السكن والأثاث وتجهيز الغرفة',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Nicos Weg A1 - Meine Wohnung',
      titleAr: 'شقة نيكو وغرفة السكن المشترك',
      sourceName: 'Deutsche Welle',
      youtubeId: 'V_X7zYy77j0',
      fallbackUrl: 'https://learngerman.dw.com/de/wohnen/c-36519789',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'استمع لأسماء الغرف (Küche, Bad, Zimmer) وأسماء الأثاث (Tisch, Stuhl, Bett, Schrank) وكيف يصف المتحدثون حجم الشقة (groß, klein, hell, dunkel).',
      keyPhrasesToListenFor: [
        { german: 'Das Zimmer ist sehr hell und ruhig.', darija: 'البيت مضوية وهادية بزاف.' },
        { german: 'Hier steht mein Schreibtisch.', darija: 'هنا كاين البيرو ديالي.' },
        { german: 'Wie hoch ist die Miete?', darija: 'شحال واصل الكراء؟' },
      ],
    },
    readingSession: {
      titleDe: 'Meine erste Wohnung in Köln',
      titleAr: 'شقتي الأولى في مدينة كولونيا',
      germanText:
        'Ich habe endlich eine schöne Wohnung in Köln gefunden. Sie hat zwei Zimmer, eine Küche und ein kleines Badezimmer. Das Wohnzimmer ist sehr hell, denn es hat zwei große Fenster. Im Schlafzimmer stehen ein bequemes Bett und ein weißer Schrank. Auf dem Schreibtisch steht mein Laptop. Die Wohnung liegt im Zentrum und die Miete ist günstig. Ich fühle mich hier wirklich sehr wohl!',
      darijaTranslation:
        'أخيراً لقيت برطمة زوينة فـ كولونيا. فيها جوج بيوت، كوزينة وحمام صغير. الصالون مضاوي بزاف حيت فيه جوج سراجم كبار. فـ بيت النعاس كاين ناموسية مريحة وماريو بيض. فوق البيرو كاين البيسي ديالي. الشقة كاينة فـ السنتر والكراء رخيص. كنحس براسي مرتاح هنا بزاف!',
      vocabularyHighlight: ['die Wohnung', 'das Zimmer', 'die Küche', 'das Bett', 'der Schrank'],
      comprehensionQuiz: [
        {
          questionAr: 'كم عدد الغرف في الشقة الموصوفة؟',
          options: ['غرفة واحدة', 'غرفتان (zwei Zimmer)', 'أربع غرف'],
          correctIndex: 1,
          explanationAr: 'في النص: "Sie hat zwei Zimmer, eine Küche und ein kleines Badezimmer".',
        },
        {
          questionAr: 'أين يوجد الحاسوب المحمول (Laptop)؟',
          options: ['تحت السرير', 'فوق المكتب (auf dem Schreibtisch)', 'في المطبخ'],
          correctIndex: 1,
          explanationAr: 'النص يذكر: "Auf dem Schreibtisch steht mein Laptop".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Meine Wohnung beschreiben',
      titleAr: 'مهمة الكتابة: وصف غرفتك أو شقتك والأثاث',
      instructionAr:
        'اكتب وصفاً لشقتك أو غرفتك المفضلة من 4 إلى 6 جمل: الموقع، الغرف، الأثاث الموجود (der Tisch, das Bett, der Schrank...)، وما إذا كانت مضاءة أو مريحة.',
      targetWordCount: { min: 30, max: 60 },
      starterPromptDe: 'Ich wohne in ... Meine Wohnung hat ...',
      suggestedWords: ['die Wohnung', 'das Zimmer', 'groß', 'hell', 'gemütlich', 'stehen'],
      sampleModelAnswerDe:
        'Ich wohne in einer gemütlichen Wohnung in Berlin. Mein Zimmer ist nicht sehr groß, aber wunderbar hell. In meinem Zimmer stehen ein Bett, ein Schreibtisch und ein bequemer Stuhl. An der Wand hängt ein Regal mit vielen deutschen Büchern. Ich lerne hier jeden Tag sehr gerne.',
      sampleModelAnswerAr:
        'أنا ساكن فـ برطمة دافئة ومريحة فـ برلين. بيتي ماشي كبير بزاف ولكن مضاوي بشكل رائع. فـ بيتي كاين ناموسية، بيرو وكرسي مريح. فـ الحيط معلقة رفوف فيها كتوبا بزايد بالألمانية. كيعجبني نقرا هنا كل نهار.',
    },
  },

  5: {
    dayNumber: 5,
    themeTitleDe: 'Studium & Campusleben',
    themeTitleAr: 'الدراسة الجامعية والحياة في الحرم الجامعي',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Easy German - Studieren an einer deutschen Universität',
      titleAr: 'الحياة الطلابية والدراسة في ألمانيا',
      sourceName: 'Easy German',
      youtubeId: 'B1qXz2k2k11',
      fallbackUrl: 'https://www.youtube.com/results?search_query=easy+german+universitaet+studieren',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'استمع للطلاب وهم يتحدثون عن تخصصاتهم الجامعية (Informatik, Medizin, Sprachen) وعن مرافق الجامعة (Mensa, Bibliothek, Campus).',
      keyPhrasesToListenFor: [
        { german: 'Ich studiere Informatik an der TU München.', darija: 'كنقرا الإعلاميات فـ جامعة ميونخ التقنية.' },
        { german: 'Wir essen mittags in der Mensa.', darija: 'كنتغداو فـ المطعم الجامعي (المينزا).' },
        { german: 'Ich lerne jeden Tag in der Bibliothek.', darija: 'كنقرا كل نهار فـ المكتبة الجامعية.' },
      ],
    },
    readingSession: {
      titleDe: 'Ein Tag an der Humboldt-Universität',
      titleAr: 'يوم في جامعة هومبولت ببرلين',
      germanText:
        'Tarek studiert Maschinenbau im zweiten Semester. Morgens um acht Uhr fährt er mit der U-Bahn zur Universität. Um neun Uhr beginnt seine erste Vorlesung im großen Hörsaal. Die Vorlesung dauert neunzig Minuten. Um zwölf Uhr trifft Tarek seine Kommilitonen in der Mensa. Sie essen zu Mittag und trinken Apfelschorle. Nachmittags liest er Fachbücher in der Bibliothek. Das Studium ist anstrengend, aber sehr interessant.',
      darijaTranslation:
        'طارق كيقرا الهندسة الميكانيكية فـ الفصل الثاني. فـ الصباح مع التمنية كيمشي فـ الميترو للجامعة. مع التسعود كتبدا أول محاضرة ديالو فـ المدرج الكبير. المحاضرة كدوم 90 دقيقة. مع الطناش كيتلاقى طارق صحابو فـ المينزا. كيتغداو وكيشربو عصير التفاح بالغاز. فـ العشية كيقرا كتوبة التخصص فـ المكتبة. القراية فيها تمارة ولكن ممتعة ومهمة بزاف.',
      vocabularyHighlight: ['studieren', 'die Universität', 'die Vorlesung', 'die Mensa', 'die Bibliothek'],
      comprehensionQuiz: [
        {
          questionAr: 'ما هو التخصص الجامعي الذي يدرسه طارق؟',
          options: ['الطب البشري', 'الهندسة الميكانيكية (Maschinenbau)', 'الأدب الألماني'],
          correctIndex: 1,
          explanationAr: 'في النص: "Tarek studiert Maschinenbau".',
        },
        {
          questionAr: 'أين يلتقي طارق بزملائه لتناول وجبة الغداء؟',
          options: ['في المقهى الخارجي', 'في المطعم الجامعي (in der Mensa)', 'في محطة القطار'],
          correctIndex: 1,
          explanationAr: 'مذكور: "trifft Tarek seine Kommilitonen in der Mensa".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Mein Traumstudium',
      titleAr: 'مهمة الكتابة: دراستي أو تخصص أحلامي',
      instructionAr:
        'اكتب فقرة من 4 إلى 6 جمل تتحدث فيها عن دراستك أو عملك أو ما ترغب في دراسته في ألمانيا: التخصص، المدينة، والسبب وراء اختيارك.',
      targetWordCount: { min: 25, max: 55 },
      starterPromptDe: 'Ich möchte in Deutschland studieren ...',
      suggestedWords: ['studieren', 'das Fach', 'die Universität', 'die Bibliothek', 'interessant'],
      sampleModelAnswerDe:
        'Ich möchte gerne Informatik in Deutschland studieren. Deutschland hat ausgezeichnete Universitäten und moderne Labore. Nach den Vorlesungen möchte ich mit internationalen Studenten in der Mensa essen und in der Bibliothek lernen. Ich freue mich sehr auf diese Zukunft.',
      sampleModelAnswerAr:
        'كنتمنى نقرا الإعلاميات فـ ألمانيا. ألمانيا فيها جامعات واعرة ومختبرات عصرية. مور المحاضرات بغيت ناكل مع طلبة دوليين فـ المينزا ونراجع فـ المكتبة. متحمس بزاف لهاد المستقبل.',
    },
  },

  6: {
    dayNumber: 6,
    themeTitleDe: 'Städte & Freizeitorte',
    themeTitleAr: 'المدن والأماكن الترفيهية والتنقل',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Nicos Weg A1 - In der Stadt',
      titleAr: 'التجول في المدينة وزيارة المعالم',
      sourceName: 'Deutsche Welle',
      youtubeId: 'Z19c0G2k20k',
      fallbackUrl: 'https://learngerman.dw.com/de/in-der-stadt/l-37324317',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'انتبه لأسماء الأماكن العامة: der Park, das Museum, der Bahnhof, die Straße، وطريقة السؤال: Wo ist hier...?',
      keyPhrasesToListenFor: [
        { german: 'Wo ist der Bahnhof? – Gleich um die Ecke.', darija: 'فين كاينا محطة التران؟ – ضورة هنا فـ القنت.' },
        { german: 'Wir gehen heute ins Museum.', darija: 'اليوم غنمشيو للمتحف.' },
      ],
    },
    readingSession: {
      titleDe: 'Ein schöner Samstag in Hamburg',
      titleAr: 'سبت جميل في مدينة هامبورغ',
      germanText:
        'Hamburg ist eine fantastische Stadt am Wasser. Am Samstag besuche ich den berühmten Hafen. Überall sieht man große Schiffe und Möwen. Danach laufe ich durch die historische Speicherstadt. Viele Touristen machen hier Fotos. Am Nachmittag treffe ich meinen Freund Jan im Park. Das Wetter ist sonnig und angenehm warm.',
      darijaTranslation:
        'هامبورغ مدينة رائعة على الما. نهار السبت مشيت زرت المرسى الشهير. فـ كل بلاصة كتشوف بواخر كبار وطائر النورس. من بعد تمشيت فـ حي المخازن التاريخي (Speicherstadt). بزاف د السياح كياخدو تصاور هنا. فـ العشية تلاقيت صاحبي يان فـ الجردة. الجو مشمش ودافي زوين.',
      vocabularyHighlight: ['die Stadt', 'der Hafen', 'der Park', 'besuchen', 'das Wetter'],
      comprehensionQuiz: [
        {
          questionAr: 'أي مدينة ألمانية تدور حولها هذه الزيارة؟',
          options: ['برلين', 'هامبورغ (Hamburg)', 'ميونيخ'],
          correctIndex: 1,
          explanationAr: 'في النص: "Hamburg ist eine fantastische Stadt".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Meine Lieblingsstadt',
      titleAr: 'مهمة الكتابة: مدينتي المفضلة وأماكنها الترفيهية',
      instructionAr: 'اكتب 4-6 جمل تصف فيها مدينتك المفضلة، موقعها، وما الذي يمكن للمرء زيارته هناك.',
      targetWordCount: { min: 25, max: 50 },
      starterPromptDe: 'Meine Lieblingsstadt ist ...',
      suggestedWords: ['die Stadt', 'schön', 'besuchen', 'der Park', 'das Zentrum'],
      sampleModelAnswerDe:
        'Meine Lieblingsstadt ist Marrakesch. Sie liegt im Süden von Marokko. Die Altstadt und der Platz Djemaa el Fna sind weltberühmt. Man kann viele historische Paläste besuchen und leckeres Essen probieren.',
      sampleModelAnswerAr: 'مدينتي المفضلة هي مراكش. كاينة فـ جنوب المغرب...',
    },
  },

  7: {
    dayNumber: 7,
    themeTitleDe: 'Uhrzeit, Termine & Wochentage',
    themeTitleAr: 'الوقت والمواعيد وأيام الأسبوع',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Nicos Weg A1 - Wie spät ist es?',
      titleAr: 'كم الساعة؟ تنظيم المواعيد والوقت',
      sourceName: 'Deutsche Welle',
      youtubeId: '2bcdZX5W7eA',
      fallbackUrl: 'https://learngerman.dw.com/de/die-uhrzeit/l-37330598',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'ركز على الفرق بين الوقت الرسمي (14:30 = vierzehn Uhr dreißig) والوقت العامي (halb drei). سجل كيف يتم تحديد المواعيد!',
      keyPhrasesToListenFor: [
        { german: 'Wie viel Uhr ist es? – Es ist viertel vor drei.', darija: 'شحال فـ الساعة؟ – التلاتة قل قسم.' },
        { german: 'Haben Sie am Dienstag Zeit?', darija: 'واش مسالي نهار التلات؟' },
        { german: 'Ich habe um zehn Uhr einen Termin.', darija: 'عندي موعد مع العشرات د الصباح.' },
      ],
    },
    readingSession: {
      titleDe: 'Ein voller Terminkalender',
      titleAr: 'جدول مواعيد مزدحم',
      germanText:
        'Mein Name ist Jonas und diese Woche habe ich viele wichtige Termine. Am Montag um neun Uhr habe ich eine Vorlesung an der Universität. Am Mittwoch um halb drei muss ich zum Arzt. Am Freitagabend habe ich frei und treffe Freunde um zwanzig Uhr im Restaurant. Pünktlichkeit ist in Deutschland sehr wichtig, deshalb komme ich immer fünf Minuten früher!',
      darijaTranslation:
        'سميتي يوناس وهاد السيمانة عندي مواعيد مهمة بزايد. نهار التنين مع التسعود عندي محاضرة فـ الجامعة. نهار لاربعا مع الجوج ونص خاصني نمشي عند الطبيب. نهار الجمعة فـ العشية أنا مسالي وغنتلاقى صحابي مع التمنية د الليل فـ الريسطورة. الانضباط فـ الوقت مهم بزاف فـ ألمانيا، داكشي علاش كنجي ديما 5 دقائق قبل الوقت!',
      vocabularyHighlight: ['die Uhrzeit', 'der Termin', 'der Kalender', 'pünktlich', 'die Stunde'],
      comprehensionQuiz: [
        {
          questionAr: 'متى موعد زيارة الطبيب لدى يوناس؟',
          options: ['الإثنين في التاسعة', 'الأربعاء في الثانية والنصف (halb drei)', 'الجمعة مساءً'],
          correctIndex: 1,
          explanationAr: 'في النص: "Am Mittwoch um halb drei muss ich zum Arzt".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Mein Wochenplan',
      titleAr: 'مهمة الكتابة: جدول مواعيدي الأسبوعية بالأوقات',
      instructionAr: 'اكتب فقرة من 4 إلى 6 جمل تذكر فيها مواعيدك خلال أيام الأسبوع باستعمال الساعات وحروف الجر (am, um).',
      targetWordCount: { min: 30, max: 55 },
      starterPromptDe: 'Am Montag um acht Uhr ...',
      suggestedWords: ['der Wochentag', 'der Termin', 'die Uhrzeit', 'pünktlich', 'am', 'um'],
      sampleModelAnswerDe:
        'Am Montag stehe ich um sieben Uhr auf und lerne Deutsch. Am Mittwoch habe ich um vierzehn Uhr einen Termin beim Amt. Am Samstag treffe ich meine Freunde um neunzehn Uhr. Ich bin immer sehr pünktlich!',
      sampleModelAnswerAr: 'نهار التنين كنفيق مع السبعة وكنقرا الألمانية...',
    },
  },

  8: {
    dayNumber: 8,
    themeTitleDe: 'Im Supermarkt: Lebensmittel & Akkusativ',
    themeTitleAr: 'في السوبرماركت: المواد الغذائية والكميات وحالة Akkusativ',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'Easy German - Einkaufen im Supermarkt',
      titleAr: 'التسوق وشراء الخضار والفواكه في متجر ألماني',
      sourceName: 'Easy German',
      youtubeId: '9UqH5T0yqK8',
      fallbackUrl: 'https://www.youtube.com/results?search_query=easy+german+supermarkt',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'استمع للمقادير (ein Kilo, ein Liter, zwei Packungen) وكيف يتحول المذكر في Akkusativ: "Ich brauche einen Apfel".',
      keyPhrasesToListenFor: [
        { german: 'Ich brauche ein Kilo Äpfel und eine Flasche Milch.', darija: 'محتاج كيلو د التفاح وقرعة د الحليب.' },
        { german: 'Wo finde ich das Olivenöl?', darija: 'فين نلقى زيت العود؟' },
        { german: 'Das Obst ist heute im Angebot sehr billig.', darija: 'الفواكه اليوم رخيصة فـ البروموسيون.' },
      ],
    },
    readingSession: {
      titleDe: 'Samstagseinkauf für die WG',
      titleAr: 'تسوق يوم السبت للسكن المشترك',
      germanText:
        'Am Samstagmorgen gehe ich in den großen Supermarkt. Ich nehme einen Einkaufskorb am Eingang. Auf meiner Einkaufsliste stehen viele Lebensmittel: ein Kilo Tomaten, zwei Packungen Nudeln, eine Flasche Olivenöl und frisches Obst. An der Kasse bezahle ich mit EC-Karte. Die Lebensmittel kosten zusammen einundzwanzig Euro.',
      darijaTranslation:
        'صباح نهار السبت مشيت للسوبرماركت الكبير. خديت سلة التسوق عند الدخلة. فـ ورقة السخرة ديالي كاين بزاف د المأكولات: كيلو د مطيشة، جوج باكيات ليباط، قرعة د زيت العود وفواكه طرية. فـ لاكاس خلصت بـ الكارطة. السخرة كاملة تقامت بـ 21 يورو.',
      vocabularyHighlight: ['das Lebensmittel', 'die Packung', 'die Flasche', 'das Obst', 'die Kasse'],
      comprehensionQuiz: [
        {
          questionAr: 'كيف دفع المشتري الحساب في الصندوق؟',
          options: ['نقداً كاش', 'بالبطاقة البنكية (mit EC-Karte)', 'بالشيك'],
          correctIndex: 1,
          explanationAr: 'في النص: "An der Kasse bezahle ich mit EC-Karte".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Mein Einkaufszettel',
      titleAr: 'مهمة الكتابة: قائمة التسوق لشراء وجبة عشاء',
      instructionAr: 'اكتب فقرة تصف فيها ما تشتريه لتحضير وجبة عشاء مستعملاً المقادير وأفعال Akkusativ (kaufen, brauchen).',
      targetWordCount: { min: 25, max: 50 },
      starterPromptDe: 'Heute Abend koche ich. Im Supermarkt kaufe ich ...',
      suggestedWords: ['brauchen', 'kaufen', 'ein Kilo', 'eine Flasche', 'das Gemüse'],
      sampleModelAnswerDe:
        'Heute koche ich ein leckeres Abendessen. Ich gehe in den Supermarkt und kaufe ein Kilo Kartoffeln, frisches Gemüse und eine Flasche Wasser. Die Sachen sind sehr frisch und nicht teuer.',
      sampleModelAnswerAr: 'اليوم غنطيب عشا لذيذ. غنمشي للسوبرماركت ونشري...',
    },
  },

  9: {
    dayNumber: 9,
    themeTitleDe: 'Wochenendausflug & Akkusativ-Pronomen',
    themeTitleAr: 'رحلة نهاية الأسبوع وضمائر المفعول به Akkusativ',
    recommendedMinutes: 15,
    videoSession: {
      titleDe: 'DW Deutsch - Ausflug ans Meer',
      titleAr: 'رحلة بالقطار إلى البحر واستعمال التذاكر',
      sourceName: 'Deutsche Welle',
      youtubeId: 'Z19c0G2k20k',
      fallbackUrl: 'https://learngerman.dw.com/de/fahrkarten-kaufen/l-37334812',
      durationEstimate: '10 - 15 دقيقة',
      listeningMissionAr:
        'استمع لشراء تذكرة قطار (Fahrkarte nach...), وللضمائر الشخصية: "Er lädt uns ein", "Ruf mich an!"',
      keyPhrasesToListenFor: [
        { german: 'Ich rufe dich heute Abend an.', darija: 'غانعيط ليك هاد العشية فـ التليفون.' },
        { german: 'Der Zug fährt von Gleis vier ab.', darija: 'التران غاينطلق من السكة ربعة.' },
      ],
    },
    readingSession: {
      titleDe: 'Ausflug auf die Insel Rügen',
      titleAr: 'رحلة إلى جزيرة روغن الألمانية',
      germanText:
        'Jan lädt uns am Wochenende zu einem tollen Ausflug ein. Wir fahren mit dem Zug nach Rügen. Ich kaufe die Fahrkarten online auf meinem Handy. Am Hauptbahnhof treffen wir Jan um acht Uhr. Der Zug ist modern und sehr pünktlich. An der Ostsee besichtigen wir die weißen Kreidefelsen und übernachten in einem kleinen Hotel.',
      darijaTranslation:
        'يان عرض علينا فـ نهاية الأسبوع لواحد التحويسة واعرة. غانمشيو فـ التران لجزيرة روغن. شريت التذاكر فـ التيليفون ديالي. فـ محطة التران الكبيرة تلاقينا يان مع التمنية. التران عصري وجا فـ الوقت نيشان. فـ بحر البلطيق زرنا الصخور البيضاء وباتنا فـ أوطيل صغير.',
      vocabularyHighlight: ['der Ausflug', 'die Fahrkarte', 'anrufen', 'einladen', 'der Hauptbahnhof'],
      comprehensionQuiz: [
        {
          questionAr: 'كيف اشترى التذاكر في النص؟',
          options: ['من شباك المحطة', 'إلكترونياً على الهاتف (online auf dem Handy)', 'من عند السائق'],
          correctIndex: 1,
          explanationAr: 'في النص: "Ich kaufe die Fahrkarten online auf meinem Handy".',
        },
      ],
    },
    writingSession: {
      titleDe: 'Schreibaufgabe: Einladung zum Ausflug',
      titleAr: 'مهمة الكتابة: دعوة صديق لرحلة نهاية الأسبوع',
      instructionAr: 'اكتب رسالة بريد إلكتروني قصيرة تدعو فيها صديقاً لرحلة بالقطار (الساعة، الوجهة، والدعوة).',
      targetWordCount: { min: 30, max: 55 },
      starterPromptDe: 'Lieber Jan, am Wochenende möchte ich ...',
      suggestedWords: ['der Ausflug', 'der Zug', 'die Fahrkarte', 'einladen', 'mitkommen'],
      sampleModelAnswerDe:
        'Lieber Karim, hast du am Samstag Zeit? Ich lade dich zu einem Ausflug nach Hamburg ein. Der Zug fährt um neun Uhr ab. Kommst du mit? Ruf mich bitte heute Abend an!',
      sampleModelAnswerAr: 'عزيزي كريم، واش مسالي السبت؟ كنعرض عليك لرحلة لهامبورغ...',
    },
  },
};

// Helper for fallback days (10 to 24) to ensure dynamic, rich content is always returned
export function getDailyImmersion(dayNumber: number): DailyImmersionData {
  const segment = calculateVideoSegment(dayNumber);
  let base: DailyImmersionData;

  if (DAILY_IMMERSION_RESOURCES[dayNumber]) {
    base = { ...DAILY_IMMERSION_RESOURCES[dayNumber] };
  } else {
    // Generic structured template generator for days 10 through 24
    const fallbackThemes: Record<number, { titleDe: string; titleAr: string; readTextDe: string; readTextAr: string; writePromptAr: string }> = {
    10: {
      titleDe: 'Modalverben & Lebensqualität in der Stadt',
      titleAr: 'الأفعال المساعدة können, müssen, dürfen وجودة الحياة بالمدينة',
      readTextDe:
        'In einer Stadt mit hoher Lebensqualität kann man viele Dinge tun. Man darf im Park auf der Wiese sitzen und grillen. Aber man muss Rücksicht auf die Nachbarn nehmen. In der Nacht darf man keinen Lärm machen. Viele Menschen fahren mit dem Fahrrad zur Arbeit, weil es gesund ist und die Umwelt schützt.',
      readTextAr:
        'فـ مدينة فيها جودة عيش عالية يمكن للإنسان يدير بزاف د الحوايج. مسموح تجلس فـ الربيع د الجردة وتشوي. ولكن خاص تحترم الجيران. فـ الليل ممنوع الصداع. بزاف د الناس كيمشيو فـ البيكالة للخدمة حيت صحية وكتحمي البيئة.',
      writePromptAr: 'اكتب فقرة من 4 إلى 6 جمل تصف فيها ما يمكنك وما يجب عليك وما لا يُسمح بفعله في مدينتك (können, müssen, dürfen).',
    },
    11: {
      titleDe: 'Freizeit im Grünen & Begründungen mit „denn“',
      titleAr: 'الترفيه في الطبيعة والتعليل بأداة denn',
      readTextDe:
        'Am Sonntag will meine Familie einen schönen Ausflug an den See machen. Wir packen einen großen Picknickkorb ein, denn das Wetter soll warm und sonnig werden. Wir wollen schwimmen und uns erholen, denn die Arbeitswoche war sehr lang. Zeit in der Natur ist die beste Medizin.',
      readTextAr:
        'نهار الحد العائلة ديالي بغات تدير خرجة زوينة للبحيرة. كانوجدو سلة نزهة كبيرة، حيت الجو غايكون دافي ومشمش. بغينا نعومو ونرتاحو حيت سيمانة الخدمة كانت طويلة. الوقت فـ الطبيعة أحسن دوا.',
      writePromptAr: 'اكتب عن خططك الترفيهية للأسبوع القادم مستعملاً فعل wollen وأداة التعليل denn في جملتين على الأقل.',
    },
    12: {
      titleDe: 'Telefonieren im Büro & Höfliche Bitten',
      titleAr: 'المحادثات الهاتفية في العمل وصيغ الأدب',
      readTextDe:
        'Guten Tag, mein Name ist Samir Alami von der Firma TechnoSoft. Könnte ich bitte Herrn Weber aus der Buchhaltung sprechen? Er ist gerade in einer Besprechung? Kein Problem, ich hinterlasse gerne eine kurze Nachricht. Könnte er mich bitte um fünfzehn Uhr zurückrufen? Meine Nummer ist 0176 1234567. Vielen Dank und auf Wiederhören!',
      readTextAr:
        'نهار مبروك، سميتي سمير العلمي من شركة تكنوسوفت. واش ممكن عافاك نهضر مع السيد فيبر من المحاسبة؟ راه دابا فـ رينيون؟ ماشي مشكل، نخلي ليه ميساج قصير. واش يقدر يعاود يصوني عليا مع التلاتة د العشية؟ النمرة ديالي هي 0176... شكراً بزاف وإلى اللقاء فـ التليفون!',
      writePromptAr: 'اكتب حواراً هاتفياً رسمياً مع سكرتيرة في شركة ألمانية تطلب فيه التحدث إلى مدير المبيعات بأدب (Könnte ich bitte...).',
    },
    13: {
      titleDe: 'Hobbys & Freizeitaktivitäten',
      titleAr: 'الهوايات والأنشطة الأسبوعية والأفعال المتغيرة',
      readTextDe:
        'In meiner Freizeit habe ich viele schöne Hobbys. Am Wochenende fahre ich oft mit dem Fahrrad an den Fluss oder treffe meine besten Freunde im Café. Abends lese ich gerne spannende deutsche Bücher, um neue Vokabeln zu lernen. Mein Bruder kocht sehr gerne marokkanischen Couscous für die ganze Familie.',
      readTextAr:
        'فـ وقت الفراغ عندي هوايات زوينة. فـ الويكاند كنسوك البيكالة حتى للواد ولا كنتلاقى صحابي فـ القهوة. فـ العشية كيعجبني نقرا كتوبا ألمانية مشوقة باش نتعلم كلمات جداد. خويا كيعجبو يطيب كسكسو مغربي للعائلة كاملة.',
      writePromptAr: 'اكتب فقرة من 4 إلى 6 جمل عن هواياتك في عطلة نهاية الأسبوع مستعملاً الأفعال fahren و lesen و treffen.',
    },
    14: {
      titleDe: 'Unisport & Trennbare Verben',
      titleAr: 'الرياضة الجامعية والأفعال المنفصلة trennbare Verben',
      readTextDe:
        'Das neue Semester fängt nächste Woche an. Ich melde mich sofort beim Universitätssport an. Der Basketballkurs fängt jeden Dienstag um achtzehn Uhr an und hört um zwanzig Uhr auf. Mein Freund Jan macht auch mit. Nach dem Sport gehen wir zusammen aus und trinken frischen Orangensaft. Sport hält uns fit!',
      readTextAr:
        'الدورة الجامعية كتبدا السيمانة الجاية. تسجلت فوراً فـ الرياضة الجامعية. حصة كرة السلة كتبدا كل تلات مع الستة وكتسالي مع التمنية. صاحبي يان حتى هو مشارك معنا. مورا الرياضة كنخرجو نشربو عصير الليمون. الرياضة كتحافظ على لا فورم!',
      writePromptAr: 'اكتب عن روتينك اليومي مستعملاً 3 أفعال منفصلة على الأقل (aufstehen, anfangen, aufhören, mitmachen, ausgehen).',
    },
    15: {
      titleDe: 'Wochenend-Rückblick im Perfekt',
      titleAr: 'استعراض أحداث نهاية الأسبوع بزمن الماضي Perfekt',
      readTextDe:
        'Gestern habe ich ein wunderbares Wochenende in Köln erlebt. Am Samstag bin ich früh aufgestanden und mit dem Zug gefahren. Dort habe ich den berühmten Dom besichtigt und viele Fotos gemacht. Am Nachmittag habe ich mit Freunden im Park Fußball gespielt. Es ist ein toller Tag gewesen und ich habe sehr viel gelacht!',
      readTextAr:
        'البارح عشت ويكاند رائع فـ كولونيا. نهار السبت فقت بكري ومشيت فـ التران. تما زرت الكاتدرائية الشهيرة وخديت بزاف د التصاور. فـ العشية لعبت كورة مع صحابي فـ الجردة. كان نهار زوين بزاف وضحكنا فيه بزاف!',
      writePromptAr: 'اكتب فقرة في زمن الماضي Perfekt تصف فيها 4 أشياء قمت بها بالأمس أو في عطلة نهاية الأسبوع الماضية (haben/sein + Partizip II).',
    },
    16: {
      titleDe: 'WG-Zimmer-Suche & Unregelmäßige Perfekt-Verben',
      titleAr: 'البحث عن سكن مشترك WG وأفعال الماضي الشاذة',
      readTextDe:
        'Letzte Woche bin ich nach Frankfurt umgezogen. Die Wohnungssuche war nicht einfach, aber ich habe endlich eine gemütliche 3er-WG gefunden. Gestern habe ich den Mietvertrag unterschrieben und die Kaution bezahlt. Meine neuen Mitbewohner sind sehr freundlich und wir haben gestern Abend zusammen Pizza gegessen.',
      readTextAr:
        'السيمانة الفايتة رحلت لـ فرانكفورت. التقليب على السكن ما كانش ساهل، ولكن أخيراً لقيت سكن مشترك WG لـ 3 د الناس مريح. البارح سينيت العقد د الكراء وخلصت الضمانة. الزملاء الجداد ضريفين والبارح تعشينا بيتزا مجموعين.',
      writePromptAr: 'اكتب إعلاناً قصيراً تبحث فيه عن غرفة في سكن مشترك WG تذكر فيه ميزانيتك ومواصفاتك.',
    },
    17: {
      titleDe: 'Möbel einrichten mit Dativ-Präpositionen',
      titleAr: 'ترتيب الأثاث وحروف الجر مع حالة Dativ (Wo?)',
      readTextDe:
        'Mein neues Zimmer ist jetzt komplett eingerichtet. Das große Bett steht an der Wand neben dem Fenster. Der moderne Schreibtisch steht vor dem Regal. Auf dem Schreibtisch steht meine Lampe. Unter dem Tisch liegt ein weicher Teppich. Alles steht am richtigen Platz und mein Zimmer sieht sehr gemütlich aus.',
      readTextAr:
        'بيتي الجديد دابا مفرش كامل. الناموسية الكبيرة كاينة عند الحيط حدا الشرجم. البيرو العصري كاين قدام الرفوف. فوق البيرو كاين الضو ديالي. تحت الطبلة كاينة زربية رطبة. كل حاجة فـ بلاصتها والبيت كيبان دافي.',
      writePromptAr: 'صف موقع 4 قطع أثاث في غرفتك باستعمال حروف الجر المكانية وحالة Dativ (auf dem, an der, neben dem...).',
    },
    18: {
      titleDe: 'WG-Leben: Putzplan & Haushaltsregeln',
      titleAr: 'حياة السكن المشترك وجدول النظافة وقواعد المنزل',
      readTextDe:
        'In unserer WG haben wir klare Regeln für das Zusammenleben. Wir haben einen wöchentlichen Putzplan an der Küchentür. Diese Woche bin ich mit dem Badezimmer dran. Man muss das Geschirr nach dem Kochen sofort abwaschen und den Müll trennen. Ab zweiundzwanzig Uhr gilt im Haus absolute Nachtruhe, damit alle gut schlafen können.',
      readTextAr:
        'فـ السكن المشترك ديالنا كاينين قواعد واضحة للتعايش. عندنا جدول نظافة سيماني معلق فـ باب الكوزينة. هاد السيمانة الدور ديالي فـ الحمام. خاص بنادم يغسل المواعين مور الطياب فوراً ويفرز الزبل. من العشرة د الليل كاين الهدوء التام فـ الدار باش كولشي ينعس.',
      writePromptAr: 'اكتب 4 قواعد أساسية للنظافة والتعايش في سكن مشترك مستعملاً müssen و der Putzplan.',
    },
    19: {
      titleDe: 'Kleidung, Farben & Waschen',
      titleAr: 'الملابس والألوان والعناية بالأقمشة',
      readTextDe:
        'Für den Winter brauche ich warme Kleidung. Gestern habe ich einen dunkelblauen Pullover aus Wolle und eine schwarze Jacke gekauft. Man muss die Kleidung richtig waschen: Wollpullover wäscht man kalt mit speziellem Wollwaschmittel, damit sie nicht einlaufen. Die Farben bleiben dann lange schön und frisch.',
      readTextAr:
        'للشتوة محتاج حوايج دافيين. البارح شريت تريكو صوف زرق غامق وفيستة كحلة. خاص الحوايج يتغسلو بالطريقة الصحيحة: الصوف كيتغسل على البارد بصابون خاص باش ما يكمشش. الألوان كيبقاو زوينين ومحافظين على راسهم.',
      writePromptAr: 'صف الملابس التي ترتديها اليوم مع ذكر ألوانها وكيفية غسلها بالشكل الصحيح.',
    },
    20: {
      titleDe: 'Textilpflege & Der Imperativ',
      titleAr: 'صيغ الأمر الثلاث في تقديم النصائح والعناية بالغسيل',
      readTextDe:
        'Meine Mutter gibt mir immer gute Ratschläge für den Haushalt: „Pass gut auf deine Sachen auf! Wasch weiße Hemden immer bei sechzig Grad! Bügel die Hemden, bevor du zur Arbeit gehst! Und vergiss nicht das Waschmittel!“ Diese Imperativ-Sätze helfen mir sehr im Alltag.',
      readTextAr:
        'الواليدة ديالي كتعطيني ديما نصائح زوينة للدار: "رد البال لحوايجك! غسل القميجات البيضين ديما على 60 درجة! حدد القميجة قبل ما تمشي للخدمة! وما تنساش التيد!" هاد الجمل د الأمر كينفعوني بزاف فـ الحياة اليومية.',
      writePromptAr: 'اكتب 4 نصائح لصديقك بصيغة الأمر المفرد du (مثل: Wasch!, Bügel!, Pass auf!).',
    },
    21: {
      titleDe: 'Im Modegeschäft & Verben mit Dativ',
      titleAr: 'في متجر الملابس وأفعال المجرور gefallen و passen و stehen',
      readTextDe:
        'Heute bin ich im Modegeschäft in der Innenstadt. Ich probiere eine elegante blaue Hose an. Die Hose gefällt mir sehr gut, aber sie ist etwas zu eng, sie passt mir leider nicht. Die Verkäuferin bringt mir Größe L. Diese Größe passt mir perfekt und die Farbe steht mir ausgezeichnet!',
      readTextAr:
        'اليوم أنا فـ محل الحوايج فـ السنتر. قست سروال أزرق أنيق. السروال عجبني بزاف، ولكن ضيق شوية، ما جاش قدي. البائعة جابت ليا لاطاي L. هاد لاطاي جات قدي تماماً واللون جا معايا واعر بزاف!',
      writePromptAr: 'اكتب حواراً في محل ملابس تقيس فيه سترة وتستعمل أفعال: gefällt mir, passt mir, steht mir.',
    },
    22: {
      titleDe: 'Städtereise Bern & Schweizerdeutsch',
      titleAr: 'رحلة إلى العاصمة السويسرية برن وخصائص اللهجة',
      readTextDe:
        'Grüezi! Heute besuchen wir die Schweizer Bundesstadt Bern. Die historische Altstadt mit ihren Lauben ist wunderschön. Wir besichtigen den berühmten Zytglogge-Turm und das Berner Münster. Viele Menschen fahren hier mit dem Velo. In der Bäckerei kaufe ich ein leckeres Gipfeli und einen Kaffee.',
      readTextAr:
        'غرويتسي! اليوم زرنا العاصمة السويسرية برن. المدينة القديمة التاريخية بالرواق ديالها زوينة بزاف. زرنا برج الساعة الشهير والكاتدرائية. بزاف د الناس كيتنقلو بالبيكالة (Velo). وفـ المخبزة شريت كرواسون سويسري (Gipfeli) وقهوة.',
      writePromptAr: 'اكتب بطاقة بريدية سياحية من مدينة برن تصف فيها معلمين سياحيين والمصطلحات السويسرية التي تعلمتها.',
    },
    23: {
      titleDe: 'Sommer an der Aare & Indefinitpronomen',
      titleAr: 'الصيف على ضفاف نهر الآر والضمائر غير المحددة',
      readTextDe:
        'Im Sommer gehen alle Berner an die Aare. Man kann im kühlen Flusswasser wunderbar baden und schwimmen. Am Ufer sitzen viele Leute und grillieren Würstchen. Hat jemand eine Decke mitgebracht? Niemand hat Durst, denn wir haben viele Getränke. Hier hört man nichts außer dem Rauschen des Wassers.',
      readTextAr:
        'فـ الصيف كاع الناس فـ برن كيمشيو لنهر الآر. كيقدر بنادم يعوم فـ الما البارد المنعش. فـ الضفة جالسين الناس كيشويو الصوصيص. واش كاين شي حد جاب مانطا؟ حتى واحد ما فيه العطش حيت جبنا مشروبات بزايد. هنا ما كتسمع والو من غير صوت خرير الما.',
      writePromptAr: 'اكتب فقرة عن نزهة شواء صيفية مستعملاً jemand (شخص ما) و niemand (لا أحد) و etwas و nichts.',
    },
    24: {
      titleDe: 'Wegbeschreibung: Orientierung in der Stadt',
      titleAr: 'وصف الطريق والاتجاهات والتنقل في المدينة',
      readTextDe:
        'Entschuldigung, wie komme ich zum Hauptbahnhof? – Gehen Sie hier immer geradeaus bis zur großen Kreuzung. An der Ampel biegen Sie nach rechts ab und gehen über die historische Brücke. Gehen Sie die Bahnhofstraße entlang. Gleich an der nächsten Ecke sehen Sie den Hauptbahnhof. Es dauert nur fünf Minuten zu Fuß!',
      readTextAr:
        'سمح لي عافاك، كيفاش نوصل لمحطة التران الكبيرة؟ – سير نيشان نيشان حتى لـ لكوازما الكبيرة. فـ الضو الحمر ضور على اليمن ودوز فوق القنطرة التاريخية. تمشى على طول شارع المحطة. فـ القنت الجاي مباشرة غاتشوف محطة التران. كاتاخد غير 5 دقائق على رجلين!',
      writePromptAr: 'اكتب وصفاً مفصلاً لشخص يسألك عن الطريق من الفندق إلى أقرب محطة ميترو مستعملاً geradeaus و nach links/rechts و über.',
    },
  };

  const fallback = fallbackThemes[dayNumber] || fallbackThemes[10];

    base = {
      dayNumber,
      themeTitleDe: fallback.titleDe,
      themeTitleAr: fallback.titleAr,
      recommendedMinutes: 15,
      videoSession: {
        titleDe: `Nicos Weg A1 - Der Film (Tag ${dayNumber}: ${segment.startFormatted} – ${segment.endFormatted})`,
        titleAr: `فيلم Nicos Weg A1 • مقطع اليوم ${dayNumber} (من ${segment.startFormatted} إلى ${segment.endFormatted})`,
        sourceName: 'Deutsche Welle (Nicos Weg - Der Film)',
        youtubeId: segment.youtubeId,
        fallbackUrl: segment.youtubeDirectUrl,
        durationEstimate: `${segment.durationFormatted} (مقطع اليوم من فيلم 1h:43m)`,
        listeningMissionAr:
          'استمع للمشهد بتركيز، ركز على طريقة نطق الكلمات والجمل في سياق واقعي، وحاول كتابة 3 كلمات وجملة كاملة سمعتها أثناء المشاهدة.',
        keyPhrasesToListenFor: [
          { german: 'Entschuldigung, wo ist hier...?', darija: 'سمح لي، فين كاينة هنا...؟' },
          { german: 'Das ist eine tolle Idee!', darija: 'هادي فكرة واعرة بزاف!' },
          { german: 'Vielen Dank für Ihre Hilfe!', darija: 'شكراً بزاف على المساعدة ديالك!' },
        ],
        segment,
      },
      readingSession: {
        titleDe: fallback.titleDe,
        titleAr: fallback.titleAr,
        germanText: fallback.readTextDe,
        darijaTranslation: fallback.readTextAr,
        vocabularyHighlight: [],
        comprehensionQuiz: [
          {
            questionAr: 'ما هي الفكرة الأساسية من هذا النص؟',
            options: ['ممارسة المفردات اليومية في سياق واقعي ألماني', 'تعلم الطبخ الإيطالي', 'حجز تذكرة طيران'],
            correctIndex: 0,
            explanationAr: 'النص مصمم خصيصاً لتطبيق المفردات والقواعد المقررة لهذا اليوم.',
          },
        ],
      },
      writingSession: {
        titleDe: `Schreibaufgabe zu Tag ${dayNumber}`,
        titleAr: `مهمة التعبير الكتابي لليوم ${dayNumber}`,
        instructionAr: fallback.writePromptAr,
        targetWordCount: { min: 25, max: 55 },
        starterPromptDe: 'Heute habe ich gelernt ...',
        suggestedWords: ['heute', 'immer', 'sehr gut', 'wichtig', 'zusammen'],
        sampleModelAnswerDe: fallback.readTextDe,
        sampleModelAnswerAr: fallback.readTextAr,
      },
    };
  }

  // Ensure ALL 24 days get the exact segmented Nicos Weg movie clip with start and end times!
  base.videoSession = {
    ...base.videoSession,
    youtubeId: segment.youtubeId,
    sourceName: 'Deutsche Welle (Nicos Weg - Der Film • 1h 43m)',
    titleDe: `Nicos Weg A1 - Der Film (Tag ${dayNumber}: ${segment.startFormatted} – ${segment.endFormatted})`,
    titleAr: `فيلم Nicos Weg A1 • مقطع اليوم ${dayNumber} (من ${segment.startFormatted} إلى ${segment.endFormatted})`,
    durationEstimate: `${segment.durationFormatted} (مقطع اليوم من فيلم 1h:43m)`,
    fallbackUrl: segment.youtubeDirectUrl,
    segment,
  };

  return base;
}

/**
 * Check if a specific day's post-lesson immersion routine is 100% completed
 */
export function isImmersionDayComplete(dayNumber: number): boolean {
  try {
    const raw = localStorage.getItem(`german_immersion_day_${dayNumber}_v1`);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const checked = data.checkedItems;
    if (!checked) return false;
    // Core steps must all be confirmed: video, reading, writing, speaking, easyGerman
    const hasVideo = Boolean(checked.video);
    const hasReading = Boolean(checked.reading);
    const hasWriting = Boolean(checked.writing);
    const hasSpeaking = Boolean(checked.speaking);
    const hasEasyGerman = Boolean(checked.easyGerman);
    // At least all 5 essential tasks completed
    return hasVideo && hasReading && hasWriting && hasSpeaking && hasEasyGerman;
  } catch {
    return false;
  }
}

/**
 * Check if a day is unlocked in the post-lesson immersion routine.
 * Day 1 is always unlocked.
 * Day d (d > 1) is unlocked ONLY if Day (d - 1) is 100% completed in the immersion routine.
 */
export function isImmersionDayUnlocked(dayNumber: number, completedCourseDays: number[] = []): boolean {
  if (dayNumber <= 1) return true;
  // Day (dayNumber - 1) routine must be 100% completed
  return isImmersionDayComplete(dayNumber - 1);
}
