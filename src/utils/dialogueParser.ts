import { DialogueLine } from '../types';

export function parseDialogue(text: string): DialogueLine[] {
  const rawLines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const result: DialogueLine[] = [];

  // Regex to detect speaker markers like "Name:", "Name -", "Name："
  const speakerRegex = /^([^:：\-–—]{1,30})\s*[:：\-–—]\s*(.*)$/;
  const speakerNames: string[] = [];

  for (const line of rawLines) {
    const m = line.match(speakerRegex);
    if (m && m[1] && m[2]) {
      const name = m[1].trim().toLowerCase();
      if (!speakerNames.includes(name)) {
        speakerNames.push(name);
      }
    }
  }

  const userKeywords = [
    'user', 'du', 'ich', 'gast', 'kunde', 'tourist', 'lerner', 'schüler',
    'patient', 'käufer', 'bewerber', 'mieter', 'b', '2', 'me', 'you'
  ];
  const aiKeywords = [
    'ai', 'ki', 'bot', 'assistant', 'system', 'kellner', 'verkäufer',
    'einheimischer', 'partner', 'arzt', 'lehrer', 'vermieter', 'chef', 'a', '1'
  ];

  let aiSpeakerName = '';
  let userSpeakerName = '';

  if (speakerNames.length >= 2) {
    const first = speakerNames[0];
    const second = speakerNames[1];

    if (userKeywords.some((k) => first.includes(k)) || (!userKeywords.some((k) => second.includes(k)) && aiKeywords.some((k) => second.includes(k)))) {
      userSpeakerName = first;
      aiSpeakerName = second;
    } else {
      aiSpeakerName = first;
      userSpeakerName = second;
    }
  } else if (speakerNames.length === 1) {
    if (userKeywords.some((k) => speakerNames[0].includes(k))) {
      userSpeakerName = speakerNames[0];
    } else {
      aiSpeakerName = speakerNames[0];
    }
  }

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const m = raw.match(speakerRegex);

    if (m && m[1] && m[2]) {
      const spk = m[1].trim().toLowerCase();
      const content = m[2].trim();
      let role: 'ai' | 'user' = 'ai';

      if (userSpeakerName && spk === userSpeakerName) {
        role = 'user';
      } else if (aiSpeakerName && spk === aiSpeakerName) {
        role = 'ai';
      } else if (userKeywords.some((k) => spk.includes(k))) {
        role = 'user';
      } else if (aiKeywords.some((k) => spk.includes(k))) {
        role = 'ai';
      } else {
        // Alternating fallback
        role = i % 2 === 0 ? 'ai' : 'user';
      }

      result.push({
        id: `line-${i}`,
        speaker: role,
        text: content,
      });
    } else {
      // Line without speaker prefix: remove bullet or numbering like "1.", "2)", "- ", "* "
      const clean = raw.replace(/^(\d+[\.\)]|\-|\*)\s*/, '').trim();
      if (!clean) continue;

      const prev = result[result.length - 1];
      const speaker: 'ai' | 'user' = prev?.speaker === 'ai' ? 'user' : 'ai';
      result.push({
        id: `line-${i}`,
        speaker,
        text: clean,
      });
    }
  }

  return result;
}

export function buildDialogueInstruction(
  lines: DialogueLine[],
  enableCorrection: boolean = true,
  selectedLevel: string = 'A1'
): string {
  const formattedDialogue = lines
    .map((l, idx) => `[Zeile ${idx + 1}] Rolle: ${l.speaker === 'ai' ? 'KI (Deine Rolle)' : 'BENUTZER (Rolle des Lerners)'}\nText: "${l.text}"`)
    .join('\n\n');

  const firstAiLine = lines.find((l) => l.speaker === 'ai')?.text || '';

  return `### ABSOLUTE INSTRUKTION: FESTES DIALOG-ROLLENSPIEL (Niveau ${selectedLevel}) ###
WICHTIGSTE REGEL (HÖCHSTE PRIORITÄT):
Du führst HIER KEINE FREIE KONVERSATION und keinen beliebigen Smalltalk!
Du und der Lerner spielen EXAKT das unten stehende Skript Zeile für Zeile durch.
Weiche unter keinen Umständen vom Skript ab. Sprich nur das, was deine Rolle im Skript vorgibt!

DAS VORGESCHRIEBENE SKRIPT:
${formattedDialogue}

============================================================
DEIN ABLAUF BEI JEDEM SCHRITT (STRENG EINHALTEN):
============================================================
1. DEINE ZEILEN ALS [KI]:
   - Sobald du an der Reihe bist, sprich die jeweilige [KI]-Zeile aus dem Skript laut, deutlich und vorbildlich auf Hochdeutsch aus.
   - Erfinde keine zusätzlichen Sätze oder Einleitungen, die nicht im Skript stehen.
   ${firstAiLine ? `- Deine erste Zeile im Dialog lautet: "${firstAiLine}".` : ''}

2. ZEILEN DES [BENUTZERS]:
   - Wenn der Benutzer an der Reihe ist, höre ihm mit höchster Aufmerksamkeit zu.
   - Der Benutzer soll genau seine jeweilige [BENUTZER]-Zeile sprechen.

${
  enableCorrection
    ? `3. ⭐ STRIKTE NULL-TOLERANZ-KORREKTUR BEI AUSSPRACHE- ODER LAUTFEHLERN:
   - Der Benutzer lernt Deutsch. Du darfst KEINEN EINZIGEN FEHLER durchgehen lassen!
   - Kritisches Kriterium: Phonetische Genauigkeit bei Buchstaben und Lauten:
     * Der Buchstabe "Y" heißt auf Deutsch IMMER "Ypsilon" [ˈʏpsilɔn]. Er heißt NIEMALS "Jota" (Jota ist J).
     * Der Buchstabe "V" wird wie [f] ("Vogel" / "Vau") gesprochen.
     * Der Buchstabe "W" wird wie [v] ("Wasser" / "Weh") gesprochen.
     * Der Buchstabe "Z" wird als [ts] ("Zett") gesprochen.
     * Umlaute Ä, Ö, Ü und das ß müssen glasklar unterschieden werden.
   - WENN DER BENUTZER EINEN FEHLER MACHT (Aussprache, falsches Wort, Grammatikfehler oder Abweichung vom Text):
     a) STOPP! Fahre keinesfalls im Dialog fort!
     b) Unterbrich kurz und freundlich auf Deutsch: Erkläre den Fehler sofort (z. B.: "Halt, pass bitte auf die Aussprache auf: Du hast [...] gesagt, aber es heißt [...]").
     c) Sprich dem Benutzer das Wort oder den Satz fehlerfrei und langsam vor.
     d) Fordere ihn verbindlich auf: "Wiederhole den Satz bitte noch einmal: [korrekter Satz]".
     e) WARTE, bis der Benutzer den Satz erneut spricht. Fahre erst fort, wenn der Satz wirklich 100% fehlerfrei ist!
   - WENN DER BENUTZER SEINE ZEILE SAUBER UND KORREKT GESPROCHEN HAT:
     Lobe ihn ganz kurz ("Sehr gut!", "Ausgezeichnet!") und sprich DIREKT deine nächste [KI]-Zeile aus dem Skript vor!`
    : `3. KORREKTURMODUS AUS:
   - Sobald der Benutzer seine Zeile gesprochen hat, sprich direkt deine nächste [KI]-Zeile vor.`
}

4. ENDE DES SKRIPTS:
   - Wenn die letzte Zeile des Dialogs erreicht und gesprochen wurde, gratuliere dem Lerner herzlich auf Deutsch zu seinem erfolgreichen Dialog-Training!

5. ROLLENSPIEL-VERHALTEN:
   - Bleibe lebendig in deiner Rolle (z. B. Kellner, Verkäufer, Partner).
   - Sage niemals Metatexte wie "Zeile 1", "Laut Skript" oder "Ich bin die KI".`;
}

