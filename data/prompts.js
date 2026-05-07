// ===== AI Sight =====
// prompts.js — 内置提示词模板库

const PromptLibrary = {
  // 场景模板库：按主题分类
  scenarios: {
    earthBreath: {
      name: '地球呼吸',
      tags: ['科幻', '地球', '呼吸', '生命', '星球'],
      description: '将地球概念化为一个生命体，展示其"呼吸"过程',
      mj: [
        {
          label: '方案 A · 电影级写实',
          prompt: `A cinematic overhead shot of planet Earth, glowing bioluminescent grid lines across continents, atmosphere pulsing with soft blue and green energy, "breathing" motion implied by cloud layer undulation, hyper-realistic, 8k, volumetric lighting, depth of field, cosmic scale --ar 16:9 --v 6 --style raw --c 20`,
          note: '适合：IMAX 级科幻短片开场'
        },
        {
          label: '方案 B · 抽象概念艺术',
          prompt: `Abstract visualization of Earth as a living organism, nerve-like energy networks across surface, glowing ley lines connecting continents, ethereal atmospheric aurora, surreal interpretation, acrylic and digital mixed media style --ar 16:9 --v 6 --style raw --c 25 --s 250`,
          note: '适合：MV / 概念预告片'
        }
      ],
      kling: [
        {
          label: '方案 A · 轨道俯拍',
          prompt: `[Camera] Slow descending orbit from deep space to atmosphere\n[Duration] 8 seconds\n[Visual] Earth rotates slowly, bioluminescent grid lines pulse from pole to pole, cloud layers undulate like breathing\n[Lighting] Sunside warm gold, darkside city lights glow teal\n[Style] Photorealistic, IMAX quality, no text, no UI`
        }
      ],
      suno: [
        {
          label: '方案 A · 史诗氛围',
          prompt: `[Genre] Cinematic Ambient Electronic\n[Mood] Awe-inspiring, mysterious, vast\n[Instrument] Deep synth pads, subtle strings, low Earth rumble, breath-like white noise\n[Structure] 60s intro build-up, 30s climax with choral swell, 30s gentle fade\n[Vocals] None, or wordless ethereal vocal chops\n[Tempo] 72 BPM, very slow, breathing rhythm`
        }
      ]
    },

    zombieReplace: {
      name: '丧尸·替换者',
      tags: ['丧尸', '末日', '感染者', '对视', '替换者'],
      description: '展现感染者与正常人对视的瞬间，揭示"替换"概念',
      mj: [
        {
          label: '方案 A · 恐怖对视',
          prompt: `A tense close-up of a survivor making eye contact with an infected, dramatic chiaroscuro lighting, the infected's eyes reflecting a strange inner light, cinematic composition, post-apocalyptic urban decay background, hyper-detailed, emotional intensity --ar 16:9 --v 6 --style raw --c 15`,
          note: '适合：电影海报 / 关键帧'
        },
        {
          label: '方案 B · 概念设计',
          prompt: `Character design sheet for "The Replacement" zombie concept, showing the moment infection completes, human consciousness visible struggling behind eyes, anatomical sketch mixed with photo-reference style, neutral background --ar 2:3 --v 6 --style raw --c 10`,
          note: '适合：角色设定参考'
        }
      ],
      kling: [
        {
          label: '方案 A · 眼神特写',
          prompt: `[Camera] Extreme close-up, eyes only, then slow pullback to reveal full face\n[Duration] 6 seconds\n[Visual] Infected's eyes shimmer with unnatural intelligence, pupil dilates, reflection of the survivor visible\n[Lighting] Low key, single source from above, harsh shadows\n[Style] Gritty realism, desaturated with pops of sickly green`
        }
      ],
      suno: [
        {
          label: '方案 A · 恐怖氛围',
          prompt: `[Genre] Dark Ambient / Horror Soundtrack\n[Mood] Tense, dread, impending danger\n[Instrument] Low cello drones, metallic scratching sounds, distant coherent whispering\n[Structure] 45s slow build with heartbeat bass, 15s silence, 30s cacophony break\n[Tempo] 60 BPM, irregular rhythm`
        }
      ]
    },

    minecraftDimension: {
      name: 'Minecraft 自定义维度',
      tags: ['minecraft', '维度', '方块', '自定义'],
      description: '展示 Minecraft 自定义维度的奇观与独特生态',
      mj: [
        {
          label: '方案 A · 宣传海报风',
          prompt: `A custom Minecraft dimension portal room, glowing with purple and teal energy, blocky aesthetic but with ray-traced lighting, custom mobs in background, Minecraft promotional art style, vibrant colors, 4k --ar 16:9 --v 6 --style raw --c 10`,
          note: '适合：模组宣传图'
        }
      ],
      kling: [
        {
          label: '方案 A · 第一人称探索',
          prompt: `[Camera] First-person walkthrough, smooth gimbal movement\n[Duration] 10 seconds\n[Visual] Enter custom dimension, blocks materialize from particles, new biomes revealed\n[Lighting] End-like purple ambient, bright portal core\n[Style] Minecraft vanilla + RTX, no UI, 60fps smooth`
        }
      ],
      suno: [
        {
          label: '方案 A · 冒险主题',
          prompt: `[Genre] Chiptune / Orchestral Hybrid\n[Mood] Adventurous, magical, discovery\n[Instrument] 8-bit lead melody, full orchestra backing, crystal bell accents\n[Structure] 30s exploration theme, 15s portal activation sting, 30s new dimension reveal\n[Tempo] 140 BPM, upbeat adventure rhythm`
        }
      ]
    },

    suspenseMusic: {
      name: '悬疑氛围音乐',
      tags: ['悬疑', '神秘', '氛围', '配乐'],
      description: '适合解谜游戏或悬疑影视的背景音乐提示词',
      suno: [
        {
          label: '方案 A · 暗流涌动',
          prompt: `[Genre] Dark Ambient / Neo-Classical\n[Mood] Mysterious, suspenseful, underlying tension\n[Instrument] Solo piano with subtle dissonant harmonics, low cello drones, occasional music box chime\n[Structure] 45s quiet exploration, 30s tense sustain, 15s resolution hint\n[Tempo] 80 BPM, rubato sections\n[Vocals] None`
        },
        {
          label: '方案 B · 电子悬疑',
          prompt: `[Genre] Dark Electronic / Cinematic\n[Mood] Urgent, paranoid, high-tech thriller\n[Instrument] Pulsating synth bass, ticking clock sounds, high-pitched alarm-like pads, distorted glitch percussion\n[Structure] 30s intro pulsing, 45s layered tension build, 15s sudden drop to silence\n[Tempo] 128 BPM, driving rhythm\n[Vocals] Distorted whispered phrases (optional)`
        }
      ]
    }
  },

  // 根据用户输入匹配最相关的场景
  matchScenario(input) {
    const lower = input.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, scenario] of Object.entries(this.scenarios)) {
      let score = 0;
      for (const tag of scenario.tags) {
        if (lower.includes(tag.toLowerCase())) {
          score += 2;
        }
      }
      // 名称匹配
      if (scenario.name.includes(input) || input.includes(scenario.name)) {
        score += 3;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { key, ...scenario };
      }
    }

    // 如果没匹配到，返回通用模板
    if (!bestMatch || bestScore === 0) {
      return this.getGenericScenario(input);
    }
    return bestMatch;
  },

  // 通用场景模板
  getGenericScenario(input) {
    const safeInput = input.substring(0, 50);
    return {
      key: 'generic',
      name: '自定义创作',
      tags: [],
      description: safeInput,
      mj: [
        {
          label: '方案 A · 标准风格',
          prompt: `${safeInput}, high quality, detailed, professional composition, cinematic lighting, 8k resolution --ar 16:9 --v 6 --style raw --c 15`
        }
      ],
      kling: [
        {
          label: '方案 A · 标准风格',
          prompt: `[Camera] Medium shot, smooth movement\n[Duration] 6 seconds\n[Visual] ${safeInput}\n[Lighting] Natural, balanced\n[Style] Photorealistic, high quality`
        }
      ],
      suno: [
        {
          label: '方案 A · 标准风格',
          prompt: `[Genre] Cinematic\n[Mood] Emotional, inspiring\n[Instrument] Full arrangement\n[Structure] 60s full track\n[Tempo] 120 BPM`
        }
      ]
    };
  },

  // 获取所有场景名称（用于文档）
  getScenarioList() {
    return Object.entries(this.scenarios).map(([key, val]) => ({
      key,
      name: val.name,
      tags: val.tags
    }));
  }
};
