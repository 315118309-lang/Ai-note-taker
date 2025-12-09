import React, { useState, useEffect, useRef } from 'react';
import { Tab, Task, JournalEntry, VoiceState } from './types';
import { Mic, LayoutList, Book, Plus, Send } from 'lucide-react';
import { getInitialTasks, getInitialJournal, parseVoiceInput } from './services/mockAiService';
import { formatTodayHeader } from './utils/dateUtils';
import TaskItem from './components/TaskItem';
import JournalEntryItem from './components/JournalEntryItem';
import VoiceOverlay from './components/VoiceOverlay';

// Mock phrases to simulate speech to text if browser API fails or for demo consistency
const MOCK_PHRASES = [
  "提醒我下午5点给张总打电话",
  "今天对项目有个绝妙的想法，关于语音交互的优化",
  "明天去买晚餐食材",
  "晨跑完感觉精力充沛，又是元气满满的一天",
  "下午2点前提交季度报告",
];

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TODAY);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  
  // Input State
  const [inputText, setInputText] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);
  
  // Refs
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Load initial data
    setTasks(getInitialTasks());
    setJournal(getInitialJournal());
  }, []);

  // --- Handlers ---
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  const handleCreateItem = async (text: string, isVoice: boolean = false) => {
    if (!text.trim()) return;

    if (voiceState === VoiceState.IDLE && isVoice) {
         setVoiceState(VoiceState.PROCESSING);
    }
    
    // Simulate AI Parsing
    const result = await parseVoiceInput(text);

    if (result.intent === 'CREATE_TASK') {
       // Logic: if dateOffset > 0, we'd normally hide it from "Today".
       // For this demo, we'll just add it and maybe show a toast.
       const newTask: Task = {
         id: Date.now().toString(),
         content: result.content,
         isCompleted: false,
         createdAt: new Date(),
         dueDate: new Date(Date.now() + (result.dateOffset || 0) * 86400000),
         timeString: result.timeString
       };
       setTasks(prev => [newTask, ...prev]);
       
       if (result.dateOffset && result.dateOffset > 0) {
         // In a real app, show a toast here saying "Added to Tomorrow"
         // For now, we add it to the list but visually distinguish implies it's "Today" view 
         // (PRD says only show Today's tasks, but for demo we show it matches input)
       }
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: result.content,
        createdAt: new Date(),
        wordCount: result.content.length, // Simple length for Chinese char count
        hasAudio: isVoice
      };
      setJournal(prev => [newEntry, ...prev]);
      // If we are in Todo tab but created a journal, maybe switch tab? 
      // PRD implies separate inputs, but voice might capture thoughts in Todo tab.
      // We will stick to current tab or auto-switch if intent was strong.
      if (activeTab === Tab.TODAY) {
          // Optional: Switch to Journal tab to show result
          setActiveTab(Tab.JOURNAL);
      }
    }

    setVoiceState(VoiceState.SUCCESS);
    setInputText('');
    
    setTimeout(() => {
      setVoiceState(VoiceState.IDLE);
    }, 1500);
  };

  // --- Voice Interaction Logic ---
  const startRecording = () => {
    setVoiceState(VoiceState.LISTENING);
    // Simulate recording duration limit or "long press" logic
    recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
    }, 5000); // Max 5s for demo
  };

  const stopRecording = () => {
    if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    if (voiceState !== VoiceState.LISTENING) return;

    // Simulate getting text from ASR
    const randomPhrase = MOCK_PHRASES[Math.floor(Math.random() * MOCK_PHRASES.length)];
    handleCreateItem(randomPhrase, true);
  };


  // --- Render Helpers ---
  const renderHeader = () => {
    if (activeTab === Tab.TODAY) {
      const todayTasks = tasks.filter(t => !t.isCompleted);
      const totalToday = tasks.length;
      const progress = totalToday === 0 ? 0 : Math.round(((totalToday - todayTasks.length) / totalToday) * 100);

      return (
        <header className="flex items-start justify-between mb-6 pt-2">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">今日待办</h1>
            <p className="text-slate-400 mt-1 font-medium">{formatTodayHeader(new Date())}</p>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Simple Circular Progress Mock */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#1e293b" strokeWidth="4" fill="transparent" />
              <circle 
                cx="24" cy="24" r="20" 
                stroke="#3b82f6" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray="126" 
                strokeDashoffset={126 - (126 * progress) / 100}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-200">{progress}%</span>
          </div>
        </header>
      );
    } 
    
    // Journal Stats
    const totalWords = journal.reduce((acc, curr) => acc + curr.wordCount, 0);
    return (
      <header className="mb-8 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">年度篇数</p>
            <p className="text-3xl font-mono text-white">{journal.length}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
             <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">年度字数</p>
             <p className="text-3xl font-mono text-white">{(totalWords / 1000).toFixed(1)}k</p>
          </div>
        </div>
      </header>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-8">
      {/* Mobile Frame Container */}
      <div className="w-full h-[100dvh] md:h-[800px] md:w-[400px] bg-slate-900 md:rounded-[3rem] md:border-[8px] md:border-slate-800 relative overflow-hidden flex flex-col shadow-2xl">
        
        {/* Status Bar Mock (Visual only) */}
        <div className="h-6 w-full flex justify-between items-center px-6 pt-2 opacity-50 text-[10px] text-white">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Voice Overlay (Global) */}
        <VoiceOverlay state={voiceState} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 scroll-smooth">
          {renderHeader()}

          {activeTab === Tab.TODAY ? (
            <div className="space-y-1">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 opacity-50">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <span className="text-4xl">☕️</span>
                  </div>
                  <p className="text-slate-400 text-sm">今日已清空，享受生活吧。</p>
                </div>
              ) : (
                tasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
                ))
              )}
            </div>
          ) : (
             <div className="space-y-4">
                <h3 className="text-slate-500 font-semibold text-sm mb-4">近期回顾</h3>
                {journal.map(entry => (
                  <JournalEntryItem key={entry.id} entry={entry} />
                ))}
             </div>
          )}
        </div>

        {/* Bottom Interaction Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
          
          {/* Controls Container */}
          <div className="relative flex flex-col gap-4">
            
            {/* Input Bar (Only visible if not Recording or Processing) */}
            {voiceState === VoiceState.IDLE && (
              <div className="flex items-end gap-3 px-2">
                
                {activeTab === Tab.TODAY ? (
                  // Hybrid Input Bar for Tasks
                  <div className="flex-1 bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-1 flex items-center shadow-lg mb-16">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="输入新任务..."
                      className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-slate-500 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateItem(inputText);
                      }}
                    />
                    <button
                      className={`p-3 rounded-xl transition-all ${inputText ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                      onClick={() => handleCreateItem(inputText)}
                    >
                      {inputText ? <Send size={20} /> : 
                        <div 
                          className="bg-slate-700/50 p-1 rounded-full cursor-pointer"
                          onMouseDown={startRecording}
                          onMouseUp={stopRecording}
                          onTouchStart={startRecording}
                          onTouchEnd={stopRecording}
                          title="按住说话"
                        >
                           <Mic size={20} />
                        </div>
                      }
                    </button>
                  </div>
                ) : (
                   // Floating Action Button for Journal (positioned via absolute in normal layout, but here simplified for layout structure)
                   <div className="absolute right-4 bottom-20">
                     <button 
                       className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-900/50 flex items-center justify-center text-white active:scale-95 transition-transform"
                       onClick={() => {
                         // Simple toggle to voice mode for prototype
                         startRecording();
                         setTimeout(stopRecording, 2000); // Auto-stop for simulation
                       }}
                     >
                       <Plus size={28} />
                     </button>
                   </div>
                )}
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex justify-around items-center bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 pt-2 pb-6 md:pb-2 md:rounded-b-[2.5rem]">
              <button
                onClick={() => setActiveTab(Tab.TODAY)}
                className={`flex flex-col items-center gap-1 p-4 transition-colors ${activeTab === Tab.TODAY ? 'text-blue-500' : 'text-slate-600'}`}
              >
                <LayoutList size={24} strokeWidth={activeTab === Tab.TODAY ? 2.5 : 2} />
                <span className="text-[10px] font-medium">待办</span>
              </button>

              <div className="w-px h-8 bg-slate-800"></div>

              <button
                 onClick={() => setActiveTab(Tab.JOURNAL)}
                 className={`flex flex-col items-center gap-1 p-4 transition-colors ${activeTab === Tab.JOURNAL ? 'text-blue-500' : 'text-slate-600'}`}
              >
                <Book size={24} strokeWidth={activeTab === Tab.JOURNAL ? 2.5 : 2} />
                <span className="text-[10px] font-medium">随手记</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;