import React from 'react';
import { Task } from '../types';
import { Check, Clock } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div 
      className={`group flex items-center gap-4 p-4 mb-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 transition-all duration-300 ${task.isCompleted ? 'opacity-50' : 'hover:bg-slate-800'}`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.isCompleted 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-slate-500 group-hover:border-blue-400'
        }`}
      >
        {task.isCompleted && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm sm:text-base truncate ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
          {task.content}
        </p>
      </div>

      {task.timeString && !task.isCompleted && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700/50 text-blue-300 text-xs font-medium">
          <Clock size={12} />
          <span>{task.timeString}</span>
        </div>
      )}
    </div>
  );
};

export default TaskItem;