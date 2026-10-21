import React, { useState } from 'react';
import { ExternalLink, HelpCircle } from 'lucide-react';

interface PdfPageScreenViewProps {
  pageNumber: number;
  availablePages?: number[];
  lessonNumber: number;
  currentTrackLabel?: string;
  youtubeVideoId?: string;
  onOpenPracticeDrawer?: () => void;
  hasPracticeQuestions?: boolean;
}

export const PdfPageScreenView: React.FC<PdfPageScreenViewProps> = ({
  pageNumber,
  availablePages,
  onOpenPracticeDrawer,
  hasPracticeQuestions = true,
}) => {
  const [activePage, setActivePage] = useState<number>(pageNumber);
  const [scanImageError, setScanImageError] = useState(false);

  // Synchronize activePage if pageNumber prop changes
  React.useEffect(() => {
    setActivePage(pageNumber);
    setScanImageError(false);
  }, [pageNumber]);

  const pageList = availablePages && availablePages.length > 0 ? availablePages : [pageNumber];

  // Exact Archive.org URLs from https://archive.org/details/da-f-kompakt-neu-a-1
  // Leaf index in Archive.org is (activePage - 1), e.g., Kursbuch Seite 8 = n7, Seite 10 = n9, Seite 12 = n11
  const archiveLeaf = Math.max(0, activePage - 1);
  const archivePageImageUrl = `https://archive.org/download/da-f-kompakt-neu-a-1/page/n${archiveLeaf}_w1200.jpg`;
  const directPdfPageUrl = `https://archive.org/download/da-f-kompakt-neu-a-1/DaF%20Kompakt%20Neu%20A1.pdf#page=${activePage}`;

  return (
    <div className="space-y-4 transition-all">
      {pageList.length > 1 && (
        <div dir="ltr" className="w-full max-w-4xl flex items-center gap-2 flex-wrap">
          {[...pageList].sort((a, b) => a - b).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setActivePage(p);
                setScanImageError(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePage === p
                  ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Seite {p}
            </button>
          ))}
        </div>
      )}

      {/* Real Scanned Book Page Image directly from Archive.org PDF (da-f-kompakt-neu-a-1) */}
      {!scanImageError && (
        <div className="w-full max-w-4xl bg-white border-2 border-amber-300 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                PDF الأصلي • Seite {activePage}
              </span>
              <span className="font-bold text-slate-200">
                صورة الصفحة {activePage} مباشرة من كتاب DaF kompakt neu A1
              </span>
            </div>
            <a
              href={directPdfPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1"
            >
              <span>تكبير في نافذة كاملة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="bg-slate-100 p-2 sm:p-4 flex justify-center">
            <img
              src={archivePageImageUrl}
              alt={`DaF kompakt neu A1 Kursbuch Seite ${activePage}`}
              className="w-full max-w-3xl h-auto rounded-lg shadow-md border border-slate-300 bg-white"
              loading="eager"
              onError={() => setScanImageError(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
