import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  HelpCircle,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  ListFilter,
  ArrowRight,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { GermanLevel, TopicPreset, SAMPLE_TOPICS } from '../types';

interface TopicTrainingViewProps {
  selectedTopic: TopicPreset;
  setSelectedTopic: (topic: TopicPreset) => void;
  customTopicTitle: string;
  setCustomTopicTitle: (title: string) => void;
  customTopicText: string;
  setCustomTopicText: (text: string) => void;
  selectedLevel: GermanLevel;
  setSelectedLevel: (level: GermanLevel) => void;
  enableCorrection: boolean;
  setEnableCorrection: (enable: boolean) => void;
  isActive: boolean;
}

export const TopicTrainingView: React.FC<TopicTrainingViewProps> = ({
  selectedTopic,
  setSelectedTopic,
  customTopicTitle,
  setCustomTopicTitle,
  customTopicText,
  setCustomTopicText,
  selectedLevel,
  setSelectedLevel,
  enableCorrection,
  setEnableCorrection,
  isActive,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [filterLevel, setFilterLevel] = useState<GermanLevel | 'ALL'>('ALL');

  const filteredPresets = SAMPLE_TOPICS.filter((preset) =>
    filterLevel === 'ALL' ? true : preset.level === filterLevel
  );

  const handleSelectPreset = (preset: TopicPreset) => {
    if (isActive) return;
    setSelectedTopic(preset);
    setCustomTopicTitle(preset.title);
    setCustomTopicText(preset.text);
    setSelectedLevel(preset.level);
  };

  const wordCount = customTopicText.trim()
    ? customTopicText.trim().split(/\s+/).length
    : 0;
  const sentenceCount = customTopicText.trim()
    ? (customTopicText.match(/[.!?]+/g) || []).length
    : 0;

  const getLevelBadgeClass = (lvl: GermanLevel) => {
    switch (lvl) {
      case 'A1':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'A2':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'B1':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Thementraining &amp; Diskussion
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-sans">
                تدريب التيمات A1-B1
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              أعطِه نص أي موضوع (من ChatGPT أو كتابك)، وسيستخرج الأسئلة ليسألك وتجيبه، أو تسأله أنت ويجيبك!
            </p>
          </div>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          {(['A1', 'A2', 'B1'] as GermanLevel[]).map((lvl) => (
            <button
              id={`btn-topic-level-${lvl}`}
              key={lvl}
              type="button"
              disabled={isActive}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Subtabs: Choose Preset or Enter Custom Topic */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80 text-xs">
          <button
            id="tab-topic-presets"
            type="button"
            disabled={isActive}
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ListFilter className="w-3.5 h-3.5 text-amber-600" />
            <span>مواضيع الامتحانات الجاهزة ({SAMPLE_TOPICS.length})</span>
          </button>
          <button
            id="tab-topic-custom"
            type="button"
            disabled={isActive}
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>كتابة / لصق تيما خاصة (ChatGPT)</span>
          </button>
        </div>

        {/* Phonetic & Grammar Correction Toggle */}
        <label
          htmlFor="topic-correction-toggle"
          className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none"
        >
          <input
            id="topic-correction-toggle"
            type="checkbox"
            disabled={isActive}
            checked={enableCorrection}
            onChange={(e) => setEnableCorrection(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 cursor-pointer"
          />
          <span className="font-medium hidden sm:inline">التصحيح الصوتي والنحوي</span>
          <span className="font-medium sm:hidden">تصحيح</span>
        </label>
      </div>

      {/* Mode A: Preset Topic Cards */}
      {activeTab === 'presets' && (
        <div className="flex flex-col gap-3">
          {/* Level Filter Chips */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto pb-1">
            <span className="text-[11px] font-medium text-slate-400 shrink-0">تصفية حسب المستوى:</span>
            {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => (
              <button
                id={`filter-chip-${lvl}`}
                key={lvl}
                type="button"
                disabled={isActive}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                  filterLevel === lvl
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {lvl === 'ALL' ? 'جميع المستويات' : lvl}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {filteredPresets.map((preset) => {
              const isSelected = selectedTopic.id === preset.id;
              return (
                <div
                  id={`preset-topic-${preset.id}`}
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/40 shadow-xs ring-1 ring-amber-400/50'
                      : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                  } ${isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadgeClass(
                          preset.level
                        )}`}
                      >
                        {preset.level}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {preset.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {preset.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {preset.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <MessageSquare className="w-3 h-3 text-amber-600" />
                      {preset.sampleQuestions.length} أسئلة نموذجية
                    </span>
                    {isSelected ? (
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" /> محدد للتدريب
                      </span>
                    ) : (
                      <span className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5">
                        اختيار <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode B: Custom Topic Editor */}
      {activeTab === 'custom' && (
        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="custom-topic-title-input"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              عنوان الموضوع (Thema-Titel):
            </label>
            <input
              id="custom-topic-title-input"
              type="text"
              disabled={isActive}
              value={customTopicTitle}
              onChange={(e) => setCustomTopicTitle(e.target.value)}
              placeholder="مثال: Meine Familie, Urlaub in Deutschland, Wohnungssuche..."
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/20 bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="custom-topic-textarea"
                className="text-xs font-semibold text-slate-700"
              >
                نص الموضوع (Text zum Thema):
              </label>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span>{wordCount} كلمة</span>
                <span>&bull;</span>
                <span>{sentenceCount} جملة</span>
              </div>
            </div>
            <textarea
              id="custom-topic-textarea"
              disabled={isActive}
              rows={6}
              value={customTopicText}
              onChange={(e) => setCustomTopicText(e.target.value)}
              placeholder="ضع هنا نص التيما التي قمت بتوليدها بـ ChatGPT أو Gemini أو نسختها من كتابك الألماني... سيقوم الذكاء الاصطناعي بدراسة النص واستخراج أسئلة دقيقة لاختبارك فيها شفهياً، ويمكنك أيضاً أن تسأله أنت حولها!"
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/20 bg-slate-50/50 resize-y leading-relaxed text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              يمكنك كتابة النص بالألمانية مهما كان طوله؛ سيبدأ المساعد الصوتي بسؤالك حوله مباشرة.
            </span>
            <button
              id="btn-clear-topic-text"
              type="button"
              disabled={isActive || !customTopicText}
              onClick={() => {
                setCustomTopicText('');
                setCustomTopicTitle('');
              }}
              className="text-[11px] text-slate-500 hover:text-rose-600 underline cursor-pointer disabled:opacity-40"
            >
              مسح النص
            </button>
          </div>
        </div>
      )}

      {/* Active Selected Topic Preview & Tips */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              الموضوع الجاهز للمحادثة:
            </span>
            <span className="text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md">
              {customTopicTitle || selectedTopic.title || 'موضوع بدون عنوان'}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadgeClass(
              selectedLevel
            )}`}
          >
            Niveau {selectedLevel}
          </span>
        </div>

        {/* Text snippet */}
        <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200/60 line-clamp-3 leading-relaxed">
          "{customTopicText || selectedTopic.text}"
        </p>

        {/* Moroccan Darija & Two-Way Q&A Prompts */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
          <div className="flex items-center gap-1.5 text-amber-900 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>تبادل الأدوار: جاوب على أسئلته أو اسأله أنت: «Und wie ist das bei dir?»</span>
          </div>
          <div className="text-emerald-800 font-medium">
            <span>طلب الشرح بالدارجة: «شرح ليا بالدارجة شنو كتعني...»</span>
          </div>
        </div>
      </div>
    </div>
  );
};
