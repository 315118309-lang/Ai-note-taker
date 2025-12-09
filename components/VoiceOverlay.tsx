import React from 'react';
import { VoiceState } from '../types';

interface VoiceOverlayProps {
  state: VoiceState;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ state }) => {
  if (state === VoiceState.IDLE) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm transition-all duration-300">
      
      {state === VoiceState.LISTENING && (
        <div className="flex flex-col items-center gap-8">
           <div className="flex items-end gap-2 h-16">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 bg-blue-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 100}%`,
                  animationDuration: `${0.4 + Math.random() * 0.4}s`
                }}
              />
            ))}
          </div>
          <p className="text-blue-100 text-lg font-medium animate-pulse">正在聆听...</p>
        </div>
      )}

      {state === VoiceState.PROCESSING && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300">正在分析意图...</p>
        </div>
      )}

      {state === VoiceState.SUCCESS && (
        <div className="flex flex-col items-center gap-4 scale-110 transition-transform">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-400 font-semibold">已记录</p>
        </div>
      )}
    </div>
  );
};

export default VoiceOverlay;