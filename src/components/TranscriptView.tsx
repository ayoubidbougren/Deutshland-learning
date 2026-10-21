import React, { useEffect, useRef, useState } from 'react';
import { ChatTranscript } from '../types';
import { MessageSquare, Trash2, Copy, Check, User, Sparkles } from 'lucide-react';

interface TranscriptViewProps {
  transcripts: ChatTranscript[];
  onClear: () => void;
  status: string;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcripts,
  onClear,
  status,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const handleCopy = () => {
    if (transcripts.length === 0) return;
    const fullText = transcripts
      .map((t) => `${t.sender === 'user' ? 'User' : 'AI'}: ${t.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="transcript-container"
      className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-sm flex flex-col overflow-hidden transition-all"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700 tracking-wide">
            Live-Transkription (Text)
          </span>
          {transcripts.length > 0 && (
            <span className="text-[11px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded-full font-mono">
              {transcripts.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {transcripts.length > 0 && (
            <>
              <button
                id="copy-transcript-btn"
                onClick={handleCopy}
                title="Transkript kopieren"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                id="clear-transcript-btn"
                onClick={onClear}
                title="Transkript löschen"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content scroll area */}
      <div className="p-4 max-h-60 overflow-y-auto space-y-3 scroll-smooth text-sm">
        {transcripts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <MessageSquare className="w-6 h-6 mb-2 text-slate-300 stroke-[1.5]" />
            <p className="font-medium text-slate-500">Noch keine Konversation</p>
            <p className="mt-1 text-slate-400">
              Drücke auf das Mikrofon und sprich auf Deutsch. Gesprochenes erscheint hier in Echtzeit.
            </p>
          </div>
        ) : (
          transcripts.map((item) => {
            const isUser = item.sender === 'user';
            return (
              <div
                key={item.id}
                className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isUser ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed text-sm ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                  }`}
                  dir="auto"
                >
                  <p className="whitespace-pre-wrap select-text">{item.text}</p>
                </div>
              </div>
            );
          })
        )}

        {status === 'speaking' && (
          <div className="flex gap-2 items-center text-xs text-emerald-600 animate-pulse pt-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KI spricht gerade auf Deutsch...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
