import React from 'react';
import { motion } from 'motion/react';
import { SessionStatus } from '../types';

interface VoiceVisualizerProps {
  status: SessionStatus;
  inputLevel: number; // 0 to 1
  outputLevel: number; // 0 to 1
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  status,
  inputLevel,
  outputLevel,
}) => {
  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';
  const isConnecting = status === 'connecting';
  const isIdle = status === 'idle';

  // Dynamic scale calculation based on real volume
  const dynamicLevel = isSpeaking ? outputLevel : isListening ? inputLevel : 0;
  const primaryScale = 1 + dynamicLevel * 0.45;
  const secondaryScale = 1 + dynamicLevel * 0.75;
  const tertiaryScale = 1 + dynamicLevel * 1.1;

  // Wave bar count for acoustic aura
  const waveBars = 24;

  return (
    <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 select-none">
      {/* Outer ambient glow ripple 2 */}
      {(isListening || isSpeaking) && (
        <motion.div
          className={`absolute rounded-full pointer-events-none transition-colors duration-500 ${
            isSpeaking
              ? 'bg-amber-500/10 border border-amber-400/20'
              : 'bg-emerald-500/10 border border-emerald-400/20'
          }`}
          style={{
            width: '280px',
            height: '280px',
          }}
          animate={{
            scale: tertiaryScale,
            opacity: 0.3 + dynamicLevel * 0.7,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      )}

      {/* Middle acoustic ripple 1 */}
      {(isListening || isSpeaking || isConnecting) && (
        <motion.div
          className={`absolute rounded-full pointer-events-none transition-colors duration-500 ${
            isSpeaking
              ? 'bg-amber-400/15'
              : isConnecting
              ? 'bg-blue-400/15'
              : 'bg-emerald-400/15'
          }`}
          style={{
            width: '220px',
            height: '220px',
          }}
          animate={{
            scale: isConnecting ? [1, 1.08, 1] : secondaryScale,
            opacity: isConnecting ? [0.4, 0.8, 0.4] : 0.4 + dynamicLevel * 0.6,
          }}
          transition={
            isConnecting
              ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 350, damping: 22 }
          }
        />
      )}

      {/* Circular spectrum bars */}
      {(isListening || isSpeaking) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {Array.from({ length: waveBars }).map((_, index) => {
            const angle = (index / waveBars) * 360;
            // Introduce slight natural frequency fluctuation per bar
            const barVariance = Math.sin((index / waveBars) * Math.PI * 4 + Date.now() / 300);
            const barHeight = Math.max(6, dynamicLevel * 48 * (0.6 + 0.4 * barVariance));

            return (
              <div
                key={index}
                className="absolute origin-bottom"
                style={{
                  transform: `rotate(${angle}deg) translate(0, -112px)`,
                }}
              >
                <motion.div
                  className={`w-1 rounded-full transition-colors duration-300 ${
                    isSpeaking ? 'bg-amber-400/70' : 'bg-emerald-400/70'
                  }`}
                  style={{ height: `${barHeight}px` }}
                  animate={{ height: `${barHeight}px` }}
                  transition={{ ease: 'easeOut', duration: 0.08 }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Central Core Orb */}
      <motion.div
        className={`relative z-10 flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40 rounded-full shadow-xl transition-all duration-500 cursor-default ${
          isIdle
            ? 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 text-slate-600 shadow-slate-200'
            : isConnecting
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25'
            : isSpeaking
            ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/30'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
        }`}
        animate={{
          scale: isConnecting ? [1, 1.04, 1] : primaryScale,
        }}
        transition={
          isConnecting
            ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 400, damping: 24 }
        }
      >
        {/* Subtle inner ring highlight */}
        <div className="absolute inset-2 rounded-full border border-white/20 pointer-events-none" />

        {/* Status animation icon / wave */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-1.5">
          {isIdle && (
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-slate-300/40 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-500">Bereit</span>
            </motion.div>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white"
              />
              <span className="mt-2 text-xs font-medium text-white/90">Verbinden...</span>
            </div>
          )}

          {isListening && (
            <div className="flex items-center gap-1.5 h-10 px-2">
              {[0, 1, 2, 3, 4].map((i) => {
                const height = Math.max(8, inputLevel * 32 * (1 + 0.3 * Math.sin(i * 1.5)));
                return (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-white rounded-full"
                    animate={{ height: `${height}px` }}
                    transition={{ ease: 'easeOut', duration: 0.05 }}
                  />
                );
              })}
            </div>
          )}

          {isSpeaking && (
            <div className="flex items-center gap-1.5 h-10 px-2">
              {[0, 1, 2, 3, 4].map((i) => {
                const height = Math.max(10, outputLevel * 36 * (1 + 0.4 * Math.cos(i * 1.2)));
                return (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-white rounded-full"
                    animate={{ height: `${height}px` }}
                    transition={{ ease: 'easeOut', duration: 0.05 }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
