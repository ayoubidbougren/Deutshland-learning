export interface BookLessonTutorProfile {
  lessonNumber: number;
  titleDe: string;
  titleAr: string;
  subtitleAr: string;
  bookPages: string; // e.g. "8 – 17"
  level: 'A1';
  summaryAr: string;
  strictCeilingSummaryAr: string;
  allowedTopics: Array<{ titleDe: string; titleAr: string }>;
  allowedVerbs: string[];
  allowedGrammar: string[];
  forbiddenGrammar: string[];
  starterPrompts: Array<{ german: string; darija: string }>;
  sampleQuestionsFromTutor: Array<{ german: string; darija: string }>;
  firstTurnGreetingDe: string;
  firstTurnGreetingAr: string;
}

export const BOOK_LESSON_TUTOR_PROFILES: Record<number, BookLessonTutorProfile> = {
  1: {
    lessonNumber: 1,
    titleDe: 'Lektion 1: Ich und die anderen',
    titleAr: 'الدرس 1: أنا والآخرون',
    subtitleAr: 'التعريف بالنفس، السؤال عن الاسم والبلد، اللغات، الحروف والأرقام',
    bookPages: 'صفحة 8 إلى 17',
    level: 'A1',
    summaryAr:
      'الدرس الأول من الكتاب يركز على إلقاء التحية، تقديم النفس، السؤال عن اسم الشخص وبلده ومدينته ولغاته، تهجئة الحروف، وأرقام الهاتف من 0 إلى 20.',
    strictCeilingSummaryAr:
      '🔒 قفل المستوى الصارم لـ Lektion 1: ممنوع على الـ AI استعمال أزمنة الماضي (Perfekt)، ولا أفعال المودال (können/müssen)، ولا جمل مركبة (weil/dass)، ولا كلمات متقدمة. كيهضر فقط بجمل قصيرة جداً (3-6 كلمات) من محتوى هذا الدرس فقط!',
    allowedTopics: [
      { titleDe: 'Begrüßung & Verabschiedung', titleAr: 'التحية والوداع (Hallo, Guten Tag, Tschüss, Auf Wiedersehen)' },
      { titleDe: 'Name & Vorstellung', titleAr: 'الاسم والتعريف بالنفس (Wie heißen Sie? / Ich heiße...)' },
      { titleDe: 'Herkunft & Länder', titleAr: 'البلد والمدينة (Woher kommen Sie? / Ich komme aus Marokko...)' },
      { titleDe: 'Wohnort', titleAr: 'مكان السكن (Wo wohnen Sie? / Ich wohne in...)' },
      { titleDe: 'Sprachen', titleAr: 'اللغات (Welche Sprachen sprechen Sie? / Ich spreche Arabisch...)' },
      { titleDe: 'Alphabet & Buchstabieren', titleAr: 'الحروف والتهجئة (Wie schreibt man das? / Buchstabieren Sie bitte!)' },
      { titleDe: 'Zahlen (0-20) & Telefonnummer', titleAr: 'الأرقام 0-20 ورقم الهاتف (Wie ist Ihre Telefonnummer?)' },
      { titleDe: 'Befinden', titleAr: 'السؤال عن الحال (Wie geht es Ihnen? / Wie geht\'s? / Danke, gut!)' },
      { titleDe: 'Formell vs. Informell', titleAr: 'الفرق بين الرسمي (Sie) والودي (du)' },
    ],
    allowedVerbs: ['heißen', 'kommen', 'wohnen', 'sprechen', 'sein', 'arbeiten', 'studieren', 'buchstabieren', 'lernen'],
    allowedGrammar: [
      'تصريف الأفعال في الحاضر (Präsens) مع: ich, du, Sie, er, sie, wir',
      'ترتيب الجملة الألمانية: الفعل دائماً في المرتبة الثانية (Position 2)',
      'أسئلة الاستفهام W-Fragen: Wie, Woher, Wo, Was, Wer',
      'أسئلة نعم/لا (Ja/Nein-Fragen): Sprechen Sie Deutsch? / Wohnen Sie in Rabat?',
      'الأرقام البسيطة من 0 إلى 20',
      'أداة الاستفهام Wie للحال: Wie geht es Ihnen?',
    ],
    forbiddenGrammar: [
      '❌ ممنوع قطعاً الماضي: KEIN Perfekt (habe gemacht, bin gefahren) و KEIN Präteritum (war, hatte)',
      '❌ ممنوع قطعاً أفعال المودال: KEIN können, müssen, wollen, dürfen, sollen, möchten',
      '❌ ممنوع قطعاً الجمل الثانوية: KEINE Nebensätze mit weil, dass, wenn, obwohl',
      '❌ ممنوع أدوات النصب المعقدة (Akkusativ-Objekte mit Artikeln den/einen/keinen) لأنها في Lektion 2',
      '❌ ممنوع الجمل الطويلة: الجمل يجب ألا تتجاوز 4 إلى 6 كلمات',
      '❌ ممنوع المفردات المتقدمة: التسوق، السفر بالقطار، كراء المنازل، زيارة الطبيب',
    ],
    starterPrompts: [
      { german: 'Hallo! Guten Tag!', darija: 'أهلاً! نهارك سعيد!' },
      { german: 'Ich heiße ... und komme aus Marokko.', darija: 'اسمي ... وأنا من المغرب.' },
      { german: 'Wie heißen Sie?', darija: 'ما اسم حضرتك؟' },
      { german: 'Woher kommen Sie?', darija: 'من أين حضرتك؟' },
      { german: 'Ich wohne in Casablanca. Und Sie?', darija: 'أسكن في الدار البيضاء. وحضرتك؟' },
      { german: 'Ich spreche Arabisch und ein bisschen Deutsch.', darija: 'أتحدث العربية وقليلاً من الألمانية.' },
      { german: 'Buchstabieren Sie Ihren Namen bitte!', darija: 'تهجأ اسمك من فضلك!' },
      { german: 'Wie geht es Ihnen?', darija: 'كيف حالك حضرتك؟' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Guten Tag! Wie heißen Sie?', darija: 'نهارك سعيد! ما اسم حضرتك؟' },
      { german: 'Woher kommen Sie?', darija: 'من أين حضرتك؟' },
      { german: 'Wo wohnen Sie jetzt?', darija: 'أين تسكن الآن؟' },
      { german: 'Welche Sprachen sprechen Sie?', darija: 'ما هي اللغات التي تتحدثها؟' },
      { german: 'Wie buchstabiert man Ihren Vornamen?', darija: 'كيف يُتهجأ اسمك الشخصي؟' },
      { german: 'Wie ist Ihre Telefonnummer?', darija: 'ما هو رقم هاتفك؟' },
    ],
    firstTurnGreetingDe:
      'Guten Tag! Ich bin dein Deutsch-Tutor für Lektion 1. Wie heißt du und woher kommst du?',
    firstTurnGreetingAr:
      'نهارك سعيد! أنا مصححك ومساعدك الخاص بـ Lektion 1. شنو سميتك ومن أي بلد نتا؟',
  },

  2: {
    lessonNumber: 2,
    titleDe: 'Lektion 2: Menschen und Dinge',
    titleAr: 'الدرس 2: الناس والأشياء',
    subtitleAr: 'الأشياء والأجهزة، العائلة، المطعم، أدوات التعريف وقاعدة الأكوزاتيف (Akkusativ)',
    bookPages: 'صفحة 18 إلى 25',
    level: 'A1',
    summaryAr:
      'يركز هذا الدرس على تسمية الأشياء المكتبية واليومية، أفراد العائلة، الذهاب إلى المطعم، أدوات التعريف (der/das/die) والتنكير (ein/eine)، والنصب مع المذكر (den/einen/keinen)، والأرقام حتى 100.',
    strictCeilingSummaryAr:
      '🔒 قفل المستوى الصارم لـ Lektion 2: التركيز على أدوات التعريف والنصب (Akkusativ) والأشياء اليومية. ممنوع أزمنة الماضي (Perfekt) أو الجمل المركبة أو مواضيع السفر المتقدمة.',
    allowedTopics: [
      { titleDe: 'Gegenstände & Technik', titleAr: 'الأشياء والأجهزة (der Computer, das Handy, die Kamera...)' },
      { titleDe: 'Familie & Verwandte', titleAr: 'العائلة (der Vater, die Mutter, der Bruder...)' },
      { titleDe: 'Im Restaurant', titleAr: 'في المطعم والطلب البسيط (Ich nehme einen Kaffee...)' },
      { titleDe: 'Akkusativ (den / einen / keinen)', titleAr: 'حالة النصب للمذكر' },
      { titleDe: 'Possessivartikel (mein / dein)', titleAr: 'ضمائر الملكية البسيطة: mein, dein' },
      { titleDe: 'Zahlen 20 bis 100', titleAr: 'الأرقام من 20 إلى 100' },
    ],
    allowedVerbs: ['haben', 'brauchen', 'finden', 'nehmen', 'kaufen', 'kosten', 'sein', 'mögen'],
    allowedGrammar: [
      'حالة النصب Akkusativ: der -> den, ein -> einen, kein -> keinen',
      'ضمائر الملكية: mein/meine, dein/deine',
      'أداة النفي nicht و kein',
      'فعل haben وفعل brauchen مع Akkusativ',
    ],
    forbiddenGrammar: [
      '❌ ممنوع قطعاً الماضي: KEIN Perfekt و KEIN Präteritum',
      '❌ ممنوع الجمل الثانوية: KEINE Nebensätze mit weil, dass',
      '❌ ممنوع حروف الجر المعقدة مع الداتيف',
    ],
    starterPrompts: [
      { german: 'Ich brauche einen Computer.', darija: 'أحتاج إلى حاسوب.' },
      { german: 'Das ist mein Handy.', darija: 'هذا هاتفي المحمول.' },
      { german: 'Was kostet das?', darija: 'كم ثمن هذا؟' },
      { german: 'Ich nehme einen Orangensaft, bitte.', darija: 'سآخذ عصير برتقال من فضلك.' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Haben Sie ein Handy?', darija: 'هل لديك هاتف محمول؟' },
      { german: 'Brauchst du einen Kugelschreiber?', darija: 'هل تحتاج إلى قلم جاف؟' },
      { german: 'Wie heißt dein Vater?', darija: 'ما اسم والدك؟' },
    ],
    firstTurnGreetingDe:
      'Hallo! Willkommen zu Lektion 2 (Menschen und Dinge). Hast du einen Computer oder ein Smartphone?',
    firstTurnGreetingAr:
      'أهلاً بك في Lektion 2! هل تملك حاسوباً أو هاتفاً ذكياً؟',
  },

  3: {
    lessonNumber: 3,
    titleDe: 'Lektion 3: Unterwegs',
    titleAr: 'الدرس 3: في الطريق والسفر',
    subtitleAr: 'وسائل المواصلات، الطرق، تذاكر السفر، والمواعيد في المدينة',
    bookPages: 'صفحة 26 إلى 33',
    level: 'A1',
    summaryAr:
      'يتناول وسائل النقل (القطار، الحافلة، الطائرة)، السؤال عن الاتجاهات، شراء التذاكر، الأفعال المنفصلة (abfahren, ankommen)، وحروف الجر البسيطة.',
    strictCeilingSummaryAr:
      '🔒 قفل المستوى لـ Lektion 3: محصور في التنقل والمواصلات والأفعال المنفصلة. ممنوع الماضي أو الجمل المركبة.',
    allowedTopics: [
      { titleDe: 'Verkehrsmittel', titleAr: 'وسائل المواصلات (der Zug, der Bus, die U-Bahn, das Fahrrad)' },
      { titleDe: 'Wegbeschreibung', titleAr: 'وصف الطريق (geradeaus, links, rechts)' },
      { titleDe: 'Fahrkarten & Bahnhof', titleAr: 'التذاكر ومحطة القطار (Eine Fahrkarte nach Berlin, bitte)' },
      { titleDe: 'Uhrzeit & Abfahrt', titleAr: 'الساعة وموعد الانطلاق (Wann fährt der Zug ab?)' },
    ],
    allowedVerbs: ['fahren', 'abfahren', 'ankommen', 'umsteigen', 'nehmen', 'gehen', 'suchen'],
    allowedGrammar: [
      'الأفعال المنفصلة (Trennbare Verben): abfahren, ankommen, umsteigen',
      'حروف الجر مع المواصلات: mit dem Bus, mit der Bahn',
      'السؤال عن الوقت: Wie spät ist es? / Um wie viel Uhr...?',
    ],
    forbiddenGrammar: [
      '❌ ممنوع قطعاً الماضي: KEIN Perfekt و KEIN Präteritum',
      '❌ ممنوع الجمل الثانوية: KEIN weil, dass',
    ],
    starterPrompts: [
      { german: 'Ich fahre mit dem Zug.', darija: 'أسافر بالقطار.' },
      { german: 'Entschuldigung, wo ist der Bahnhof?', darija: 'معذرة، أين توجد محطة القطار؟' },
      { german: 'Wann fährt der Bus ab?', darija: 'متى تنطلق الحافلة؟' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Wie fahren Sie zur Arbeit oder zur Schule?', darija: 'كيف تذهب إلى العمل أو المدرسة؟' },
      { german: 'Fährst du lieber mit dem Zug oder mit dem Bus?', darija: 'هل تفضل السفر بالقطار أم بالحافلة؟' },
    ],
    firstTurnGreetingDe:
      'Guten Tag! Willkommen zu Lektion 3 (Unterwegs). Fährst du oft mit dem Zug oder mit dem Bus?',
    firstTurnGreetingAr:
      'نهارك سعيد! مرحباً بك في Lektion 3. هل تسافر غالباً بالقطار أم بالحافلة؟',
  },

  4: {
    lessonNumber: 4,
    titleDe: 'Lektion 4: Essen und Trinken',
    titleAr: 'الدرس 4: الأكل والمشروبات',
    subtitleAr: 'المواد الغذائية، التسوق في السوبرماركت، والوجبات اليومية',
    bookPages: 'صفحة 34 إلى 41',
    level: 'A1',
    summaryAr:
      'المأكولات، الخضر والفواكه، الوجبات اليومية (الفطور، الغداء، العشاء)، والكميات والأسعار في السوبرماركت والمطعم.',
    strictCeilingSummaryAr:
      '🔒 قفل المستوى لـ Lektion 4: محصور في الأكل والشرب والمشتريات والتفضيلات الغذائية.',
    allowedTopics: [
      { titleDe: 'Lebensmittel & Getränke', titleAr: 'الأغذية والمشروبات (Brot, Milch, Fleisch, Wasser...)' },
      { titleDe: 'Einkaufen im Supermarkt', titleAr: 'التسوق والكميات (ein Kilo, eine Flasche, ein Liter...)' },
      { titleDe: 'Mahlzeiten', titleAr: 'الوجبات (Frühstück, Mittagessen, Abendessen)' },
      { titleDe: 'Vorlieben & Geschmack', titleAr: 'التفضيل والمذاق (Ich esse gern... / Das schmeckt lecker)' },
    ],
    allowedVerbs: ['essen', 'trinken', 'kaufen', 'mögen', 'schmecken', 'kochen', 'brauchen'],
    allowedGrammar: [
      'فعل essen مع تغير الحرف (du isst, er isst)',
      'فعل möchten للتعبير عن الرغبة المهذبة: Ich möchte...',
      'الكميات والوحدات: Kilo, Gramm, Packung, Flasche',
    ],
    forbiddenGrammar: ['❌ ممنوع الماضي KEIN Perfekt', '❌ ممنوع الجمل الثانوية KEIN weil'],
    starterPrompts: [
      { german: 'Ich trinke gern Kaffee zum Frühstück.', darija: 'أحب شرب القهوة في وجبة الإفطار.' },
      { german: 'Ich brauche zwei Kilo Äpfel.', darija: 'أحتاج كيلوغرامين من التفاح.' },
      { german: 'Was isst du gern?', darija: 'ماذا تحب أن تأكل؟' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Was isst du gern zum Frühstück?', darija: 'ماذا تحب أن تأكل في الفطور؟' },
      { german: 'Trinken Sie lieber Tee oder Kaffee?', darija: 'هل تفضل شرب الشاي أم القهوة؟' },
    ],
    firstTurnGreetingDe:
      'Guten Tag! Willkommen zu Lektion 4 (Essen und Trinken). Was isst und trinkst du gern zum Frühstück?',
    firstTurnGreetingAr:
      'نهارك سعيد! مرحباً بك في Lektion 4. شنو كاتبغي تاكل وتشرب فـ الفطور؟',
  },

  5: {
    lessonNumber: 5,
    titleDe: 'Lektion 5: Wohnen',
    titleAr: 'الدرس 5: السكن والمنزل',
    subtitleAr: 'البيت والغرف، الأثاث، والموقع والإيجار',
    bookPages: 'صفحة 42 إلى 49',
    level: 'A1',
    summaryAr: 'وصف المنزل، الغرف، قطع الأثاث، الألوان والصفات (كبير، صغير، مضيء، هادئ)، وعقود الإيجار.',
    strictCeilingSummaryAr: '🔒 قفل المستوى لـ Lektion 5: محصور في مفردات السكن والأثاث والصفات.',
    allowedTopics: [
      { titleDe: 'Zimmer & Wohnung', titleAr: 'الغرف والمنزل (das Wohnzimmer, das Schlafzimmer, die Küche...)' },
      { titleDe: 'Möbel', titleAr: 'الأثاث (der Tisch, der Stuhl, das Bett, das Sofa...)' },
      { titleDe: 'Adjektive', titleAr: 'الصفات (groß, klein, hell, dunkel, teuer, billig)' },
      { titleDe: 'Miete & Lage', titleAr: 'الإيجار والموقع (Die Miete ist 500 Euro)' },
    ],
    allowedVerbs: ['wohnen', 'haben', 'sein', 'finden', 'kosten', 'gefallen'],
    allowedGrammar: ['استخدام الصفات بعد sein: Die Wohnung ist sehr groß', 'أدوات الإشارة والتعريف'],
    forbiddenGrammar: ['❌ ممنوع الماضي KEIN Perfekt', '❌ ممنوع الجمل المعقدة'],
    starterPrompts: [
      { german: 'Ich wohne in einer schönen Wohnung.', darija: 'أسكن في شقة جميلة.' },
      { german: 'Meine Küche ist groß und hell.', darija: 'مطبخي كبير ومضيء.' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Wie ist deine Wohnung? Groß oder klein?', darija: 'كيف هي شقتك؟ كبيرة أم صغيرة؟' },
      { german: 'Hast du einen Balkon oder einen Garten?', darija: 'هل لديك شرفة أو حديقة؟' },
    ],
    firstTurnGreetingDe:
      'Hallo! Willkommen zu Lektion 5 (Wohnen). Wie ist deine Wohnung oder dein Zimmer?',
    firstTurnGreetingAr: 'أهلاً بك في Lektion 5! كيف هي شقتك أو غرفتك؟',
  },

  6: {
    lessonNumber: 6,
    titleDe: 'Lektion 6: Mein Tag & Freizeit',
    titleAr: 'الدرس 6: يومي وأوقات الفراغ',
    subtitleAr: 'البرنامج اليومي، الهوايات، وأفعال المودال (können, müssen, wollen)',
    bookPages: 'صفحة 50 إلى 57',
    level: 'A1',
    summaryAr:
      'الأنشطة اليومية، الاستيقاظ، العمل، ممارسة الهوايات والرياضة، والمواعيد مع الأصدقاء باستخدام أفعال المودال.',
    strictCeilingSummaryAr:
      '🔒 قفل المستوى لـ Lektion 6: التركيز على الروتين اليومي وأفعال können / müssen / wollen.',
    allowedTopics: [
      { titleDe: 'Tagesablauf', titleAr: 'البرنامج اليومي (aufstehen, frühstücken, arbeiten, schlafen)' },
      { titleDe: 'Hobbys & Sport', titleAr: 'الهوايات والرياضة (Fußball spielen, Musik hören, lesen)' },
      { titleDe: 'Modalverben', titleAr: 'الأفعال المساعدة (können, müssen, wollen)' },
    ],
    allowedVerbs: ['können', 'müssen', 'wollen', 'aufstehen', 'anfangen', 'fernsehen', 'spielen', 'lesen'],
    allowedGrammar: ['تصريف Modalverben وموقع الفعل الثاني في المصدر بآخر الجملة'],
    forbiddenGrammar: ['❌ ممنوع الماضي المعقد والكونجونكتيف'],
    starterPrompts: [
      { german: 'Ich stehe um 7 Uhr auf.', darija: 'أستيقظ على الساعة السابعة.' },
      { german: 'Ich kann gut kochen.', darija: 'أستطيع الطبخ جيداً.' },
      { german: 'Ich muss heute Deutsch lernen.', darija: 'يجب أن أتعلم الألمانية اليوم.' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Wann stehst du morgens auf?', darija: 'متى تستيقظ صباحاً؟' },
      { german: 'Was machst du gern am Wochenende?', darija: 'ماذا تحب أن تفعل في عطلة نهاية الأسبوع؟' },
    ],
    firstTurnGreetingDe:
      'Hallo! Willkommen zu Lektion 6. Wann stehst du morgens auf und was machst du gern in der Freizeit?',
    firstTurnGreetingAr: 'مرحباً في Lektion 6! إمتى كتفيق فالصباح وشنو كادير فوقت الفراغ؟',
  },

  7: {
    lessonNumber: 7,
    titleDe: 'Lektion 7: Lernen und Arbeiten',
    titleAr: 'الدرس 7: التعلم والعمل',
    subtitleAr: 'الدراسة، المهن والوظائف، ومقدمة زمن الماضي Perfekt',
    bookPages: 'صفحة 58 إلى 65',
    level: 'A1',
    summaryAr:
      'التحدث عن المسار الدراسي والمهني، بيئة العمل، والبدء في التحدث عن أحداث الأمس باستخدام الماضي البسيط Perfekt.',
    strictCeilingSummaryAr: '🔒 قفل المستوى لـ Lektion 7: محصور في العمل والماضي التام (Perfekt) البسيط.',
    allowedTopics: [
      { titleDe: 'Beruf & Arbeit', titleAr: 'المهنة والعمل (Arzt, Lehrer, Ingenieur, Büro...)' },
      { titleDe: 'Lernen & Schule', titleAr: 'المدرسة والجامعة (Universität, Kurs, Prüfung...)' },
      { titleDe: 'Perfekt mit haben', titleAr: 'الماضي التام مع haben (Ich habe gelernt / gearbeitet)' },
    ],
    allowedVerbs: ['arbeiten', 'lernen', 'studieren', 'haben gemacht', 'haben gelernt', 'haben gearbeitet'],
    allowedGrammar: ['صياغة Perfekt البسيطة: haben + Partizip II (ge...t)'],
    forbiddenGrammar: ['❌ ممنوع الماضي المعقد أو صيغ الشرط Konjunktiv II'],
    starterPrompts: [
      { german: 'Ich arbeite als Ingenieur.', darija: 'أعمل كمهندس.' },
      { german: 'Gestern habe ich Deutsch gelernt.', darija: 'أمس تعلمت الألمانية.' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Was bist du von Beruf?', darija: 'ما هي مهنتك؟' },
      { german: 'Was hast du gestern gemacht?', darija: 'ماذا فعلت البارحة؟' },
    ],
    firstTurnGreetingDe:
      'Guten Tag! Willkommen zu Lektion 7. Was bist du von Beruf und was hast du gestern gemacht?',
    firstTurnGreetingAr: 'نهارك سعيد! مرحباً بك في Lektion 7. ما هي مهنتك وماذا فعلت البارحة؟',
  },

  8: {
    lessonNumber: 8,
    titleDe: 'Lektion 8: Einkaufen und Gesundheit',
    titleAr: 'الدرس 8: التسوق والصحة',
    subtitleAr: 'الملابس، الألوان، أعضاء الجسم، وعند الطبيب',
    bookPages: 'صفحة 66 إلى 73',
    level: 'A1',
    summaryAr:
      'شراء الملابس والأحذية، المقاسات، وصف أعضاء الجسم، الذهاب إلى الطبيب، ووصف الأعراض المرضية والأدوية البسيطة.',
    strictCeilingSummaryAr: '🔒 قفل المستوى لـ Lektion 8: محصور في التسوق والصحة وأعضاء الجسم.',
    allowedTopics: [
      { titleDe: 'Kleidung & Mode', titleAr: 'الملابس والمقاسات (die Hose, das Hemd, die Schuhe...)' },
      { titleDe: 'Körperteile & Gesundheit', titleAr: 'أعضاء الجسم والصحة (der Kopf, der Bauch, der Arm...)' },
      { titleDe: 'Beim Arzt & Schmerzen', titleAr: 'عند الطبيب والألم (Ich habe Kopfschmerzen / Mein Bauch tut weh)' },
      { titleDe: 'Ratschläge', titleAr: 'النصائح بالأمر والمودال sollen: Trinken Sie viel Wasser!' },
    ],
    allowedVerbs: ['anprobieren', 'passen', 'gefallen', 'wehtun', 'haben (Schmerzen)', 'nehmen (Tabletten)', 'sollen'],
    allowedGrammar: ['صيغة الألم: Mein Kopf tut weh / Ich habe Schmerzen', 'صيغة الأمر البسيطة Imperativ: Schlafen Sie gut!'],
    forbiddenGrammar: ['❌ قواعد المستوى A2 أو B1'],
    starterPrompts: [
      { german: 'Ich suche eine blaue Hose.', darija: 'أبحث عن سروال أزرق.' },
      { german: 'Mein Kopf tut weh.', darija: 'رأسي يؤلمني.' },
    ],
    sampleQuestionsFromTutor: [
      { german: 'Welche Kleidung trägst du gern?', darija: 'ما هي الملابس التي تحب ارتداءها؟' },
      { german: 'Geht es dir gut oder hast du Schmerzen?', darija: 'هل أنت بخير أم تشعر بأي ألم؟' },
    ],
    firstTurnGreetingDe:
      'Hallo! Willkommen zu Lektion 8. Wie fühlst du dich heute? Geht es dir gut?',
    firstTurnGreetingAr: 'أهلاً بك في Lektion 8. كيف تشعر اليوم؟ هل أنت بخير؟',
  },
};

export function getBookLessonTutorProfile(lessonNumber: number): BookLessonTutorProfile {
  return BOOK_LESSON_TUTOR_PROFILES[lessonNumber] || BOOK_LESSON_TUTOR_PROFILES[1];
}
