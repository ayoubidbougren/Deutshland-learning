import React, { useState, useMemo } from 'react';
import { DialogueLine, DialoguePreset, GermanLevel, SAMPLE_DIALOGUES, SessionStatus } from '../types';
import {
  BookOpen,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  FileText,
  HelpCircle,
  Check,
  RotateCcw,
  GraduationCap,
  Volume2,
} from 'lucide-react';

interface DialoguePracticeViewProps {
  dialogueText: string;
  setDialogueText: (text: string) => void;
  parsedLines: DialogueLine[];
  currentLineIndex: number;
  status: SessionStatus;
  isActive: boolean;
  enableCorrection: boolean;
  setEnableCorrection: (val: boolean) => void;
  selectedLevel: GermanLevel;
  setSelectedLevel: (lvl: GermanLevel) => void;
  onStartPractice: () => void;
  onResetPractice: () => void;
}

export const DialoguePracticeView: React.FC<DialoguePracticeViewProps> = ({
  dialogueText,
  setDialogueText,
  parsedLines,
  currentLineIndex,
  status,
  isActive,
  enableCorrection,
  setEnableCorrection,
  selectedLevel,
  setSelectedLevel,
  onStartPractice,
  onResetPractice,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [levelFilter, setLevelFilter] = useState<GermanLevel | 'ALL'>('ALL');

  const filteredPresets = useMemo(() => {
    if (levelFilter === 'ALL') return SAMPLE_DIALOGUES;
    return SAMPLE_DIALOGUES.filter((p) => p.level === levelFilter);
  }, [levelFilter]);

  const handleSelectPreset = (preset: DialoguePreset) => {
    if (isActive) return;
    setDialogueText(preset.linesText);
    setSelectedLevel(preset.level);
    setIsEditing(false);
  };

  const handleSwapRoles = () => {
    if (isActive) return;
    const lines = dialogueText.split('\n');
    let swappedCount = 0;
    const swapped = lines.map((l) => {
      if (/^\s*(ai|ki|bot|assistant|system)\s*[:：]/i.test(l)) {
        swappedCount++;
        return l.replace(/^\s*(ai|ki|bot|assistant|system)\s*[:：]/i, 'User: ');
      }
      if (/^\s*(user|du|ich|gast|kunde|tourist|lerner|schüler)\s*[:：]/i.test(l)) {
        swappedCount++;
        return l.replace(/^\s*(user|du|ich|gast|kunde|tourist|lerner|schüler)\s*[:：]/i, 'AI: ');
      }
      return l;
    });

    if (swappedCount === 0 && parsedLines.length > 0) {
      const explicitSwapped = parsedLines
        .map((line) => {
          const newSpeaker = line.speaker === 'ai' ? 'User' : 'AI';
          return `${newSpeaker}: ${line.text}`;
        })
        .join('\n');
      setDialogueText(explicitSwapped);
    } else {
      setDialogueText(swapped.join('\n'));
    }
  };

  const getLevelBadgeClass = (lvl: GermanLevel) => {
    switch (lvl) {
      case 'A1':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'A2':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'B1':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      {/* Dialogue Header & Controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  Deutsch-Dialoge (A1 &bull; A2 &bull; B1)
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadgeClass(
                    selectedLevel
                  )}`}
                >
                  Niveau {selectedLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rollenspiel auf Deutsch: Die KI korrigiert Fehler und lässt dich den Satz wiederholen, bis er stimmt.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {!isActive && (
              <button
                id="edit-script-toggle-btn"
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isEditing
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {isEditing ? 'Rollen-Vorschau' : 'Text bearbeiten / Eigenen Dialog'}
              </button>
            )}
          </div>
        </div>

        {/* Level Tabs (A1, A2, B1) */}
        {!isActive && !isEditing && (
          <div className="pt-3 pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 mr-1">Sprachniveau:</span>
              <button
                type="button"
                onClick={() => setLevelFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  levelFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Alle
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('A1')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  levelFilter === 'A1'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                A1 Anfänger
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('A2')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  levelFilter === 'A2'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 hover:bg-sky-100 text-sky-800'
                }`}
              >
                A2 Grundstufe
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('B1')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  levelFilter === 'B1'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800'
                }`}
              >
                B1 Mittelstufe
              </button>
            </div>
          </div>
        )}

        {/* Strict Correction & Repeat Feature Banner */}
        <div className="py-3 px-3.5 my-2 bg-amber-50/70 border border-amber-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                enableCorrection ? 'bg-amber-600 text-white font-bold' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-950">
                  Wiederholen bis es stimmt (Korrekturpflicht)
                </span>
                <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded font-medium">
                  Strenges Training
                </span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed mt-0.5">
                {enableCorrection ? (
                  <>
                    <span className="block font-medium">
                      Strenge Aussprache- und Grammatikprüfung (Null-Toleranz): Der KI-Tutor korrigiert jeden Laut und lässt dich wiederholen, bis der Satz 100% stimmt.
                    </span>
                    <span className="block text-[10px] text-amber-800/80 mt-0.5">
                      تدقيق صوتي وقواعدي صارم: الذكاء الاصطناعي يتوقف عند أي خطأ نطق حتى تعيده بشكل صحيح تماماً.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block font-medium">
                      Ausgeschaltet: Der Dialog geht ohne Wiederholungsaufforderung weiter.
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      إيقاف: الحوار يستمر بدون إلزامية إعادة الجملة عند الخطأ.
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            id="toggle-correction-mode-btn"
            type="button"
            disabled={isActive}
            onClick={() => setEnableCorrection(!enableCorrection)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all self-start sm:self-center shrink-0 cursor-pointer ${
              enableCorrection
                ? 'bg-amber-700 border-amber-800 text-white shadow-xs'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
            } ${isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {enableCorrection ? 'Wiederholung AN ✓' : 'Wiederholung AUS'}
          </button>
        </div>

        {/* Presets Grid */}
        {!isActive && !isEditing && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Wähle einen Dialog ({filteredPresets.length} verfügbar):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-btn-${preset.id}`}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-left transition-all flex items-start justify-between gap-2 group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getLevelBadgeClass(
                          preset.level
                        )}`}
                      >
                        {preset.level}
                      </span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900 truncate">
                        {preset.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{preset.topic}</p>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-60 group-hover:opacity-100 shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Edit or Input Mode */}
        {isEditing && !isActive ? (
          <div className="pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="custom-dialogue-input" className="text-xs font-semibold text-slate-700">
                Eigenen Dialog schreiben oder einfügen (A1 / A2 / B1):
              </label>
              <span className="text-[11px] text-slate-400">
                User: (Du) &bull; AI: (KI)
              </span>
            </div>

            <textarea
              id="custom-dialogue-input"
              rows={9}
              value={dialogueText}
              onChange={(e) => setDialogueText(e.target.value)}
              placeholder={`AI: Hallo! Wie geht es dir heute?\nUser: Mir geht es sehr gut, danke! Und dir?\nAI: Auch prima, danke!`}
              className="w-full p-3.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-800 leading-relaxed resize-y"
              dir="auto"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Tipp: Die KI korrigiert jeden Satz und lässt dich den Satz wiederholen, bis er fehlerfrei ist.
              </span>
              <button
                id="done-editing-btn"
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium cursor-pointer self-end"
              >
                Speichern &amp; Rollen prüfen
              </button>
            </div>
          </div>
        ) : (
          /* Visual Script Line-by-Line Flow */
          <div className="pt-3 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Deine Zeilen (Du)
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Bot className="w-3.5 h-3.5 text-emerald-600" /> KI-Zeilen (Tutor)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="swap-roles-btn"
                  type="button"
                  disabled={isActive}
                  onClick={handleSwapRoles}
                  title="Rollen tauschen: Wechsle, wer welche Zeile spricht"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                  }`}
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Rollen tauschen (Du ⇄ KI)</span>
                </button>
                <span className="font-mono text-[11px] font-medium text-slate-400">
                  {parsedLines.length} Sätze &bull; {selectedLevel}
                </span>
              </div>
            </div>

            {parsedLines.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                <FileText className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                <p>Noch kein Dialog eingegeben.</p>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-slate-800 font-semibold underline"
                >
                  Hier klicken, um einen Dialog einzufügen
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {parsedLines.map((line, idx) => {
                  const isUser = line.speaker === 'user';
                  const isPast = idx < currentLineIndex;
                  const isCurrent = idx === currentLineIndex && isActive;

                  return (
                    <div
                      key={line.id}
                      className={`p-3 rounded-xl border transition-all text-sm flex items-start gap-3 ${
                        isCurrent
                          ? isUser
                            ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                          : isPast
                          ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                          : 'bg-white border-slate-200/90'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          isUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              isUser ? 'text-blue-700' : 'text-emerald-700'
                            }`}
                          >
                            {isUser ? 'Du (Benutzer)' : 'KI (Deutsch)'}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full animate-pulse font-medium">
                              {isUser ? 'Jetzt vorlesen' : 'KI spricht...'}
                            </span>
                          )}
                          {isPast && (
                            <span className="text-[11px] text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Erledigt
                            </span>
                          )}
                        </div>
                        <p className="text-slate-900 leading-relaxed font-medium">{line.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
