export interface TelegramGrammarLesson {
  id: number;
  title: string;
  url: string;
  topicAr: string;
  topicDe: string;
  level: 'A1' | 'A2' | 'B1';
  keywords: string[];
}

export const TELEGRAM_GRAMMAR_LESSONS: TelegramGrammarLesson[] = [
  {
    id: 1,
    title: 'الدرس 001 الأحرف',
    url: 'https://t.me/khaledbozann/2',
    topicAr: 'الأحرف الألمانية وطريقة النطق',
    topicDe: 'Das deutsche Alphabet & Aussprache',
    level: 'A1',
    keywords: ['الأحرف', 'الحروف', 'نطق', 'alphabet', 'buchstaben', 'aussprache', 'buchstabiere'],
  },
  {
    id: 2,
    title: 'الدرس 002 ال التعريف',
    url: 'https://t.me/khaledbozann/3',
    topicAr: 'أدوات التعريف (der, die, das)',
    topicDe: 'Bestimmte Artikel (der, die, das)',
    level: 'A1',
    keywords: ['ال التعريف', 'أداة التعريف', 'أدوات التعريف', 'artikel', 'bestimmter', 'der', 'die', 'das', 'نومن'],
  },
  {
    id: 3,
    title: 'الدرس 003 الضمائر الشخصية',
    url: 'https://t.me/khaledbozann/4',
    topicAr: 'الضمائر الشخصية (ich, du, er, sie...)',
    topicDe: 'Personalpronomen im Nominativ',
    level: 'A1',
    keywords: ['الضمائر الشخصية', 'ضمائر', 'personalpronomen', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr'],
  },
  {
    id: 4,
    title: 'الدرس 004 تحديد أداة التعريف',
    url: 'https://t.me/khaledbozann/5',
    topicAr: 'قواعد تحديد أداة التعريف (مذكر، مؤنث، محايد)',
    topicDe: 'Bestimmung des Artikels (Genus)',
    level: 'A1',
    keywords: ['تحديد أداة التعريف', 'أداة التعريف', 'genus', 'maskulin', 'feminin', 'neutral', 'مذكر', 'مؤنث', 'محايد'],
  },
  {
    id: 5,
    title: 'الدرس 005 أداة النكرة',
    url: 'https://t.me/khaledbozann/6',
    topicAr: 'أداة النكرة (ein, eine) ونفي النكرة (kein, keine)',
    topicDe: 'Unbestimmter Artikel (ein, eine) & Negation',
    level: 'A1',
    keywords: ['أداة النكرة', 'نكرة', 'unbestimmter artikel', 'ein', 'eine', 'kein', 'keine'],
  },
  {
    id: 6,
    title: 'الدرس 006 فعل الملكية',
    url: 'https://t.me/khaledbozann/7',
    topicAr: 'فعل الملكية haben وتصريفه واستخداماته',
    topicDe: 'Das Verb haben (Präsens & Bedeutung)',
    level: 'A1',
    keywords: ['فعل الملكية', 'haben', 'عندي', 'يملك', 'ملكية', 'hast', 'hat'],
  },
  {
    id: 7,
    title: 'الدرس 007 فعل الكون',
    url: 'https://t.me/khaledbozann/8',
    topicAr: 'فعل الكينونة sein وتصريفه (ich bin, du bist...)',
    topicDe: 'Das Verb sein (Konjugation & Anwendung)',
    level: 'A1',
    keywords: ['فعل الكون', 'فعل الكينونة', 'sein', 'bin', 'bist', 'ist', 'sind', 'seid'],
  },
  {
    id: 8,
    title: 'الدرس 008 صياغة الجمع',
    url: 'https://t.me/khaledbozann/9',
    topicAr: 'صياغة الجمع في الأسماء الألمانية (Plural)',
    topicDe: 'Pluralbildung der Nomen',
    level: 'A1',
    keywords: ['صياغة الجمع', 'الجمع', 'plural', 'pluralbildung', 'nomen im plural', 'جموع'],
  },
  {
    id: 9,
    title: 'الدرس 009 حالة الرفع',
    url: 'https://t.me/khaledbozann/10',
    topicAr: 'حالة الرفع (Nominativ) والفاعل في الجملة',
    topicDe: 'Der Nominativ (Subjekt im Satz)',
    level: 'A1',
    keywords: ['حالة الرفع', 'الرفع', 'nominativ', 'subjekt', 'فاعل'],
  },
  {
    id: 10,
    title: 'الدرس 010 صياغة السؤال في حالة الرفع',
    url: 'https://t.me/khaledbozann/11',
    topicAr: 'صياغة السؤال (W-Frage & Ja/Nein-Frage) في الرفع',
    topicDe: 'Fragebildung im Nominativ',
    level: 'A1',
    keywords: ['صياغة السؤال', 'سؤال في الرفع', 'w-fragen', 'ja/nein frage', 'wer', 'was', 'استفهام'],
  },
  {
    id: 11,
    title: 'الدرس 011 تركيبات الأحرف',
    url: 'https://t.me/khaledbozann/12',
    topicAr: 'تركيبات الحروف الألمانية وطريقة لفظها (ei, ie, sch, ch...)',
    topicDe: 'Buchstabenkombinationen & Diphthonge',
    level: 'A1',
    keywords: ['تركيبات الأحرف', 'حروف مركبة', 'لفظ الحروف', 'diphthonge', 'ei', 'eu', 'ch', 'sch', 'sp', 'st'],
  },
  {
    id: 12,
    title: 'الدرس 012 حالة النصب',
    url: 'https://t.me/khaledbozann/13',
    topicAr: 'حالة النصب (Akkusativ) - المفعول به المباشر',
    topicDe: 'Der Akkusativ (Direktes Objekt)',
    level: 'A1',
    keywords: ['حالة النصب', 'النصب', 'akkusativ', 'den', 'einen', 'keinen', 'مفعول به'],
  },
  {
    id: 13,
    title: 'الدرس 013 صياغة السؤال في حالة النصب',
    url: 'https://t.me/khaledbozann/14',
    topicAr: 'صياغة السؤال في حالة النصب (Wen? Was?)',
    topicDe: 'Fragen im Akkusativ (Wen? Was?)',
    level: 'A1',
    keywords: ['السؤال في حالة النصب', 'wen', 'was', 'akkusativ frage', 'سؤال النصب'],
  },
  {
    id: 14,
    title: 'الدرس 014 الضمائر الشخصية في حالة النصب',
    url: 'https://t.me/khaledbozann/15',
    topicAr: 'الضمائر الشخصية في حالة النصب (mich, dich, ihn, sie...)',
    topicDe: 'Personalpronomen im Akkusativ',
    level: 'A1',
    keywords: ['الضمائر في حالة النصب', 'mich', 'dich', 'ihn', 'uns', 'euch', 'pronomen akkusativ'],
  },
  {
    id: 15,
    title: 'الدرس 015 أحرف النصب 1/2',
    url: 'https://t.me/khaledbozann/16',
    topicAr: 'أحرف الجر التي تنصب دائماً (bis, durch, für...)',
    topicDe: 'Präpositionen mit Akkusativ (Teil 1)',
    level: 'A1',
    keywords: ['أحرف النصب', 'حروف النصب', 'präpositionen mit akkusativ', 'für', 'ohne', 'durch', 'bis'],
  },
  {
    id: 16,
    title: 'الدرس 015 أحرف النصب 2/2',
    url: 'https://t.me/khaledbozann/17',
    topicAr: 'أحرف الجر مع النصب وتطبيقاتها (um, gegen, entlang)',
    topicDe: 'Präpositionen mit Akkusativ (Teil 2)',
    level: 'A1',
    keywords: ['أحرف النصب 2', 'حروف النصب', 'um', 'gegen', 'entlang', 'akkusativ präpositionen'],
  },
  {
    id: 17,
    title: 'الدرس 016 حالة الجر',
    url: 'https://t.me/khaledbozann/18',
    topicAr: 'حالة الجر (Dativ) وتغيير الأدوات (dem, der, einem...)',
    topicDe: 'Der Dativ (Indirektes Objekt)',
    level: 'A1',
    keywords: ['حالة الجر', 'الجر', 'dativ', 'dem', 'einem', 'einer', 'مجاور'],
  },
  {
    id: 18,
    title: 'الدرس 017 الضمائر الشخصية في حالة الجر',
    url: 'https://t.me/khaledbozann/19',
    topicAr: 'الضمائر الشخصية في حالة الجر (mir, dir, ihm, ihr...)',
    topicDe: 'Personalpronomen im Dativ',
    level: 'A1',
    keywords: ['الضمائر في حالة الجر', 'mir', 'dir', 'ihm', 'ihr', 'uns', 'euch', 'ihnen', 'pronomen dativ'],
  },
  {
    id: 19,
    title: 'الدرس 018 صياغة السؤال في حالة الجر',
    url: 'https://t.me/khaledbozann/20',
    topicAr: 'صياغة السؤال في حالة الجر (Wem? Wo? Mit wem?)',
    topicDe: 'Fragen im Dativ (Wem? Wo?)',
    level: 'A1',
    keywords: ['السؤال في حالة الجر', 'wem', 'wo', 'dativ frage', 'سؤال الجر'],
  },
  {
    id: 20,
    title: 'الدرس 019 أحرف الجر 1/2',
    url: 'https://t.me/khaledbozann/21',
    topicAr: 'أحرف الجر التي تجر دائماً (aus, bei, mit, nach...)',
    topicDe: 'Präpositionen mit Dativ (Teil 1)',
    level: 'A1',
    keywords: ['أحرف الجر', 'حروف الجر', 'präpositionen mit dativ', 'aus', 'bei', 'mit', 'nach'],
  },
  {
    id: 21,
    title: 'الدرس 019 أحرف الجر 2/2',
    url: 'https://t.me/khaledbozann/22',
    topicAr: 'أحرف الجر مع الداتيف (seit, von, zu, gegenüber)',
    topicDe: 'Präpositionen mit Dativ (Teil 2)',
    level: 'A1',
    keywords: ['أحرف الجر 2', 'حروف الجر', 'seit', 'von', 'zu', 'gegenüber', 'dativ präpositionen'],
  },
  {
    id: 22,
    title: 'الدرس 020 أحرف النصب و الجر المشتركة',
    url: 'https://t.me/khaledbozann/23',
    topicAr: 'أحرف الجر المشتركة بين النصب والجر (Wechselpräpositionen)',
    topicDe: 'Wechselpräpositionen (Akkusativ / Dativ)',
    level: 'A2',
    keywords: ['أحرف النصب و الجر المشتركة', 'حروف مشتركة', 'wechselpräpositionen', 'in', 'an', 'auf', 'unter', 'über', 'vor', 'hinter', 'neben', 'zwischen', 'wo', 'wohin'],
  },
  {
    id: 23,
    title: 'الدرس 021 حالة المضاف إليه 1/3',
    url: 'https://t.me/khaledbozann/24',
    topicAr: 'حالة المضاف إليه (Genitiv) - المفهوم والأدوات',
    topicDe: 'Der Genitiv (Teil 1 - Grundlagen)',
    level: 'A2',
    keywords: ['المضاف إليه', 'حالة المضاف إليه', 'genitiv', 'des', 'der', 'إضافة'],
  },
  {
    id: 24,
    title: 'الدرس 022 حالة المضاف إليه 2/3',
    url: 'https://t.me/khaledbozann/25',
    topicAr: 'حالة المضاف إليه والضمائر وأسماء العلم',
    topicDe: 'Der Genitiv (Teil 2 - Eigennamen & N-Deklination)',
    level: 'A2',
    keywords: ['المضاف إليه 2', 'genitiv', 'nomen im genitiv', 'des mannes'],
  },
  {
    id: 25,
    title: 'الدرس 023 حالة المضاف إليه 3/3',
    url: 'https://t.me/khaledbozann/26',
    topicAr: 'حالة المضاف إليه - صياغة السؤال Wessen وتطبيقات',
    topicDe: 'Der Genitiv (Teil 3 - Fragen mit Wessen)',
    level: 'A2',
    keywords: ['المضاف إليه 3', 'wessen', 'genitiv fragen', 'لمن'],
  },
  {
    id: 26,
    title: 'الدرس 024 أحرف المضاف إليه 1/3',
    url: 'https://t.me/khaledbozann/27',
    topicAr: 'أحرف الجر مع المضاف إليه (während, wegen...)',
    topicDe: 'Präpositionen mit Genitiv (Teil 1)',
    level: 'B1',
    keywords: ['أحرف المضاف إليه', 'präpositionen mit genitiv', 'während', 'wegen'],
  },
  {
    id: 27,
    title: 'الدرس 025 أحرف المضاف إليه 2/3',
    url: 'https://t.me/khaledbozann/28',
    topicAr: 'أحرف الجر مع المضاف إليه (trotz, statt / anstatt)',
    topicDe: 'Präpositionen mit Genitiv (Teil 2)',
    level: 'B1',
    keywords: ['أحرف المضاف إليه 2', 'trotz', 'statt', 'anstatt', 'genitiv präpositionen'],
  },
  {
    id: 28,
    title: 'الدرس 026 أحرف المضاف إليه 3/3',
    url: 'https://t.me/khaledbozann/29',
    topicAr: 'أحرف الجر المكانية مع الجينيتيف (innerhalb, außerhalb)',
    topicDe: 'Präpositionen mit Genitiv (Teil 3)',
    level: 'B1',
    keywords: ['أحرف المضاف إليه 3', 'innerhalb', 'außerhalb', 'genitiv'],
  },
  {
    id: 29,
    title: 'الدرس 027 ضمائر الملكية 01',
    url: 'https://t.me/khaledbozann/30',
    topicAr: 'ضمائر الملكية (Possessivartikel: mein, dein, sein...)',
    topicDe: 'Possessivartikel im Nominativ',
    level: 'A1',
    keywords: ['ضمائر الملكية', 'ضمير الملكية', 'possessivartikel', 'possessivpronomen', 'mein', 'dein', 'sein', 'ihr', 'unser', 'euer'],
  },
  {
    id: 30,
    title: 'الدرس 028 ضمائر الملكية 02',
    url: 'https://t.me/khaledbozann/31',
    topicAr: 'ضمائر الملكية في النصب والجر (meinen, meinem...)',
    topicDe: 'Possessivartikel in Akkusativ und Dativ',
    level: 'A1',
    keywords: ['ضمائر الملكية في النصب والجر', 'meinen', 'meinem', 'meiner', 'possessiv deklinieren'],
  },
  {
    id: 31,
    title: 'الدرس 029 الأفعال النظامية 01',
    url: 'https://t.me/khaledbozann/32',
    topicAr: 'تصريف الأفعال النظامية في الحاضر (Präsens)',
    topicDe: 'Regelmäßige Verben im Präsens (Teil 1)',
    level: 'A1',
    keywords: ['الأفعال النظامية', 'أفعال نظامية', 'تصريف الأفعال', 'regelmäßige verben', 'konjugation', 'präsens', 'verbendung', 'lernen', 'wohnen', 'machen'],
  },
  {
    id: 32,
    title: 'الدرس 030 الأفعال النظامية 02',
    url: 'https://t.me/khaledbozann/33',
    topicAr: 'الأفعال المنتهية بـ t, d, s, z وتصريفها',
    topicDe: 'Regelmäßige Verben Besonderheiten (Teil 2)',
    level: 'A1',
    keywords: ['الأفعال النظامية 2', 'arbeiten', 'heißen', 'finden', 'kosten', 'verben auf d t'],
  },
  {
    id: 33,
    title: 'الدرس 031 الأفعال النظامية 03',
    url: 'https://t.me/khaledbozann/34',
    topicAr: 'تطبيقات وتمارين تصريف الأفعال العادية',
    topicDe: 'Regelmäßige Verben Übungen & Praxis (Teil 3)',
    level: 'A1',
    keywords: ['الأفعال النظامية 3', 'تمارين تصريف الأفعال', 'verbkonjugation'],
  },
  {
    id: 34,
    title: 'الدرس 032 الأفعال النظامية في الزمن الماضي 01',
    url: 'https://t.me/khaledbozann/35',
    topicAr: 'الماضي البسيط للأفعال النظامية (Präteritum)',
    topicDe: 'Präteritum regelmäßiger Verben (Teil 1)',
    level: 'A2',
    keywords: ['الأفعال النظامية في الماضي', 'präteritum', 'ماضي بسيط', 'lernte', 'machte', 'sagte'],
  },
  {
    id: 35,
    title: 'الدرس 033 الأفعال النظامية في الزمن الماضي 02',
    url: 'https://t.me/khaledbozann/36',
    topicAr: 'الماضي البسيط وتصريف الأفعال مع t/d',
    topicDe: 'Präteritum Besonderheiten (Teil 2)',
    level: 'A2',
    keywords: ['الأفعال النظامية في الماضي 2', 'arbeitete', 'wartete', 'präteritum d t'],
  },
  {
    id: 36,
    title: 'الدرس 034 الأفعال الشاذة 01',
    url: 'https://t.me/khaledbozann/37',
    topicAr: 'الأفعال الشاذة وتغيير حرف العلة (Vokalwechsel: e -> i/ie, a -> ä)',
    topicDe: 'Unregelmäßige Verben im Präsens (Vokalwechsel e->i, a->ä)',
    level: 'A1',
    keywords: ['الأفعال الشاذة', 'أفعال شاذة', 'تغيير حرف العلة', 'vokalwechsel', 'unregelmäßige verben', 'sprechen', 'sprichst', 'sehen', 'siehst', 'fahren', 'fährt', 'lesen', 'liest', 'schlafen', 'schläft', 'essen', 'isst'],
  },
  {
    id: 37,
    title: 'الدرس 035 الأفعال الشاذة 02',
    url: 'https://t.me/khaledbozann/38',
    topicAr: 'الأفعال الشاذة في الماضي البسيط (Präteritum)',
    topicDe: 'Unregelmäßige Verben im Präteritum',
    level: 'A2',
    keywords: ['الأفعال الشاذة في الماضي', 'ging', 'kam', 'sah', 'aß', 'unregelmäßig präteritum'],
  },
  {
    id: 38,
    title: 'الدرس 036 الأفعال الشاذة 03',
    url: 'https://t.me/khaledbozann/39',
    topicAr: 'قوائم وأهم الأفعال الشاذة واستخداماتها',
    topicDe: 'Wichtigste unregelmäßige Verben (Liste & Praxis)',
    level: 'A2',
    keywords: ['قائمة الأفعال الشاذة', 'starke verben', 'الأفعال القوية'],
  },
  {
    id: 39,
    title: 'الدرس 037 الزمن التام 01',
    url: 'https://t.me/khaledbozann/40',
    topicAr: 'الزمن التام (Perfekt) وصياغة اسم المفعول Partizip II',
    topicDe: 'Das Perfekt (Grundlagen & Partizip II)',
    level: 'A1',
    keywords: ['الزمن التام', 'الماضي التام', 'perfekt', 'partizip ii', 'gekauft', 'gelernt', 'gemacht'],
  },
  {
    id: 40,
    title: 'الدرس 038 الزمن التام 02',
    url: 'https://t.me/khaledbozann/41',
    topicAr: 'الماضي التام مع haben أو sein (متى نستخدم sein؟)',
    topicDe: 'Perfekt mit haben oder sein',
    level: 'A1',
    keywords: ['الماضي مع sein', 'perfekt mit sein', 'gegangen', 'gefahren', 'geblieben', 'حركة وانتقال'],
  },
  {
    id: 41,
    title: 'الدرس 039 الزمن التام 03',
    url: 'https://t.me/khaledbozann/47',
    topicAr: 'الماضي التام للأفعال القابلة للفصل وغير القابلة للفصل',
    topicDe: 'Perfekt trennbarer und untrennbarer Verben',
    level: 'A2',
    keywords: ['الزمن التام 3', 'eingekauft', 'bezahlt', 'verstanden', 'ge- infix'],
  },
  {
    id: 42,
    title: 'الدرس 040 زمن الماضي التام',
    url: 'https://t.me/khaledbozann/48',
    topicAr: 'زمن الماضي الأسبق (Plusquamperfekt)',
    topicDe: 'Das Plusquamperfekt (hatte / war + Partizip II)',
    level: 'B1',
    keywords: ['الماضي التام', 'الماضي الأسبق', 'plusquamperfekt', 'hatte gemacht', 'war gegangen'],
  },
  {
    id: 43,
    title: 'الدرس 041 أفعال قابلة للفصل 01',
    url: 'https://t.me/khaledbozann/49',
    topicAr: 'الأفعال القابلة للفصل (Trennbare Verben: aufstehen, anrufen...)',
    topicDe: 'Trennbare Verben (Präfixe ab, an, auf, aus...)',
    level: 'A1',
    keywords: ['أفعال قابلة للفصل', 'قابل للفصل', 'trennbare verben', 'aufstehen', 'anrufen', 'einkaufen', 'fernsehen', 'mitkommen', 'انفصال الفعل'],
  },
  {
    id: 44,
    title: 'الدرس 042 أفعال قابلة للفصل 02',
    url: 'https://t.me/khaledbozann/50',
    topicAr: 'الأفعال غير القابلة للفصل (Untrennbare Verben: be-, ver-, ge-...)',
    topicDe: 'Untrennbare Verben (be-, emp-, ent-, er-, ge-, ver-, zer-)',
    level: 'A2',
    keywords: ['أفعال غير قابلة للفصل', 'untrennbare verben', 'bezahlen', 'verstehen', 'erklären'],
  },
  {
    id: 45,
    title: 'الدرس 043 الأفعال الإنعكاسية 01',
    url: 'https://t.me/khaledbozann/51',
    topicAr: 'الأفعال الانعكاسية (Reflexive Verben: sich freuen, sich waschen...)',
    topicDe: 'Reflexive Verben mit Akkusativ',
    level: 'A2',
    keywords: ['الأفعال الإنعكاسية', 'أفعال انعكاسية', 'reflexive verben', 'sich', 'mich', 'dich', 'sich freuen', 'sich interessieren'],
  },
  {
    id: 46,
    title: 'الدرس 044 الأفعال الإنعكاسية 02',
    url: 'https://t.me/khaledbozann/52',
    topicAr: 'الأفعال الانعكاسية مع الداتيف (sich die Hände waschen)',
    topicDe: 'Reflexive Verben mit Dativ (mir / dir)',
    level: 'A2',
    keywords: ['الأفعال الإنعكاسية في الجر', 'reflexiv im dativ', 'sich wünschen', 'sich überlegen'],
  },
  {
    id: 47,
    title: 'الدرس 045 صيغة الأمر 01',
    url: 'https://t.me/khaledbozann/53',
    topicAr: 'صيغة الأمر (Imperativ) مع du (Komm! Geh! Sprich!)',
    topicDe: 'Der Imperativ (du-Form)',
    level: 'A1',
    keywords: ['صيغة الأمر', 'الأمر', 'imperativ', 'komm', 'lies', 'fahr', 'أمر'],
  },
  {
    id: 48,
    title: 'الدرس 046 صيغة الأمر 02',
    url: 'https://t.me/khaledbozann/54',
    topicAr: 'صيغة الأمر مع ihr و Sie الاحترام (Kommt! Kommen Sie!)',
    topicDe: 'Der Imperativ (ihr & Sie-Form)',
    level: 'A1',
    keywords: ['صيغة الأمر 2', 'الأمر مع الجمع والحرص', 'kommen sie', 'macht', 'seid leise'],
  },
  {
    id: 49,
    title: 'الدرس 047 صيغة الأمر 03',
    url: 'https://t.me/khaledbozann/55',
    topicAr: 'الأمر مع الأفعال الشاذة والقابلة للفصل',
    topicDe: 'Imperativ Besonderheiten (unregelmäßig & trennbar)',
    level: 'A1',
    keywords: ['صيغة الأمر 3', 'steh auf', 'sei', 'haben sie geduld'],
  },
  {
    id: 50,
    title: 'الدرس 048 الصفات 01',
    url: 'https://t.me/khaledbozann/56',
    topicAr: 'نهايات الصفات بعد أداة التعريف (Adjektivdeklination mit bestimmtem Artikel)',
    topicDe: 'Adjektivdeklination mit bestimmtem Artikel (Typ 1)',
    level: 'A2',
    keywords: ['الصفات', 'نهايات الصفات', 'تصريف الصفات', 'adjektivdeklination', 'der gute mann', 'die schöne frau'],
  },
  {
    id: 51,
    title: 'الدرس 049 الصفات 02',
    url: 'https://t.me/khaledbozann/57',
    topicAr: 'نهايات الصفات بعد أداة النكرة والملكية (ein guter Mann...)',
    topicDe: 'Adjektivdeklination mit unbestimmtem Artikel (Typ 2)',
    level: 'A2',
    keywords: ['الصفات 2', 'نهايات الصفات مع النكرة', 'ein schönes auto', 'meine neue wohnung'],
  },
  {
    id: 52,
    title: 'الدرس 050 الصفات 03',
    url: 'https://t.me/khaledbozann/58',
    topicAr: 'نهايات الصفات بدون أداة (Nullartikel)',
    topicDe: 'Adjektivdeklination ohne Artikel (Typ 3)',
    level: 'A2',
    keywords: ['الصفات 3', 'صفات بدون أداة', 'kalter kaffee', 'frisches brot', 'nullartikel'],
  },
  {
    id: 53,
    title: 'الدرس 051 الصفات 04',
    url: 'https://t.me/khaledbozann/59',
    topicAr: 'الصفات في حالة النصب (Akkusativ)',
    topicDe: 'Adjektivdeklination im Akkusativ',
    level: 'A2',
    keywords: ['الصفات في النصب', 'adjektive im akkusativ', 'den neuen wagen'],
  },
  {
    id: 54,
    title: 'الدرس 052 الصفات 05',
    url: 'https://t.me/khaledbozann/60',
    topicAr: 'الصفات في حالة الجر (Dativ)',
    topicDe: 'Adjektivdeklination im Dativ',
    level: 'A2',
    keywords: ['الصفات في الجر', 'adjektive im dativ', 'dem netten mann', 'mit großer freude'],
  },
  {
    id: 55,
    title: 'الدرس 053 الصفات 06',
    url: 'https://t.me/khaledbozann/61',
    topicAr: 'ملخص شامل وتطبيقات عملية على إعراب الصفات',
    topicDe: 'Adjektivdeklination Gesamttabelle & Übungen',
    level: 'A2',
    keywords: ['الصفات 6', 'جدول الصفات', 'adjektivdeklination tabelle'],
  },
  {
    id: 56,
    title: 'الدرس 054 الأفعال المساعدة 01',
    url: 'https://t.me/khaledbozann/62',
    topicAr: 'الأفعال المساعدة (Modalverben: können, müssen, wollen...)',
    topicDe: 'Modalverben im Präsens (Bedeutung & Konjugation)',
    level: 'A1',
    keywords: ['الأفعال المساعدة', 'أفعال مساعدة', 'modalverben', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
  },
  {
    id: 57,
    title: 'الدرس 055 الأفعال المساعدة 02',
    url: 'https://t.me/khaledbozann/63',
    topicAr: 'ترتيب الجملة مع الأفعال المساعدة وموقع المصدر في النهاية',
    topicDe: 'Satzbau mit Modalverben (Infinitiv am Satzende)',
    level: 'A1',
    keywords: ['الأفعال المساعدة 2', 'ترتيب الجملة مع modalverben', 'infinitiv satzende'],
  },
  {
    id: 58,
    title: 'الدرس 056 الأفعال المساعدة 03',
    url: 'https://t.me/khaledbozann/64',
    topicAr: 'الأفعال المساعدة في الزمن الماضي (konnte, musste, wollte...)',
    topicDe: 'Modalverben im Präteritum',
    level: 'A2',
    keywords: ['الأفعال المساعدة في الماضي', 'konnte', 'musste', 'wollte', 'durfte', 'sollte'],
  },
  {
    id: 59,
    title: 'الدرس 057 الجمل الفرعية 01',
    url: 'https://t.me/khaledbozann/65',
    topicAr: 'الجمل الجانبية (Nebensätze) وموقع الفعل المصرف في آخر الجملة',
    topicDe: 'Nebensätze Grundlagen (Verb am Ende)',
    level: 'A2',
    keywords: ['الجمل الفرعية', 'الجمل الجانبية', 'nebensätze', 'verb am ende', 'dass', 'weil', 'جمل تابعة'],
  },
  {
    id: 60,
    title: 'الدرس 058 الجمل الفرعية 02',
    url: 'https://t.me/khaledbozann/66',
    topicAr: 'الجمل الجانبية مع dass والجمل الاستفهامية غير المباشرة (ob / W-Fragen)',
    topicDe: 'Nebensätze mit dass & indirekte Fragesätze (ob / W-Fragen)',
    level: 'A2',
    keywords: ['الجمل الفرعية 2', 'dass', 'ob', 'indirekte fragen', 'سؤال غير مباشر'],
  },
  {
    id: 61,
    title: 'الدرس 059 الجمل الفرعية الزمانية و أدوات الربط 01',
    url: 'https://t.me/khaledbozann/67',
    topicAr: 'الجمل الزمانية مع wenn و als (الفرق بين wenn و als)',
    topicDe: 'Temporale Nebensätze: wenn vs. als',
    level: 'A2',
    keywords: ['الجمل الفرعية الزمانية', 'زمانية', 'wenn', 'als', 'فرق wenn als', 'temporalsätze'],
  },
  {
    id: 62,
    title: 'الدرس 060 الجمل الفرعية الزمانية و أدوات الربط 02',
    url: 'https://t.me/khaledbozann/68',
    topicAr: 'الجمل الزمانية مع während و solange',
    topicDe: 'Temporale Konnektoren: während & solange',
    level: 'B1',
    keywords: ['الجمل الفرعية الزمانية 2', 'während', 'solange', 'أثناء', 'طالما'],
  },
  {
    id: 63,
    title: 'الدرس 061 الجمل الفرعية الزمانية و أدوات الربط 03',
    url: 'https://t.me/khaledbozann/69',
    topicAr: 'الجمل الزمانية مع bevor و ehe',
    topicDe: 'Temporale Konnektoren: bevor & ehe',
    level: 'B1',
    keywords: ['الجمل الفرعية الزمانية 3', 'bevor', 'ehe', 'قبل أن'],
  },
  {
    id: 64,
    title: 'الدرس 062 الجمل الفرعية الزمانية و أدوات الربط 04',
    url: 'https://t.me/khaledbozann/70',
    topicAr: 'الجمل الزمانية مع nachdem و seitdem / seit',
    topicDe: 'Temporale Konnektoren: nachdem & seitdem',
    level: 'B1',
    keywords: ['الجمل الفرعية الزمانية 4', 'nachdem', 'seitdem', 'بعد أن', 'منذ أن'],
  },
  {
    id: 65,
    title: 'الدرس 063 الجمل الفرعية السببية و أدوات الربط',
    url: 'https://t.me/khaledbozann/71',
    topicAr: 'الجمل السببية مع weil و da و denn (أدوات التعليل)',
    topicDe: 'Kausale Nebensätze: weil, da & denn',
    level: 'A2',
    keywords: ['السببية', 'الجمل الفرعية السببية', 'تعليل', 'weil', 'da', 'denn', 'لأن', 'بسبب'],
  },
  {
    id: 66,
    title: 'الدرس 064 الجمل الفرعية الشرطية و أدوات الربط',
    url: 'https://t.me/khaledbozann/72',
    topicAr: 'الجمل الشرطية (Konditionalsätze) مع wenn و falls',
    topicDe: 'Konditionale Nebensätze: wenn & falls',
    level: 'A2',
    keywords: ['الشرطية', 'الجمل الفرعية الشرطية', 'konditionalsätze', 'wenn', 'falls', 'إذا', 'لو'],
  },
  {
    id: 67,
    title: 'الدرس 065 الجمل الفرعية المتعاقبة و أدوات الربط',
    url: 'https://t.me/khaledbozann/73',
    topicAr: 'الجمل الناتجة / المتعاقبة مع so dass و sodass',
    topicDe: 'Konsekutive Nebensätze: sodass & so ... dass',
    level: 'B1',
    keywords: ['المتعاقبة', 'الجمل الفرعية المتعاقبة', 'sodass', 'so dass', 'بحيث', 'لدرجة أن'],
  },
  {
    id: 68,
    title: 'الدرس 066 الجمل الفرعية المحدودة و أدوات الربط',
    url: 'https://t.me/khaledbozann/74',
    topicAr: 'الجمل الحصرية والتقييدية مع indem و ohne dass و anstatt dass',
    topicDe: 'Modale Nebensätze: indem, ohne dass, anstatt dass',
    level: 'B1',
    keywords: ['المحدودة', 'indem', 'ohne dass', 'anstatt dass', 'عن طريق', 'دون أن'],
  },
  {
    id: 69,
    title: 'الدرس 067 زمن المستقبل 1',
    url: 'https://t.me/khaledbozann/75',
    topicAr: 'زمن المستقبل الأول (Futur I: werden + Infinitiv)',
    topicDe: 'Das Futur I (werden + Infinitiv)',
    level: 'A2',
    keywords: ['زمن المستقبل', 'مستقبل', 'futur i', 'werden', 'wird machen', 'سوف'],
  },
  {
    id: 70,
    title: 'الدرس 068 زمن المستقبل 2',
    url: 'https://t.me/khaledbozann/76',
    topicAr: 'زمن المستقبل الثاني (Futur II) واستخداماته للتخمين',
    topicDe: 'Das Futur II (Vermutung & vollendete Zukunft)',
    level: 'B1',
    keywords: ['زمن المستقبل 2', 'futur ii', 'تخمين', 'wird gemacht haben'],
  },
  {
    id: 71,
    title: 'الدرس 069 المبني للمجهول 01',
    url: 'https://t.me/khaledbozann/77',
    topicAr: 'المبني للمجهول في الحاضر (Passiv Präsens: werden + Partizip II)',
    topicDe: 'Das Passiv im Präsens (werden + Partizip II)',
    level: 'B1',
    keywords: ['المبني للمجهول', 'مبني للمجهول', 'passiv', 'passiv präsens', 'wird gebaut', 'wird gemacht'],
  },
  {
    id: 72,
    title: 'الدرس 070 المبني للمجهول 02',
    url: 'https://t.me/khaledbozann/78',
    topicAr: 'المبني للمجهول في الماضي (Passiv Präteritum: wurde + Partizip II)',
    topicDe: 'Das Passiv im Präteritum (wurde + Partizip II)',
    level: 'B1',
    keywords: ['المبني للمجهول في الماضي', 'passiv präteritum', 'wurde repariert', 'wurde gesagt'],
  },
  {
    id: 73,
    title: 'الدرس 071 المبني للمجهول 03',
    url: 'https://t.me/khaledbozann/79',
    topicAr: 'المبني للمجهول في التام ومع الأفعال المساعدة (Passiv Perfekt & Modalverben)',
    topicDe: 'Passiv im Perfekt & mit Modalverben',
    level: 'B1',
    keywords: ['المبني للمجهول 3', 'ist gebaut worden', 'muss gemacht werden', 'passiv modalverben'],
  },
  {
    id: 74,
    title: 'الدرس 072 المبني للمجهول 04',
    url: 'https://t.me/khaledbozann/80',
    topicAr: 'المبني للمجهول للحالة (Zustandspassiv: sein + Partizip II)',
    topicDe: 'Das Zustandspassiv (sein + Partizip II)',
    level: 'B1',
    keywords: ['المبني للمجهول 4', 'zustandspassiv', 'ist geöffnet', 'ist geschlossen'],
  },
  {
    id: 75,
    title: 'الدرس 073 01 Konjunktiv II',
    url: 'https://t.me/khaledbozann/81',
    topicAr: 'صيغة التمني والطلب المهذب (Konjunktiv II: würde + Infinitiv, hätte, wäre)',
    topicDe: 'Konjunktiv II der Gegenwart (Höflichkeit & Wünsche)',
    level: 'A2',
    keywords: ['konjunktiv ii', 'konjunktiv 2', 'تمني', 'طلب مهذب', 'würde gerne', 'hätte', 'wäre', 'könnte'],
  },
  {
    id: 76,
    title: 'الدرس 074 02 Konjunktiv II',
    url: 'https://t.me/khaledbozann/82',
    topicAr: 'صيغة Konjunktiv II مع الأفعال المساعدة (könnte, müsste, sollte)',
    topicDe: 'Konjunktiv II der Modalverben',
    level: 'B1',
    keywords: ['konjunktiv ii 2', 'könnte', 'sollte', 'müsste', 'نصيحة', 'افتراض'],
  },
  {
    id: 77,
    title: 'الدرس 075 03 Konjunktiv II',
    url: 'https://t.me/khaledbozann/83',
    topicAr: 'صيغة Konjunktiv II في الماضي والندم (hätte/wäre + Partizip II)',
    topicDe: 'Konjunktiv II der Vergangenheit (Irreale Wünsche)',
    level: 'B1',
    keywords: ['konjunktiv ii في الماضي', 'hätte gemacht', 'wäre gegangen', 'ندم'],
  },
  {
    id: 78,
    title: 'الدرس 076 04 Konjunktiv II',
    url: 'https://t.me/khaledbozann/84',
    topicAr: 'الجمل الشرطية غير الواقعية والمقارنة الوهمية (als ob / als wenn)',
    topicDe: 'Irreale Bedingungssätze & Vergleiche mit als ob',
    level: 'B1',
    keywords: ['konjunktiv ii 4', 'als ob', 'لو كنت', 'شرط غير واقعي'],
  },
  {
    id: 79,
    title: 'الدرس 077 المقارنة و التفضيل 01 Komparativ und Superlativ',
    url: 'https://t.me/khaledbozann/85',
    topicAr: 'المقارنة والتفضيل في الصفات (Komparativ & Superlativ: schneller, am schnellsten)',
    topicDe: 'Komparativ und Superlativ (Regelmäßige Formen)',
    level: 'A2',
    keywords: ['المقارنة و التفضيل', 'مقارنة وتفضيل', 'komparativ', 'superlativ', 'als', 'wie', 'schneller', 'am schönsten', 'تفضيل'],
  },
  {
    id: 80,
    title: 'الدرس 078 المقارنة و التفضيل 02 Komparativ und Superlativ',
    url: 'https://t.me/khaledbozann/86',
    topicAr: 'المقارنة والتفضيل الشاذة (gut-besser-am besten, viel-mehr-am meisten)',
    topicDe: 'Unregelmäßige Komparation (gut, viel, gern, hoch, nah)',
    level: 'A2',
    keywords: ['المقارنة والتفضيل الشاذة', 'besser am besten', 'mehr am meisten', 'lieber am liebsten'],
  },
  {
    id: 81,
    title: 'الدرس 079 الجمل الموصولة 01 Relativsätze',
    url: 'https://t.me/khaledbozann/87',
    topicAr: 'الجمل الموصولة في الرفع والنصب (Relativsätze im Nominativ und Akkusativ)',
    topicDe: 'Relativsätze im Nominativ und Akkusativ',
    level: 'B1',
    keywords: ['الجمل الموصولة', 'جمل موصولة', 'relativsätze', 'relativpronomen', 'الذي', 'التي', 'der mann der', 'das buch das'],
  },
  {
    id: 82,
    title: 'الدرس 080 الجمل الموصولة 02 Relativsätze',
    url: 'https://t.me/khaledbozann/88',
    topicAr: 'الجمل الموصولة في الجر مع أحرف الجر (mit dem, bei der...)',
    topicDe: 'Relativsätze im Dativ & mit Präpositionen',
    level: 'B1',
    keywords: ['الجمل الموصولة 2', 'relativsätze im dativ', 'mit dem', 'in dem', 'auf die'],
  },
  {
    id: 83,
    title: 'الدرس 081 صيغة الإستفهام 01 Fragen',
    url: 'https://t.me/khaledbozann/89',
    topicAr: 'أدوات الاستفهام W-Fragen (Wer, Wie, Wo, Woher, Wohin...)',
    topicDe: 'W-Fragen Übersicht & Anwendung',
    level: 'A1',
    keywords: ['صيغة الإستفهام', 'صيغة الاستفهام', 'أدوات الاستفهام', 'w-fragen', 'wer', 'wie', 'wo', 'woher', 'wohin', 'wann', 'warum', 'سؤال'],
  },
  {
    id: 84,
    title: 'الدرس 082 صيغة الإستفهام 02 Fragen',
    url: 'https://t.me/khaledbozann/90',
    topicAr: 'أسئلة نعم/لا والرد بـ Ja / Nein / Doch',
    topicDe: 'Ja/Nein-Fragen & Antwort mit Doch',
    level: 'A1',
    keywords: ['صيغة الاستفهام 2', 'ja nein frage', 'doch', 'الرد بـ doch', 'سؤال منفي'],
  },
  {
    id: 85,
    title: 'الدرس 083 صيغة الإستفهام 03 Fragen',
    url: 'https://t.me/khaledbozann/91',
    topicAr: 'الأسئلة بحرف الجر (Worauf? Woran? Auf wen? An wen?)',
    topicDe: 'Präpositionalfragen (Wo-Komposita vs. Präposition + Pronomen)',
    level: 'B1',
    keywords: ['صيغة الاستفهام 3', 'worauf', 'woran', 'womit', 'auf wen', 'mit wem'],
  },
  {
    id: 86,
    title: 'الدرس 084 أفعال حركية و غير حركية 01 Transitive und intransitive Verben',
    url: 'https://t.me/khaledbozann/92',
    topicAr: 'الأفعال المتعدية واللازمة (Transitive und intransitive Verben: stellen/stehen...)',
    topicDe: 'Positions- und Richtungsverben (legen/liegen, stellen/stehen)',
    level: 'A2',
    keywords: ['أفعال حركية و غير حركية', 'transitive verben', 'intransitive verben', 'stellen', 'stehen', 'legen', 'liegen', 'setzen', 'sitzen', 'hängen'],
  },
  {
    id: 87,
    title: 'الدرس 085 أفعال حركية و غير حركية 02 Transitive und intransitive Verben',
    url: 'https://t.me/khaledbozann/93',
    topicAr: 'تطبيقات الأفعال الحركية والثابتة مع أحرف الجر المشتركة (Wohin vs. Wo)',
    topicDe: 'Wohin (Akkusativ) vs. Wo (Dativ) mit Positionsverben',
    level: 'A2',
    keywords: ['أفعال حركية 2', 'wohin akkusativ', 'wo dativ', 'ich stelle das buch'],
  },
  {
    id: 88,
    title: 'الدرس 086 ظروف الأحرف 01 Präpositionaladverbien',
    url: 'https://t.me/khaledbozann/94',
    topicAr: 'ظروف الجر والإشارة (Präpositionaladverbien: damit, darauf, davon...)',
    topicDe: 'Präpositionaladverbien (da-Komposita: damit, dafür, darüber)',
    level: 'B1',
    keywords: ['ظروف الأحرف', 'ظروف الجر', 'präpositionaladverbien', 'da-komposita', 'damit', 'dafür', 'darauf', 'davon'],
  },
  {
    id: 89,
    title: 'الدرس 087 ظروف الأحرف 02 Präpositionaladverbien',
    url: 'https://t.me/khaledbozann/95',
    topicAr: 'ظروف الجر الاستفهامية (womit, wofür, worüber...)',
    topicDe: 'Fragewörter mit Präpositionen (wo-Komposita)',
    level: 'B1',
    keywords: ['ظروف الأحرف 2', 'womit', 'wofür', 'worüber', 'wo-komposita'],
  },
  {
    id: 90,
    title: 'الدرس 088 ظروف الأحرف 03 Präpositionaladverbien',
    url: 'https://t.me/khaledbozann/96',
    topicAr: 'أفعال بحروف جر محددة واستخدام الظروف معها',
    topicDe: 'Verben mit festen Präpositionen & Da-Wörter',
    level: 'B1',
    keywords: ['ظروف الأحرف 3', 'verben mit präpositionen', 'warten auf', 'denken an'],
  },
  {
    id: 91,
    title: 'الدرس 089 إسلوب النفي 01 Die Negation',
    url: 'https://t.me/khaledbozann/97',
    topicAr: 'أسلوب النفي بـ nicht (موقع nicht في الجملة وقواعده)',
    topicDe: 'Die Negation mit nicht (Satzstellung & Regeln)',
    level: 'A1',
    keywords: ['إسلوب النفي', 'اسلوب النفي', 'نفي', 'negation', 'nicht', 'موقع nicht', 'نفي الجملة'],
  },
  {
    id: 92,
    title: 'الدرس 090 إسلوب النفي 02 Die Negation',
    url: 'https://t.me/khaledbozann/98',
    topicAr: 'أسلوب النفي بـ kein والفرق بين nicht و kein والكلمات المعاكسة',
    topicDe: 'Die Negation mit kein vs. nicht & gegenteilige Wörter',
    level: 'A1',
    keywords: ['إسلوب النفي 2', 'kein', 'keine', 'فرق nicht kein', 'nie', 'niemand', 'nichts'],
  },
];

/**
 * Intelligent matching function that takes any grammar topic from the book course
 * and returns the best matching Telegram video explanation from Khaled Bozan's course.
 */
export function getTelegramLessonExplanation(lesson: TelegramGrammarLesson): string {
  const explanations: Record<number, string> = {
    1: 'يشرح نطق الأبجدية الألمانية كاملة مع كيفية لفظ الحروف المركبة ونطق الأسماء وتهجئتها (Buchstabieren).',
    2: 'يشرح أدوات التعريف الثلاث في الألمانية (der للمذكر، die للمؤنث، das للمحايد) وكيفية التمييز بينها.',
    3: 'يشرح الضمائر الشخصية في حالة الرفع (ich, du, er, sie, es, wir, ihr, sie, Sie) وكيف تقترن مع الأفعال.',
    4: 'يشرح القواعد والنهايات التي تساعدك على معرفة أداة تعريف الاسم (der, die, das) بسهولة وبدون حفظ عشوائي.',
    5: 'يشرح أدوات النكرة (ein, eine) وكيفية نفي الأسماء النكرة باستعمال (kein, keine).',
    6: 'يشرح تصريف فعل الملكية (haben) في الحاضر مع جميع الضمائر واستعمالاته اليومية للتعبير عما تملك.',
    7: 'يشرح تصريف فعل الكينونة (sein) الشاذ في زمن الحاضر (ich bin, du bist, er ist...) وأهميته في تقديم النفس والمهن والصفات.',
    8: 'يشرح قواعد صياغة الجمع في الأسماء الألمانية والتغييرات الصوتية كالإمالة (Umlaut) والنهايات المختلفة.',
    9: 'يشرح تركيب الجملة الألمانية البسيطة وموقع الفعل الإجباري في المرتبة الثانية (Position 2).',
    10: 'يشرح ترتيب الكلمات وبنية الجملة بين الجملة الخبرية العادية وسؤال نعم/لا (Ja/Nein-Frage) حيث يقف الفعل في المرتبة الأولى.',
    11: 'يشرح التراكيب الصوتية للحروف الألمانية المزدوجة (ei, ie, eu, sch, ch) ونطقها السليم.',
    12: 'يشرح مفهوم المفعول به المنصوب (Akkusativ) وتغير أداة المذكر فقط من der إلى den.',
    13: 'يشرح السؤال في حالة النصب (Wen? / Was?) وكيف تميز الفاعل عن المفعول به في الجملة.',
    14: 'يشرح تصريف الضمائر الشخصية في حالة النصب (mich, dich, ihn, sie, uns, euch, sie/Sie).',
    15: 'يشرح حروف الجر التي تجر دائماً حالة النصب (für, um, durch, ohne, gegen).',
    16: 'يشرح حالة الجر (Dativ) ومعانيها وتغير أدوات التعريف (dem, der, dem, den + n).',
    17: 'يشرح الضمائر الشخصية في حالة الجر (mir, dir, ihm, ihr, uns, euch, ihnen/Ihnen).',
    18: 'يشرح أفعال شائعة تأخذ حالة الجر Dativ مباشرة مثل (helfen, danken, gefallen, gehören).',
    19: 'يشرح حروف الجر التي تأتي دائماً مع حالة Dativ مثل (aus, bei, mit, nach, seit, von, zu).',
    20: 'يشرح حروف الجر المشتركة بين Akkusativ و Dativ (حروف المكان والحركة Wechselpräpositionen).',
    29: 'يشرح تصريف ضمائر الملكية الأساسية (mein, dein, sein, ihr) في حالة الرفع وكيفية استخدامها.',
    30: 'يشرح تصريف ضمائر الملكية في حالتي النصب والجر (meinen, meinem, meiner...).',
    31: 'يشرح تصريف الأفعال في الحاضر (Präsens): حذف لاحقة -en وإضافة النهايات الأساسية (ich -e, du -st, er/sie -t, wir -en, ihr -t, sie/Sie -en) لأفعال الدرس (kommen, wohnen, heißen, arbeiten)، وهو المطابق تماماً لصندوق Verben في الصفحة 11 من كتاب DaF kompakt neu.',
    32: 'يشرح الحالات الخاصة في تصريف الأفعال المنتظمة: الأفعال المنتهية بـ t, d (مثل arbeiten) وإضافة e، والمنتهية بـ s, ß, z (مثل heißen) وأخذ -t فقط مع du.',
    33: 'يقدم تطبيقات عملية وأمثلة إضافية لتثبيت تصريف الأفعال النظامية في جمل واقعية.',
    34: 'يشرح الماضي البسيط (Präteritum) للأفعال النظامية للمستويات المتقدمة.',
    35: 'يشرح تفاصيل الماضي البسيط للأفعال المنتهية بـ t و d.',
    36: 'يشرح الأفعال الشاذة وتغيير حرف العلة في الحاضر (Vokalwechsel: e -> i/ie, a -> ä) مع الضميرين du و er/sie/es.',
    37: 'يشرح تصريف الأفعال الشاذة في الماضي البسيط.',
    38: 'يشرح قائمة بأهم الأفعال الشاذة وكيفية استخدامها في الحياة اليومية.',
    39: 'يشرح الزمن التام (Perfekt) واستخدام الفعل المساعد haben أو sein وصياغة Partizip II.',
    40: 'يشرح متى نختار sein ومتى نختار haben في صياغة زمن Perfekt (أفعال الحركة وتغير الحالة).',
    41: 'يشرح صياغة اسم المفعول Partizip II للأفعال غير المنتظمة والشاذة.',
    43: 'يشرح الأفعال المنفصلة (Trennbare Verben) وكيف ينفصل المقطع الأول ليأتي في آخر الجملة.',
    44: 'يشرح الأفعال غير القابلة للانفصال ومقاطعها الثابتة (be-, ver-, er-, ge-...).',
    47: 'يشرح صيغة الأمر (Imperativ) مع الضمائر du و ihr و صيغة الاحترام Sie.',
    48: 'يشرح حالات خاصة في صياغة الأمر وتطبيقاتها في التعليمات والنصائح.',
    56: 'يشرح الأفعال المساعدة (Modalverben: können, müssen, wollen) وتصريفها ووضع الفعل الأصلي في المصدر نهاية الجملة.',
    57: 'يشرح الأفعال المساعدة (dürfen, sollen, möchten) ومعاني الإذن والواجب والرغبة.',
    58: 'يشرح تطبيقات الأفعال المساعدة في الحياة اليومية وفي العمل.',
    83: 'يشرح أدوات الاستفهام في الألمانية (W-Fragen: Wie, Woher, Was, Wo, Wer) وترتيب الجملة (أداة الاستفهام في المرتبة 1 والفعل المصرف في المرتبة 2)، وهو المطابق تماماً لدرس W-Fragen في الصفحة 8 و 9 من كتاب DaF kompakt neu.',
    84: 'يشرح أسئلة نعم/لا (Ja/Nein-Fragen) ووقوف الفعل المصرف في المرتبة الأولى (Position 1) وكيفية الإجابة بـ Ja أو Nein أو Doch.',
    88: 'يشرح أدوات النبرة والمشاعر في الحديث اليومي (Modalpartikeln: denn, ja) وكيف تجعل الأسئلة ودودة والجمل معبرة عن الدهشة أو التأكيد.',
    91: 'يشرح أسلوب النفي باستعمال nicht وموقعه الدقيق داخل الجملة لنفي الأفعال والصفات.',
    92: 'يشرح الفرق الدقيق بين النفي بـ nicht والنفي بـ kein لتفادي الأخطاء الشائعة.',
  };

  if (explanations[lesson.id]) {
    return explanations[lesson.id];
  }

  return `يشرح هذا الدرس قاعدة (${lesson.topicAr}) بالتفصيل مع أمثلة تطبيقية وطريقة الاستخدام السليمة في الألمانية.`;
}

export function findMatchingTelegramLessons(topic: {
  titleDe: string;
  titleAr: string;
  summaryDe?: string;
  summaryAr?: string;
  explanationAr?: string;
  id?: string;
  telegramVideo?: { id: number; url: string; lessonTitle: string };
}): TelegramGrammarLesson[] {
  // If explicitly assigned: return ONLY that exact lesson
  if (topic.telegramVideo?.id) {
    const found = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === topic.telegramVideo?.id);
    if (found) {
      return [found];
    }
  }

  const query = `${topic.titleDe} ${topic.titleAr} ${topic.summaryDe || ''} ${topic.summaryAr || ''} ${topic.explanationAr || ''}`.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  // 1. W-Fragen (صيغة الاستفهام وأدوات السؤال W-Fragen)
  if (
    normalizedQuery.includes('w-frage') ||
    normalizedQuery.includes('w-fragen') ||
    normalizedQuery.includes('أداة استفهام') ||
    normalizedQuery.includes('أدوات الاستفهام') ||
    normalizedQuery.includes('ترتيب الكلمات: السؤال') ||
    normalizedQuery.includes('fragesätze')
  ) {
    const l83 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 83);
    if (l83) return [l83];
  }

  // 2. Ja/Nein-Fragen (أسئلة هل / نعم ولا)
  if (
    normalizedQuery.includes('ja/nein') ||
    normalizedQuery.includes('سؤال نعم/لا') ||
    normalizedQuery.includes('سؤال بهل')
  ) {
    const l84 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 84);
    if (l84) return [l84];
  }

  // 3. Verben im Präsens (تصريف الأفعال في الحاضر: kommen, wohnen, heißen, arbeiten)
  if (
    normalizedQuery.includes('verben') ||
    normalizedQuery.includes('الأفعال') ||
    normalizedQuery.includes('تصريف الأفعال') ||
    normalizedQuery.includes('konjugation') ||
    normalizedQuery.includes('kommen') ||
    normalizedQuery.includes('wohnen') ||
    normalizedQuery.includes('heißen') ||
    normalizedQuery.includes('arbeiten') ||
    normalizedQuery.includes('regelmäßige verben')
  ) {
    const l31 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 31);
    if (l31) return [l31];
  }

  // 4. Verb sein
  if (
    normalizedQuery.includes('verb: sein') ||
    normalizedQuery.includes('verb sein') ||
    normalizedQuery.includes('فعل الكينونة') ||
    normalizedQuery.includes('فعل الكون') ||
    (normalizedQuery.includes('sein') && normalizedQuery.includes('unregelmäßig'))
  ) {
    const l7 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 7);
    if (l7) return [l7];
  }

  // 5. Verb haben
  if (normalizedQuery.includes('verb haben') || normalizedQuery.includes('فعل الملكية')) {
    const l6 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 6);
    if (l6) return [l6];
  }

  // 6. Personalpronomen
  if (
    normalizedQuery.includes('personalpronomen') ||
    normalizedQuery.includes('الضمائر الشخصية') ||
    normalizedQuery.includes('الضمير')
  ) {
    if (normalizedQuery.includes('akkusativ') || normalizedQuery.includes('نصب')) {
      const l14 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 14);
      if (l14) return [l14];
    }
    if (normalizedQuery.includes('dativ') || normalizedQuery.includes('جر')) {
      const l18 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 18);
      if (l18) return [l18];
    }
    const l3 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 3);
    if (l3) return [l3];
  }

  // 7. Bestimmter / Unbestimmter Artikel
  if (
    normalizedQuery.includes('bestimmter artikel') ||
    normalizedQuery.includes('ال التعريف') ||
    (normalizedQuery.includes('der') && normalizedQuery.includes('die') && normalizedQuery.includes('das'))
  ) {
    const l2 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 2);
    if (l2) return [l2];
  }

  if (
    normalizedQuery.includes('unbestimmter artikel') ||
    normalizedQuery.includes('أداة النكرة') ||
    normalizedQuery.includes('ein') ||
    normalizedQuery.includes('eine')
  ) {
    const l5 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 5);
    if (l5) return [l5];
  }

  // 8. Negation (nicht / kein)
  if (
    normalizedQuery.includes('negation') ||
    normalizedQuery.includes('nicht') ||
    normalizedQuery.includes('kein') ||
    normalizedQuery.includes('النفي')
  ) {
    const l91 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 91);
    if (l91) return [l91];
  }

  // 9. Akkusativ
  if (normalizedQuery.includes('akkusativ') || normalizedQuery.includes('النصب')) {
    const l12 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 12);
    if (l12) return [l12];
  }

  // 10. Dativ
  if (normalizedQuery.includes('dativ') || normalizedQuery.includes('حالة الجر')) {
    const l17 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 17);
    if (l17) return [l17];
  }

  // 11. Modalverben
  if (
    normalizedQuery.includes('modalverben') ||
    normalizedQuery.includes('أفعال مساعدة') ||
    normalizedQuery.includes('können') ||
    normalizedQuery.includes('müssen') ||
    normalizedQuery.includes('möchten') ||
    normalizedQuery.includes('wollen')
  ) {
    const l56 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 56);
    if (l56) return [l56];
  }

  // 12. Perfekt
  if (
    normalizedQuery.includes('perfekt') ||
    normalizedQuery.includes('partizip ii') ||
    normalizedQuery.includes('الزمن التام')
  ) {
    const l39 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 39);
    if (l39) return [l39];
  }

  // 13. Trennbare Verben
  if (normalizedQuery.includes('trennbar') || normalizedQuery.includes('قابلة للفصل') || normalizedQuery.includes('انفصال')) {
    const l43 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 43);
    if (l43) return [l43];
  }

  // 14. Imperativ
  if (normalizedQuery.includes('imperativ') || normalizedQuery.includes('صيغة الأمر') || normalizedQuery.includes('الأمر')) {
    const l47 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 47);
    if (l47) return [l47];
  }

  // 15. Possessiv
  if (normalizedQuery.includes('possessiv') || normalizedQuery.includes('الملكية') || normalizedQuery.includes('mein')) {
    const l29 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 29);
    if (l29) return [l29];
  }

  // 16. Plural
  if (normalizedQuery.includes('plural') || normalizedQuery.includes('جمع') || normalizedQuery.includes('صياغة الجمع')) {
    const l8 = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === 8);
    if (l8) return [l8];
  }

  // General scoring fallback: return ONLY the single top match
  const scored = TELEGRAM_GRAMMAR_LESSONS.map((lesson) => {
    let score = 0;
    for (const kw of lesson.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    if (normalizedQuery.includes(lesson.title.toLowerCase())) score += 5;
    return { lesson, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return [scored[0].lesson];
  }

  // Default fallback to first lesson if nothing matches
  return [TELEGRAM_GRAMMAR_LESSONS[0]];
}
