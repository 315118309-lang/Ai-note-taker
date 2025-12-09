import React from 'react';
import { JournalEntry } from '../types';
import { formatJournalDate } from '../utils/dateUtils';
import { Mic } from 'lucide-react';

interface JournalEntryItemProps {
  entry: JournalEntry;
}

const JournalEntryItem: React.FC<JournalEntryItemProps> = ({ entry }) => {
  const { day, month } = formatJournalDate(entry.createdAt);

  return (
    <div className="flex gap-4 mb-6">
      {/* Date Block */}
      <div className="flex-shrink-0 flex flex-col items-center pt-1 w-12">
        <span className="text-xl font-bold text-slate-100 leading-none">{day}</span>
        <span className="text-xs font-medium text-slate-500 uppercase mt-1">{month}</span>
        {/* Timeline Line */}
        <div className="w-px h-full bg-slate-800 mt-2 rounded-full"></div>
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-4">
        <div className="bg-slate-800 p-4 rounded-xl rounded-tl-none border border-slate-700/50 relative">
           {entry.hasAudio && (
             <div className="absolute top-4 right-4 text-slate-600">
               <Mic size={14} />
             </div>
           )}
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
            {entry.content}
          </p>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            {entry.wordCount} 字
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryItem;