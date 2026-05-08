// ===== AI Sight =====
// agents.js — 三个 Agent 的模拟推理逻辑

const AgentSimulator = {
  // 当前状态
  state: 'idle', // idle | running | done
  currentStep: 0,
  maxSteps: 3,

  // 理解 Agent 模拟输出
  understandAgent(userInput) {
    const keywords = this.extractKeywords(userInput);
    const tasks = this.buildTasks(userInput, keywords);
    return {
      thinking: [
        '📥 接收用户输入...',
        '🔍 识别核心创作类型...',
        '🏷️ 提取关键词与风格标签...',
        '📋 拆解可执行任务单元...',
        '✅ 任务拆解完成'
      ],
      result: {
        input: userInput,
        keywords: keywords,
        taskCount: tasks.length,
        tasks: tasks,
        summary: this.generateSummary(userInput, keywords)
      }
    };
  },

  // 生成 Agent 模拟输出
  generateAgent(understandResult) {
    const { keywords, tasks } = understandResult;
    const isEarthBreath = keywords.some(k => k.includes('地球') || k.includes('呼吸') || k.includes('earth'));
    const isZombie = keywords.some(k => k.includes('丧尸') || k.includes('末日') || k.includes('僵尸'));
    const isMinecraft = keywords.some(k => k.includes('minecraft') || k.includes('麦块') || k.includes('我的世界'));

    let mjPrompt, klingPrompt, sunoPrompt;
    let variations = [];

    if (isEarthBreath) {
      mjPrompt = `\
A cinematic overhead shot of planet Earth, glowing bioluminescent grid lines across continents, \
atmosphere pulsing with soft blue and green energy, "breathing" motion implied by cloud layer undulation, \
hyper-realistic, 8k, volumetric lighting, depth of field, cosmic scale --ar 16:9 --v 6 --style raw --c 20`;

      klingPrompt = `\
[Camera] Slow descending orbit from deep space to atmosphere
[Duration] 8 seconds
[Visual] Earth rotates slowly, bioluminescent grid lines pulse from pole to pole, cloud layers undulate like breathing
[Lighting] Sunside warm gold, darkside city lights glow teal
[Style] Photorealistic, IMAX quality, no text, no UI`;

      sunoPrompt = `\
[Genre] Cinematic Ambient Electronic
[Mood] Awe-inspiring, mysterious, vast
[Instrument] Deep synth pads, subtle strings, low Earth rumble, breath-like white noise
[Structure] 60s intro build-up, 30s climax with choral swell, 30s gentle fade
[Vocals] None, or wordless ethereal vocal chops
[Tempo] 72 BPM, very slow, breathing rhythm`;

      variations = [
        { label: '方案 A（电影级写实）', mj: mjPrompt, kling: klingPrompt, suno: sunoPrompt },
        { label: '方案 B（抽象艺术风）', mj: mjPrompt.replace('hyper-realistic', 'abstract surrealist painting, Van Gogh starry night style'), kling: klingPrompt + '\n[Style] Oil painting animation, brush stroke visible', suno: sunoPrompt.replace('Cinematic Ambient Electronic', 'Neoclassical Contemporary') }
      ];
    } else if (isZombie) {
      mjPrompt = `\
A tense close-up of a survivor making eye contact with an infected, dramatic chiaroscuro lighting, \
the infected's eyes reflecting a strange inner light, cinematic composition, post-apocalyptic urban decay background, \
hyper-detailed, emotional intensity --ar 16:9 --v 6 --style raw --c 15`;

      klingPrompt = `\
[Camera] Extreme close-up, eyes only, then slow pullback to reveal full face
[Duration] 6 seconds
[Visual] Infected's eyes shimmer with unnatural intelligence, pupil dilates, reflection of the survivor visible
[Lighting] Low key, single source from above, harsh shadows
[Style] Gritty realism, desaturated with pops of sickly green`;

      sunoPrompt = `\
[Genre] Dark Ambient / Horror Soundtrack
[Mood] Tense, dread, impending danger
[Instrument] Low cello drones, metallic scratching sounds, distant coherent whispering
[Structure] 45s slow build with heartbeat bass, 15s silence, 30s cacophony break
[Tempo] 60 BPM, irregular rhythm`;

      variations = [
        { label: '方案 A（恐怖惊悚风）', mj: mjPrompt, kling: klingPrompt, suno: sunoPrompt },
        { label: '方案 B（情感剧情风）', mj: mjPrompt.replace('chiaroscuro', 'soft dramatic lighting, emotional'), kling: klingPrompt.replace('Gritty realism', 'Cinematic drama, emotional close-up'), suno: sunoPrompt.replace('Dark Ambient', 'Cinematic Orchestral Drama') }
      ];
    } else if (isMinecraft) {
      mjPrompt = `\
A custom Minecraft dimension portal room, glowing with purple and teal energy, \
blocky aesthetic but with ray-traced lighting, custom mobs in background, \
Minecraft promotional art style, vibrant colors, 4k --ar 16:9 --v 6 --style raw --c 10`;

      klingPrompt = `\
[Camera] First-person walkthrough, smooth gimbal movement
[Duration] 10 seconds
[Visual] Enter custom dimension, blocks materialize from particles, new biomes revealed
[Lighting] End-like purple ambient, bright portal core
[Style] Minecraft vanilla + RTX, no UI, 60fps smooth`;

      sunoPrompt = `\
[Genre] Chiptune / Orchestral Hybrid
[Mood] Adventurous, magical, discovery
[Instrument] 8-bit lead melody, full orchestra backing, crystal bell accents
[Structure] 30s exploration theme, 15s portal activation sting, 30s new dimension reveal
[Tempo] 140 BPM, upbeat adventure rhythm`;

      variations = [
        { label: '方案 A（冒险探索风）', mj: mjPrompt, kling: klingPrompt, suno: sunoPrompt },
        { label: '方案 B（神秘史诗风）', mj: mjPrompt.replace('vibrant colors', 'dark mythical atmosphere, ancient ruin textures'), kling: klingPrompt.replace('smooth gimbal', 'slow epic reveal'), suno: sunoPrompt.replace('140 BPM', '90 BPM epic orchestral') }
      ];
    } else {
      // 通用模板
      mjPrompt = `\
${keywords.join(', ')}, high quality, detailed, professional composition, \
cinematic lighting, 8k resolution --ar 16:9 --v 6 --style raw --c 15`;

      klingPrompt = `\
[Camera] Medium shot, smooth movement
[Duration] 6 seconds
[Visual] ${understandResult.summary}
[Lighting] Natural, balanced
[Style] Photorealitic, high quality`;

      sunoPrompt = `\
[Genre] ${keywords.includes('悬疑') || keywords.includes('神秘') ? 'Dark Ambient' : 'Cinematic Pop'}
[Mood] ${keywords.slice(0, 3).join(', ')}
[Instrument] Full arrangement
[Structure] 60s full track
[Tempo] 120 BPM`;

      variations = [
        { label: '方案 A（标准风格）', mj: mjPrompt, kling: klingPrompt, suno: sunoPrompt }
      ];
    }

    return {
      thinking: [
        '📥 接收理解 Agent 的输出...',
        '🎨 针对 Midjourney 特性生成提示词...',
        '🎬 针对 Kling 视频模型生成提示词...',
        '🎵 针对 Suno 音乐模型生成提示词...',
        '🔄 生成多版本变体...',
        '✅ 提示词生成完成'
      ],
      result: {
        mjPrompt: variations[0].mj,
        klingPrompt: variations[0].kling,
        sunoPrompt: variations[0].suno,
        variations: variations,
        quality: 'A+',
        estimatedCost: '~0.15 MJ credits + ~0.5 Kling credits'
      }
    };
  },

  // 执行 Agent 模拟输出
  executeAgent(generateResult) {
    const steps = [
      { tool: 'validate_prompt', desc: '验证提示词格式与完整性', status: '✅ 通过', time: '0.3s' },
      { tool: 'check_safety', desc: '内容安全检测', status: '✅ 通过', time: '0.5s' },
      { tool: 'estimate_cost', desc: '估算生成成本', status: `⏱️ ${generateResult.estimatedCost}`, time: '0.1s' },
      { tool: 'mock_mj_call', desc: '模拟 Midjourney API 调用', status: '🎨 返回 4 张候选图', time: '~45s (模拟)' },
      { tool: 'mock_kling_call', desc: '模拟 Kling API 调用', status: '🎬 返回 8s 视频', time: '~120s (模拟)' },
      { tool: 'mock_suno_call', desc: '模拟 Suno API 调用', status: '🎵 返回 60s 音轨', time: '~60s (模拟)' },
      { tool: 'generate_report', desc: '生成综合报告', status: '✅ 完成', time: '0.2s' }
    ];

    return {
      thinking: [
        '📥 接收生成 Agent 的提示词...',
        '🔍 验证提示词格式...',
        '🛡️ 内容安全检测...',
        '💰 成本预估...',
        '🔗 模拟工具链调用...',
        '📊 生成执行报告...',
        '✅ 执行流程完成'
      ],
      result: {
        steps: steps,
        report: this.buildReport(generateResult),
        exportReady: true
      }
    };
  },

  // 工具函数
  extractKeywords(input) {
    const kwMap = {
      '科幻': ['科幻', 'sci-fi', 'futuristic'],
      '地球': ['地球', 'earth', '星球', 'planet'],
      '呼吸': ['呼吸', 'breathe', '生命', 'life'],
      '丧尸': ['丧尸', '僵尸', 'zombie', '感染者', 'infected'],
      '末日': ['末日', '世界末日', 'apocalypse', '后末日', 'post-apocalyptic'],
      'Minecraft': ['minecraft', '麦块', '我的世界', '方块'],
      '悬疑': ['悬疑', '神秘', 'mystery', '解谜'],
      '氛围': ['氛围', 'atmosphere', 'ambient']
    };
    let result = [];
    for (const [cn, enArr] of Object.entries(kwMap)) {
      if (enArr.some(w => input.toLowerCase().includes(w))) {
        result.push(cn);
      }
    }
    if (result.length === 0) {
      // 提取前 3 个有意义的中文词或英文词
      const words = input.match(/[\u4e00-\u9fa5]{2,}|[a-zA-Z]{3,}/g) || [];
      result = words.slice(0, 3);
    }
    return result;
  },

  buildTasks(input, keywords) {
    const tasks = [];
    if (keywords.some(k => ['科幻', '地球', '呼吸', '悬疑', '氛围'].includes(k))) {
      tasks.push({ id: 1, type: 'image', desc: '生成概念图（Midjourney）' });
      tasks.push({ id: 2, type: 'video', desc: '生成动态视频（Kling）' });
      tasks.push({ id: 3, type: 'music', desc: '生成背景音乐（Suno）' });
    }
    if (tasks.length === 0) {
      tasks.push({ id: 1, type: 'image', desc: '生成视觉素材（Midjourney）' });
      tasks.push({ id: 2, type: 'video', desc: '生成视频内容（Kling）' });
    }
    return tasks;
  },

  generateSummary(input, keywords) {
    return `创作类型：${keywords.join(' / ')}；输出需求：多模态内容生成（图像+视频+音乐）`;
  },

  buildReport(genResult) {
    return `\
📊 执行报告
═════════════════════════════

✅ 提示词质量评估：A+
✅ 格式验证：全部通过
✅ 内容安全：无风险
⏱️ 预估总耗时：~4 分钟（模拟）
💰 预估成本：Midjourney ~0.15 credits | Kling ~0.5 credits | Suno ~1 credit

📋 输出清单：
  • Midjourney 提示词（1 组，含参数）
  • Kling 视频提示词（1 组，含镜头描述）
  • Suno 音乐提示词（1 组，含结构说明）
  • 方案变体：${genResult.variations.length} 个

💡 优化建议：
  • 可在 MJ 提示词末尾添加 --s 50 调整风格化程度
  • Kling 提示词建议明确标注帧率要求（30fps/60fps）
  • Suno 提示词可指定歌手音色参考

═════════════════════════════
🤖 本报告由 AI Sight 执行 Agent 生成（模拟模式）
后续接入 MiMo API 后可替换为真实 AI 推理。`
  },

  // ===== 提示词解析器 =====
  analyzePrompt(promptText) {
    const text = promptText.trim();
    if (!text) return null;

    // 检测提示词类型
    const toolType = this.detectPromptType(text);
    const analysis = this.analyzeByType(text, toolType);
    const score = this.calculateScore(analysis);
    const suggestions = this.generateSuggestions(text, toolType, analysis);

    return {
      toolType: toolType,
      score: score,
      analysis: analysis,
      suggestions: suggestions,
      improved: this.generateImprovedVersion(text, toolType, analysis)
    };
  },

  // 检测提示词所属工具类型
  detectPromptType(text) {
    if (/--ar\s|-\-v\s|-\-s\s|-\-c\s|-\-style\s/i.test(text)) return 'midjourney';
    if (/\[Camera\]|\[Duration\]|\[Visual\]|\[Lighting\]/i.test(text)) return 'kling';
    if (/\[Genre\]|\[Mood\]|\[Tempo\]|BPM/i.test(text)) return 'suno';
    if (/midjourney|mj\s|image\s+prompt/i.test(text.toLowerCase())) return 'midjourney';
    if (/kling|video\s+prompt/i.test(text.toLowerCase())) return 'kling';
    if (/suno|music\s+prompt/i.test(text.toLowerCase())) return 'suno';
    return 'generic';
  },

  // 按类型分析
  analyzeByType(text, type) {
    const result = { strengths: [], weaknesses: [], missing: [] };

    if (type === 'midjourney' || type === 'generic') {
      // MJ 提示词分析
      result.hasSubject = text.length > 10;
      result.hasStyle = /\b(cinematic|photorealistic|surreal|abstract|oil painting|anime|3d render)/i.test(text);
      result.hasLighting = /\b(lighting|rim light|volumetric|glow|shadow|chiaroscuro)/i.test(text);
      result.hasCamera = /\b(close-up|wide angle|overhead|aerial|fisheye|macro)/i.test(text);
      result.hasParams = /--ar\s+\d+:\d+/.test(text);
      result.hasVersion = /--v\s+\d+/.test(text) || /--style\s+raw/.test(text);
      result.hasQuality = /\b(8k|4k|hd|high quality|detailed)/i.test(text);
      result.wordCount = text.split(/\s+/).length;
      result.hasNegative = /\b(not|no|without|avoid|-\-no)/i.test(text);
    }

    if (type === 'kling' || type === 'generic') {
      result.hasCameraTag = /\[Camera\]/i.test(text);
      result.hasDurationTag = /\[Duration\]/i.test(text);
      result.hasVisualTag = /\[Visual\]/i.test(text);
      result.hasStyleTag = /\[Style\]/i.test(text);
      result.hasLightingTag = /\[Lighting\]/i.test(text);
      if (result.hasDurationTag) {
        const durMatch = text.match(/(\d+)\s*s/);
        result.durationValue = durMatch ? parseInt(durMatch[1]) : 0;
      }
    }

    if (type === 'suno' || type === 'generic') {
      result.hasGenreTag = /\[Genre\]/i.test(text);
      result.hasMoodTag = /\[Mood\]/i.test(text);
      result.hasInstrumentTag = /\[Instrument\]/i.test(text);
      result.hasStructureTag = /\[Structure\]|\[Structure\]/i.test(text);
      result.hasTempoTag = /\[Tempo\]|BPM/i.test(text);
      if (result.hasTempoTag) {
        const bpmMatch = text.match(/(\d+)\s*BPM/);
        result.bpmValue = bpmMatch ? parseInt(bpmMatch[1]) : 0;
      }
    }

    return result;
  },

  // 计算评分（0-100）
  calculateScore(analysis) {
    let score = 0;
    let max = 0;

    const check = (condition, weight) => {
      max += weight;
      if (condition) score += weight;
    };

    check(analysis.hasSubject, 15);
    check(analysis.hasStyle, 15);
    check(analysis.hasLighting, 10);
    check(analysis.hasCamera, 10);
    check(analysis.hasParams, 15);
    check(analysis.hasVersion, 10);
    check(analysis.hasQuality, 10);
    check(analysis.wordCount > 15, 10);
    check(analysis.wordCount < 80, 5); // 不要太长

    // Kling 专属
    check(analysis.hasCameraTag, 10);
    check(analysis.hasDurationTag, 10);
    check(analysis.hasVisualTag, 10);
    check(analysis.hasStyleTag, 10);

    // Suno 专属
    check(analysis.hasGenreTag, 10);
    check(analysis.hasMoodTag, 10);
    check(analysis.hasStructureTag, 10);
    check(analysis.hasTempoTag, 10);

    return Math.min(100, Math.round((score / Math.max(max, 1)) * 100));
  },

  // 生成改进建议
  generateSuggestions(text, type, analysis) {
    const suggestions = [];

    if (type === 'midjourney' || type === 'generic') {
      if (!analysis.hasStyle) suggestions.push('缺少风格描述（如 cinematic、photorealistic、anime 等），建议添加');
      if (!analysis.hasLighting) suggestions.push('缺少光照描述（如 volumetric lighting、rim light），添加后可提升画面质感');
      if (!analysis.hasParams) suggestions.push('建议添加 --ar 16:9 指定宽高比，这是 MJ 最佳实践的必要参数');
      if (!analysis.hasVersion) suggestions.push('建议添加 --v 6 或 --style raw 以使用最新模型');
      if (analysis.wordCount < 10) suggestions.push('提示词过短，建议详细描述主体、环境、风格、光照');
      if (analysis.wordCount > 80) suggestions.push('提示词过长，MJ 对超长提示词的效果会递减，建议精简到 60 词以内');
      if (!analysis.hasQuality) suggestions.push('建议添加质量关键词（8k、highly detailed、sharp focus）');
    }

    if (type === 'kling' || type === 'generic') {
      if (!analysis.hasCameraTag) suggestions.push('缺少 [Camera] 标签，Kling 强烈依赖镜头描述，建议添加');
      if (!analysis.hasDurationTag) suggestions.push('缺少 [Duration] 标签，建议明确视频时长（如 5s、10s）');
      if (!analysis.hasVisualTag) suggestions.push('缺少 [Visual] 标签，建议描述核心画面内容');
      if (analysis.durationValue && analysis.durationValue > 15) suggestions.push('Kling 单段视频建议 ≤10s，过长会导致质量下降');
    }

    if (type === 'suno' || type === 'generic') {
      if (!analysis.hasGenreTag) suggestions.push('缺少 [Genre] 标签，Suno 需要明确音乐类型');
      if (!analysis.hasMoodTag) suggestions.push('缺少 [Mood] 标签，建议描述情绪氛围');
      if (!analysis.hasStructureTag) suggestions.push('缺少 [Structure] 标签，建议描述歌曲结构（如前奏-主歌-副歌）');
      if (analysis.bpmValue && (analysis.bpmValue < 60 || analysis.bpmValue > 180)) suggestions.push('BPM 值建议设在 70-160 之间，超出范围可能导致生成失败');
    }

    if (suggestions.length === 0) suggestions.push('提示词结构完整，无明显缺陷！可尝试添加更多细节描述以提升独特性。');
    return suggestions;
  },

  // 生成改进版提示词
  generateImprovedVersion(text, type, analysis) {
    let improved = text;

    if (type === 'midjourney') {
      if (!analysis.hasParams) improved += ' --ar 16:9';
      if (!analysis.hasVersion) improved += ' --v 6 --style raw';
      if (!analysis.hasQuality && improved === text) improved = text + ', highly detailed, 8k, sharp focus --ar 16:9 --v 6';
    }

    if (type === 'kling') {
      if (!analysis.hasCameraTag) improved = '[Camera] Medium shot, smooth movement\n' + improved;
      if (!analysis.hasDurationTag) improved = improved.replace('[Visual]', '[Duration] 6 seconds\n[Visual]');
    }

    if (type === 'suno') {
      if (!analysis.hasGenreTag) improved = '[Genre] Cinematic Orchestral\n' + improved;
      if (!analysis.hasMoodTag) improved = improved.replace('[Instrument]', '[Mood] Epic, emotional\n[Instrument]');
    }

    return improved === text ? null : improved;
  },

  // ===== 提示词格式转换 =====
  convertPrompt(text, from, to) {
    if (!text || from === to) return null;

    // 解析源格式
    const parsed = this.parsePrompt(text, from);
    if (!parsed) return null;

    // 转换为目标格式
    return this.formatPrompt(parsed, to);
  },

  // 解析提示词为通用结构
  parsePrompt(text, format) {
    const result = {
      subject: '',
      style: '',
      lighting: '',
      camera: '',
      params: {},
      text: text
    };

    if (format === 'midjourney') {
      // 解析 MJ 格式
      const parts = text.split('--');
      result.subject = parts[0].trim();
      parts.slice(1).forEach(p => {
        const match = p.match(/^(\w+)\s*(.*)$/s);
        if (match) result.params[match[1].trim()] = match[2].trim();
      });
      // 提取风格、光照、镜头等
      if (/cinematic/i.test(text)) result.style += 'cinematic ';
      if (/photorealistic/i.test(text)) result.style += 'photorealistic ';
      if (/ volumetric |rim light|lighting/i.test(text)) result.lighting = 'volumetric lighting';
      if (/close-up|wide angle|overhead|aerial/i.test(text)) result.camera = (text.match(/(close-up|wide angle|overhead|aerial|fisheye|macro)/i) || [''])[0];
    } else if (format === 'kling') {
      // 解析 Kling 格式
      const tags = ['Camera', 'Duration', 'Visual', 'Lighting', 'Style'];
      tags.forEach(tag => {
        const regex = new RegExp(`\\[${tag}\\]\\s*(.+)$`, 'm');
        const match = text.match(regex);
        if (match) {
          if (tag === 'Camera') result.camera = match[1].trim();
          if (tag === 'Visual') result.subject = match[1].trim();
          if (tag === 'Lighting') result.lighting = match[1].trim();
          if (tag === 'Style') result.style = match[1].trim();
        }
      });
    } else if (format === 'suno') {
      // 解析 Suno 格式
      const tags = ['Genre', 'Mood', 'Instrument', 'Structure', 'Tempo'];
      tags.forEach(tag => {
        const regex = new RegExp(`\\[${tag}\\]\\s*(.+)$`, 'm');
        const match = text.match(regex);
        if (match) {
          if (tag === 'Genre') result.params.genre = match[1].trim();
          if (tag === 'Mood') result.params.mood = match[1].trim();
          if (tag === 'Instrument') result.params.instrument = match[1].trim();
          if (tag === 'Structure') result.params.structure = match[1].trim();
          if (tag === 'Tempo') result.params.tempo = match[1].trim();
        }
      });
    }

    return result;
  },

  // 将通用结构格式化为目标格式
  formatPrompt(parsed, format) {
    if (format === 'midjourney') {
      let mj = parsed.subject || 'high quality scene';
      if (parsed.style) mj += `, ${parsed.style.trim()}`;
      if (parsed.lighting) mj += `, ${parsed.lighting}`;
      if (parsed.camera) mj += `, ${parsed.camera}`;
      mj += ' --ar 16:9';
      if (!parsed.params.v) mj += ' --v 6';
      if (!parsed.params.style) mj += ' --style raw';
      return mj;
    } else if (format === 'kling') {
      let kling = '[Camera] ' + (parsed.camera || 'Medium shot, smooth movement') + '\n';
      kling += '[Duration] 8 seconds\n';
      kling += '[Visual] ' + (parsed.subject || 'visual content') + '\n';
      kling += '[Lighting] ' + (parsed.lighting || 'Natural, balanced') + '\n';
      kling += '[Style] ' + (parsed.style || 'Photorealistic, high quality');
      return kling;
    } else if (format === 'suno') {
      let suno = '[Genre] ' + (parsed.params.genre || 'Cinematic Orchestral') + '\n';
      suno += '[Mood] ' + (parsed.params.mood || 'Epic, emotional') + '\n';
      suno += '[Instrument] ' + (parsed.params.instrument || 'Full arrangement') + '\n';
      suno += '[Structure] ' + (parsed.params.structure || '60s full track') + '\n';
      suno += '[Tempo] ' + (parsed.params.tempo || '120 BPM');
      return suno;
    }
    return parsed.text;
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgentSimulator;
}
