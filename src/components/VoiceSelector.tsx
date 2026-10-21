import React from 'react';
import { AVAILABLE_VOICES, VoiceOption } from '../types';
import { Volume2 } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  disabled?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between px-1">
        <label
          htmlFor="voice-select"
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span>KI-Stimme wählen (Voice)</span>
        </label>
        <span className="text-xs text-slate-400">Gemini Live API</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {AVAILABLE_VOICES.map((v: VoiceOption) => {
          const isSelected = selectedVoice === v.id;
          return (
            <button
              id={`voice-btn-${v.id.toLowerCase()}`}
              key={v.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectVoice(v.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-medium'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-sm font-semibold leading-tight">{v.name}</span>
              <span
                className={`text-[11px] truncate max-w-full mt-0.5 ${
                  isSelected ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {v.tone}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
