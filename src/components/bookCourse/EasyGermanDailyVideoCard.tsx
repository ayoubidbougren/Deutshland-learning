import React, { useState, useEffect } from 'react';
import {
  Film,
  ExternalLink,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Search,
  ListVideo,
  Sparkles,
  Play,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  EASY_GERMAN_A1_VIDEOS,
  EASY_GERMAN_PLAYLIST_URL,
  EasyGermanLessonVideo,
  getEasyGermanVideoForDay,
  isEasyGermanVideoWatched,
  setEasyGermanVideoWatched,
} from '../../data/easyGermanPlaylistData';

interface EasyGermanDailyVideoCardProps {
  dayNumber: number;
  isCompleted?: boolean;
  onToggleCompleted?: (completed: boolean) => void;
  standalone?: boolean;
}

export const EasyGermanDailyVideoCard: React.FC<EasyGermanDailyVideoCardProps> = ({
  dayNumber,
  isCompleted,
  onToggleCompleted,
  standalone = false,
}) => {
  const defaultVideo = getEasyGermanVideoForDay(dayNumber);
  const [currentVideo, setCurrentVideo] = useState<EasyGermanLessonVideo>(defaultVideo);
  const [localWatched, setLocalWatched] = useState<boolean>(() => isEasyGermanVideoWatched(dayNumber));
  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync with dayNumber changes
  useEffect(() => {
    const video = getEasyGermanVideoForDay(dayNumber);
    setCurrentVideo(video);
    setLocalWatched(isEasyGermanVideoWatched(dayNumber));
  }, [dayNumber]);

  // If controlled prop provided
  const watched = isCompleted !== undefined ? isCompleted : localWatched;

  const handleToggleWatched = () => {
    const nextVal = !watched;
    setLocalWatched(nextVal);
    setEasyGermanVideoWatched(dayNumber, nextVal);
    if (onToggleCompleted) {
      onToggleCompleted(nextVal);
    }
    if (nextVal) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const handleSelectVideo = (v: EasyGermanLessonVideo) => {
    setCurrentVideo(v);
    setShowLibraryModal(false);
  };

  const handleNextVideo = () => {
    const nextIdx = (currentVideo.day % EASY_GERMAN_A1_VIDEOS.length);
    setCurrentVideo(EASY_GERMAN_A1_VIDEOS[nextIdx]);
  };

  const handlePrevVideo = () => {
    const prevIdx = (currentVideo.day - 2 + EASY_GERMAN_A1_VIDEOS.length) % EASY_GERMAN_A1_VIDEOS.length;
    setCurrentVideo(EASY_GERMAN_A1_VIDEOS[prevIdx]);
  };

  const handleResetToDayVideo = () => {
    setCurrentVideo(defaultVideo);
  };

  // Filter library
  const filteredVideos = EASY_GERMAN_A1_VIDEOS.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.titleDe.toLowerCase().includes(q) ||
      v.titleAr.toLowerCase().includes(q) ||
      v.day.toString() === q
    );
  });

  const getCategoryBadge = (cat: EasyGermanLessonVideo['category']) => {
    switch (cat) {
      case 'dialogue':
        return { label: 'حوارات واقعية', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' };
      case 'vocabulary':
        return { label: 'مفردات وأغراض', color: 'bg-blue-500/10 text-blue-700 border-blue-300' };
      case 'grammar':
        return { label: 'قواعد مبسطة', color: 'bg-purple-500/10 text-purple-700 border-purple-300' };
      case 'culture':
        return { label: 'ثقافة ومجتمع', color: 'bg-amber-500/10 text-amber-700 border-amber-300' };
      default:
        return { label: 'حياة يومية', color: 'bg-teal-500/10 text-teal-700 border-teal-300' };
    }
  };

  const badge = getCategoryBadge(currentVideo.category);

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-md transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 sm:p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Easy German • المستوى A1
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  الحلقة {currentVideo.day} من {EASY_GERMAN_A1_VIDEOS.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                فيديو الانغماس والاستماع اليومي من Easy German 🇩🇪
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLibraryModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
              title="تصفح جميع الحلقات الـ 64"
            >
              <ListVideo className="w-3.5 h-3.5 text-amber-300" />
              <span>كل الحلقات (64)</span>
            </button>

            <a
              href={EASY_GERMAN_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-xs transition-all"
              title="فتح قائمة التشغيل على YouTube"
            >
              <span>البلايليست كاملة</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Lesson Video Title Info */}
        <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.color} bg-white/90`}>
                {badge.label}
              </span>
              {currentVideo.day === defaultVideo.day ? (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                  ⭐ مخصص لـ Day {dayNumber}
                </span>
              ) : (
                <button
                  onClick={handleResetToDayVideo}
                  className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>العودة لحلقة Day {dayNumber}</span>
                </button>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
              {currentVideo.titleDe}
            </h4>
            <p className="text-xs text-amber-200/90 mt-0.5">
              {currentVideo.titleAr}
            </p>
          </div>

          {/* Quick Prev / Next Episode Controls */}
          <div className="flex items-center gap-1 self-end sm:self-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={handlePrevVideo}
              title="الحلقة السابقة"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            </button>
            <span className="text-[11px] font-mono px-2 text-amber-300 font-bold">
              #{currentVideo.day}
            </span>
            <button
              onClick={handleNextVideo}
              title="الحلقة التالية"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded YouTube Player */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
          <iframe
            key={currentVideo.videoId}
            src={`https://www.youtube-nocookie.com/embed/${currentVideo.videoId}?rel=0&modestbranding=1`}
            title={currentVideo.titleDe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Action Controls and Complete Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Completion Toggle Button */}
          <button
            onClick={handleToggleWatched}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm ${
              watched
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-98'
            }`}
          >
            {watched ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>✅ تمت مشاهدة فيديو اليوم من Easy German بنجاح!</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-900" />
                <span>تأكيد مشاهدة فيديو اليوم من Easy German (إتمام المهمة)</span>
              </>
            )}
          </button>

          {/* Links */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={currentVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>مشاهدة على YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Tips Box */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-800">نصيحة الاستماع الفعّال لـ Easy German:</strong>
            <span className="block mt-0.5">
              فيديوهات Easy German كتمتاز بنطق ألماني طبيعي في شوارع برلين مع كتابة الجمل بالألمانية والإنجليزية في الأسفل.
              تفرج فالمقطع مرة بتركيز باش وذنك توالف نغمة الكلام الواقعي، وركز على المفردات اللي قريتيها فدرس اليوم!
            </span>
          </div>
        </div>
      </div>

      {/* Library Modal: Browse all 64 videos */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ListVideo className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-base sm:text-lg">
                    مكتبة فيديوهات Easy German A1 كاملة (64 حلقة)
                  </h3>
                  <p className="text-xs text-slate-300">
                    اختر أي حلقة ترغب بمشاهدتها أو مراجعتها في أي وقت
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLibraryModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن موضوع أو كلمة (Numbers, Supermarket, Weather, Verbs...)"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Video List */}
            <div className="overflow-y-auto p-4 space-y-2 flex-1">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  لم يتم العثور على أي حلقة مطابقة للبحث
                </div>
              ) : (
                filteredVideos.map((v) => {
                  const isCurrent = v.day === currentVideo.day;
                  const isDayTarget = v.day === defaultVideo.day;
                  const vBadge = getCategoryBadge(v.category);
                  const isWatchedSaved = isEasyGermanVideoWatched(v.day);

                  return (
                    <button
                      key={v.day}
                      onClick={() => handleSelectVideo(v)}
                      className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-50 border-amber-400 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-black ${
                            isCurrent
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{v.day}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 line-clamp-1">
                              {v.titleDe}
                            </span>
                            {isDayTarget && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-800 font-bold border border-amber-400/40">
                                درس اليوم
                              </span>
                            )}
                            {isWatchedSaved && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                                تمت المشاهدة ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {v.titleAr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${vBadge.color}`}>
                          {vBadge.label}
                        </span>
                        <Play className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>إجمالي الحلقات: {EASY_GERMAN_A1_VIDEOS.length} حلقة</span>
              <button
                onClick={() => setShowLibraryModal(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
