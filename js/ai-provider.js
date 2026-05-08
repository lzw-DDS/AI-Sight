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

  // 系统提示词（带 few-shot 示例）
  systemPrompt: `你是 AI Sight 的核心提示词生成引擎。用户会输入一段创作需求（中文或英文），你需要：
1. 深度理解其语义、情感基调、视觉风格
2. 生成真正经过"理解→重构→升华"的高质量提示词
3. 必须返回纯 JSON，不能有任何解释性文字

## 输出格式（严格遵循）
{
  "mj": "Midjourney提示词（英文，完整、具体、富含细节）",
  "kling": "可灵视频提示词（镜头运动+画面内容+光影氛围）",
  "suno": "Suno音乐提示词（风格+情绪+乐器+节奏+人声）",
  "analysis": {
    "emotion": "情感基调（恐怖/希望/史诗/神秘/孤独等）",
    "style": "视觉风格（cinematic/photorealistic/anime/概念艺术等）",
    "theme": "核心主题（一句话概括）"
  }
}

## 核心原则
- mj 提示词必须完全重写，不得直接复制用户原句
- 必须包含：主体描述 + 风格关键词 + 光照描述 + 构图描述 + 氛围词 + MJ参数
- MJ参数格式：--ar 16:9 --v 6 --style raw --s 200 --c 20
- kling 必须包含 [Camera]、[Duration]、[Visual]、[Lighting]、[Style] 五个标签
- suno 必须包含 [Genre]、[Mood]、[Instrument]、[Tempo]、[Vocals] 五个标签

## 示例

用户输入："丧尸末日，一座废弃城市里有人站在楼顶望向远方"
期望输出 mj：
"a lone survivor standing on the rooftop of an abandoned crumbling skyscraper in a post-apocalyptic city, ash falling like snow in the gray sky, cinematic composition, dramatic low-angle shot looking up at the silhouette against the overcast sky, volumetric fog, muted desaturated tones, haunting atmosphere, film grain texture, post-processing color grading, hyper-detailed architecture decay --ar 16:9 --v 6 --style raw --s 250 --c 30"

期望输出 kling：
"[Camera] Slow dolly-in from wide establishing shot to medium close-up, revealing the survivor's face with subtle emotional micro-expression
[Duration] 8 seconds
[Visual] Abandoned cityscape below, fog rolling through empty streets, distant fires still burning, ash drifting upward in the wind
[Lighting] Cold blue-hour tones, single warm light source from the setting sun cutting through the haze, volumetric atmosphere
[Style] Cinematic color science, anamorphic lens quality, 30fps with subtle motion blur, documentary realism"

期望输出 suno：
"[Genre] Post-Rock / Atmospheric Cinematic
[Mood] Haunting, melancholic, with a glimmer of quiet determination
[Instrument] Sparse electric guitar, distant bass rumble, ambient city noise, slow-building strings
[Tempo] 70 BPM slow build, crescendo at 45s mark
[Vocals] Optional distant wordless choir whispers, breathing sounds"

## 重要
- 输出必须是合法的单层 JSON 对象
- mj 字段不得包含换行符，使用英文逗号分隔
- 不要输出任何 JSON 以外的文字
- 风格化程度(s)根据情感强度调整：激烈情感 s=300+，平和 s=100-150`,

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
      temperature: 0.9,
      max_tokens: 3000
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
   * 评估提示词质量
   * @param {Object} result - AI 生成的结果 { mj, kling, suno }
   * @param {string} userInput - 用户原始输入
   * @returns {Object} 评分结果
   */
  evaluatePrompt(result, userInput) {
    const scores = {
      mj: this._evaluateMJ(result.mj, userInput),
      kling: this._evaluateKling(result.kling),
      suno: this._evaluateSuno(result.suno),
      overall: 0
    };

    // 综合评分（加权平均）
    scores.overall = Math.round(
      scores.mj.total * 0.4 +
      scores.kling.total * 0.35 +
      scores.suno.total * 0.25
    );

    return scores;
  },

  /**
   * 评估 Midjourney 提示词
   */
  _evaluateMJ(prompt, userInput) {
    const score = { detail: 0, style: 0, params: 0, creativity: 0, total: 0, issues: [], suggestions: [] };

    if (!prompt) {
      score.issues.push('MJ 提示词为空');
      return score;
    }

    // 详细度（0-25分）
    const wordCount = prompt.split(/\s+/).length;
    if (wordCount > 30) score.detail = 25;
    else if (wordCount > 20) score.detail = 20;
    else if (wordCount > 10) score.detail = 12;
    else {
      score.detail = 5;
      score.issues.push('MJ 提示词过于简短，建议增加更多细节描述');
    }

    // 风格关键词（0-25分）
    const styleKeywords = ['cinematic', 'photorealistic', 'detailed', 'hyper', 'ultra', '8k', '4k', 'professional', 'dramatic', 'moody', 'atmospheric', 'volumetric', 'anamorphic', 'film grain'];
    const styleMatches = styleKeywords.filter(k => prompt.toLowerCase().includes(k));
    score.style = Math.min(25, styleMatches.length * 5 + 10);

    // 参数完整性（0-25分）
    const hasAR = /--ar\s+\d+:\d+/.test(prompt);
    const hasV = /--v\s+\d+/.test(prompt);
    const hasS = /--s\s+\d+/.test(prompt);
    let paramScore = 0;
    if (hasAR) paramScore += 10;
    if (hasV) paramScore += 8;
    if (hasS) paramScore += 7;
    score.params = paramScore;

    if (!hasAR) score.suggestions.push('缺少 --ar 参数，建议添加画幅比例如 --ar 16:9');
    if (!hasV) score.suggestions.push('缺少 --v 参数，建议添加版本如 --v 6');
    if (!hasS) score.suggestions.push('缺少 --s 参数，建议添加风格化程度如 --s 200');

    // 创意性（0-25分）
    const creativeWords = ['haunting', 'ethereal', 'gritty', 'surreal', 'serene', 'bleak', 'vibrant', 'ominous', 'mysterious', 'epic', 'intimate', 'vast', 'subtle', 'stark'];
    const creativeMatches = creativeWords.filter(w => prompt.toLowerCase().includes(w));
    score.creativity = Math.min(25, creativeMatches.length * 4 + 8);

    // 如果直接复制原句
    if (prompt.toLowerCase().includes(userInput.toLowerCase().substring(0, 5))) {
      score.creativity -= 10;
      score.issues.push('MJ 提示词疑似直接复制原句，建议完全重构');
    }

    score.total = Math.max(0, Math.min(100, score.detail + score.style + score.params + score.creativity));
    return score;
  },

  /**
   * 评估 Kling 提示词
   */
  _evaluateKling(prompt) {
    const score = { structure: 0, camera: 0, visual: 0, lighting: 0, total: 0, issues: [], suggestions: [] };

    if (!prompt) {
      score.issues.push('Kling 提示词为空');
      return score;
    }

    // 结构完整性（5个标签）
    const tags = ['[Camera]', '[Duration]', '[Visual]', '[Lighting]', '[Style]'];
    const foundTags = tags.filter(t => prompt.includes(t));
    score.structure = foundTags.length * 12;

    if (foundTags.length < 5) {
      score.suggestions.push(`缺少 ${5 - foundTags.length} 个标签：${tags.filter(t => !prompt.includes(t)).join('、')}`);
    }

    // Camera 评估
    if (prompt.includes('[Camera]')) {
      const cameraPart = prompt.match(/\[Camera\]([\s\S]*?)(?=\[|$)/)?.[1] || '';
      if (cameraPart.length > 30) score.camera = 20;
      else if (cameraPart.length > 10) score.camera = 12;
      else score.camera = 5;
    }

    // Visual 评估
    if (prompt.includes('[Visual]')) {
      const visualPart = prompt.match(/\[Visual\]([\s\S]*?)(?=\[|$)/)?.[1] || '';
      if (visualPart.length > 50) score.visual = 20;
      else if (visualPart.length > 20) score.visual = 12;
      else score.visual = 5;
    }

    // Lighting 评估
    if (prompt.includes('[Lighting]')) {
      const lightingPart = prompt.match(/\[Lighting\]([\s\S]*?)(?=\[|$)/)?.[1] || '';
      if (lightingPart.length > 20) score.lighting = 20;
      else if (lightingPart.length > 10) score.lighting = 12;
      else score.lighting = 5;
    }

    // Duration 评估
    if (prompt.includes('[Duration]')) {
      const durationPart = prompt.match(/\[Duration\]([\s\S]*?)(?=\[|$)/)?.[1] || '';
      if (/\d+\s*seconds?/.test(durationPart) || /\d+s/.test(durationPart)) {
        score.structure += 5; // 有具体时长加5分
      }
    }

    score.total = Math.max(0, Math.min(100, score.structure + score.camera + score.visual + score.lighting));
    return score;
  },

  /**
   * 评估 Suno 提示词
   */
  _evaluateSuno(prompt) {
    const score = { structure: 0, genre: 0, mood: 0, instrument: 0, total: 0, issues: [], suggestions: [] };

    if (!prompt) {
      score.issues.push('Suno 提示词为空');
      return score;
    }

    // 结构完整性（5个标签）
    const tags = ['[Genre]', '[Mood]', '[Instrument]', '[Tempo]', '[Vocals]'];
    const foundTags = tags.filter(t => prompt.includes(t));
    score.structure = foundTags.length * 10;

    if (foundTags.length < 5) {
      score.suggestions.push(`缺少 ${5 - foundTags.length} 个标签：${tags.filter(t => !prompt.includes(t)).join('、')}`);
    }

    // 各维度详细评估
    ['genre', 'mood', 'instrument', 'tempo', 'vocals'].forEach(dim => {
      const tagName = `[${dim.charAt(0).toUpperCase() + dim.slice(1)}]`;
      if (prompt.includes(tagName)) {
        const part = prompt.match(new RegExp(`${tagName}([\\s\\S]*?)(?=\\[|$)`))?.[1] || '';
        if (part.length > 15) score[dim] = 8;
        else if (part.length > 5) score[dim] = 5;
        else score[dim] = 2;
      }
    });

    score.total = Math.max(0, Math.min(100, score.structure + score.genre + score.mood + score.instrument + score.tempo + score.vocals));
    return score;
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
