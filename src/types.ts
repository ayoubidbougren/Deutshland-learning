export type SessionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error';

export type AppMode =
  | 'book_course'
  | 'dialogue_practice'
  | 'topic_discussion'
  | 'free_conversation'
  | 'listening_stories';
export type GermanLevel = 'A1' | 'A2' | 'B1';

export interface StoryQuestion {
  id: number;
  questionDe: string;
  questionAr?: string;
  options: string[];
  correctIndex: number;
  explanationDe: string;
  explanationDarija: string;
}

export interface StoryVocabulary {
  word: string;
  article?: 'der' | 'die' | 'das';
  plural?: string;
  meaningAr: string;
}

export interface ListeningStory {
  id: string;
  title: string;
  titleAr: string;
  level: GermanLevel;
  durationMinutes: string;
  category: string;
  description: string;
  text: string;
  vocabulary: StoryVocabulary[];
  questions: StoryQuestion[];
}

export interface TopicPreset {
  id: string;
  title: string;
  level: GermanLevel;
  category: string;
  description: string;
  text: string;
  sampleQuestions: string[];
}

export const SAMPLE_TOPICS: TopicPreset[] = [
  // --- A1 LEVEL ---
  {
    id: 'a1-vorstellen-familie',
    title: 'Sich vorstellen & Meine Familie',
    level: 'A1',
    category: 'Prüfung A1 - Sprechen Teil 1 & 2',
    description: 'Name, Alter, Herkunft, Wohnort, Beruf und Familienmitglieder beschreiben.',
    text: `Hallo! Mein Name ist Karim. Ich bin 25 Jahre alt und komme aus Marokko, aus der Stadt Casablanca. Jetzt lebe ich in Deutschland. Ich spreche Arabisch, Französisch und ich lerne fleißig Deutsch. Von Beruf bin ich Informatiker. In meiner Freizeit spiele ich gerne Fußball und koche mit Freunden. Meine Familie ist groß: Meine Eltern leben in Marokko. Ich habe zwei Brüder und eine jüngere Schwester. Wir telefonieren fast jeden Tag.`,
    sampleQuestions: [
      'Wie heißt du und wie alt bist du?',
      'Woher kommst du und wo wohnst du jetzt?',
      'Welche Sprachen sprichst du?',
      'Was machst du gerne in deiner Freizeit?',
      'Erzähl mir von deiner Familie: Wie viele Geschwister hast du?'
    ]
  },
  {
    id: 'a1-tagesablauf',
    title: 'Mein Tagesablauf & Gewohnheiten',
    level: 'A1',
    category: 'Prüfung A1 - Alltag',
    description: 'Typische Aktivitäten von morgens bis abends auf Deutsch schildern.',
    text: `Mein Tag beginnt früh um 7:00 Uhr. Ich stehe auf, dusche und mache mein Frühstück. Meistens trinke ich schwarzen Kaffee und esse Brot mit Butter und Käse. Um 8:30 Uhr nehme ich den Bus und fahre zu meinem Deutschkurs. Der Kurs dauert bis 12:30 Uhr. Nach dem Kurs esse ich zu Mittag und lerne neue Vokabeln in der Bibliothek. Am Abend gehe ich oft im Park spazieren oder höre deutsche Podcasts. Um 23:00 Uhr gehe ich schlafen.`,
    sampleQuestions: [
      'Um wie viel Uhr stehst du morgens auf?',
      'Was isst und trinkst du zum Frühstück?',
      'Wie fährst du zum Deutschkurs oder zur Arbeit?',
      'Was machst du nachmittags nach dem Lernen?',
      'Wann gehst du normalerweise schlafen?'
    ]
  },
  {
    id: 'a1-einkaufen-essen',
    title: 'Einkaufen & Essen gehen',
    level: 'A1',
    category: 'Prüfung A1 - Alltag',
    description: 'Lebensmittel kaufen, Preise nennen und nach Lieblingsessen fragen.',
    text: `Am Samstag gehe ich immer in den Supermarkt einkaufen. Ich brauche frische Lebensmittel für die Woche. Ich kaufe Äpfel, Bananen, Tomaten, Brot und Milch. Ein Kilo Äpfel kostet zwei Euro fünfzig. Obst und Gemüse sind sehr gesund. Mein Lieblingsessen ist marokkanischer Couscous und Hähnchen mit Reis. Am Wochenende gehe ich manchmal mit Freunden in ein deutsches Café und trinke Cappuccino mit Apfelkuchen.`,
    sampleQuestions: [
      'Wo kaufst du normalerweise deine Lebensmittel ein?',
      'Welches Obst oder Gemüse kaufst du am liebsten?',
      'Was ist dein absolutes Lieblingsessen?',
      'Kochst du lieber selbst oder gehst du ins Restaurant?',
      'Was trinkst du gerne in einem Café?'
    ]
  },

  // --- A2 LEVEL ---
  {
    id: 'a2-wohnen-wohnung',
    title: 'Meine Wohnung & Einrichtung',
    level: 'A2',
    category: 'Prüfung A2 - Sprechen Teil 2',
    description: 'Zimmer, Möbel, Miete, Lage und Nachbarschaft beschreiben.',
    text: `Ich wohne seit sechs Monaten in einer schönen Zweizimmerwohnung in Köln. Die Wohnung liegt im zweiten Stock eines ruhigen Mehrfamilienhauses. Sie hat ein großes, helles Wohnzimmer mit Südbalkon, ein gemütliches Schlafzimmer, eine Einbauküche und ein Badezimmer. Die Warmmiete beträgt 720 Euro pro Monat. In der Nähe gibt es eine U-Bahn-Station, eine Bäckerei und einen Supermarkt, was sehr praktisch ist. Die Nachbarn sind freundlich und ruhig.`,
    sampleQuestions: [
      'Beschreibe deine aktuelle Wohnung: Wie viele Zimmer hat sie?',
      'Welches Möbelstück magst du in deiner Wohnung am liebsten?',
      'Wie hoch ist die Miete und findest du Wohnungen in Deutschland teuer?',
      'Was ist dir bei der Lage einer Wohnung am wichtigsten?',
      'Verstehst du dich gut mit deinen Nachbarn?'
    ]
  },
  {
    id: 'a2-letzter-urlaub',
    title: 'Ein schöner Urlaub & Reisen',
    level: 'A2',
    category: 'Prüfung A2 - Vergangenheit erzählen',
    description: 'Im Perfekt von einer Reise berichten (Wohin, Verkehrsmittel, Hotel, Erlebnisse).',
    text: `Letzten Sommer habe ich eine wunderschöne Reise nach Bayern gemacht. Ich bin mit dem ICE-Zug gefahren, weil die Zugfahrt sehr bequem und pünktlich war. Ich habe in einem kleinen Hotel in der Nähe der Berge übernachtet. Das Wetter war herrlich und sonnig. Jeden Tag bin ich gewandert, habe die Natur genossen und traditionelle Gerichte probiert. Ich habe auch viele Fotos von Schloss Neuschwanstein gemacht. Die Reise war unvergesslich und sehr erholsam.`,
    sampleQuestions: [
      'Wohin bist du in deinem letzten Urlaub gereist?',
      'Mit welchem Verkehrsmittel bist du gefahren und warum?',
      'Wo hast du übernachtet und wie war die Unterkunft?',
      'Welche Sehenswürdigkeiten oder Aktivitäten hast du dort gemacht?',
      'Was ist dein persönliches Traumreiseziel für die Zukunft?'
    ]
  },
  {
    id: 'a2-gesundheit-arzt',
    title: 'Gesundheit & Besuch beim Arzt',
    level: 'A2',
    category: 'Prüfung A2 - Gesundheit',
    description: 'Symptome schildern, einen Arzttermin vereinbaren und Ratschläge geben.',
    text: `Vor zwei Wochen fühlte ich mich überhaupt nicht gut. Ich hatte hohes Fieber, starke Kopfschmerzen und Husten. Am Montagmorgen habe ich in der Praxis meines Hausarztes angerufen und für denselben Nachmittag einen Termin bekommen. Die Ärztin hat meine Lunge abgehört und den Hals untersucht. Sie sagte, ich hätte eine schwere Grippe. Sie hat mir Tabletten und Hustensaft verschrieben und mir geraten, mindestens vier Tage im Bett zu bleiben und viel warmen Kräutertee zu trinken.`,
    sampleQuestions: [
      'Was machst du als Erstes, wenn du dich krank fühlst?',
      'Wie vereinbarst du einen Termin beim Arzt in Deutschland?',
      'Welche Hausmittel helfen dir am besten gegen Erkältung oder Kopfschmerzen?',
      'Treibst du regelmäßig Sport, um gesund und fit zu bleiben?',
      'Welche Ratschläge gibst du jemandem, der viel Stress hat?'
    ]
  },

  // --- B1 LEVEL ---
  {
    id: 'b1-soziale-medien',
    title: 'Soziale Medien im täglichen Leben',
    level: 'B1',
    category: 'Prüfung B1 - Vortrag & Diskussion',
    description: 'Vor- und Nachteile von Social Media diskutieren, eigene Erfahrungen teilen.',
    text: `Soziale Netzwerke wie Instagram, TikTok und LinkedIn spielen heute eine zentrale Rolle in der Kommunikation junger Menschen. Ein wesentlicher Vorteil ist, dass man mühelos mit Freunden und Familie im Ausland in Kontakt bleiben und schnell neue Informationen oder Lerninhalte finden kann. Andererseits birgt die ständige Nutzung auch Gefahren: Viele Jugendliche verbringen täglich Stunden am Smartphone, was zu Konzentrationsproblemen und sozialer Isolation führen kann. Meiner Meinung nach ist eine bewusste, maßvolle Nutzung der beste Weg.`,
    sampleQuestions: [
      'Welche sozialen Medien nutzt du persönlich am häufigsten und wofür?',
      'Was sind aus deiner Sicht die größten Vorteile von Social Media?',
      'Welche Nachteile und Risiken siehst du für Kinder und Jugendliche?',
      'Wie ist die Situation mit Social Media in deinem Heimatland im Vergleich zu Deutschland?',
      'Glaubst du, dass Menschen heute wegen Handys weniger persönlich miteinander sprechen?'
    ]
  },
  {
    id: 'b1-oeffentlicher-verkehr',
    title: 'Öffentliche Verkehrsmittel vs. Eigenes Auto',
    level: 'B1',
    category: 'Prüfung B1 - Argumentation',
    description: 'Vor- und Nachteile von Bus/Bahn und Auto abwägen (Umwelt, Kosten, Pünktlichkeit).',
    text: `Die Wahl zwischen öffentlichen Verkehrsmitteln und dem eigenen Auto ist sowohl eine Frage des Komforts als auch des Umweltschutzes. Das Deutschlandticket für 49 Euro macht Bus und Bahn in Deutschland für viele Pendler finanziell sehr attraktiv. Außerdem schont die Nutzung öffentlicher Verkehrsmittel das Klima und reduziert CO2-Emissionen. Jedoch klagen viele Fahrgäste über Verspätungen und Zugausfälle bei der Bahn. Auf dem Land ist ein eigenes Auto oft unverzichtbar, da Busse nur selten fahren. Ich finde, man sollte Bus und Bahn in Großstädten bevorzugen, aber auf dem Land bleibt das Auto wichtig.`,
    sampleQuestions: [
      'Fährst du lieber mit Bus und Bahn oder fährst du lieber mit dem Auto?',
      'Welche Erfahrungen hast du mit der Pünktlichkeit der Deutschen Bahn gemacht?',
      'Ist das Deutschlandticket eine gute Idee für Studenten und Arbeitnehmer?',
      'Wie sieht der öffentliche Nahverkehr in deiner Heimatstadt aus?',
      'Was müsste verbessert werden, damit mehr Menschen ihr Auto stehen lassen?'
    ]
  },
  {
    id: 'b1-arbeiten-ausland',
    title: 'Arbeitssuche & Berufliche Integration',
    level: 'B1',
    category: 'Prüfung B1 - Beruf & Zukunft',
    description: 'Chancen, Voraussetzungen, Sprachbarrieren und Arbeitskultur in Deutschland.',
    text: `Deutschland bietet qualifizierten Fachkräften aus aller Welt vielfältige Karrieremöglichkeiten, insbesondere in den Bereichen IT, Pflege, Handwerk und Ingenieurwesen. Um erfolgreich im deutschen Berufsleben Fuß zu fassen, ist das Beherrschen der deutschen Sprache auf mindestens B1- oder B2-Niveau der wichtigste Schlüssel. Neben der Sprache schätzen deutsche Arbeitgeber Zuverlässigkeit, Pünktlichkeit und selbstständiges Arbeiten. Die Anerkennung von ausländischen Diplomen und Abschlüssen stellt jedoch oft eine bürokratische Hürde dar, die Geduld und gute Vorbereitung erfordert.`,
    sampleQuestions: [
      'In welchem Berufsfeld möchtest du in Zukunft arbeiten?',
      'Warum ist die deutsche Sprache für deinen Traumberuf so wichtig?',
      'Welche Werte sind in der deutschen Arbeitskultur besonders geschätzt?',
      'Welche Herausforderungen siehst du bei der Suche nach einem Ausbildungs- oder Arbeitsplatz?',
      'Hast du schon einmal ein Vorstellungsgespräch auf Deutsch geführt oder vorbereitet?'
    ]
  }
];

export interface DialogueLine {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  translation?: string;
}

export interface ChatTranscript {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: number;
  isCorrection?: boolean;
}

export interface VoiceOption {
  id: string;
  name: string;
  label: string;
  desc: string;
  tone: string;
}

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'Zephyr', name: 'Zephyr', label: 'Zephyr (Warm & Ausgeglichen)', desc: 'Natürliche, klare Aussprache – ideal für Deutschlernende', tone: 'Warm & Ausgeglichen' },
  { id: 'Kore', name: 'Kore', label: 'Kore (Sanft & Deutlich)', desc: 'Sehr deutliche, ruhige Aussprache auf A1/A2-Niveau', tone: 'Sanft & Deutlich' },
  { id: 'Puck', name: 'Puck', label: 'Puck (Lebendig & Freundlich)', desc: 'Freundlicher und motivierender Sprachrhythmus', tone: 'Lebendig & Freundlich' },
  { id: 'Charon', name: 'Charon', label: 'Charon (Ruhig & Tief)', desc: 'Entspannte, geduldige und sonore Stimme', tone: 'Ruhig & Geduldig' },
  { id: 'Fenrir', name: 'Fenrir', label: 'Fenrir (Klar & Bestimmt)', desc: 'Präzise und akzentfreie Artikulation', tone: 'Präzise & Klar' },
  { id: 'Aoede', name: 'Aoede', label: 'Aoede (Melodisch & Hell)', desc: 'Sehr ausdrucksstark und gut verständlich', tone: 'Melodisch & Hell' },
];

export interface DialoguePreset {
  id: string;
  title: string;
  level: GermanLevel;
  levelLabel: string;
  topic: string;
  userRole: string;
  aiRole: string;
  linesText: string;
}

export const SAMPLE_DIALOGUES: DialoguePreset[] = [
  // --- A1 LEVEL (Anfänger) ---
  {
    id: 'alphabet-buchstabieren',
    title: 'Das Alphabet & Buchstabieren (A bis Z)',
    level: 'A1',
    levelLabel: 'A1 Grundlagen',
    topic: 'Alphabet, Laute & Buchstabieren',
    userRole: 'Deutschlerner (Du)',
    aiRole: 'Sprachlehrer (KI)',
    linesText: `AI: Guten Tag! Lass uns die kniffligen deutschen Buchstaben üben. Wie heißt der Buchstabe Y auf Deutsch?
User: Der Buchstabe Y heißt auf Deutsch Ypsilon.
AI: Perfekt! Und wie heißt der Buchstabe J auf Deutsch?
User: Der Buchstabe J heißt Jot.
AI: Sehr gut! Wie spricht man das Wort Vogel aus? Mit V oder W?
User: Vogel spricht man mit Vau aus, wie ein F.
AI: Ganz genau! Und wie buchstabiert man das Wort Zeit?
User: Zeit buchstabiert man: Zett, E, I, T.
AI: Ausgezeichnet! Du beherrschst das deutsche Alphabet hervorragend!`,
  },
  {
    id: 'im-cafe',
    title: 'Im Café bestellen',
    level: 'A1',
    levelLabel: 'A1 Anfänger',
    topic: 'Gastronomie & Bestellen',
    userRole: 'Gast (Du)',
    aiRole: 'Kellner (KI)',
    linesText: `AI: Guten Tag! Herzlich willkommen. Was möchten Sie bestellen?
User: Guten Tag! Ich möchte bitte einen Kaffee mit Milch und Zucker.
AI: Gerne! Möchten Sie auch etwas essen? Wir haben frischen Kuchen.
User: Ja, gerne. Ein Stück Apfelkuchen bitte.
AI: Sehr gern! Bring ich Ihnen sofort an den Tisch.
User: Vielen Dank! Was kostet das zusammen?
AI: Das macht zusammen fünf Euro fünfzig bitte.
User: Hier sind sechs Euro. Stimmt so, vielen Dank!
AI: Vielen herzlichen Dank und guten Appetit!`,
  },
  {
    id: 'kennenlernen',
    title: 'Kennenlernen & Vorstellen',
    level: 'A1',
    levelLabel: 'A1 Anfänger',
    topic: 'Alltag & Begrüßung',
    userRole: 'Neuer Nachbar (Du)',
    aiRole: 'Gesprächspartner (KI)',
    linesText: `AI: Hallo! Wie heißt du und woher kommst du?
User: Hallo! Ich heiße Samir und ich komme aus Marokko. Und du?
AI: Freut mich, Samir! Ich heiße Anna und wohne hier in Berlin. Lernst du Deutsch?
User: Ja, ich lerne seit zwei Monaten Deutsch. Es macht viel Spaß!
AI: Dein Deutsch klingt schon richtig gut! Was machst du beruflich?
User: Ich arbeite als Entwickler und lerne jeden Tag neue Wörter.
AI: Das ist großartig! Ich helfe dir gerne beim Üben. Schön, dich kennenzulernen!
User: Danke schön, Anna! Freut mich auch sehr.`,
  },
  {
    id: 'im-supermarkt',
    title: 'Im Supermarkt einkaufen',
    level: 'A1',
    levelLabel: 'A1 Anfänger',
    topic: 'Einkaufen & Fragen',
    userRole: 'Kunde (Du)',
    aiRole: 'Verkäufer (KI)',
    linesText: `AI: Guten Tag! Kann ich Ihnen behilflich sein?
User: Entschuldigung, wo finde ich bitte das Mineralwasser?
AI: Das Wasser finden Sie in Gang drei, gleich rechts neben den Säften.
User: Perfekt, vielen Dank! Und wo gibt es frisches Brot?
AI: Die Bäckerei-Theke ist ganz vorne beim Eingang.
User: Super, vielen Dank für Ihre Hilfe!
AI: Sehr gern geschehen! Einen schönen Tag noch!
User: Danke, Ihnen auch einen schönen Tag!`,
  },

  // --- A2 LEVEL (Grundstufe) ---
  {
    id: 'nach-dem-weg-fragen',
    title: 'Nach dem Weg fragen',
    level: 'A2',
    levelLabel: 'A2 Grundstufe',
    topic: 'Orientierung in der Stadt',
    userRole: 'Tourist (Du)',
    aiRole: 'Einheimischer (KI)',
    linesText: `AI: Hallo! Suchen Sie etwas? Kann ich Ihnen helfen?
User: Entschuldigung, wie komme ich bitte zum Hauptbahnhof?
AI: Gehen Sie hier geradeaus und biegen Sie an der Ampel links ab.
User: Wie lange dauert das zu Fuß von hier?
AI: Nur etwa zehn Minuten. Sie können den Bahnhof gar nicht verfehlen.
User: Fährt von hier auch ein Bus direkt dorthin?
AI: Ja, die Buslinie zweihundert hält direkt vor dem Bahnhofsgebäude.
User: Vielen herzlichen Dank für die genaue Wegbeschreibung!
AI: Gern geschehen! Gute Reise und einen schönen Tag noch!`,
  },
  {
    id: 'beim-arzt',
    title: 'Beim Arzt - Termin & Symptome',
    level: 'A2',
    levelLabel: 'A2 Grundstufe',
    topic: 'Gesundheit & Arztbesuch',
    userRole: 'Patient (Du)',
    aiRole: 'Arzthelferin / Arzt (KI)',
    linesText: `AI: Praxis Dr. Schmidt, guten Tag! Wie kann ich Ihnen helfen?
User: Guten Tag, ich fühle mich seit gestern nicht gut und habe starke Halsschmerzen.
AI: Das tut mir leid. Haben Sie auch Fieber oder Husten?
User: Ja, ich habe leichtes Fieber und fühle mich sehr müde.
AI: Sie können heute um vierzehn Uhr dreißig in die Notfallsprechstunde kommen.
User: Vielen Dank, vierzehn Uhr dreißig passt mir sehr gut.
AI: Bitte bringen Sie Ihre Versichertenkarte mit. Bis später!
User: Alles klar, ich bringe sie mit. Auf Wiederhören!`,
  },
  {
    id: 'wohnungssuche',
    title: 'Wohnungsbesichtigung anfragen',
    level: 'A2',
    levelLabel: 'A2 Grundstufe',
    topic: 'Wohnen & Miete',
    userRole: 'Mietinteressent (Du)',
    aiRole: 'Vermieter (KI)',
    linesText: `AI: Guten Tag, Meyer Immobilien. Worum geht es?
User: Guten Tag, ich interessiere mich für Ihre Zweizimmerwohnung in der Innenstadt.
AI: Sehr gern. Die Wohnung ist ab dem ersten nächsten Monats bezugsfrei.
User: Das passt mir perfekt. Wie hoch ist die monatliche Warmmiete?
AI: Die Warmmiete beträgt siebenhundertfünfzig Euro inklusive aller Nebenkosten.
User: Das klingt fair. Wäre eine Besichtigung am Samstagvormittag möglich?
AI: Ja, Samstag um elf Uhr passt prima. Ich schicke Ihnen die Adresse per E-Mail.
User: Vielen Dank für die schnelle Rückmeldung!`,
  },

  // --- B1 LEVEL (Mittelstufe) ---
  {
    id: 'vorstellungsgespraech',
    title: 'Vorstellungsgespräch (Job Interview)',
    level: 'B1',
    levelLabel: 'B1 Mittelstufe',
    topic: 'Beruf & Karriere',
    userRole: 'Bewerber (Du)',
    aiRole: 'Personalmanager (KI)',
    linesText: `AI: Guten Tag und herzlich willkommen zu unserem Gespräch! Konnten Sie uns gut finden?
User: Guten Tag! Vielen Dank für die Einladung. Die Anfahrt mit der U-Bahn war sehr unkompliziert.
AI: Wunderbar! Erzählen Sie uns bitte kurz über Ihren beruflichen Werdegang und Ihre Schwerpunkte.
User: Gerne. Ich habe fundierte Erfahrung in der Entwicklung und arbeite sehr gerne im agilen Team.
AI: Das klingt überzeugend. Was reizt Sie besonders an der ausgeschriebenen Position in unserem Unternehmen?
User: Ihr Fokus auf innovative Technologien und die Chance, Verantwortung zu übernehmen, motivieren mich sehr.
AI: Ausgezeichnet! Welche Fragen haben Sie bezüglich des Projekts oder der Arbeitskultur an uns?
User: Mich würde interessieren, welche Weiterbildungsmöglichkeiten das Unternehmen für Entwickler anbietet.
AI: Eine sehr gute Frage! Wir unterstützen Konferenzbesuche und wöchentliche Lernzeiten vollkommen.`,
  },
  {
    id: 'reklamation-kundenservice',
    title: 'Reklamation beim Kundenservice',
    level: 'B1',
    levelLabel: 'B1 Mittelstufe',
    topic: 'Problemlösung & Argumentation',
    userRole: 'Kunde (Du)',
    aiRole: 'Kundendienstleiter (KI)',
    linesText: `AI: Kundenservice Technikhub, mein Name ist Schneider. Was kann ich für Sie tun?
User: Guten Tag. Ich habe vor drei Tagen einen Laptop bei Ihnen gekauft, aber der Bildschirm flackert ständig.
AI: Das tut mir sehr leid zu hören. Haben Sie die Bestellnummer und die Rechnung zur Hand?
User: Ja natürlich, die Bestellnummer lautet 48291 und die Quittung liegt mir vor.
AI: Vielen Dank. Da das Gerät brandneu ist, können wir Ihnen einen sofortigen Umtausch oder eine Reparatur anbieten.
User: Ein sofortiger Umtausch wäre mir am liebsten, da ich das Gerät dringend beruflich benötige.
AI: Vollkommen verständlich. Ich erstelle Ihnen ein kostenloses Retourenlabel und reserviere ein Neugerät.
User: Herzlichen Dank für die kundenfreundliche und schnelle Abwicklung!`,
  },
  {
    id: 'diskussion-homeoffice',
    title: 'Meinung äußern: Homeoffice vs. Büro',
    level: 'B1',
    levelLabel: 'B1 Mittelstufe',
    topic: 'Diskussion & Argumente',
    userRole: 'Kollege (Du)',
    aiRole: 'Teamkollege (KI)',
    linesText: `AI: Hallo! Wir besprechen gerade die neue Regelung zu Homeoffice. Was hältst du persönlich davon?
User: Meiner Meinung nach bietet die hybride Arbeit eine hervorragende Balance zwischen Konzentration und Austausch.
AI: Da stimme ich dir zu, aber fehlt dir im Homeoffice nicht manchmal der spontane Kontakt mit dem Team?
User: Einerseits schon, andererseits spare ich mir täglich zwei Stunden Pendelzeit im Berufsverkehr.
AI: Das ist ein starkes Argument. Denkst du, zwei feste Tage im Büro pro Woche wären ein sinnvoller Kompromiss?
User: Genau diesen Vorschlag halte ich für ideal, weil er beiden Bedürfnissen gerecht wird.
AI: Perfekt! Dann schlagen wir das morgen in der Abteilungsbesprechung gemeinsam so vor.
User: Ausgezeichnete Idee, ich freue mich auf unser Treffen morgen!`,
  },
];

export const SAMPLE_STORIES: ListeningStory[] = [
  // --- A1 LEVEL STORIES ---
  {
    id: 'a1-flohmarkt-berlin',
    title: 'Lukas auf dem Flohmarkt in Berlin',
    titleAr: 'لوكاس في سوق السلع المستعملة في برلين',
    level: 'A1',
    durationMinutes: '1.5 Min',
    category: 'Alltag & Einkaufen',
    description: 'قصة بسيطة وممتعة في نهاية الأسبوع مع مفردات الشراء والصباح والتجول في برلين.',
    text: `Es ist Samstagmorgen in Berlin. Lukas steht um acht Uhr auf. Das Wetter ist sonnig und warm. Er frühstückt einen Kaffee und ein Brötchen mit Käse. Danach zieht er seine Jacke an und geht zum Mauerpark. Dort ist heute ein großer Flohmarkt. Viele Menschen spazieren zwischen den Ständen. Lukas sucht ein schönes Geschenk für seine Schwester. An einem Stand sieht er eine kleine, alte Kamera. "Guten Tag! Wie viel kostet diese Kamera?", fragt er die Verkäuferin. "Sie kostet nur fünfzehn Euro und funktioniert noch prima", antwortet sie lächelnd. Lukas freut sich sehr. Er bezahlt fünfzehn Euro und nimmt die Kamera glücklich mit nach Hause.`,
    vocabulary: [
      { word: 'der Flohmarkt', article: 'der', plural: 'die Flohmärkte', meaningAr: 'سوق الخردة / السلع المستعملة' },
      { word: 'das Brötchen', article: 'das', plural: 'die Brötchen', meaningAr: 'خبز صغير / قريشلة' },
      { word: 'der Stand', article: 'der', plural: 'die Stände', meaningAr: 'طاولة العرض / كشك البيع' },
      { word: 'das Geschenk', article: 'das', plural: 'die Geschenke', meaningAr: 'الهدية' },
      { word: 'die Verkäuferin', article: 'die', plural: 'die Verkäuferinnen', meaningAr: 'البائعة' },
      { word: 'funktionieren', meaningAr: 'يشتغل / يعمل بصورة جيدة' },
    ],
    questions: [
      {
        id: 1,
        questionDe: 'Was isst und trinkt Lukas zum Frühstück?',
        questionAr: 'ماذا أكل وشرب لوكاس في وجبة الفطور؟',
        options: ['Tee und Kuchen', 'Kaffee und ein Brötchen mit Käse', 'Orangensaft und Eier'],
        correctIndex: 1,
        explanationDe: 'Im Text steht: Er frühstückt einen Kaffee und ein Brötchen mit Käse.',
        explanationDarija: 'فالنص قال: كيشرب قهوة وكياكل خبيز مع الفروماج.',
      },
      {
        id: 2,
        questionDe: 'Wohin geht Lukas nach dem Frühstück?',
        questionAr: 'إلى أين ذهب لوكاس بعد الفطور؟',
        options: ['Zum Bahnhof', 'In den Supermarkt', 'Zum Flohmarkt im Mauerpark'],
        correctIndex: 2,
        explanationDe: 'Er geht zum Mauerpark, weil dort heute ein großer Flohmarkt ist.',
        explanationDarija: 'مشى للماور بارك حيث كاين سوق الفلوهماركت.',
      },
      {
        id: 3,
        questionDe: 'Wie viel hat die alte Kamera gekostet?',
        questionAr: 'كم كان ثمن الكاميرا القديمة؟',
        options: ['50 Euro', '15 Euro', 'Kostenlos'],
        correctIndex: 1,
        explanationDe: 'Die Verkäuferin sagt: "Sie kostet nur fünfzehn Euro."',
        explanationDarija: 'البائعة قالت ليه راها بـ 15 أورو فقط.',
      },
    ],
  },
  {
    id: 'a1-erster-tag-sprachschule',
    title: 'Der erste Tag im Deutschkurs',
    titleAr: 'اليوم الأول في معهد تعليم الألمانية',
    level: 'A1',
    durationMinutes: '1.5 Min',
    category: 'Lernen & Kennenlernen',
    description: 'التعرف على الزملاء والأستاذة وقاعة الدرس مع العبارات الأساسية للمبتدئين.',
    text: `Heute ist Montag. Für Amira beginnt der erste Tag in der Sprachschule in Frankfurt. Sie betritt das Klassenzimmer im zweiten Stock. Im Raum sitzen bereits zehn Teilnehmerinnen und Teilnehmer aus verschiedenen Ländern. Die Lehrerin heißt Frau Wagner. Sie begrüßt alle herzlich mit einem freundlichen "Guten Morgen!". Zuerst stellen sich alle kurz vor. Amira sagt: "Mein Name ist Amira, ich komme aus Marokko und wohne seit zwei Monaten hier." Danach machen sie lustige Sprachspiele an der Tafel. Amira findet neue Freunde und freut sich schon sehr auf den nächsten Schultag.`,
    vocabulary: [
      { word: 'die Sprachschule', article: 'die', plural: 'die Sprachschulen', meaningAr: 'مدرسة اللغات' },
      { word: 'das Klassenzimmer', article: 'das', plural: 'die Klassenzimmer', meaningAr: 'قاعة الدرس / القسم' },
      { word: 'die Teilnehmer', article: 'die', plural: 'die Teilnehmer', meaningAr: 'المشاركون / الطلبة' },
      { word: 'sich vorstellen', meaningAr: 'يُعرّف بنفسه' },
      { word: 'die Tafel', article: 'die', plural: 'die Tafeln', meaningAr: 'السبورة' },
    ],
    questions: [
      {
        id: 1,
        questionDe: 'In welcher Stadt befindet sich die Sprachschule?',
        questionAr: 'في أي مدينة توجد مدرسة اللغات؟',
        options: ['In Berlin', 'In Frankfurt', 'In München'],
        correctIndex: 1,
        explanationDe: 'Amira besucht die Sprachschule in Frankfurt.',
        explanationDarija: 'المدرسة كاينة فمدينة فرانكفورت.',
      },
      {
        id: 2,
        questionDe: 'Woher kommt Amira?',
        questionAr: 'من أين تنحدر أميرة؟',
        options: ['Aus Spanien', 'Aus Ägypten', 'Aus Marokko'],
        correctIndex: 2,
        explanationDe: 'Amira sagt: "Ich komme aus Marokko."',
        explanationDarija: 'أميرة قالت: أنا كنجي من المغرب وعايشة دابا هنا.',
      },
    ],
  },

  // --- A2 LEVEL STORIES ---
  {
    id: 'a2-geheimnis-koffer',
    title: 'Das Geheimnis im alten Koffer',
    titleAr: 'السر المخبأ في الحقيبة القديمة',
    level: 'A2',
    durationMinutes: '2 Min',
    category: 'Abenteuer & Erinnerungen',
    description: 'قصة مشوقة عن العثور على حقيبة قديمة في قبو المنزل واسترجاع ذكريات زمن مضى.',
    text: `Am Wochenende half Jonas seinen Großeltern beim Aufräumen auf dem Dachboden. Zwischen verstaubten Kisten und alten Möbeln fand er einen schweren braunen Lederkoffer. Auf dem Koffer klebte ein altes Etikett aus dem Jahr 1972. Jonas fragte neugierig seinen Großvater: "Opa, was ist in diesem Koffer?". Der Großvater lächelte, holte einen kleinen Schlüssel und öffnete das Schloss. Darin lagen alte Schwarz-Weiß-Fotografien, handgeschriebene Briefe und ein Zugticket von München nach Rom. Der Großvater erzählte Jonas von seiner allerersten Reise durch Europa als junger Student. Jonas hörte begeistert zu und verstand, dass jeder alte Gegenstand eine wunderbare Geschichte erzählen kann.`,
    vocabulary: [
      { word: 'der Dachboden', article: 'der', plural: 'die Dachböden', meaningAr: 'العلّية / سقف البيت التخزيني' },
      { word: 'aufräumen', meaningAr: 'يرتب / ينظف المكان' },
      { word: 'der Lederkoffer', article: 'der', plural: 'die Lederkoffer', meaningAr: 'حقيبة جلدية' },
      { word: 'das Etikett', article: 'das', plural: 'die Etiketten', meaningAr: 'ملصق / بطاقة تعريفية' },
      { word: 'begeistert', meaningAr: 'متحمس / معجب بشدة' },
      { word: 'der Gegenstand', article: 'der', plural: 'die Gegenstände', meaningAr: 'الشيء / الغرض' },
    ],
    questions: [
      {
        id: 1,
        questionDe: 'Wo hat Jonas den alten Koffer gefunden?',
        questionAr: 'أين وجد يوناس الحقيبة القديمة؟',
        options: ['Im Keller', 'Auf dem Dachboden der Großeltern', 'Im Garten'],
        correctIndex: 1,
        explanationDe: 'Jonas fand den Koffer auf dem Dachboden beim Aufräumen.',
        explanationDarija: 'لقاها فالسطاح الفوقاني (Dachboden) ديال دار جدودو وهو كيعاونهم يرتبو.',
      },
      {
        id: 2,
        questionDe: 'Was befand sich im Lederkoffer?',
        questionAr: 'ماذا كان يوجد داخل الحقيبة الجلدية؟',
        options: ['Geld und Gold', 'Alte Fotos, Briefe und ein Zugticket', 'Alte Kleidungsstücke'],
        correctIndex: 1,
        explanationDe: 'Darin lagen Schwarz-Weiß-Fotografien, Briefe und ein Ticket nach Rom.',
        explanationDarija: 'كانو فيها تصاور قدام بالأبيض والكحل، بريات وتيكيت ديال التران لروما.',
      },
    ],
  },
  {
    id: 'a2-zugfahrt-ostsee',
    title: 'Die Fahrradtour an die Ostsee',
    titleAr: 'رحلة بالدراجة الهوائية إلى بحر البلطيق',
    level: 'A2',
    durationMinutes: '2 Min',
    category: 'Reisen & Natur',
    description: 'مغامرة ركوب الدراجات الهوائية في الطبيعة مع الأصدقاء والاستمتاع بنسيم البحر.',
    text: `Letzten Sommer planten Mia und ihr Bruder Felix einen besonderen Ausflug. Sie wollten mit dem Fahrrad von Rostock an die Ostsee fahren. Am frühen Morgen packten sie ihre Rucksäcke mit Wasserflaschen, Obst und Sandwiches. Das Wetter war ideal: Die Sonne schien, und ein leichter Wind wehte von Norden. Nach zwei Stunden Fahrt durch grüne Wälder und kleine Dörfer sahen sie endlich das blaue Meer. Die Luft roch nach Salz und frischer Freiheit. Sie stellten ihre Fahrräder am Strand ab, zogen die Schuhe aus und liefen barfuß über den warmen Sand. Am Abend aßen sie frischen Fisch in einem kleinen Restaurant am Hafen, bevor sie erschöpft aber überglücklich den Zug nach Hause nahmen.`,
    vocabulary: [
      { word: 'die Ostsee', article: 'die', meaningAr: 'بحر البلطيق (شمال ألمانيا)' },
      { word: 'der Rucksack', article: 'der', plural: 'die Rucksäcke', meaningAr: 'حقيبة الظهر' },
      { word: 'wehen', meaningAr: 'يهب (الريح)' },
      { word: 'barfuß', meaningAr: 'حافي القدمين' },
      { word: 'der Hafen', article: 'der', plural: 'die Häfen', meaningAr: 'الميناء' },
      { word: 'erschöpft', meaningAr: 'منهك / متعب بعد مجهود' },
    ],
    questions: [
      {
        id: 1,
        questionDe: 'Wie sind Mia und Felix an die Ostsee gereist?',
        questionAr: 'كيف سافر ميا وفيليكس إلى بحر البلطيق؟',
        options: ['Mit dem Flugzeug', 'Mit dem Fahrrad', 'Mit dem Bus'],
        correctIndex: 1,
        explanationDe: 'Sie fuhren mit dem Fahrrad von Rostock an die Küste.',
        explanationDarija: 'سافرو بالبيكالات (Fahrrad) من روستوك حتى للبحر.',
      },
      {
        id: 2,
        questionDe: 'Was aßen sie am Abend am Hafen?',
        questionAr: 'ماذا تناولا في المساء عند الميناء؟',
        options: ['Pizza', 'Frischen Fisch', 'Döner'],
        correctIndex: 1,
        explanationDe: 'Am Abend aßen sie frischen Fisch in einem kleinen Restaurant.',
        explanationDarija: 'تعشاو بالحوت الطري فريسطو صغير فالميناء.',
      },
    ],
  },

  // --- B1 LEVEL STORIES ---
  {
    id: 'b1-mutiger-schritt-cafe',
    title: 'Der mutige Schritt: Ein Café in Leipzig',
    titleAr: 'الخطوة الشجاعة: تأسيس مقهى في لايبزيغ',
    level: 'B1',
    durationMinutes: '2.5 Min',
    category: 'Beruf, Mut & Gesellschaft',
    description: 'قصة واقعية ملهمة عن ترك الوظيفة المكتبية التقليدية وبدء مشروع تجاري مجتمعي في ألمانيا.',
    text: `Acht Jahre lang arbeitete Sarah als Buchhalterin in einem großen Konzern. Obwohl sie ein sicheres Gehalt und geregelte Arbeitszeiten hatte, fühlte sie sich innerlich unzufrieden. Ihr größter Lebenstraum war es immer gewesen, ein gemütliches Café mit eigener Sauerteig-Bäckerei zu eröffnen. Vor zwei Jahren fasste sie schließlich den Entschluss, ihren sicheren Arbeitsplatz zu kündigen. Der Anfang war keineswegs leicht: Sie musste einen umfassenden Businessplan schreiben, Bankkredite verhandeln und zahllose bürokratische Vorschriften der Stadt Leipzig erfüllen. Viele Bekannte hielten ihren Schritt für zu riskant. Doch Sarah gab nicht auf. Heute ist ihr "Café Morgenrot" ein beliebter Treffpunkt im Viertel. Studenten, Senioren und junge Familien schätzen das hausgemachte Bio-Brot und die herzliche Atmosphäre. Sarah sagt heute stolz: "Der Weg war anstrengend, aber es hat sich gelohnt, für den eigenen Traum zu kämpfen."`,
    vocabulary: [
      { word: 'die Buchhalterin', article: 'die', plural: 'die Buchhalterinnen', meaningAr: 'المحاسبة المالية' },
      { word: 'kündigen', meaningAr: 'يقدم استقالته / ينهي عقداً' },
      { word: 'der Sauerteig', article: 'der', meaningAr: 'الخميرة البلدية / الطبيعية' },
      { word: 'die Vorschrift', article: 'die', plural: 'die Vorschriften', meaningAr: 'القانون التنظيمي / المساطر الإدارية' },
      { word: 'der Treffpunkt', article: 'der', plural: 'die Treffpunkte', meaningAr: 'مكان اللقاء والتجمع' },
      { word: 'sich lohnen', meaningAr: 'يستحق العناء والمجهود' },
    ],
    questions: [
      {
        id: 1,
        questionDe: 'Was war Sarahs Beruf, bevor sie ihr Café eröffnete?',
        questionAr: 'ماذا كانت مهنة سارة قبل افتتاح مقهاها؟',
        options: ['Köchin', 'Buchhalterin in einem Großkonzern', 'Architektin'],
        correctIndex: 1,
        explanationDe: 'Sie arbeitete acht Jahre lang als Buchhalterin.',
        explanationDarija: 'كانت خدامة 8 سنين كمحاسبة (Buchhalterin) فشركة كبيرة.',
      },
      {
        id: 2,
        questionDe: 'Was war an der Anfangsphase besonders schwierig?',
        questionAr: 'ما الذي كان صعباً بوجه خاص في المرحلة الأولى؟',
        options: ['Sie hatte keine Kunden', 'Bürokratie, Businessplan und Bankkredite', 'Sie konnte nicht backen'],
        correctIndex: 1,
        explanationDe: 'Sie musste Kredite verhandeln und bürokratische Vorschriften erfüllen.',
        explanationDarija: 'البيروقراطية ديال الأوراق والتفاوض مع البنك على القرض وتصحيح البيزنس بلان.',
      },
    ],
  },
  {
    id: 'b1-digital-detox',
    title: 'Zwei Wochen ohne Smartphone',
    titleAr: 'أسبوعان بدون هاتف ذكي (تجربة الانقطاع الرقمي)',
    level: 'B1',
    durationMinutes: '2.5 Min',
    category: 'Psychologie & Moderner Alltag',
    description: 'تجربة شخصية مفيدة حول التخلص من إدمان الشاشات واستعادة التركيز والتواصل البشري المباشر.',
    text: `David stellte fest, dass er täglich mehr als vier Stunden an seinem Smartphone verbrachte: sinnlose Benachrichtigungen, Social Media und ständige Erreichbarkeit raubten ihm die Konzentration. Er beschloss daher, an einem zweiwöchigen "Digital Detox"-Experiment teilzunehmen. Er schaltete sein Smartphone komplett aus und legte es in eine Schublade. Für wichtige Anrufe nutzte er ein altes Tastenhandy ohne Internetzugang. In den ersten drei Tagen spürte David eine seltsame innere Unruhe; ständig griff seine Hand reflexartig in die leere Hosentasche. Doch ab dem vierten Tag änderte sich seine Wahrnehmung radikal: In der U-Bahn schaute er nicht mehr nach unten, sondern beobachtete die Gesichter seiner Mitmenschen. Er las abends wieder Romane und schlief deutlich tiefer. Nach zwei Wochen schaltete er sein Telefon wieder an – allerdings löschte er vorher alle zeitfressenden Apps. Er hatte gelernt, die Technologie bewusst zu nutzen, anstatt sich von ihr beherrschen zu lassen.`,
    vocabulary: [
      { word: 'die Erreichbarkeit', article: 'die', meaningAr: 'إمكانية التواصل المستمر / التواجد الدائم' },
      { word: 'die Benachrichtigung', article: 'die', plural: 'die Benachrichtigungen', meaningAr: 'الإشعار / التنبيه في الهاتف' },
      { word: 'die Unruhe', article: 'die', meaningAr: 'القلق والاضطراب الداخلي' },
      { word: 'die Wahrnehmung', article: 'die', meaningAr: 'الإدراك والملاحظة الحسية' },
      { word: 'beherrschen', meaningAr: 'يتحكم / يسيطر على' },
    ],
    questions: [
      {
        id: 1,
        questionDe: 'Wie verhielt sich David in den ersten Tagen ohne Smartphone?',
        questionAr: 'كيف كان شعور وتصرف ديفيد في الأيام الأولى بدون هاتف ذكي؟',
        options: ['Er war sofort völlig entspannt', 'Er spürte eine innere Unruhe und griff reflexartig in die Tasche', 'Er brach das Experiment nach zwei Stunden ab'],
        correctIndex: 1,
        explanationDe: 'In den ersten drei Tagen spürte er eine seltsame innere Unruhe.',
        explanationDarija: 'فالأيام الثلاثة الأولى حس بواحد القلق وحرك يديه لا إرادياً لجيبو باش يقلب على التيليفون.',
      },
      {
        id: 2,
        questionDe: 'Was tat David am Ende des Experiments mit seinem Smartphone?',
        questionAr: 'ماذا فعل ديفيد في نهاية التجربة بهاتفه الذكي؟',
        options: ['Er verkaufte es im Internet', 'Er löschte alle zeitfressenden Apps', 'Er nutzte es genau wie früher'],
        correctIndex: 1,
        explanationDe: 'Er löschte alle zeitraubenden Apps, um bewusster damit umzugehen.',
        explanationDarija: 'مسح جميع ليزابليكاسيون اللي كيضيعو ليه الوقت باش يستعمل التكنولوجيا بوعي.',
      },
    ],
  },
];


