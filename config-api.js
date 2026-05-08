/**
 * AI Sight - API Key 配置文件
 * 
 * 使用方法：
 * 1. 打开 AI Sight 页面
 * 2. 按 F12 打开浏览器开发者工具
 * 3. 切换到 Console（控制台）标签
 * 4. 复制以下代码并按回车执行
 * 
 * 注意：配置仅保存在浏览器本地，不会发送到任何服务器
 */

// ========== 配置开始 ==========

// 选择 AI 提供商：deepseek / openrouter / ollama / openai
const PROVIDER = 'deepseek';

// 填入你的 API Key（DeepSeek 示例）
const API_KEY = '在这里填入你的API Key';

// 选择模型（留空使用默认）
const MODEL = '';

// ========== 配置结束 ==========

// 执行配置
const config = {
  enabled: true,
  provider: PROVIDER,
  apiKey: API_KEY,
  model: MODEL
};

localStorage.setItem('ai-sight-provider', JSON.stringify(config));
console.log('✅ AI Sight 配置已保存！');
console.log('已配置: ' + PROVIDER);
console.log('API Key: ' + (API_KEY ? '已设置 ✓' : '未设置'));
console.log('');
console.log('现在可以刷新页面，然后关闭设置界面（已自动启用 AI），直接使用！');
