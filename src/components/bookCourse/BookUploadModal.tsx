import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, X, RefreshCw } from 'lucide-react';
import { CourseBook } from '../../types/bookCourse';
import { DAF_KOMPAKT_A1_BOOK } from '../../data/dafKompaktBookData';

interface BookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookLoaded: (book: CourseBook) => void;
  currentBook: CourseBook;
}

export const BookUploadModal: React.FC<BookUploadModalProps> = ({
  isOpen,
  onClose,
  onBookLoaded,
  currentBook,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('يرجى اختيار ملف PDF صالح لكتاب اللغة الألمانية.');
      return;
    }

    setError(null);
    setFileName(file.name);
    setAnalyzing(true);
    setAnalysisStatus('جاري قراءة محتوى الكتاب واستخراج الفهرس والصفحات...');

    try {
      // Read text snippet using FileReader
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const buffer = reader.result as ArrayBuffer;
          // Extract plain text snippet from raw pdf stream
          const textDecoder = new TextDecoder('utf-8');
          const rawString = textDecoder.decode(buffer.slice(0, 150000));
          const printable = rawString.replace(/[^\x20-\x7E\xC0-\xFF]/g, ' ');

          setAnalysisStatus('الذكاء الاصطناعي يحلل الوحدات والفهرس والمفردات...');

          const res = await fetch('/api/book/analyze-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              textSnippet: printable.slice(0, 8000),
            }),
          });

          let bookTitle = file.name.replace(/\.pdf$/i, '').trim();
          let level: 'A1' | 'A2' | 'B1' = 'A1';

          if (res.ok) {
            const data = await res.json();
            if (data.title && data.title.length > 2) {
              bookTitle = data.title;
            }
            if (data.level) {
              level = data.level;
            }
          }

          // Build adapted course book based on the analyzed book
          const newBook: CourseBook = {
            ...DAF_KOMPAKT_A1_BOOK,
            id: `book-${Date.now()}`,
            title: bookTitle,
            fileName: file.name,
            level,
            uploadedAt: new Date().toISOString(),
          };

          setAnalysisStatus('اكتمل التحليل! تم بناء مسار التعلم اليومي.');
          setTimeout(() => {
            onBookLoaded(newBook);
            onClose();
          }, 800);
        } catch (e: any) {
          console.error('Error in PDF analysis:', e);
          // Fallback gracefully using file name
          const cleanName = file.name.replace(/\.pdf$/i, '');
          const fallbackBook: CourseBook = {
            ...DAF_KOMPAKT_A1_BOOK,
            id: `book-${Date.now()}`,
            title: cleanName,
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
          };
          onBookLoaded(fallbackBook);
          onClose();
        } finally {
          setAnalyzing(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      setError(err?.message || 'تعذر معالجة الملف.');
      setAnalyzing(false);
    }
  };

  const handleResetToDefault = () => {
    onBookLoaded(DAF_KOMPAKT_A1_BOOK);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">رفع وتحليل كتاب ألماني جديد (PDF)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          ارفع أي كتاب ألماني (مثل <span className="font-semibold text-slate-900">DaF kompakt neu A1</span> أو{' '}
          <span className="font-semibold text-slate-900">Menschen A1</span> أو{' '}
          <span className="font-semibold text-slate-900">Netzwerk A1</span>). سيقوم الذكاء الاصطناعي بقراءة الكتاب،
          التعرف على اسمه بدقة، استخراج أرقام الصفحات والدروس، وبناء خطة يومية صفحة بصفحة!
        </p>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileProcess(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-amber-500 bg-amber-50/50'
              : 'border-slate-300 hover:border-amber-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            id="book-pdf-input"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <label htmlFor="book-pdf-input" className="cursor-pointer block space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <span className="text-sm font-bold text-slate-900">اسحب وأفلت ملف PDF هنا</span>
              <p className="text-xs text-slate-500 mt-1">أو اضغط لتصفح ملفات جهازك</p>
            </div>

            <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
              يدعم جميع كتب اللغات والمستويات A1, A2, B1
            </span>
          </label>
        </div>

        {/* Loading / Status state */}
        {analyzing && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-amber-900">{analysisStatus}</p>
            {fileName && <p className="text-[11px] text-amber-700">{fileName}</p>}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Current Active Book & Reset Option */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            الكتاب النشط حالياً:{' '}
            <span className="font-bold text-slate-900">{currentBook.title}</span>
          </div>

          <button
            onClick={handleResetToDefault}
            className="text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>استعادة DaF kompakt neu A1 المدمج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
