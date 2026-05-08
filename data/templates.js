// ===== AI Sight =====
// templates.js — 工作流模板市场数据

const TEMPLATES = [
  // —— 视频制作 ——
  {
    id: 'tpl-001',
    title: '🌍 地球呼吸 · 科幻短片',
    category: 'video',
    description: '生成地球作为生命体的科幻风格分镜脚本和视频提示词，包含19个精细镜头',
    tags: ['科幻', '分镜', 'Kling'],
    prompt: '制作一个科幻风格的短视频，主题是地球呼吸，展示地球作为一个生命体的概念，需要19个镜头的精细分镜脚本'
  },
  {
    id: 'tpl-002',
    title: '🧟 丧尸末日 · 叙事脚本',
    category: 'video',
    description: '生成丧尸末日世界观的分镜脚本，重点刻画感染者与正常人的对视时刻',
    tags: ['丧尸', '末日', '叙事'],
    prompt: '生成一个丧尸末日世界观的分镜脚本，重点展示感染者与正常人的对视时刻，需要多角度镜头设计'
  },
  {
    id: 'tpl-003',
    title: '🏙️ 赛博朋克 · 城市夜景',
    category: 'video',
    description: '赛博朋克风格的城市夜景视频提示词，霓虹灯光、雨水反射、广角镜头',
    tags: ['赛博朋克', '城市', '夜景'],
    prompt: '制作一个赛博朋克风格的城市夜景视频，霓虹灯反射在湿润的街道上，广角镜头，电影级画质'
  },

  // —— 图像生成 ——
  {
    id: 'tpl-004',
    title: '🎮 Minecraft · 维度宣传图',
    category: 'image',
    description: '生成 Minecraft 风格的建筑模组宣传图，包含自定义维度设计',
    tags: ['Minecraft', '建筑', 'Midjourney'],
    prompt: '创建一组 Minecraft 风格的建筑模组宣传图，展示自定义维度的传送门和生态环境'
  },
  {
    id: 'tpl-005',
    title: '🖼️ 概念艺术 · 角色设计',
    category: 'image',
    description: '生成原创角色的概念艺术图，包含细节设定和风格参考',
    tags: ['概念艺术', '角色', '设计'],
    prompt: '设计一个原创角色的概念艺术图，包含服装细节、配色方案和背景设定，电影级质感'
  },

  // —— 音乐创作 ——
  {
    id: 'tpl-006',
    title: '🎵 史诗配乐 · 战斗场景',
    category: 'music',
    description: '生成史诗风格的战斗场景配乐提示词，包含乐器编排和情绪曲线',
    tags: ['史诗', '配乐', 'Suno'],
    prompt: '生成一段史诗风格的战斗场景配乐提示词，包含全乐器编排、情绪曲线和60秒完整结构'
  },
  {
    id: 'tpl-007',
    title: '🎹 悬疑氛围 · 背景音乐',
    category: 'music',
    description: '生成悬疑游戏风格的背景音乐提示词，低沉氛围、渐强张力',
    tags: ['悬疑', '氛围', '游戏'],
    prompt: '创建一段悬疑氛围的背景音乐提示词，低沉的弦乐、渐强的张力、适合解谜游戏场景'
  },

  // —— 提示词工程 ——
  {
    id: 'tpl-008',
    title: '🔄 MJ→Kling 提示词转换',
    category: 'convert',
    description: '将 Midjourney 图像提示词转换为 Kling 视频提示词，保留风格和构图',
    tags: ['转换', 'MJ', 'Kling'],
    prompt: '',
    convertFrom: 'midjourney',
    convertTo: 'kling',
    convertText: 'A cinematic shot of a cyberpunk city at night, neon lights reflecting on wet streets, wide angle, photorealistic, volumetric lighting --ar 16:9 --v 6'
  },
  {
    id: 'tpl-009',
    title: '🎵 Suno→MJ 音乐视觉化',
    category: 'convert',
    description: '将 Suno 音乐提示词转换为 Midjourney 专辑封面提示词',
    tags: ['转换', 'Suno', 'MJ'],
    prompt: '',
    convertFrom: 'suno',
    convertTo: 'midjourney',
    convertText: '[Genre] Epic Orchestral\n[Mood] Emotional, soaring\n[Instrument] Full orchestra, choir\n[Structure] 60s full track\n[Tempo] 120 BPM'
  },
];
