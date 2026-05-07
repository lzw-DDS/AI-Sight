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
后续接入 MiMo API 后可替换为真实 AI 推理。`;
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgentSimulator;
}
