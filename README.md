# MemoVoice - AI 语音笔记应用

MemoVoice 是一个结合了待办事项和随手记功能的语音交互应用，具有现代化的界面设计。

## 功能特性

- 🎤 语音输入支持
- ✅ 待办事项管理
- 📝 随手记功能
- 📱 响应式设计，适配移动设备
- 🌙 深色主题界面

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 在浏览器中访问 http://localhost:3000

## 构建生产版本

```bash
npm run build
```

## 部署到 GitHub Pages

1. 确保在 `vite.config.ts` 中正确设置了 base 路径
2. 构建项目：`npm run build`
3. 将 `dist` 目录的内容部署到 GitHub Pages

## 使用说明

- 在"待办"标签页中，可以添加和管理今日任务
- 在"随手记"标签页中，可以记录日常想法和笔记
- 使用麦克风图标进行语音输入
- 支持中英文输入

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React 图标库