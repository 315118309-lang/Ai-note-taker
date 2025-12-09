import { AiParseResult } from '../types';

/**
 * Simulates the NLU (Natural Language Understanding) process described in the PRD.
 * It uses simple heuristic rules to determine if the input is a Task or a Journal entry.
 */
export const parseVoiceInput = async (text: string): Promise<AiParseResult> => {
  return new Promise((resolve) => {
    // Simulate network/processing latency (800ms)
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // Heuristics for Task detection (Keywords)
      // English keywords retained for compatibility, added Chinese keywords
      const taskKeywords = ['remind', 'task', 'buy', 'call', 'email', 'schedule', 'meeting', 'submit', 'tomorrow', 'today', 'at',
                            '提醒', '任务', '买', '打', '联系', '邮件', '安排', '会议', '提交', '明天', '今天', '点', '发'];
      const isTask = taskKeywords.some(keyword => lowerText.includes(keyword)) && text.length < 50;

      if (isTask) {
        // Simple slot filling simulation
        let timeString = undefined;
        let dateOffset = 0; // Default today
        let cleanContent = text;

        // Detect Time (matches 15:00 or 3点 or 下午3点)
        const timeMatch = text.match(/(\d{1,2}(?::\d{2})?)|([上下]午\d{1,2}点)|(\d{1,2}点)/);
        if (timeMatch) {
            timeString = timeMatch[0];
        }

        // Detect Date
        if (lowerText.includes('tomorrow') || lowerText.includes('明天')) {
          dateOffset = 1;
          cleanContent = cleanContent.replace(/tomorrow/gi, '').replace(/明天/g, '').trim();
        }
        
        // Clean up common prefixes
        cleanContent = cleanContent
          .replace(/remind me to/gi, '')
          .replace(/reminder to/gi, '')
          .replace(/提醒我/g, '')
          .replace(/记得/g, '')
          .trim();
        
        // Capitalize first letter (mostly for English, but harmless for Chinese)
        cleanContent = cleanContent.charAt(0).toUpperCase() + cleanContent.slice(1);

        resolve({
          intent: 'CREATE_TASK',
          content: cleanContent,
          timeString,
          dateOffset
        });
      } else {
        // Default to Journal for longer text or non-task commands
        resolve({
          intent: 'CREATE_JOURNAL',
          content: text,
          dateOffset: 0
        });
      }
    }, 800);
  });
};

/**
 * Mock data generator for initial state
 */
export const getInitialTasks = () => [
  {
    id: '1',
    content: '审查 MemoVoice 产品需求文档',
    isCompleted: true,
    dueDate: new Date(),
    timeString: '10:00',
    createdAt: new Date()
  },
  {
    id: '2',
    content: '联系供应商确认 API 密钥',
    isCompleted: false,
    dueDate: new Date(),
    timeString: '14:30',
    createdAt: new Date()
  },
  {
    id: '3',
    content: '起草 UI 草图',
    isCompleted: false,
    dueDate: new Date(),
    createdAt: new Date()
  }
];

export const getInitialJournal = () => [
  {
    id: 'j1',
    content: '今天感觉效率极高。终于打通了设计团队和工程团队的隔阂。新的语音功能绝对会成为游戏规则的改变者。',
    createdAt: new Date(), // Today
    wordCount: 42,
    hasAudio: true
  },
  {
    id: 'j2',
    content: '昨晚熬夜写代码感觉有点透支。今晚必须优先保证睡眠。',
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    wordCount: 24,
    hasAudio: false
  }
];