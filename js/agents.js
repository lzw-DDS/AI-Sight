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
    const { keywords, input } = understandResult;

    // 深度语义分析
    const semantic = this.deepAnalyze(input, keywords);
    
    // 基于语义分析生成定制提示词
    const mjPrompt = this.generateMidjourneyPrompt(input, semantic);
    const klingPrompt = this.generateKlingPrompt(input, semantic);
    const sunoPrompt = this.generateSunoPrompt(input, semantic);

    // 生成变体方案
    const variations = [
      {
        label: '方案 A（电影质感）',
        mj: mjPrompt,
        kling: klingPrompt,
        suno: sunoPrompt
      },
      {
        label: '方案 B（艺术风格）',
        mj: this.generateVariantB(mjPrompt, semantic),
        kling: this.generateVariantBKling(klingPrompt, semantic),
        suno: this.generateVariantBSuno(sunoPrompt, semantic)
      }
    ];

    return {
      thinking: [
        '📥 接收理解 Agent 的输出...',
        '🔍 深度分析创作语义与情感基调...',
        '🎨 构建 Midjourney 视觉叙事...',
        '🎬 设计 Kling 镜头语言...',
        '🎵 编排 Suno 音乐氛围...',
        '🔄 生成差异化变体方案...',
        '✅ 提示词生成完成'
      ],
      result: {
        mjPrompt: variations[0].mj,
        klingPrompt: variations[0].kling,
        sunoPrompt: variations[0].suno,
        variations: variations,
        quality: 'A+',
        semantic: semantic,
        estimatedCost: '~0.15 MJ credits + ~0.5 Kling credits'
      }
    };
  },

  // ============ 深度语义分析引擎 ============
  
  deepAnalyze(input, keywords) {
    const lower = input.toLowerCase();
    
    return {
      emotions: this.detectEmotions(lower),
      visualStyle: this.detectVisualStyle(lower),
      timeAtmosphere: this.detectTimeAtmosphere(lower),
      composition: this.detectComposition(lower),
      coreTheme: this.extractCoreTheme(lower, keywords),
      intensity: this.estimateIntensity(lower),
      raw: input
    };
  },

  detectEmotions(text) {
    const emotionMap = [
      { keywords: ['恐怖', '血腥', '惊悚', 'horror', 'fear', 'scary', 'dread', 'gore'], emotion: 'dread', label: '恐惧' },
      { keywords: ['孤独', '寂寞', 'alone', 'solitude', 'isolated', 'deserted'], emotion: 'solitude', label: '孤独' },
      { keywords: ['希望', 'hope', '阳光', 'sunrise', '新生', 'dawn'], emotion: 'hope', label: '希望' },
      { keywords: ['宁静', 'peace', 'calm', '安详', '静谧', 'serene'], emotion: 'peace', label: '宁静' },
      { keywords: ['战斗', '激烈', 'action', 'battle', 'fight', 'explosive'], emotion: 'intense', label: '激烈' },
      { keywords: ['神秘', 'mystery', '未知', 'unknown', 'cryptic', 'enigmatic'], emotion: 'mystery', label: '神秘' },
      { keywords: ['悲伤', '哀伤', 'sad', 'sorrow', 'melancholy', 'grief'], emotion: 'melancholy', label: '悲伤' },
      { keywords: ['浪漫', 'romance', '爱情', 'love', '温馨', 'warm'], emotion: 'romance', label: '浪漫' },
      { keywords: ['崇高', '史诗', 'epic', 'grand', 'majestic', '壮阔'], emotion: 'epic', label: '史诗' },
      { keywords: ['颓废', 'decay', '腐烂', 'decaying', 'corruption', '末日'], emotion: 'decay', label: '颓废' },
      { keywords: ['凝视', '对视', 'gaze', '注视', 'staring', 'eye contact'], emotion: 'confrontation', label: '对峙' }
    ];

    const detected = [];
    for (const { keywords, emotion, label } of emotionMap) {
      if (keywords.some(k => text.includes(k))) {
        detected.push({ emotion, label });
      }
    }
    return detected.length > 0 ? detected : [{ emotion: 'neutral', label: '中性' }];
  },

  detectVisualStyle(text) {
    const styleMap = [
      { keywords: ['电影', 'cinematic', 'filmic', 'film'], style: 'cinematic' },
      { keywords: ['写实', 'realistic', 'photorealistic', '真实'], style: 'photorealistic' },
      { keywords: ['动漫', 'anime', '二次元', 'cel-shaded'], style: 'anime' },
      { keywords: ['油画', 'oil painting', 'painterly', 'artistic'], style: 'painterly' },
      { keywords: ['概念', 'concept', 'conceptual', 'art'], style: 'concept-art' },
      { keywords: ['赛博', 'cyber', 'neon', 'glitch'], style: 'cyberpunk' },
      { keywords: ['像素', 'pixel', 'retro', '8bit'], style: 'pixel-art' },
      { keywords: ['极简', 'minimal', '极简主义', 'clean'], style: 'minimalist' }
    ];

    const detected = [];
    for (const { keywords, style } of styleMap) {
      if (keywords.some(k => text.includes(k))) {
        detected.push(style);
      }
    }
    return detected.length > 0 ? detected : ['cinematic'];
  },

  detectTimeAtmosphere(text) {
    const timeMap = [
      { keywords: ['黎明', 'dawn', '日出', 'sunrise', '晨'], time: 'dawn' },
      { keywords: ['黄昏', 'dusk', '日落', 'sunset', '暮色'], time: 'dusk' },
      { keywords: ['夜晚', 'night', '夜间', 'dark', '夜色'], time: 'night' },
      { keywords: ['正午', 'noon', 'midday', 'bright'], time: 'noon' },
      { keywords: ['暴雨', 'storm', '雷雨', 'lightning', 'thunder'], time: 'storm' },
      { keywords: ['雨天', 'rain', '下雨', '雨天', 'wet'], time: 'rainy' },
      { keywords: ['雾', 'fog', 'mist', '雾气', '朦胧'], time: 'foggy' },
      { keywords: ['雪', 'snow', '雪天', 'winter', '冰'], time: 'snowy' }
    ];

    const detected = [];
    for (const { keywords, time } of timeMap) {
      if (keywords.some(k => text.includes(k))) {
        detected.push(time);
      }
    }
    return detected.length > 0 ? detected : ['neutral'];
  },

  detectComposition(text) {
    const compMap = [
      { keywords: ['特写', 'close-up', 'closeup', '脸部', '面部'], comp: 'close-up' },
      { keywords: ['全景', 'wide', 'panoramic', '广阔', '全景'], comp: 'wide-shot' },
      { keywords: ['俯拍', 'overhead', 'top-down', 'aerial', '鸟瞰'], comp: 'aerial' },
      { keywords: ['仰拍', 'low-angle', '低角度', '仰望'], comp: 'low-angle' },
      { keywords: ['背影', 'silhouette', '剪影', 'back view'], comp: 'silhouette' },
      { keywords: ['对称', 'symmetrical', '对称', 'balanced'], comp: 'symmetrical' }
    ];

    const detected = [];
    for (const { keywords, comp } of compMap) {
      if (keywords.some(k => text.includes(k))) {
        detected.push(comp);
      }
    }
    return detected.length > 0 ? detected : ['dynamic'];
  },

  extractCoreTheme(text, keywords) {
    const themeMap = [
      { pattern: /地球|earth|星球|planet|宇宙|cosmic|太空/, theme: 'cosmic-wonder' },
      { pattern: /森林|forest|海洋|ocean|自然|nature|生态/, theme: 'nature-harmony' },
      { pattern: /末日|apocalypse|废土|wasteland|毁灭|collapse/, theme: 'apocalyptic-dread' },
      { pattern: /生命|life|呼吸|breathe|活着|survive/, theme: 'life-force' },
      { pattern: /角色|character|人物|figure|角色/, theme: 'character-study' },
      { pattern: /场景|scene|世界|world|环境|environment/, theme: 'environmental' },
      { pattern: /对视|eye.*contact|gaze|凝视|注视|staring/, theme: 'emotional-confrontation' },
      { pattern: /丧尸|僵尸|zombie|感染者|infected|变异/, theme: 'infection-horror' },
      { pattern: /替换|替换者|replacement/, theme: 'replacement-mystery' }
    ];

    for (const { pattern, theme } of themeMap) {
      if (pattern.test(text)) return theme;
    }
    return keywords[0] || 'abstract';
  },

  estimateIntensity(text) {
    let score = 5;
    const high = ['爆炸', 'explosive', '激烈', 'intense', '极端', 'extreme', '震撼', 'shocking', '恐怖', 'horror', '史诗', 'epic'];
    const low = ['柔和', 'soft', '平静', 'calm', '宁静', 'peaceful', '微妙', 'subtle', '细腻'];
    
    for (const kw of high) { if (text.includes(kw)) score += 2; }
    for (const kw of low) { if (text.includes(kw)) score -= 2; }
    
    return Math.max(1, Math.min(10, score));
  },

  // ============ Midjourney 提示词生成 ============

  generateMidjourneyPrompt(input, semantic) {
    const subject = this.extractVisualSubject(input);
    const emotionDesc = this.buildEmotionDescriptors(semantic.emotions, semantic.intensity);
    const lightingDesc = this.buildLightingDesc(semantic.emotions, semantic.timeAtmosphere);
    const compositionDesc = this.buildCompositionDesc(semantic.composition, semantic.visualStyle);
    const atmosphereDesc = this.buildAtmosphereKeywords(semantic);
    
    let prompt = `${subject}, ${emotionDesc}, ${lightingDesc}, ${compositionDesc}, ${atmosphereDesc}`;
    prompt += this.getStyleSpec(semantic.visualStyle);
    prompt += this.getQualityParams(semantic.intensity);
    
    return prompt;
  },

  extractVisualSubject(input) {
    let cleaned = input
      .replace(/,--/g, '')
      .replace(/提示词|prompt|生成|create|设计|design/gi, '')
      .trim();
    if (cleaned.length > 100) cleaned = cleaned.substring(0, 100);
    
    // 根据核心主题添加视觉增强
    const enhancements = [];
    const themeEnhancements = {
      'cosmic-wonder': ['celestial beauty', 'cosmic grandeur'],
      'nature-harmony': ['organic harmony', 'natural wonder'],
      'apocalyptic-dread': ['post-collapse desolation', 'survival horror'],
      'life-force': ['vital energy', 'living presence'],
      'emotional-confrontation': ['psychological tension', 'intimate eye contact'],
      'infection-horror': ['flesh corruption', 'unnatural transformation'],
      'replacement-mystery': ['human facade', 'inner void']
    };
    
    const theme = this.extractCoreTheme(input.toLowerCase(), []);
    if (themeEnhancements[theme]) {
      enhancements.push(...themeEnhancements[theme]);
    }
    
    return enhancements.length > 0 ? `${cleaned}, ${enhancements.join(', ')}` : cleaned;
  },

  buildEmotionDescriptors(emotions, intensity) {
    if (!emotions || emotions.length === 0) return 'emotionally resonant';
    
    const emotionDescs = {
      'dread': ['oppressive', 'unnerving', 'visceral', 'unsettling'],
      'solitude': ['melancholic', 'quiet', 'contemplative', 'introspective'],
      'hope': ['luminous', 'radiant', 'uplifting', 'transcendent'],
      'peace': ['serene', 'tranquil', 'harmonious', 'meditative'],
      'intense': ['dynamic', 'explosive', 'visceral', 'powerful'],
      'mystery': ['enigmatic', 'cryptic', 'obscure', 'shadowed'],
      'melancholy': ['bittersweet', 'nostalgic', 'poignant', 'somber'],
      'romance': ['intimate', 'tender', 'warm', 'affectionate'],
      'epic': ['majestic', 'monumental', 'grandiose', 'sweeping'],
      'decay': ['weathered', 'crumbling', 'faded', 'tarnished'],
      'confrontation': ['tense', 'charged', 'magnetic', 'psychological'],
      'neutral': ['composed', 'balanced', 'grounded']
    };
    
    const numWords = intensity > 7 ? 3 : intensity > 4 ? 2 : 1;
    const result = [];
    
    for (const e of emotions.slice(0, 2)) {
      const descs = emotionDescs[e.emotion] || emotionDescs['neutral'];
      for (let i = 0; i < Math.min(numWords, descs.length); i++) {
        if (!result.includes(descs[i])) result.push(descs[i]);
      }
    }
    
    return result.join(', ');
  },

  buildLightingDesc(emotions, times) {
    const lightingMap = {
      'dread': ['harsh single source', 'deep shadows', 'sickly pallor'],
      'solitude': ['soft diffused', 'dappled light', 'overcast balance'],
      'hope': ['golden hour', 'warm backlight', 'ethereal glow'],
      'peace': ['even lighting', 'soft ambient', 'natural diffusion'],
      'intense': ['dramatic rim light', 'high contrast', 'stark shadows'],
      'mystery': ['low key', 'volumetric fog', 'hidden sources'],
      'melancholy': ['muted tones', 'blue hour', 'subtle gradients'],
      'romance': ['warm bokeh', 'candlelit', 'golden rim'],
      'epic': ['epic rim lighting', 'god rays', 'volumetric atmosphere'],
      'decay': ['harsh daylight', 'dust motes', 'oxidized tones'],
      'confrontation': ['chiaroscuro', 'tension in the light', 'split lighting'],
      'neutral': ['balanced', 'natural', 'professional']
    };
    
    const timeLighting = {
      'dawn': 'warm amber horizon light',
      'dusk': 'crimson and indigo gradient',
      'night': 'single moonlight source, deep shadows',
      'noon': 'harsh overhead, strong shadows',
      'storm': 'dramatic cloud break, lightning flicker',
      'rainy': 'soft gray ambient, reflection-rich',
      'foggy': 'muffled diffused, limited visibility',
      'snowy': 'cool white, high key, reflective snow',
      'neutral': 'cinematic balanced'
    };
    
    const primaryEmotion = emotions[0]?.emotion || 'neutral';
    const lightingWords = lightingMap[primaryEmotion] || lightingMap['neutral'];
    
    let result = lightingWords[0];
    if (times && times[0] !== 'neutral') {
      result += `, ${timeLighting[times[0]] || timeLighting['neutral']}`;
    }
    
    return result;
  },

  buildCompositionDesc(compositions, styles) {
    const compDescs = {
      'close-up': 'intimate close-up framing, shallow depth of field, eye-level',
      'wide-shot': 'expansive wide composition, cinematic framing, sense of scale',
      'aerial': 'aerial perspective, sweeping view, grand establishing shot',
      'low-angle': 'dramatic low angle, looking up, imposing presence',
      'silhouette': 'silhouette against background, strong contrast, atmospheric',
      'symmetrical': 'perfectly balanced symmetrical composition, centered subject',
      'dynamic': 'dynamic asymmetric composition, movement implied, energy'
    };
    
    const styleAdditions = {
      'cinematic': 'cinematic aspect ratio, anamorphic quality',
      'photorealistic': 'ultra-sharp focus, optical precision, documentary feel',
      'anime': 'cel-shaded rendering, clean linework, stylized',
      'concept-art': 'design-focused composition, portfolio quality',
      'cyberpunk': 'futuristic framing, neon edge lighting, tech details'
    };
    
    let result = (compositions[0] ? compDescs[compositions[0]] : compDescs['dynamic']) || '';
    
    for (const style of styles) {
      const addition = styleAdditions[style];
      if (addition && !result.includes(addition)) {
        result += `, ${addition}`;
        break;
      }
    }
    
    return result;
  },

  buildAtmosphereKeywords(semantic) {
    const { emotions, timeAtmosphere, coreTheme, intensity } = semantic;
    
    const themeAtmosphere = {
      'cosmic-wonder': ['cosmic scale', 'stellar phenomena', 'vastness beyond comprehension'],
      'nature-harmony': ['organic forms', 'living ecosystem', 'earth tones'],
      'apocalyptic-dread': ['post-collapse', 'survival atmosphere', 'ruined civilization'],
      'life-force': ['breathing motion', 'organic energy', 'living presence'],
      'character-study': ['psychological depth', 'inner conflict', 'backstory implied'],
      'emotional-confrontation': ['tension in the gaze', 'psychological connection'],
      'infection-horror': ['flesh mutation', 'unnatural stillness', 'wrongness'],
      'replacement-mystery': ['hollow humanity', 'inner void', 'uncanny valley']
    };
    
    // 添加情感强度氛围
    const intensityAtmosphere = intensity > 7 
      ? 'overwhelming presence, powerful'
      : intensity > 4 
      ? 'narrative quality, engaging'
      : 'subtle undertones, restrained';
    
    const themeWords = themeAtmosphere[coreTheme] || ['atmospheric depth', 'narrative quality'];
    let atmosphere = themeWords.slice(0, 2).join(', ');
    
    if (timeAtmosphere[0] !== 'neutral') {
      atmosphere += `, ${timeAtmosphere[0]} atmosphere`;
    }
    atmosphere += `, ${intensityAtmosphere}`;
    
    return atmosphere;
  },

  getStyleSpec(styles) {
    const styleSpecs = {
      'cinematic': ', cinematic color grading, film grain texture, dramatic palette',
      'photorealistic': ', hyperrealistic details, lifelike textures, optical quality',
      'anime': ', anime aesthetic, Studio Ghibli inspired, cel-shaded',
      'concept-art': ', concept art quality, portfolio-ready, design sheets',
      'cyberpunk': ', neon reflections, holographic elements, retrofuturistic',
      'painterly': ', painterly quality, artistic interpretation, gallery worthy',
      'pixel-art': ', pixel art style, nostalgic gaming aesthetic',
      'minimalist': ', clean composition, negative space emphasis'
    };
    
    const specs = [];
    for (const style of styles) {
      const spec = styleSpecs[style];
      if (spec && !specs.includes(spec)) specs.push(spec);
    }
    
    return specs.length > 0 ? specs.join('') : ', film-inspired color grading, professional palette';
  },

  getQualityParams(intensity) {
    const c = intensity > 7 ? '--c 35' : intensity > 4 ? '--c 20' : '--c 10';
    const s = intensity > 7 ? '--s 300' : intensity > 4 ? '--s 200' : '--s 100';
    return ` --ar 16:9 --v 6 --style raw ${c} ${s}`;
  },

  generateVariantB(mjPrompt, semantic) {
    return mjPrompt
      .replace(/hyperrealistic|photorealistic/gi, 'artistic interpretation, painterly')
      .replace(/8k/gi, '4k')
      .replace(/cinematic/g, 'art-house cinema')
      .replace(/film grain/g, 'fine art photography')
      .replace(/--c \d+/, `--c ${semantic.intensity > 5 ? 45 : 30}`)
      .replace(/--s \d+/, `--s ${semantic.intensity > 5 ? 500 : 350}`);
  },

  // ============ Kling 提示词生成 ============

  generateKlingPrompt(input, semantic) {
    const camera = this.buildCameraMovement(semantic.composition);
    const duration = semantic.intensity > 7 ? '10 seconds' : '8 seconds';
    const visualContent = this.extractVisualSubject(input);
    const visualElements = this.buildVisualElements(semantic);
    const lightingSetup = this.buildKlingLighting(semantic.emotions, semantic.timeAtmosphere);
    const styleDesc = this.buildKlingStyle(semantic);
    
    return `[Camera] ${camera}
[Duration] ${duration}
[Visual] ${visualContent}. ${visualElements}
[Lighting] ${lightingSetup}
[Style] ${styleDesc}`;
  },

  buildCameraMovement(compositions) {
    const movements = {
      'close-up': 'Slow push-in toward subject, breathing room for eye contact, subtle focus shift',
      'wide-shot': 'Establishing shot with slow dolly forward, revealing scale gradually',
      'aerial': 'Drone footage, gradual descent revealing world below',
      'low-angle': 'Tilt up from ground level, dramatic perspective shift',
      'silhouette': 'Static framing, letting silhouette speak, slow reveal',
      'symmetrical': 'Perfectly controlled pan, balanced movement',
      'dynamic': 'Orbiting camera around subject, smooth gimbal movement, momentum'
    };
    return compositions[0] ? (movements[compositions[0]] || movements['dynamic']) : movements['dynamic'];
  },

  buildVisualElements(semantic) {
    const { emotions, coreTheme, timeAtmosphere } = semantic;
    const elements = [];
    
    const themeElements = {
      'cosmic-wonder': ['celestial motion', 'light trails', 'particle dust'],
      'nature-harmony': ['natural movement', 'organic flow', 'environmental life'],
      'apocalyptic-dread': ['decay motion', 'dust particles', 'destruction slow reveal'],
      'life-force': ['breathing rhythm', 'energy pulse', 'organic movement'],
      'emotional-confrontation': ['eye movement', 'tension micro-expressions', 'power struggle'],
      'infection-horror': ['twitching', 'unnatural stillness', 'decay progression'],
      'replacement-mystery': ['hollow gaze', 'uncanny stillness', 'wrong smile']
    };
    
    const themeEl = themeElements[coreTheme] || ['narrative elements', 'atmospheric details'];
    elements.push(themeEl.slice(0, 2).join(', '));
    
    if (timeAtmosphere[0] === 'rainy') elements.push('rain droplets', 'reflection ripples');
    if (timeAtmosphere[0] === 'foggy') elements.push('mist layers', 'limited visibility');
    if (timeAtmosphere[0] === 'storm') elements.push('wind movement', 'debris floating');
    
    return elements.join(', ');
  },

  buildKlingLighting(emotions, times) {
    const emotionLighting = {
      'dread': 'Low-key, single harsh source from above, deep shadows consuming frame, sickly tones',
      'solitude': 'Soft diffused, overcast mood, gentle shadows, contemplative',
      'hope': 'Warm backlight, lens flare hints, uplifting glow, golden rim',
      'peace': 'Even ambient, calm and balanced, soft shadows',
      'intense': 'High contrast, dramatic rim light, strobing accents, harsh',
      'mystery': 'Volumetric fog, hidden sources, moody pools of light, obscured',
      'melancholy': 'Desaturated, blue-hour tones, muted highlights, somber',
      'romance': 'Warm bokeh foreground, candlelit atmosphere, intimate glow',
      'epic': 'Volumetric god rays, epic scale lighting, atmospheric depth',
      'decay': 'Harsh daylight revealing texture, dust in light beams, oxidized',
      'confrontation': 'Split lighting, tension between light and shadow',
      'neutral': 'Professional three-point lighting, balanced'
    };
    
    const primaryEmotion = emotions[0]?.emotion || 'neutral';
    let lighting = emotionLighting[primaryEmotion];
    
    if (times[0] === 'night') lighting += ', moonlight silver tones';
    if (times[0] === 'dusk') lighting += ', warm-to-cool gradient';
    if (times[0] === 'dawn') lighting += ', amber horizon glow';
    
    return lighting;
  },

  buildKlingStyle(semantic) {
    const styleDescs = {
      'cinematic': 'Filmic quality, anamorphic lens, 2.39:1 letterbox, cinematic color science',
      'photorealistic': 'Documentary authenticity, unpolished realism, natural grain',
      'anime': 'Cel-shaded animation, stylized motion, key-frame quality',
      'concept-art': 'Behind-the-scenes VFX quality, pre-visualization feel',
      'cyberpunk': 'Glitch effects, neon smear, retrofuturistic, digital artifacts',
      'painterly': 'Visual effects that evoke fine art, gallery aesthetic'
    };
    
    const styles = semantic.visualStyle;
    for (const style of styles) {
      if (styleDescs[style]) {
        return `${styleDescs[style]}, ${semantic.intensity > 7 ? '60fps smooth, high motion blur' : '30fps cinematic, subtle motion'}`;
      }
    }
    
    return `Professional quality, cinematic feel, ${semantic.intensity > 7 ? '60fps' : '30fps'}`;
  },

  generateVariantBKling(klingPrompt, semantic) {
    return klingPrompt
      .replace(/60fps/g, '24fps stylized')
      .replace(/30fps/g, '24fps arthouse')
      .replace(/Filmic quality/g, 'Art-house film quality')
      .replace(/cinematic feel/g, 'contemplative pacing, deliberate movement');
  },

  // ============ Suno 提示词生成 ============

  generateSunoPrompt(input, semantic) {
    const { emotions, coreTheme, intensity } = semantic;
    
    const emotionToGenre = {
      'dread': { genre: 'Dark Ambient / Horror Soundtrack', mood: 'oppressive, suffocating, dread-inducing' },
      'solitude': { genre: 'Ambient / Neo-Classical', mood: 'contemplative, introspective, quietly melancholic' },
      'hope': { genre: 'Cinematic Uplifting / Orchestral', mood: 'triumphant, radiant, forward-moving' },
      'peace': { genre: 'Ambient / Meditation', mood: 'serene, restorative, grounded' },
      'intense': { genre: 'Action Trailer / Hybrid', mood: 'explosive, relentless, adrenaline-pumping' },
      'mystery': { genre: 'Dark Electronic / Cinematic', mood: 'enigmatic, searching, tension-building' },
      'melancholy': { genre: 'Neo-Classical / Piano Solo', mood: 'bittersweet, nostalgic, emotionally raw' },
      'romance': { genre: 'Film Score / Contemporary', mood: 'intimate, tender, emotionally rich' },
      'epic': { genre: 'Epic Orchestral / Trailer', mood: 'majestic, sweeping, monumental' },
      'decay': { genre: 'Post-Rock / Atmospheric', mood: 'decaying, haunting, disintegrating' },
      'confrontation': { genre: 'Tension / Psychological', mood: 'charged, paranoid, building dread' },
      'neutral': { genre: 'Cinematic / Contemporary', mood: 'evocative, balanced, narrative' }
    };
    
    const themeToInstrument = {
      'cosmic-wonder': 'spatial synths, sub-bass rumble, wordless ethereal choir, crystalline textures',
      'nature-harmony': 'organic sounds, acoustic instruments, nature ambiences, flowing melodies',
      'apocalyptic-dread': 'industrial textures, distorted bass, mechanical rhythms, unsettling drones',
      'life-force': 'breathing synths, pulsing rhythms, organic samples, living textures',
      'character-study': 'solo piano, intimate strings, emotional expression, restrained dynamics',
      'emotional-confrontation': 'dueling instruments, tension motifs, building dynamics, dramatic silences',
      'infection-horror': 'flesh sounds, organic decay, heartbeat bass, visceral textures',
      'replacement-mystery': 'hollow reverb, empty spaces, unsettling absence, wrongness in the tone'
    };
    
    const intensityToStructure = intensity > 7
      ? '30s tension build, 45s explosive climax, 15s hard cut'
      : intensity > 4
      ? '30s gentle intro, 60s emotional development, 30s resolution'
      : '20s minimal intro, 40s sustained atmosphere, 20s soft fade';
    
    const intensityToTempo = intensity > 7
      ? '140 BPM driving rhythm, building to 160 BPM climax'
      : intensity > 4
      ? '100 BPM moderate pace, dynamic shifts'
      : '60 BPM slow, meditative pulse';
    
    const primaryEmotion = emotions[0]?.emotion || 'neutral';
    const genreInfo = emotionToGenre[primaryEmotion] || emotionToGenre['neutral'];
    const instrumentInfo = themeToInstrument[coreTheme] || 'full arrangement, modern orchestral elements';
    const vocalSetting = this.getVocalSetting(emotions, intensity);
    
    return `[Genre] ${genreInfo.genre}
[Mood] ${genreInfo.mood}
[Instrument] ${instrumentInfo}
[Structure] ${intensityToStructure}
[Tempo] ${intensityToTempo}
[Vocals] ${vocalSetting}`;
  },

  getVocalSetting(emotions, intensity) {
    const vocalMap = {
      'dread': 'Distant whispers, distorted breath sounds, no clear words, unsettling',
      'solitude': 'Optional wordless vocals, sparse and haunting, isolated',
      'hope': 'Hopeful choir climaxes, ethereal wordless soprano, transcendent',
      'peace': 'None, pure ambient texture, silence is the voice',
      'intense': 'Aggressive shouts, wordless screams, powerful crescendos',
      'mystery': 'Cryptic whispered phrases, wordless atmospheric layers',
      'melancholy': 'Breathy female vocals, emotionally exposed, vulnerable',
      'romance': 'Warm male/female duet, emotionally resonant, intimate',
      'epic': 'Male choir chant, wordless soprano climax, powerful',
      'decay': 'Fragmented vocal samples, disintegrating quality, distorted',
      'confrontation': 'Tense breathing, whispered confrontation, psychological',
      'neutral': 'Optional wordless vocals for emotional impact'
    };
    
    const primaryEmotion = emotions[0]?.emotion || 'neutral';
    return vocalMap[primaryEmotion] || vocalMap['neutral'];
  },

  generateVariantBSuno(sunoPrompt, semantic) {
    const baseTempo = semantic.intensity > 5 ? 100 : 70;
    return sunoPrompt
      .replace(/\d+ BPM/g, `${Math.round(baseTempo * 0.6)} BPM, ambient re-interpretation`)
      .replace('[Genre]', '[Genre] Ambient / Experimental\n')
      .replace('[Instrument]', '[Instrument] Minimalist, mostly negative space\n[Instrument]');
  },

  // ============ 原有工具函数 ============

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
      '氛围': ['氛围', 'atmosphere', 'ambient'],
      '对视': ['对视', '凝视', '注视', 'eye contact', 'gaze'],
      '替换': ['替换', '替换者', 'replacement']
    };
    let result = [];
    for (const [cn, enArr] of Object.entries(kwMap)) {
      if (enArr.some(w => input.toLowerCase().includes(w))) {
        result.push(cn);
      }
    }
    if (result.length === 0) {
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
🤖 本报告由 AI Sight 执行 Agent 生成（模拟模式）`;
  },

  // ===== 提示词解析器 =====
  analyzePrompt(promptText) {
    const text = promptText.trim();
    if (!text) return null;

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

  detectPromptType(text) {
    if (/--ar\s|-\-v\s|-\-s\s|-\-c\s|-\-style\s/i.test(text)) return 'midjourney';
    if (/\[Camera\]|\[Duration\]|\[Visual\]|\[Lighting\]/i.test(text)) return 'kling';
    if (/\[Genre\]|\[Mood\]|\[Tempo\]|BPM/i.test(text)) return 'suno';
    if (/midjourney|mj\s|image\s+prompt/i.test(text.toLowerCase())) return 'midjourney';
    if (/kling|video\s+prompt/i.test(text.toLowerCase())) return 'kling';
    if (/suno|music\s+prompt/i.test(text.toLowerCase())) return 'suno';
    return 'generic';
  },

  analyzeByType(text, type) {
    const result = { strengths: [], weaknesses: [], missing: [] };

    if (type === 'midjourney' || type === 'generic') {
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
    check(analysis.wordCount < 80, 5);

    check(analysis.hasCameraTag, 10);
    check(analysis.hasDurationTag, 10);
    check(analysis.hasVisualTag, 10);
    check(analysis.hasStyleTag, 10);

    check(analysis.hasGenreTag, 10);
    check(analysis.hasMoodTag, 10);
    check(analysis.hasStructureTag, 10);
    check(analysis.hasTempoTag, 10);

    return Math.min(100, Math.round((score / Math.max(max, 1)) * 100));
  },

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
    const parsed = this.parsePrompt(text, from);
    if (!parsed) return null;
    return this.formatPrompt(parsed, to);
  },

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
      const parts = text.split('--');
      result.subject = parts[0].trim();
      parts.slice(1).forEach(p => {
        const match = p.match(/^(\w+)\s*(.*)$/s);
        if (match) result.params[match[1].trim()] = match[2].trim();
      });
      if (/cinematic/i.test(text)) result.style += 'cinematic ';
      if (/photorealistic/i.test(text)) result.style += 'photorealistic ';
      if (/ volumetric |rim light|lighting/i.test(text)) result.lighting = 'volumetric lighting';
      if (/close-up|wide angle|overhead|aerial/i.test(text)) result.camera = (text.match(/(close-up|wide angle|overhead|aerial|fisheye|macro)/i) || [''])[0];
    } else if (format === 'kling') {
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
