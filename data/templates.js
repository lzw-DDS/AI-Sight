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
  {
    id: 'tpl-010',
    title: '🌊 深海探索 · 自然纪录片',
    category: 'video',
    description: '深海探索主题的自然纪录片风格视频，从浅海到深海的渐进式镜头设计',
    tags: ['自然', '深海', '纪录片'],
    prompt: '制作一个深海探索主题的自然纪录片风格短视频，从浅海阳光区逐渐下潜到黑暗的深海区域，展示奇异的海洋生物和发光水母群'
  },
  {
    id: 'tpl-011',
    title: '🏔️ 雪山攀登 · 极限运动',
    category: 'video',
    description: '登山运动员攀登雪山的极限运动风格视频，航拍视角与POV结合',
    tags: ['运动', '登山', '极限'],
    prompt: '制作一个雪山攀登主题的极限运动短视频，航拍大全景结合运动员主观视角，展示攀登过程中的挑战与壮丽景色'
  },
  {
    id: 'tpl-012',
    title: '🌸 樱花飘落 · 日式和风',
    category: 'video',
    description: '日式樱花季主题的唯美风格视频，慢镜头捕捉花瓣飘落的瞬间',
    tags: ['日式', '樱花', '唯美'],
    prompt: '制作一个樱花季主题的日式唯美风格短视频，用慢镜头捕捉樱花花瓣在和风建筑间飘落的画面，配以柔和的光线'
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
  {
    id: 'tpl-013',
    title: '⚔️ 奇幻生物 · 龙族设定',
    category: 'image',
    description: '奇幻风格巨龙的概念设计图，展示不同种类巨龙的形态特征',
    tags: ['奇幻', '龙', '生物设计'],
    prompt: '生成一组奇幻风格的巨龙概念设计图，包含火龙、冰龙、毒龙等多种类型，每种有独特的鳞片纹理、翅膀结构和体型比例'
  },
  {
    id: 'tpl-014',
    title: '🏰 废土建筑 · 末日废墟',
    category: 'image',
    description: '后末日风格的废弃建筑场景图，展示被自然侵蚀的城市废墟',
    tags: ['末日', '废墟', '废土'],
    prompt: '创建一组后末日风格的废弃建筑场景图，高楼大厦被藤蔓和苔藓覆盖，阳光透过破碎的窗户洒入，展现人类文明与自然的对抗'
  },
  {
    id: 'tpl-015',
    title: '🔮 神秘道具 · 魔法物品',
    category: 'image',
    description: '奇幻游戏风格的魔法道具设计图，每件物品有独特外观和光效',
    tags: ['魔法', '道具', '奇幻'],
    prompt: '设计一组奇幻游戏风格的魔法道具概念图，包括发光法杖、水晶球、符文剑等，每件物品有独特的光效和材质表现'
  },
  {
    id: 'tpl-016',
    title: '👤 赛博朋克 · 角色头像',
    category: 'image',
    description: '赛博朋克风格的角色头像/半身像，机械改造与霓虹光效结合',
    tags: ['赛博朋克', '头像', '机械'],
    prompt: '生成赛博朋克风格的角色头像，包含半机械改造（发光义眼、颈部线路）、霓虹光效装饰、未来感发型，适合作为游戏角色立绘'
  },
  {
    id: 'tpl-017',
    title: '🌌 宇宙星云 · 天体摄影',
    category: 'image',
    description: 'NASA风格的天体摄影图，绚丽星云与星系照片级画质',
    tags: ['宇宙', '星云', '天文'],
    prompt: '生成一组天体摄影风格的宇宙星云图片，像NASA发布的深空照片一样绚丽，展现螺旋星云、发射星云等多种类型，分辨率极高'
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
  {
    id: 'tpl-018',
    title: '🌙 治愈系 · 放松音乐',
    category: 'music',
    description: '轻柔治愈的放松音乐，适合冥想、睡眠或SPA场景',
    tags: ['治愈', '放松', '冥想'],
    prompt: '创作一段治愈系放松音乐提示词，轻柔的钢琴旋律、自然音效（雨声、鸟鸣）、渐进的放松节奏，适合冥想或睡前聆听'
  },
  {
    id: 'tpl-019',
    title: '🎸 赛博朋克 · 电子音乐',
    category: 'music',
    description: '赛博朋克风格的电子音乐，带有未来感和霓虹氛围',
    tags: ['电子', '赛博朋克', '未来'],
    prompt: '制作一段赛博朋克风格的电子音乐提示词，低沉的合成器音色、充满节奏感的鼓点、偶尔插入的数字失真人声，适合作为未来城市背景音乐'
  },
  {
    id: 'tpl-020',
    title: '🏛️ 古典优雅 · 宫廷舞曲',
    category: 'music',
    description: '巴洛克/古典风格的宫廷舞曲，适合历史题材游戏或纪录片',
    tags: ['古典', '宫廷', '优雅'],
    prompt: '创作一段古典优雅风格的宫廷舞曲提示词，参考巴洛克时期的弦乐编制、小提琴独奏段落、端庄的节奏，适合欧洲中世纪或文艺复兴题材'
  },
  {
    id: 'tpl-021',
    title: '🌪️ 自然力量 · 环境音效',
    category: 'music',
    description: '自然力量主题的环境音景，包括暴风雨、地震等极端天气',
    tags: ['环境音', '自然', '氛围'],
    prompt: '设计一段自然力量主题的环境音景提示词，包括暴风雨、雷鸣、海浪撞击等自然元素，可以加入微妙的电子元素增强戏剧性'
  },

  // —— 提示词转换 ——
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
  {
    id: 'tpl-022',
    title: '🔄 Kling→MJ 动态转静态',
    category: 'convert',
    description: '将 Kling 视频提示词转换为 Midjourney 静态图像提示词',
    tags: ['转换', 'Kling', 'MJ'],
    prompt: '',
    convertFrom: 'kling',
    convertTo: 'midjourney',
    convertText: '[Camera] Slow pan from left to right\n[Duration] 10 seconds\n[Visual] Ancient temple ruins covered in jungle vegetation, sunlight filtering through canopy\n[Lighting] Golden hour, volumetric god rays\n[Style] Cinematic, hyper-realistic'
  },
  {
    id: 'tpl-023',
    title: '🔄 Suno→Kling 音乐配视频',
    category: 'convert',
    description: '将 Suno 音乐提示词转换为匹配风格的 Kling 视频提示词',
    tags: ['转换', 'Suno', 'Kling'],
    prompt: '',
    convertFrom: 'suno',
    convertTo: 'kling',
    convertText: '[Genre] Dark Ambient\n[Mood] Ominous, mysterious\n[Instrument] Low drones, distant thunder\n[Structure] 90s slowly building atmosphere\n[Tempo] 40 BPM, very slow'
  },
  {
    id: 'tpl-024',
    title: '🔄 MJ→Suno 图像转配乐',
    category: 'convert',
    description: '根据 Midjourney 图像提示词生成匹配情绪的 Suno 音乐提示词',
    tags: ['转换', 'MJ', 'Suno'],
    prompt: '',
    convertFrom: 'midjourney',
    convertTo: 'suno',
    convertText: 'A serene Japanese garden at dawn, cherry blossoms falling, koi pond with ancient bridge, mist rising from water, soft golden light, photorealistic --ar 16:9 --v 6'
  },
  {
    id: 'tpl-025',
    title: '🔄 Kling→Suno 视频配音乐',
    category: 'convert',
    description: '将 Kling 视频提示词转换为配套的背景音乐提示词',
    tags: ['转换', 'Kling', 'Suno'],
    prompt: '',
    convertFrom: 'kling',
    convertTo: 'suno',
    convertText: '[Camera] Hero shot, slow reveal\n[Duration] 15 seconds\n[Visual] Grand castle on mountain peak at sunset, birds flying, epic clouds\n[Lighting] Dramatic backlighting, warm sunset colors\n[Style] Cinematic, grand scale'
  },
];
