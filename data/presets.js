/**
 * AI Sight - 世界观预设数据
 */

const WORLD_PRESETS = [
  {
    id: 'zombie-apocalypse',
    name: '丧尸末日',
    icon: '☠️',
    desc: '感染者活体替换，恐惧触发机制',
    keywords: ['post-apocalyptic', 'zombie', 'survival', 'abandoned', 'desolate', 'decay', 'infection', 'wasteland', 'survivor', 'horror', 'eerie'],
    mood: '恐怖 / 压抑 / 绝望中带希望',
    style: 'cinematic realism, desaturated tones, film grain, documentary feel',
    examples: [
      '废弃医院走廊，腐烂的病床，窗户透进惨淡月光',
      '幸存者在废墟中搜刮物资，远方传来不明嘶吼',
      '被雾气笼罩的城市广场，空无一人却充满危险气息'
    ]
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    icon: '🤖',
    desc: '霓虹灯下的反乌托邦都市',
    keywords: ['cyberpunk', 'neon', 'dystopia', 'high-tech', 'rain', 'urban', 'hologram', 'corporate', 'underground', 'augmented'],
    mood: '未来感 / 冰冷 / 暗流涌动',
    style: 'sci-fi cinematic, volumetric fog, anamorphic lens, high contrast',
    examples: [
      '雨夜霓虹街景，全息广告牌倒映在水洼中',
      '高楼林立的都市天际线，飞行汽车穿梭其间',
      '地下黑市，义体改造者正在交易'
    ]
  },
  {
    id: 'wasteland',
    name: '废土世界',
    icon: '🌍',
    desc: '文明毁灭后的荒芜之地',
    keywords: ['wasteland', 'dust', 'ruins', 'radiation', 'mutant', 'tribal', 'barren', 'survival', 'scavenger', 'sun-scorched'],
    mood: '苍凉 / 粗犷 / 生存本能',
    style: 'dusty atmosphere, warm color grading, rugged textures, epic scale',
    examples: [
      '烈日下的荒漠公路，废弃车辆散落各处',
      '辐射区边缘，变异生物在远处游荡',
      '部落营地，篝火映照着战士们的面孔'
    ]
  },
  {
    id: 'fantasy',
    name: '奇幻世界',
    icon: '🧙',
    desc: '魔法与异兽并存的中世纪幻想',
    keywords: ['fantasy', 'medieval', 'magic', 'castle', 'dragon', 'warrior', 'mystical', 'ancient', 'enchanted', 'epic'],
    mood: '史诗 / 神秘 / 壮阔',
    style: 'painterly, warm fantasy lighting, cinematic wide shot, rich details',
    examples: [
      '云雾缭绕的山巅古堡，巨龙盘旋其上',
      '精灵族的森林圣殿，光影透过巨大树冠',
      '骑士与恶龙对峙，剑刃反射着金色夕阳'
    ]
  },
  {
    id: 'scifi',
    name: '科幻太空',
    icon: '🚀',
    desc: '星际文明与未知宇宙',
    keywords: ['sci-fi', 'space', 'alien', 'futuristic', 'spacecraft', 'planet', 'nebula', 'android', 'hyperspace', 'docking'],
    mood: '宏大 / 冷峻 / 未知探索',
    style: 'sci-fi cinematic, volumetric lighting, cold color palette, epic composition',
    examples: [
      '宇宙空间站对接场景，地球在远方升起',
      '外星球表面，奇异植物在紫红色天空下发光',
      '巨型飞船穿越星云，船体反射着星光'
    ]
  },
  {
    id: 'dystopia',
    name: '反乌托邦',
    icon: '⚔️',
    desc: '极权统治下的压抑社会',
    keywords: ['dystopia', 'oppressive', 'surveillance', 'class-division', 'rebellion', 'conformity', 'totalitarian', 'grim', 'industrial'],
    mood: '压抑 / 反抗 / 灰色地带',
    style: 'gritty realism, cold blue-grey tones, documentary style, stark contrast',
    examples: [
      '整齐划一的居民区，穿着统一的群众面无表情',
      '工厂流水线，工人机械重复着同样的动作',
      '反抗军据点，昏暗灯光下正在策划行动'
    ]
  },
  {
    id: 'nature',
    name: '自然之美',
    icon: '🌿',
    desc: '壮丽自然景观与生灵',
    keywords: ['nature', 'landscape', 'wildlife', 'majestic', 'serene', 'wilderness', 'peaceful', 'organic', 'breathtaking'],
    mood: '宁静 / 敬畏 / 生命力量',
    style: 'photorealistic, natural lighting, golden hour, cinematic landscape',
    examples: [
      '瀑布从悬崖倾泻而下，彩虹横跨水雾',
      '非洲草原日落，百万角马迁徙',
      '萤火虫照亮的古老森林，神秘而宁静'
    ]
  },
  {
    id: 'urban-life',
    name: '都市生活',
    icon: '🏙️',
    desc: '现代城市中的日常与情感',
    keywords: ['urban', 'city', 'street', 'life', 'candid', 'documentary', 'daily', 'human', 'moody', 'contemporary'],
    mood: '真实 / 温暖 / 都市孤独',
    style: 'documentary style, natural light, shallow depth of field, cinematic color',
    examples: [
      '深夜便利店，店员与夜归人的片刻交集',
      '老城区狭窄巷弄，孩子们的嬉闹声',
      '地铁站台，人群涌动中的片刻宁静'
    ]
  }
];

/**
 * 获取预设上下文
 */
function getPresetContext(presetId) {
  const preset = WORLD_PRESETS.find(p => p.id === presetId);
  if (!preset) return '';
  
  return `
【世界观预设：${preset.name}】
- 风格关键词：${preset.keywords.join(', ')}
- 推荐风格：${preset.style}
- 情绪基调：${preset.mood}
`;
}

/**
 * 生成预设选项 HTML
 */
function generatePresetOptions(selectedId = null) {
  return WORLD_PRESETS.map(p => 
    `<option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.icon} ${p.name}</option>`
  ).join('');
}
