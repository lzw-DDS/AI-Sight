/**
 * AI Sight - AI Provider Module
 * 支持多AI后端：DeepSeek / OpenRouter / Ollama / OpenAI 兼容格式
 * 
 * 使用方式：
 *   AIProvider.call(prompt, callback)
 *   AIProvider.callAsync(prompt) -> Promise
 */

const AIProvider = {
  // 当前配置的 provider
  config: null,

  // 可用的 provider 定义
  providers: {
    deepseek: {
      name: 'DeepSeek',
      color: '#0066FF',
      baseURL: 'https://api.deepseek.com/v1',
      models: ['deepseek-chat', 'deepseek-reasoner'],
      defaultModel: 'deepseek-chat',
      needApiKey: true,
      description: '500万token免费额度，性价比高'
    },
    openrouter: {
      name: 'OpenRouter',
      color: '#7C3AED',
      baseURL: 'https://openrouter.ai/api/v1',
      models: ['openrouter/auto', 'qwen/qwen3.5-32b', 'anthropic/claude-3-haiku'],
      defaultModel: 'openrouter/auto',
      needApiKey: true,
      description: '30+免费模型，支持Claude/GPT等'
    },
    ollama: {
      name: 'Ollama 本地',
      color: '#10B981',
      baseURL: 'http://localhost:11434/v1',
      models: ['llama3', 'qwen3', 'qwen3:4b', 'qwen2.5:1.5b'],
      defaultModel: 'qwen3:4b',
      needApiKey: false,
      description: '本地部署，完全免费离线'
    },
    openai: {
      name: 'OpenAI',
      color: '#10A37F',
      baseURL: 'https://api.openai.com/v1',
      models: ['gpt-4o-mini', 'gpt-4o'],
      defaultModel: 'gpt-4o-mini',
      needApiKey: true,
      description: 'OpenAI 官方API'
    }
  },

  // 默认系统提示词
  systemPrompt: `你是一个专业的AI提示词工程师，专门为Midjourney、Kling（可灵）、Suno等AI创作工具生成高质量提示词。

分析用户的创作需求，输出JSON格式：
{
  "mj": "Midjourney提示词，包含主体、风格、光照、构图等，用英文书写",
  "kling": "可灵AI视频提示词，描述镜头运动、场景转换、时长控制等",
  "suno": "Suno音乐提示词，描述音乐风格、情绪、乐器、节奏等",
  "analysis": {
    "emotion": "情感基调：恐怖/希望/宁静/史诗等",
    "style": "视觉风格：电影/写实/动漫等",
    "theme": "核心主题"
  }
}`,

  /**
   * 初始化：从 localStorage 加载配置
   */
  init() {
    try {
      const saved = localStorage.getItem('ai-sight-provider');
      if (saved) {
        this.config = JSON.parse(saved);
      } else {
        this.config = {
          enabled: false,
          provider: 'deepseek',
          apiKey: '',
          model: ''
        };
      }
    } catch (e) {
      this.config = { enabled: false, provider: 'deepseek', apiKey: '', model: '' };
    }
    return this;
  },

  /**
   * 保存配置到 localStorage
   */
  saveConfig() {
    localStorage.setItem('ai-sight-provider', JSON.stringify(this.config));
  },

  /**
   * 检查是否可用
   */
  isAvailable() {
    return this.config && this.config.enabled && this.config.apiKey;
  },

  /**
   * 获取当前 provider 信息
   */
  getCurrentProvider() {
    return this.providers[this.config.provider] || null;
  },

  /**
   * 调用 AI 生成提示词（回调方式）
   * @param {string} userInput - 用户输入
   * @param {function} callback - 回调函数 (error, result)
   */
  call(userInput, callback) {
    if (!this.isAvailable()) {
      callback('AI未配置或未启用，请在设置中配置API', null);
      return;
    }

    const provider = this.getCurrentProvider();
    const model = this.config.model || provider.defaultModel;

    const messages = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userInput }
    ];

    this._fetch(provider.baseURL, model, messages, (error, result) => {
      if (error) {
        callback(error, null);
        return;
      }

      try {
        const parsed = this._parseResponse(result);
        callback(null, parsed);
      } catch (e) {
        callback('解析AI响应失败: ' + e.message, null);
      }
    });
  },

  /**
   * 调用 AI 生成提示词（Promise方式）
   */
  async callAsync(userInput) {
    return new Promise((resolve, reject) => {
      this.call(userInput, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  },

  /**
   * 调用 Ollama 本地模型（特殊处理）
   */
  callOllama(userInput, callback) {
    const provider = this.providers.ollama;
    const model = this.config.model || provider.defaultModel;

    const messages = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userInput }
    ];

    this._fetch(provider.baseURL, model, messages, callback);
  },

  /**
   * 内部方法：发送 HTTP 请求
   */
  _fetch(baseURL, model, messages, callback) {
    // 构造完整的 API URL
    const url = `${baseURL}/chat/completions`;
    
    // Ollama 不需要 Bearer token
    const isOllama = baseURL.includes('localhost:11434');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (!isOllama && this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const body = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    };

    // Ollama 不支持某些参数
    if (isOllama) {
      delete body.max_tokens;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            callback(null, data);
          } catch (e) {
            callback('解析响应失败', null);
          }
        } else if (xhr.status === 401) {
          callback('API Key 无效或已过期', null);
        } else if (xhr.status === 429) {
          callback('请求过于频繁，请稍后重试', null);
        } else if (xhr.status === 402) {
          callback('额度不足，请充值或更换API', null);
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            callback(errData.error?.message || `请求失败 (${xhr.status})`, null);
          } catch (e) {
            callback(`请求失败 (${xhr.status})`, null);
          }
        }
      }
    };

    xhr.onerror = () => {
      if (baseURL.includes('localhost')) {
        callback('无法连接 Ollama，请确保已启动 Ollama (ollama serve)', null);
      } else {
        callback('网络请求失败，请检查网络连接', null);
      }
    };

    xhr.timeout = 60000; // 60秒超时
    xhr.ontimeout = () => callback('请求超时，请稍后重试', null);

    xhr.send(JSON.stringify(body));
  },

  /**
   * 解析 AI 响应
   */
  _parseResponse(data) {
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('无效的响应格式');
    }

    // 尝试提取 JSON
    let jsonStr = content;
    
    // 尝试从 markdown 代码块中提取
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // 尝试提取 JSON 对象
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      jsonStr = objMatch[0];
    }

    const parsed = JSON.parse(jsonStr);
    return parsed;
  },

  /**
   * 测试连接
   */
  testConnection(callback) {
    if (!this.isAvailable()) {
      callback(false, 'AI未配置');
      return;
    }

    const testMessage = '请回复JSON格式：{"status":"ok","model":"测试成功"}';

    this.call(testMessage, (error, result) => {
      if (error) {
        callback(false, error);
      } else {
        callback(true, '连接成功！');
      }
    });
  },

  /**
   * 获取模型列表（用于设置界面）
   */
  getModelList() {
    const provider = this.getCurrentProvider();
    if (!provider) return [];
    return provider.models;
  },

  /**
   * 切换 provider 时获取默认模型
   */
  getDefaultModel(providerKey) {
    const provider = this.providers[providerKey];
    return provider ? provider.defaultModel : '';
  },

  /**
   * 导出配置（不包含 API Key）
   */
  exportConfig() {
    return {
      enabled: this.config.enabled,
      provider: this.config.provider,
      model: this.config.model,
      hasApiKey: !!this.config.apiKey
    };
  }
};

// 初始化
AIProvider.init();
