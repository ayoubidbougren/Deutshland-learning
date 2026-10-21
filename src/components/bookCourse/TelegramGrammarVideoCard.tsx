import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Play, Sparkles } from 'lucide-react';
import {
  TELEGRAM_GRAMMAR_LESSONS,
  TelegramGrammarLesson,
  findMatchingTelegramLessons,
  getTelegramLessonExplanation,
} from '../../data/telegramGrammarLessons';
import { BookGrammarTopic } from '../../types/bookCourse';

interface TelegramGrammarVideoCardProps {
  topic: BookGrammarTopic;
}

export const TelegramGrammarVideoCard: React.FC<TelegramGrammarVideoCardProps> = ({ topic }) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // If topic has an explicit telegramVideo ID, find it directly
  let targetLesson: TelegramGrammarLesson | undefined;
  if (topic.telegramVideo?.id) {
    targetLesson = TELEGRAM_GRAMMAR_LESSONS.find((l) => l.id === topic.telegramVideo?.id);
  }

  // Fallback to intelligent matching if not found
  if (!targetLesson) {
    const matched = findMatchingTelegramLessons(topic);
    targetLesson = matched[0] || TELEGRAM_GRAMMAR_LESSONS[0];
  }

  const lesson = targetLesson;

  const handleCopy = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const explanation = getTelegramLessonExplanation(lesson);

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/90 via-sky-50/40 to-indigo-50/60 p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Top Header: Channel info */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#229ED9] text-white flex items-center justify-center shadow-xs shrink-0">
            {/* Telegram Icon */}
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.48-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.44 3.79-1.63 4.58-1.91 5.09-1.92.11 0 .37.03.53.17.14.12.18.28.2.45-.02.07-.02.16-.04.27z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-1.5">
                <span>فيديو شرح القاعدة من Telegram</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  قناة أ. خالد بوزان
                </span>
              </span>
            </div>
            <p className="text-[11px] text-sky-800/80">
              فيديو واحد مباشر ومحدد يطابق موضوع القاعدة بالضبط بدون تشتيت
            </p>
          </div>
        </div>
      </div>

      {/* Single Exact Video Card */}
      <div className="rounded-xl border border-sky-300/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-bold">
                فيديو القاعدة المحدد
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[11px] font-bold">
                {lesson.title}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                مستوى {lesson.level}
              </span>
            </div>
            <h5 className="text-sm font-bold text-slate-900 pt-0.5">{lesson.topicAr}</h5>
            <p className="text-xs text-slate-500 font-medium">{lesson.topicDe}</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => handleCopy(lesson.url, e)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="نسخ رابط التيليغرام"
            >
              {copiedUrl === lesson.url ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 text-[11px] font-semibold">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">نسخ الرابط</span>
                </>
              )}
            </button>

            <a
              href={lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>مشاهدة الفيديو على Telegram</span>
              <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />
            </a>
          </div>
        </div>

        {/* محتوى هذا الفيديو بالتفصيل */}
        <div className="rounded-xl bg-sky-50/70 border border-sky-100 p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-sky-900 font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>ماذا يشرح هذا الفيديو بالتحديد:</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-normal text-xs pr-1">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
};


