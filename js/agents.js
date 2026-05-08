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

    // 多场景识别
    const sceneMapping = {
      cyberpunk: keywords.some(k => ['赛博朋克', 'cyberpunk', '霓虹', 'neon'].includes(k)),
      nature: keywords.some(k => ['自然', '森林', '海洋', '生态', 'nature'].includes(k)),
      space: keywords.some(k => ['宇宙', '太空', '星球', 'space', '宇宙'].includes(k)),
      fantasy: keywords.some(k => ['奇幻', '魔法', '龙', 'fantasy', '魔法'].includes(k)),
      horror: keywords.some(k => ['恐怖', '惊悚', '血腥', 'horror'].includes(k)),
      anime: keywords.some(k => ['动漫', '二次元', 'anime', '日式'].includes(k)),
      history: keywords.some(k => ['历史', '古代', '古典', '战争'].includes(k)),
      scifi: keywords.some(k => ['科幻', '未来', '外星', 'sci-fi', '科技'].includes(k)),
    };

    // 深度场景组合
    const deepSceneMapping = {
      underwater: keywords.some(k => ['深海', '水下', '海洋生物'].includes(k)),
      mountain: keywords.some(k => ['雪山', '登山', '高山'].includes(k)),
      city: keywords.some(k => ['城市', '建筑', '街道'].includes(k)),
      desert: keywords.some(k => ['沙漠', '戈壁', '荒漠'].includes(k)),
      jungle: keywords.some(k => ['丛林', '雨林', '密林'].includes(k)),
      ruins: keywords.some(k => ['废墟', '遗迹', '古代建筑'].includes(k)),
    };

    let mjPrompt, klingPrompt, sunoPrompt;
    let variations = [];
    let quality = 'A+';

    // 根据场景生成定制化提示词
    if (sceneMapping.cyberpunk) {
      mjPrompt = `Cyberpunk city street at night, rain-soaked neon-lit alley, holographic advertisements, flying vehicles in background, volumetric fog, cinematic lighting, shot from low angle, ultra-detailed, 8k --ar 16:9 --v 6 --style raw --c 25 --s 200`;
      klingPrompt = `[Camera] Slow dolly shot forward through rain-lit street, Dutch angle for tension
[Duration] 10 seconds
[Visual] Neon signs reflecting in puddles, steam rising from vents, distant flying cars, pedestrians with glowing implants
[Lighting] Deep blues and magentas, harsh neon sources, volumetric fog
[Style] Blade Runner aesthetic, film grain, cinematic letterbox`;
      sunoPrompt = `[Genre] Synthwave / Retrowave
[Mood] Nostalgic, electric, slightly melancholic
[Instrument] Analog synths, gated reverb drums, bass synth, occasional vocoder
[Structure] 30s intro with arpeggios, 60s main theme with evolving pads, 30s outro fade
[Tempo] 118 BPM, driving rhythm
[Vocals] Wordless vocal chops or optional female vocals`;
    } else if (sceneMapping.nature || deepSceneMapping.underwater || deepSceneMapping.jungle) {
      if (deepSceneMapping.underwater) {
        mjPrompt = `Deep sea underwater scene, bioluminescent jellyfish colony, rays of light penetrating from surface above, hyper-realistic, National Geographic quality, 8k --ar 16:9 --v 6 --style raw --c 15`;
        klingPrompt = `[Camera] Slow upward tilt from ocean floor, revealing the bioluminescent world above
[Duration] 12 seconds
[Visual] Glowing jellyfish drifting gracefully, particles floating in light beams, mysterious deep sea creatures
[Lighting] Deep blue gradient, bioluminescent glow, volumetric light rays
[Style] BBC Blue Planet quality, ethereal, hypnotic`;
      } else {
        mjPrompt = `Ancient primeval forest at golden hour, colossal trees with hanging vines, rays of light piercing canopy, moss-covered rocks by crystal stream, fairy tale atmosphere, hyper-detailed, 8k --ar 16:9 --v 6 --style raw --c 20`;
        klingPrompt = `[Camera] Slow push-in through misty forest, revealing hidden world
[Duration] 10 seconds
[Visual] Ancient trees, floating particles in light beams, small stream with smooth stones, occasional wildlife glimpse
[Lighting] Golden hour, volumetric god rays, soft backlight
[Style] Studio Ghibli meets Planet Earth, magical realism`;
      }
      sunoPrompt = `[Genre] Ambient Nature / Ethereal
[Mood] Peaceful, awe-inspiring, meditative
[Instrument] Nature sounds (birds, water, wind), soft piano, ambient synth pads, distant flute
[Structure] 40s gradual build, 60s main soundscape, 20s gentle fade
[Tempo] 60 BPM, breathing rhythm
[Vocals] Optional wordless female vocals`;
    } else if (sceneMapping.space || keywords.includes('宇宙') || keywords.includes('地球')) {
      mjPrompt = `Cosmic nebula panorama, stellar nursery with newborn stars, swirling dust clouds in purple and gold, Hubble telescope quality, deep space photography style, 8k --ar 16:9 --v 6 --style raw --c 15`;
      klingPrompt = `[Camera] Slow zoom out from nebula center, revealing cosmic scale
[Duration] 15 seconds
[Visual] Colorful nebula gases, newborn stars twinkling, distant galaxies rotating, cosmic dust particles
[Lighting] Natural cosmic illumination, no terrestrial light sources
[Style] NASA visualization, scientifically accurate colors, cinematic`;
      sunoPrompt = `[Genre] Cinematic Space Ambient
[Mood] Vast, mysterious, humbling
[Instrument] Deep sub-bass rumble, shimmering synths, spatial reverb, wordless choir
[Structure] 60s slow build with layering, 90s peak with full arrangement, 30s fade to silence
[Tempo] 50 BPM, very slow pulse
[Vocals] Ethereal choir or wordless vocal textures`;
    } else if (sceneMapping.fantasy || sceneMapping.history) {
      mjPrompt = `Epic fantasy battle scene, armored knights on horseback charging across misty battlefield, castle fortress on volcanic mountain, dragons flying overhead, dramatic storm clouds, concept art quality, 8k --ar 16:9 --v 6 --style raw --c 30`;
      klingPrompt = `[Camera] Epic establishing shot, slow reveal of battlefield scale
[Duration] 12 seconds
[Visual] Knight formation charging, banners fluttering, castle in background with lightning, dragons circling above
[Lighting] Storm lighting, dramatic rim light on figures, volumetric clouds
[Style] Peter Jackson Lord of the Rings, historical accuracy meets fantasy spectacle`;
      sunoPrompt = `[Genre] Epic Orchestral / Trailer Music
[Mood] Grandiose, heroic, climactic
[Instrument] Full orchestra (strings, brass, percussion), war drums, chanted vocals
[Structure] 30s tension build, 60s full battle theme, 30s victory fanfare or dramatic cut
[Tempo] 140 BPM battle rhythm, building to 160 BPM climax
[Vocals] Male choir chant, wordless soprano climax`;
    } else if (sceneMapping.horror) {
      mjPrompt = `Psychological horror scene, abandoned hospital corridor at night, flickering fluorescent lights, shadowy figure at end of hallway, dust particles floating, unsettling atmosphere, film grain, 8k --ar 16:9 --v 6 --style raw --c 35`;
      klingPrompt = `[Camera] Tracking shot down eerie corridor, POV glimpses
[Duration] 10 seconds
[Visual] Flickering lights, shadows moving impossibly, doors creaking open, figure appearing and disappearing
[Lighting] Harsh fluorescent flicker, deep shadows, occasional supernatural glow
[Style] Silent Hill meets The Conjuring, dread-inducing, psychological`;
      sunoPrompt = `[Genre] Horror Soundtrack / Dark Ambient
[Mood] Dreadful, unsettling, paranoid
[Instrument] Dissonant strings, metallic scrapes, distorted bass drones, heartbeat bass
[Structure] 60s gradual tension build, 30s silence, 30s sudden cacophony, unsettling end
[Tempo] 40 BPM irregular, heartbeat rhythm that accelerates
[Vocals] Distant whispers, breath sounds, no clear words`;
    } else if (sceneMapping.anime) {
      mjPrompt = `Anime style scene, cherry blossom viewing in Kyoto, character with flowing hair looking at distant mountain, Studio Ghibli aesthetic, watercolor background, soft lighting, 8k --ar 16:9 --v 6 --style raw`;
      klingPrompt = `[Camera] Gentle pan, soft focus transitions
[Duration] 8 seconds
[Visual] Falling cherry petals, character in contemplative pose, traditional Japanese garden background
[Lighting] Soft golden hour, bokeh sakura petals, warm tones
[Style] Anime cel-shaded, Studio Ghibli quality, watercolor background effect`;
      sunoPrompt = `[Genre] Anime OST / J-Pop Ballad
[Mood] Nostalgic, bittersweet, beautiful
[Instrument] Acoustic guitar, piano, light strings, shakuhachi flute
[Structure] 30s gentle intro, 60s emotional verse-chorus, 30s soft outro
[Tempo] 85 BPM, flowing tempo
[Vocals] Emotional Japanese female vocals, breathy and expressive`;
    } else if (sceneMapping.scifi || keywords.includes('地球')) {
      mjPrompt = `Futuristic megacity from orbit, biodome clusters covering continents, space elevator reaching to orbital stations, Earth as backdrop, clean energy visibly flowing, concept art, 8k --ar 16:9 --v 6 --style raw --c 20`;
      klingPrompt = `[Camera] Slow orbit around Earth, descending through atmosphere to city
[Duration] 12 seconds
[Visual] Continental cities in biodomes, orbital infrastructure, natural and artificial coexisting
[Lighting] Earth reflection, sunrise terminator line, artificial light grids visible
[Style] Expanse meets Avatar, hopeful future, technological beauty`;
      sunoPrompt = `[Genre] Sci-Fi Orchestral / Progressive
[Mood] Hopeful, grand, forward-looking
[Instrument] Electronic elements (subtle), full orchestra, choral elements
[Structure] 60s epic build from quiet to full orchestration, 60s main theme
[Tempo] 100 BPM, building rhythm
[Vocals] Hopeful choir, mixed with ethereal electronic textures`;
    } else if (keywords.some(k => ['战斗', '动作', '格斗'].includes(k))) {
      mjPrompt = `Epic martial arts battle scene, two warriors clashing in mid-air, dynamic action pose, cape flowing dramatically, explosive energy effects, cinematic composition, 8k --ar 16:9 --v 6 --style raw --c 30`;
      klingPrompt = `[Camera] Dynamic tracking shot, explosive action
[Duration] 8 seconds
[Visual] Martial artists in mid-leap, impact effects, debris, dramatic lighting on contact
[Lighting] Rim light for silhouette, backlit impact flashes
[Style] John Wick meets Crouching Tiger, grounded but stylized action`;
      sunoPrompt = `[Genre] Action Trailer / Metal Hybrid
[Mood] Intense, adrenaline-fueled, unstoppable
[Instrument] Heavy guitars, pounding drums, orchestral brass stabs, bass drop
[Structure] 15s tension, 45s full action, 15s hard stop or slowdown
[Tempo] 180 BPM, double-kick drums
[Vocals] Aggressive shouts, wordless screams`;
    } else {
      // 通用模板 - 基于关键词智能组合
      const styleKeywords = keywords.slice(0, 4).join(', ');
      mjPrompt = `${styleKeywords}, highly detailed, professional composition, cinematic lighting, atmospheric depth, 8k resolution, hyper-realistic --ar 16:9 --v 6 --style raw --c 20`;
      klingPrompt = `[Camera] Medium wide shot, subtle camera movement
[Duration] 8 seconds
[Visual] ${styleKeywords} scene, dynamic composition, atmospheric elements
[Lighting] Cinematic, mood-enhancing
[Style] Professional production quality, 60fps`;
      sunoPrompt = `[Genre] Cinematic / Atmospheric
[Mood] ${styleKeywords}, immersive
[Instrument] Full arrangement with modern and organic elements
[Structure] 60s full track with dynamics
[Tempo] 90-120 BPM, matching scene energy`;
      variations = [
        { label: '方案 A（标准风格）', mj: mjPrompt, kling: klingPrompt, suno: sunoPrompt },
        { label: '方案 B（电影质感）', mj: mjPrompt.replace('8k', '8k photorealistic, anamorphic lens flare'), kling: klingPrompt.replace('60fps', 'film grain, anamorphic quality'), suno: sunoPrompt.replace('90-120', '70-85, epic orchestral enhancement') }
      ];
      quality = 'A';
    }

    // 如果没有设置 variations，使用默认方案
    if (variations.length === 0) {
      variations = [
        { label: '方案 A（电影级）', mj: mjPrompt, kling: klingPrompt, suno: sunoPrompt },
        { label: '方案 B（艺术风格）', mj: mjPrompt.replace('hyper-realistic', 'artistic interpretation, painterly').replace('8k', '4k'), kling: klingPrompt.replace('60fps', 'stylized animation'), suno: sunoPrompt.replace('[Genre]', '[Genre] Ambient / Experimental\n').replace('[Tempo]', '[Tempo] 40% slower, ambient re interpretation\n[Tempo]') }
      ];
    }

    return {
      thinking: [
        '📥 接收理解 Agent 的输出...',
        '🔍 分析创作场景与风格定位...',
        '🎨 针对 Midjourney 特性生成专业提示词...',
        '🎬 针对 Kling 视频模型生成镜头描述...',
        '🎵 针对 Suno 音乐模型生成音频提示词...',
        '🔄 生成多版本变体方案...',
        '✅ 提示词生成完成'
      ],
      result: {
        mjPrompt: variations[0].mj,
        klingPrompt: variations[0].kling,
        sunoPrompt: variations[0].suno,
        variations: variations,
        quality: quality,
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
🤖 本报告由 AI Sight 执行 Agent 生成（模拟模式）`
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
