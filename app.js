// ===== AI Sight =====
// app.js — 主逻辑：事件绑定、流程控制

(function () {
  'use strict';

  // ===== 常量 =====
  const HISTORY_KEY = 'ai-sight-history';
  const MAX_HISTORY = 50;
  const MINE_KEY = 'ai-sight-my-templates';
  const COMMUNITY_GIST_URL = 'https://gist.githubusercontent.com/lzw-DDS/d7bf5665a038c6a0a717fdea13fa622f/raw/community-templates.json';

  // ===== DOM 元素 =====
  const dom = {
    // 模式切换
    modeBtns: document.querySelectorAll('.mode-btn'),
    // 生成模式
    areaGenerate: document.getElementById('area-generate'),
    presetsGenerate: document.getElementById('presets-generate'),
    btnRun: document.getElementById('btn-run'),
    userInput: document.getElementById('user-input'),
    // 解析模式
    areaAnalyze: document.getElementById('area-analyze'),
    btnAnalyze: document.getElementById('btn-analyze'),
    analyzeInput: document.getElementById('analyze-input'),
    // 转换模式
    areaConvert: document.getElementById('area-convert'),
    btnConvert: document.getElementById('btn-convert'),
    convertInput: document.getElementById('convert-input'),
    convertFrom: document.getElementById('convert-from'),
    convertTo: document.getElementById('convert-to'),
    // 模板市场模式
    areaTemplates: document.getElementById('area-templates'),
    templateGrid: document.getElementById('template-grid'),
    templateFilter: document.getElementById('template-filter'),
    // 模板市场子标签页
    tplTabs: document.getElementById('tpl-tabs'),
    areaTplOfficial: document.getElementById('area-tpl-official'),
    areaTplCommunity: document.getElementById('area-tpl-community'),
    areaTplMine: document.getElementById('area-tpl-mine'),
    // 社区模板
    communityGrid: document.getElementById('community-grid'),
    communityFilter: document.getElementById('community-filter'),
    // 我的收藏
    mineGrid: document.getElementById('mine-grid'),
    // 社区操作按钮
    btnImportTemplate: document.getElementById('btn-import-template'),
    btnSubmitTemplate: document.getElementById('btn-submit-template'),
    // 我的收藏操作按钮
    btnExportMine: document.getElementById('btn-export-mine'),
    btnImportMine: document.getElementById('btn-import-mine'),
    // 提交弹窗
    modalSubmit: document.getElementById('modal-submit'),
    // 隐藏文件导入
    fileImport: document.getElementById('file-import'),
    // Tab 切换
    tabBtns: document.querySelectorAll('.tab-btn'),
    panels: document.querySelectorAll('.tab-panel'),
    // 输出区域（Agent 流程）
    contentUnderstand: document.getElementById('content-understand'),
    contentGenerate: document.getElementById('content-generate'),
    contentExecute: document.getElementById('content-execute'),
    // 提示词输出
    promptMj: document.getElementById('prompt-mj'),
    promptKling: document.getElementById('prompt-kling'),
    promptSuno: document.getElementById('prompt-suno'),
    contentSummary: document.getElementById('content-summary'),
    // 解析结果
    contentAnalyze: document.getElementById('content-analyze'),
    copyAnalyze: document.getElementById('copy-analyze'),
    // 转换结果
    promptConvert: document.getElementById('prompt-convert'),
    copyConvert: document.getElementById('copy-convert'),
    convertLabel: document.getElementById('convert-label'),
    // 底部状态
    footerStatus: document.getElementById('footer-status'),
    // 弹窗
    modalHow: document.getElementById('modal-how'),
    btnHow: document.getElementById('btn-howitworks'),
    modalCloseHow: document.getElementById('modal-close-how'),
    // 复制按钮
    copyMj: document.getElementById('copy-mj'),
    copyKling: document.getElementById('copy-kling'),
    copySuno: document.getElementById('copy-suno'),
    copySummary: document.getElementById('copy-summary'),
    // 操作按钮
    btnExportAll: document.getElementById('btn-export-all'),
    btnReset: document.getElementById('btn-reset'),
  };

  // ===== 当前模式 =====
  let currentMode = 'generate'; // 'generate' | 'analyze' | 'convert' | 'templates'

  // ===== 状态 =====
  let currentData = null;
  let isRunning = false;

  // ===== 当前模板子标签 =====
  let currentTplTab = 'official';

  // ===== 新功能状态 =====
  let currentPersona = 'director';          // 当前 Agent 人格
  let isLightTheme = false;                  // 主题状态
  let draftTimer = null;                     // 草稿保存定时器
  const DRAFT_KEY = 'ai-sight-draft';        // 草稿存储 key
  const GROUP_KEY = 'ai-sight-template-groups'; // 模板分组 key
  let currentGroup = 'all';                   // 当前分组筛选
  let currentGenerateResult = null;          // 当前生成结果（用于对比/雷达图）
  let quickMode = false;                     // 快速模式开关

  // ===== Agent 人格描述映射 =====
  const PERSONA_MAP = {
    director: { label: '🎬 导演', color: '#6366f1', style: '电影级叙事，构图讲究，色调统一' },
    planner: { label: '🎮 策划', color: '#8b5cf6', style: '游戏化思维，场景完整，数值明确' },
    writer: { label: '✍️ 作者', color: '#a78bfa', style: '文学性强，情感丰富，叙事层层递进' },
    artist: { label: '🖌️ 美术', color: '#c084fc', style: '视觉冲击强，色彩独特，细节丰富' }
  };

  // ===== 雷达图维度定义 =====
  const RADAR_DIMS = [
    { label: '主体描述', key: 'hasSubject' },
    { label: '风格关键词', key: 'hasStyle' },
    { label: '光照效果', key: 'hasLighting' },
    { label: '镜头构图', key: 'hasCamera' },
    { label: '参数完整', key: 'hasParams' },
    { label: '模型版本', key: 'hasVersion' },
  ];

  // ===== 模式切换 =====
  function switchMode(mode) {
    currentMode = mode;
    dom.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    const isGenerate = mode === 'generate';
    const isAnalyze = mode === 'analyze';
    const isConvert = mode === 'convert';
    const isTemplates = mode === 'templates';
    dom.areaGenerate.style.display = isGenerate ? '' : 'none';
    dom.presetsGenerate.style.display = isGenerate ? '' : 'none';
    dom.btnRun.style.display = isGenerate ? '' : 'none';
    dom.areaAnalyze.style.display = isAnalyze ? '' : 'none';
    dom.btnAnalyze.style.display = isAnalyze ? '' : 'none';
    dom.areaConvert.style.display = isConvert ? '' : 'none';
    dom.btnConvert.style.display = isConvert ? '' : 'none';
    dom.areaTemplates.style.display = isTemplates ? '' : 'none';
    if (isTemplates) {
      switchTplTab(currentTplTab);
    }
    const msgs = {
      generate: '就绪 · 输入创作需求后点击「启动 Agent 协作」',
      analyze: '就绪 · 粘贴提示词后点击「解析提示词」',
      convert: '就绪 · 选择源格式和目标格式，粘贴提示词后点击「转换格式」',
      templates: '就绪 · 选择模板，一键加载到创作需求'
    };
    updateFooter(msgs[mode] || '就绪');
  }

  // ===== 切换模板子标签 =====
  function switchTplTab(tab) {
    currentTplTab = tab;
    dom.tplTabs.querySelectorAll('.tpl-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tpltab') === tab);
    });
    dom.areaTplOfficial.style.display = tab === 'official' ? '' : 'none';
    dom.areaTplCommunity.style.display = tab === 'community' ? '' : 'none';
    dom.areaTplMine.style.display = tab === 'mine' ? '' : 'none';
    if (tab === 'official') {
      renderTemplateGrid('all');
    } else if (tab === 'community') {
      loadCommunityTemplates();
    } else if (tab === 'mine') {
      renderMineTemplates();
    }
  }

  // ===== 初始化 =====
  function init() {
    try {
    // 模式切换
    dom.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => switchMode(btn.getAttribute('data-mode')));
    });

    // 生成模式：启动按钮
    dom.btnRun.addEventListener('click', startFlow);

    // 解析模式：解析按钮
    dom.btnAnalyze.addEventListener('click', startAnalyze);

    // 转换模式：转换按钮
    dom.btnConvert.addEventListener('click', startConvert);

    // 模板市场：过滤器按钮
    dom.templateFilter.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      dom.templateFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTemplateGrid(btn.getAttribute('data-filter'));
    });

    // 模板市场：子标签页切换
    dom.tplTabs.addEventListener('click', e => {
      const btn = e.target.closest('.tpl-tab-btn');
      if (!btn) return;
      switchTplTab(btn.getAttribute('data-tpltab'));
    });

    // 模板市场：社区过滤器
    dom.communityFilter.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      dom.communityFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCommunityGrid(currentCommunityTemplates, btn.getAttribute('data-cfilter'));
    });

    // 社区：导入模板文件
    dom.btnImportTemplate.addEventListener('click', () => dom.fileImport.click());
    dom.fileImport.addEventListener('change', handleImportCommunityTemplate);

    // 社区：提交模板
    dom.btnSubmitTemplate.addEventListener('click', openSubmitModal);

    // 我的收藏：导出
    dom.btnExportMine.addEventListener('click', exportMyTemplates);
    dom.btnImportMine.addEventListener('click', () => dom.fileImport.click());
    dom.fileImport.addEventListener('change', handleImportMyTemplates);

    // 提交弹窗
    dom.modalSubmit.addEventListener('click', e => {
      if (e.target === dom.modalSubmit) dom.modalSubmit.style.display = 'none';
    });
    document.getElementById('modal-close-submit').addEventListener('click', () => {
      dom.modalSubmit.style.display = 'none';
    });
    document.getElementById('btn-preview-submit').addEventListener('click', previewSubmitTemplate);
    document.getElementById('btn-copy-submit').addEventListener('click', copySubmitTemplate);
    document.getElementById('submit-prompt').addEventListener('input', autoFillSubmitForm);

    // 示例按钮（仅生成模式）
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dom.userInput.value = btn.getAttribute('data-prompt');
        switchMode('generate');
        startFlow();
      });
    });

    // Tab 切换
    dom.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    // 工作原理弹窗
    dom.btnHow.addEventListener('click', () => { dom.modalHow.style.display = 'flex'; });
    dom.modalCloseHow.addEventListener('click', () => { dom.modalHow.style.display = 'none'; });
    dom.modalHow.addEventListener('click', (e) => { if (e.target === dom.modalHow) dom.modalHow.style.display = 'none'; });

    // 历史记录弹窗
    document.getElementById('btn-history').addEventListener('click', openHistoryModal);
    document.getElementById('modal-close-history').addEventListener('click', () => { document.getElementById('modal-history').style.display = 'none'; });
    document.getElementById('modal-history').addEventListener('click', (e) => { if (e.target.id === 'modal-history') document.getElementById('modal-history').style.display = 'none'; });
    document.getElementById('btn-clear-history').addEventListener('click', clearHistory);

    // 模板预览弹窗
    document.getElementById('modal-close-preview').addEventListener('click', () => { document.getElementById('modal-preview').style.display = 'none'; });
    document.getElementById('modal-preview').addEventListener('click', (e) => { if (e.target.id === 'modal-preview') document.getElementById('modal-preview').style.display = 'none'; });
    document.getElementById('btn-preview-copy').addEventListener('click', copyPreviewPrompt);
    document.getElementById('btn-preview-use').addEventListener('click', usePreviewTemplate);

    // 初始化历史记录
    currentHistory = getHistory();

    // 复制按钮
    dom.copyMj.addEventListener('click', () => copyText(dom.promptMj.textContent));
    dom.copyKling.addEventListener('click', () => copyText(dom.promptKling.textContent));
    dom.copySuno.addEventListener('click', () => copyText(dom.promptSuno.textContent));
    dom.copySummary.addEventListener('click', () => copyText(dom.contentSummary.textContent));
    dom.copyAnalyze.addEventListener('click', () => copyText(dom.contentAnalyze.textContent));
    dom.copyConvert.addEventListener('click', () => copyText(dom.promptConvert.textContent));

    // 操作按钮
    dom.btnExportAll.addEventListener('click', exportAll);
    dom.btnReset.addEventListener('click', resetAll);

    // ===== 新功能：主题切换 =====
    const savedTheme = localStorage.getItem('ai-sight-theme');
    if (savedTheme === 'light') {
      isLightTheme = true;
      document.body.classList.add('light-theme');
      document.getElementById('btn-theme').textContent = '☀️';
    }
    document.getElementById('btn-theme').addEventListener('click', toggleTheme);

    // ===== 新功能：Agent 人格选择 =====
    document.querySelectorAll('.persona-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.persona-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentPersona = chip.getAttribute('data-persona');
        const info = PERSONA_MAP[currentPersona];
        updateFooter(`${info.label} 模式已激活 · ${info.style}`);
      });
    });

    // ===== 新功能：快捷键支持 =====
    document.addEventListener('keydown', handleKeyboard);

    // ===== 新功能：草稿自动保存 =====
    loadDraft(); // 启动时恢复草稿
    const inputEl = dom.userInput;
    inputEl.addEventListener('input', () => {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(saveDraft, 1500);
      showDraftIndicator(false);
    });

    // ===== 新功能：复制全部按钮 =====
    document.getElementById('btn-copy-all').addEventListener('click', copyAllPrompts);

    // ===== 新功能：对比模式按钮 =====
    document.getElementById('btn-compare').addEventListener('click', openCompareMode);
    document.getElementById('btn-close-compare').addEventListener('click', closeCompareMode);

    // ===== 新功能：历史搜索 =====
    document.getElementById('history-search-input').addEventListener('input', filterHistory);

    // ===== 新功能：模板分组 =====
    document.getElementById('btn-new-group').addEventListener('click', createNewGroup);
    document.getElementById('template-groups').addEventListener('click', e => {
      const btn = e.target.closest('.group-btn');
      if (!btn) return;
      document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGroup = btn.getAttribute('data-group');
      renderMineTemplates();
    });
    loadTemplateGroups();

    // ===== 新功能：快速模式切换 =====
    const quickToggle = document.getElementById('quick-mode-toggle');
    quickToggle.addEventListener('change', () => {
      quickMode = quickToggle.checked;
      localStorage.setItem('ai-sight-quick-mode', quickMode ? '1' : '0');
      updateFooter(quickMode ? '⚡ 快速模式已开启 · 直接输出，跳过动画' : '📺 完整模式 · 展示 Agent 协作流程');
    });
    // 恢复快速模式状态
    if (localStorage.getItem('ai-sight-quick-mode') === '1') {
      quickMode = true;
      quickToggle.checked = true;
    }

    // ===== 新功能：拖拽导入支持 =====
    const mineArea = document.getElementById('area-tpl-mine');
    mineArea.addEventListener('dragover', e => {
      e.preventDefault();
      mineArea.classList.add('drag-over');
    });
    mineArea.addEventListener('dragleave', () => mineArea.classList.remove('drag-over'));
    mineArea.addEventListener('drop', handleDragDrop);

    // ===== AI 设置弹窗初始化 =====
    initAISettings();

    updateFooter('就绪 · 输入创作需求后点击「启动 Agent 协作」');
    } catch (err) {
      console.error('[AI Sight] 初始化错误：', err);
      updateFooter('⚠️ 初始化完成，部分功能可能受限');
    }
  }

  // ===== AI 设置弹窗功能 =====
  function initAISettings() {
    const modalSettings = document.getElementById('modal-settings');
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('modal-close-settings');
    const btnTestConnection = document.getElementById('btn-test-connection');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const guideToggle = document.getElementById('guide-toggle');
    const guideContent = document.getElementById('guide-content');

    // 打开设置弹窗
    btnSettings.addEventListener('click', () => {
      loadSettingsUI();
      modalSettings.style.display = 'flex';
    });

    // 关闭设置弹窗
    btnCloseSettings.addEventListener('click', () => {
      modalSettings.style.display = 'none';
    });
    modalSettings.addEventListener('click', e => {
      if (e.target === modalSettings) modalSettings.style.display = 'none';
    });

    // Provider 选择
    document.querySelectorAll('.provider-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.provider-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        card.querySelector('input').checked = true;
        updateModelSelect(card.getAttribute('data-provider'));
      });
    });

    // 测试连接
    btnTestConnection.addEventListener('click', testAIConnection);

    // 保存设置
    btnSaveSettings.addEventListener('click', saveAISettings);

    // 指南展开/收起
    guideToggle.addEventListener('click', () => {
      const isHidden = guideContent.style.display === 'none';
      guideContent.style.display = isHidden ? 'block' : 'none';
      guideToggle.textContent = isHidden ? '📖 收起接入指南' : '📖 查看接入指南';
    });
  }

  // ===== 加载设置 UI =====
  function loadSettingsUI() {
    const config = AIProvider.config;
    
    // 启用开关
    document.getElementById('ai-enabled').checked = config.enabled;
    
    // Provider 选择
    document.querySelectorAll('.provider-card').forEach(card => {
      const isSelected = card.getAttribute('data-provider') === config.provider;
      card.classList.toggle('selected', isSelected);
      card.querySelector('input').checked = isSelected;
    });
    
    // API Key
    document.getElementById('ai-apikey').value = config.apiKey || '';
    
    // 模型选择
    updateModelSelect(config.provider);
    document.getElementById('ai-model').value = config.model || '';
    
    // 更新底部显示
    updateAIModeLabel();
  }

  // ===== 更新模型选择器 =====
  function updateModelSelect(provider) {
    const models = AIProvider.providers[provider]?.models || [];
    const modelSelect = document.getElementById('ai-model');
    const modelHint = document.getElementById('model-hint');
    const sectionApikey = document.getElementById('section-apikey');
    
    modelSelect.innerHTML = '<option value="">使用默认模型</option>';
    models.forEach(m => {
      modelSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });
    
    // 更新提示
    if (modelHint) {
      const providerInfo = AIProvider.providers[provider];
      modelHint.textContent = providerInfo?.description || '';
    }
    
    // Ollama 不需要 API Key
    sectionApikey.style.display = provider === 'ollama' ? 'none' : '';
  }

  // ===== 测试 AI 连接 =====
  async function testAIConnection() {
    const resultEl = document.getElementById('test-result');
    const resultText = document.getElementById('test-result-text');
    
    resultEl.style.display = 'block';
    resultEl.style.background = '#1e293b';
    resultText.textContent = '🔄 测试连接中...';
    
    // 临时应用设置进行测试
    const wasEnabled = AIProvider.config.enabled;
    AIProvider.config.enabled = true;
    
    AIProvider.testConnection((success, message) => {
      AIProvider.config.enabled = wasEnabled;
      
      if (success) {
        resultEl.style.background = 'rgba(34, 197, 94, 0.1)';
        resultText.innerHTML = `✅ <span style="color:#22c55e">${message}</span>`;
      } else {
        resultEl.style.background = 'rgba(239, 68, 68, 0.1)';
        resultText.innerHTML = `❌ <span style="color:#ef4444">${message}</span>`;
      }
    });
  }

  // ===== 保存 AI 设置 =====
  function saveAISettings() {
    const enabled = document.getElementById('ai-enabled').checked;
    const provider = document.querySelector('input[name="provider"]:checked')?.value || 'deepseek';
    const apiKey = document.getElementById('ai-apikey').value.trim();
    const model = document.getElementById('ai-model').value;
    
    // Ollama 不需要 API Key
    if (provider === 'ollama' || !AIProvider.providers[provider]?.needApiKey) {
      // 不检查 API Key
    } else if (!apiKey) {
      showToast('⚠️ 请输入 API Key', 'warning');
      return;
    }
    
    AIProvider.config = {
      enabled,
      provider,
      apiKey,
      model
    };
    AIProvider.saveConfig();
    
    // 更新底部状态
    updateAIModeLabel();
    
    showToast('✅ AI 设置已保存', 'success');
    document.getElementById('modal-settings').style.display = 'none';
  }

  // ===== 更新底部 AI 模式标签 =====
  function updateAIModeLabel() {
    const labelEl = document.getElementById('ai-mode-label');
    if (AIProvider.isAvailable()) {
      const provider = AIProvider.getCurrentProvider();
      labelEl.textContent = `🤖 ${provider?.name || 'AI'}`;
      labelEl.style.color = provider?.color || '#22c55e';
    } else {
      labelEl.textContent = '纯前端';
      labelEl.style.color = '';
    }
  }

  // ===== 渲染模板网格 =====
  function renderTemplateGrid(filter) {
    const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === filter);
    if (!filtered.length) {
      dom.templateGrid.innerHTML = '<div class="template-empty">该分类暂无模板</div>';
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    filtered.forEach(t => {
      const tags = t.tags.map(tag => `<span class="tpl-tag">${tag}</span>`).join('');
      const icon = iconMap[t.category] || '📦';
      html += `\
<div class="template-card" data-id="${t.id}" data-category="${t.category}">
  <div class="tpl-icon">${icon}</div>
  <div class="tpl-body">
    <div class="tpl-title">${t.title}</div>
    <div class="tpl-desc">${t.description}</div>
    <div class="tpl-tags">${tags}</div>
  </div>
  <button class="tpl-use-btn">使用模板</button>
</div>`;
    });
    dom.templateGrid.innerHTML = html;

    // 绑定点击事件
    dom.templateGrid.querySelectorAll('.template-card').forEach(card => {
      card.querySelector('.tpl-use-btn').addEventListener('click', e => {
        e.stopPropagation();
        loadTemplate(card.getAttribute('data-id'));
      });
      card.addEventListener('click', () => loadTemplate(card.getAttribute('data-id')));
    });
  }

  let currentCommunityTemplates = [];
  let currentCommunityFilter = 'all';

  // ===== 历史记录 =====
  let currentHistory = [];

  // ===== 加载社区模板 =====
  async function loadCommunityTemplates() {
    dom.communityGrid.innerHTML = '<div class="tpl-loading"><span class="tpl-spinner">⟳</span> 加载社区模板中...</div>';
    try {
      const res = await fetch(COMMUNITY_GIST_URL);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      currentCommunityTemplates = data.templates || [];
      renderCommunityGrid(currentCommunityTemplates, currentCommunityFilter);
    } catch (e) {
      dom.communityGrid.innerHTML = '<div class="tpl-error">⚠️ 加载失败，请检查网络后重试</div>';
    }
  }

  // ===== 渲染社区模板卡片 =====
  function renderCommunityGrid(templates, filter) {
    currentCommunityFilter = filter;
    const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter);
    if (!filtered.length) {
      dom.communityGrid.innerHTML = '<div class="tpl-empty">该分类暂无社区模板</div>';
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    filtered.forEach(t => {
      const tags = (t.tags || []).map(tag => `<span class="tpl-tag">${tag}</span>`).join('');
      const icon = iconMap[t.category] || '📦';
      html += `<div class="template-card" data-id="${t.id}" data-category="${t.category}">
  <div class="tpl-icon">${icon}</div>
  <div class="tpl-body">
    <div class="tpl-title">${t.title}<span class="tpl-author"> · ${t.author || '匿名'}</span></div>
    <div class="tpl-desc">${t.description}</div>
    <div class="tpl-tags">${tags}</div>
  </div>
  <div class="tpl-card-actions">
    <button class="tpl-star-btn" data-id="${t.id}" title="收藏到我的">⭐</button>
    <button class="tpl-use-btn" data-id="${t.id}">使用</button>
  </div>
</div>`;
    });
    dom.communityGrid.innerHTML = html;
    dom.communityGrid.querySelectorAll('.tpl-use-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); loadTemplate(btn.getAttribute('data-id'), currentCommunityTemplates); });
    });
    dom.communityGrid.querySelectorAll('.tpl-star-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const tpl = currentCommunityTemplates.find(t => t.id === id);
        if (tpl) {
          saveToMyTemplates(tpl);
          btn.textContent = '✅';
          btn.disabled = true;
        }
      });
    });
    dom.communityGrid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => loadTemplate(card.getAttribute('data-id'), currentCommunityTemplates));
    });
  }

  // ===== 我的收藏：读取 =====
  function getMyTemplates() {
    try { return JSON.parse(localStorage.getItem(MINE_KEY) || '[]'); }
    catch { return []; }
  }

  // ===== 我的收藏：保存单个 =====
  function saveToMyTemplates(tpl) {
    const mine = getMyTemplates();
    if (mine.find(t => t.id === tpl.id)) return;
    mine.push({ ...tpl, savedAt: Date.now() });
    localStorage.setItem(MINE_KEY, JSON.stringify(mine));
    showToast('⭐ 已收藏到「我的收藏」');
  }

  // ===== 我的收藏：渲染 =====
  function renderMineTemplates() {
    const mine = getMyTemplates();
    if (!mine.length) {
      dom.mineGrid.innerHTML = '<div class="tpl-empty">还没有收藏任何模板，去社区找找吧！</div>';
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    mine.forEach(t => {
      const tags = (t.tags || []).map(tag => `<span class="tpl-tag">${tag}</span>`).join('');
      const icon = iconMap[t.category] || '📦';
      html += `<div class="template-card template-card-mine" data-id="${t.id}" data-category="${t.category}">
  <div class="tpl-icon">${icon}</div>
  <div class="tpl-body">
    <div class="tpl-title">${t.title}</div>
    <div class="tpl-desc">${t.description}</div>
    <div class="tpl-tags">${tags}</div>
  </div>
  <div class="tpl-card-actions">
    <button class="tpl-remove-btn" data-id="${t.id}" title="移除">✕</button>
    <button class="tpl-use-btn" data-id="${t.id}">使用</button>
  </div>
</div>`;
    });
    dom.mineGrid.innerHTML = html;
    dom.mineGrid.querySelectorAll('.tpl-use-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); loadTemplate(btn.getAttribute('data-id'), mine); });
    });
    dom.mineGrid.querySelectorAll('.tpl-remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        removeFromMyTemplates(btn.getAttribute('data-id'));
      });
    });
    dom.mineGrid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => loadTemplate(card.getAttribute('data-id'), mine));
    });
  }

  // ===== 我的收藏：移除 =====
  function removeFromMyTemplates(id) {
    let mine = getMyTemplates();
    mine = mine.filter(t => t.id !== id);
    localStorage.setItem(MINE_KEY, JSON.stringify(mine));
    renderMineTemplates();
    showToast('🗑️ 已从收藏中移除');
  }

  // ===== 我的收藏：导出 =====
  function exportMyTemplates() {
    const mine = getMyTemplates();
    if (!mine.length) { showToast('⚠️ 收藏为空，无需导出'); return; }
    const blob = new Blob([JSON.stringify(mine, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ai-sight-my-templates-${Date.now()}.json`;
    a.click();
    showToast('📦 收藏已导出为 JSON 文件');
  }

  // ===== 导入到我的收藏 =====
  function handleImportMyTemplates(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) throw new Error('not array');
        const mine = getMyTemplates();
        let added = 0;
        imported.forEach(t => {
          if (t.title && t.prompt && !mine.find(m => m.id === t.id)) {
            mine.push({ ...t, savedAt: Date.now() });
            added++;
          }
        });
        localStorage.setItem(MINE_KEY, JSON.stringify(mine));
        renderMineTemplates();
        showToast(`✅ 成功导入 ${added} 个模板`);
      } catch {
        showToast('❌ JSON 格式错误，导入失败');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ===== 导入社区模板文件 =====
  function handleImportCommunityTemplate(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        const imported = data.templates || [];
        if (!imported.length) throw new Error('no templates');
        currentCommunityTemplates = [...imported, ...currentCommunityTemplates];
        renderCommunityGrid(currentCommunityTemplates, currentCommunityFilter);
        showToast(`✅ 成功导入 ${imported.length} 个社区模板`);
      } catch {
        showToast('❌ JSON 格式错误，需包含 templates 数组');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ===== 打开提交弹窗 =====
  function openSubmitModal() {
    dom.modalSubmit.style.display = 'flex';
    document.getElementById('submit-preview').innerHTML = '';
  }

  // ===== 自动填表 =====
  function autoFillSubmitForm() {
    const prompt = document.getElementById('submit-prompt').value.trim();
    if (prompt && !document.getElementById('submit-title').value.trim()) {
      // 从提示词猜测一个标题
      const short = prompt.slice(0, 20);
      document.getElementById('submit-title').value = '📝 ' + short + (prompt.length > 20 ? '...' : '');
    }
  }

  // ===== 预览提交 JSON =====
  function previewSubmitTemplate() {
    const entry = buildSubmitEntry();
    if (!entry) return;
    const preview = document.getElementById('submit-preview');
    preview.innerHTML = `<div class="submit-json-label">📋 JSON 预览（复制后粘贴到 Gist）</div>
<pre class="submit-json-preview">${escapeForHtml(JSON.stringify(entry, null, 2))}</pre>`;
  }

  // ===== 复制提交 JSON =====
  function copySubmitTemplate() {
    const entry = buildSubmitEntry();
    if (!entry) return;
    const json = JSON.stringify(entry, null, 2);
    copyText(json).then(() => {
      showToast('✅ JSON 已复制！打开 Gist 编辑并提交');
      dom.modalSubmit.style.display = 'none';
      window.open('https://gist.github.com/lzw-DDS/d7bf5665a038c6a0a717fdea13fa622f', '_blank');
    });
  }

  // ===== 构建提交条目 =====
  function buildSubmitEntry() {
    const title = document.getElementById('submit-title').value.trim();
    const category = document.getElementById('submit-category').value;
    const description = document.getElementById('submit-desc').value.trim();
    const tagsRaw = document.getElementById('submit-tags').value.trim();
    const prompt = document.getElementById('submit-prompt').value.trim();
    const author = document.getElementById('submit-author').value.trim() || '匿名';
    const tags = tagsRaw ? tagsRaw.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [];
    if (!title || !prompt) {
      showToast('⚠️ 标题和提示词不能为空');
      return null;
    }
    return {
      id: 'user-' + Date.now(),
      title,
      category,
      description,
      tags,
      prompt,
      author
    };
  }

  // ===== 增强版加载模板（支持模板数组）=====
  function loadTemplate(id, source) {
    const src = source || TEMPLATES;
    const tpl = src.find(t => t.id === id);
    if (!tpl) return;
    if (tpl.category === 'convert') {
      switchMode('convert');
      dom.convertFrom.value = tpl.convertFrom || 'midjourney';
      dom.convertTo.value = tpl.convertTo || 'kling';
      dom.convertInput.value = tpl.convertText || tpl.prompt || '';
      showToast(`✅ 已加载「${tpl.title}」到转换模式`);
    } else {
      switchMode('generate');
      dom.userInput.value = tpl.prompt || '';
      dom.userInput.focus();
      showToast(`✅ 已加载「${tpl.title}」到创作需求`);
    }
  }

  // ===== 启动流程 =====
  async function startFlow() {
    const input = dom.userInput.value.trim();
    if (!input) {
      dom.userInput.focus();
      dom.userInput.style.borderColor = '#ef4444';
      setTimeout(() => dom.userInput.style.borderColor = '', 1500);
      return;
    }

    if (isRunning) return;
    isRunning = true;
    dom.btnRun.disabled = true;

    // 重置界面
    resetPanels();
    Animation.resetNodes();
    Animation.resetAllStatus();

    // ===== AI 增强模式 =====
    if (AIProvider.isAvailable()) {
      await runWithAI(input);
      return;
    }

    // ===== 本地模拟模式 =====
    startLocalFlow(input);
  }

  // ===== AI 增强模式运行 =====
  async function runWithAI(input) {
    updateFooter('🤖 AI 增强模式启动中...');
    dom.btnRun.innerHTML = '<span class="btn-icon">🤖</span> AI 生成中...';
    
    try {
      // 显示 AI 状态
      dom.contentUnderstand.innerHTML = '<div class="ai-loading"><span class="tpl-spinner">⟳</span> 正在调用 AI...</div>';
      dom.contentGenerate.innerHTML = '<div class="ai-loading"><span class="tpl-spinner">⟳</span> 分析需求并生成提示词...</div>';
      
      // 构建 AI 请求（添加 Agent 人格提示）
      const persona = PERSONA_MAP[currentPersona];
      const enhancedInput = `[${persona.label} 模式] ${persona.style}\n\n用户需求：${input}`;

      // 调用 AI
      const aiResult = await AIProvider.callAsync(enhancedInput);
      
      if (aiResult && aiResult.mj) {
        // AI 返回了有效结果
        dom.contentUnderstand.innerHTML = `<div style="color:#22c55e">✅ AI 分析完成</div>
<div style="color:#94a3b8;font-size:12px;margin-top:6px">
• 情感基调：${aiResult.analysis?.emotion || '综合'}\n
• 视觉风格：${aiResult.analysis?.style || '电影质感'}\n
• 核心主题：${aiResult.analysis?.theme || '待定义'}
</div>`;

        dom.contentGenerate.innerHTML = `<div style="color:#22c55e">✅ AI 提示词生成完成</div>
<div style="color:#94a3b8;font-size:12px;margin-top:6px">✨ 由 AI 智能生成，质量更高</div>`;

        dom.contentExecute.innerHTML = `<div style="color:#22c55e">✅ 就绪</div>
<div style="color:#94a3b8;font-size:12px;margin-top:6px">🤖 AI 增强 · ${AIProvider.getCurrentProvider()?.name || 'AI'}</div>`;

        // 填充提示词
        dom.promptMj.textContent = aiResult.mj || '';
        dom.promptKling.textContent = aiResult.kling || '';
        dom.promptSuno.textContent = aiResult.suno || '';

        // 更新状态
        currentData = {
          input,
          mj: aiResult.mj,
          kling: aiResult.kling,
          suno: aiResult.suno,
          source: 'ai',
          provider: AIProvider.config.provider
        };

        updateFooter('✅ AI 生成完成 · 提示词已就绪');
        dom.btnRun.innerHTML = '<span class="btn-icon">🔄</span> 重新生成';
        isRunning = false;
        dom.btnRun.disabled = false;
        switchTab('mj');

        // 保存历史
        if (currentData && currentData.input) {
          saveToHistory({ input: currentData.input, category: 'generate' });
          clearDraft();
        }
      } else {
        throw new Error('AI 返回格式异常');
      }
    } catch (err) {
      console.error('[AI Sight] AI 生成异常：', err);
      updateFooter(`⚠️ AI 调用失败：${err.message}，切换本地模拟`);
      dom.btnRun.innerHTML = '<span class="btn-icon">🔄</span> 重试';
      isRunning = false;
      dom.btnRun.disabled = false;
      // 降级到本地模拟
      startLocalFlow(input);
    }
  }

  // ===== 本地模拟模式 =====
  async function startLocalFlow(input) {
    // ===== 快速模式：直接输出，跳过动画 =====
    if (quickMode) {
      updateFooter('⚡ 快速生成中...');
      dom.btnRun.innerHTML = '<span class="btn-icon">⚡</span> 生成中...';
      try {
        const understandResult = AgentSimulator.understandAgent(input);
        const genResult = AgentSimulator.generateAgent(understandResult.result);
        const execResult = AgentSimulator.executeAgent(genResult.result);

        // 直接填充结果
        dom.contentUnderstand.innerHTML = `<div style="color:#22c55e">✅ 需求解析完成</div><div style="color:#94a3b8;font-size:12px;margin-top:6px">关键词：${understandResult.result.keywords.join('、')}</div>`;
        dom.contentGenerate.innerHTML = `<div style="color:#22c55e">✅ 提示词生成完成</div><div style="color:#94a3b8;font-size:12px;margin-top:6px">${genResult.result.variations.length} 个方案已生成</div>`;
        dom.contentExecute.innerHTML = `<div style="color:#22c55e">✅ 执行完成</div>`;

        dom.promptMj.textContent = genResult.result.mjPrompt;
        dom.promptKling.textContent = genResult.result.klingPrompt;
        dom.promptSuno.textContent = genResult.result.sunoPrompt;
        dom.contentSummary.innerHTML = formatReport(execResult.result.report);

        currentData = {
          input,
          mj: genResult.result.mjPrompt,
          kling: genResult.result.klingPrompt,
          suno: genResult.result.sunoPrompt,
          report: execResult.result.report,
          variations: genResult.result.variations
        };

        const analyzeResult = AgentSimulator.analyzePrompt(genResult.result.mjPrompt);
        if (analyzeResult) drawRadarChart(analyzeResult);

        updateFooter('✅ 生成完成 · 可复制或导出提示词');
        dom.btnRun.disabled = false;
        dom.btnRun.innerHTML = '<span class="btn-icon">🔄</span> 重新生成';
        isRunning = false;
        switchTab('mj');

        if (currentData && currentData.input) {
          saveToHistory({ input: currentData.input, category: 'generate' });
          clearDraft();
        }
      } catch (err) {
        console.error('[AI Sight] 快速生成异常：', err);
        updateFooter('❌ 生成出现异常，请刷新后重试');
        dom.btnRun.disabled = false;
        dom.btnRun.innerHTML = '<span class="btn-icon">▶</span> 启动 Agent 协作';
        isRunning = false;
      }
      return;
    }

    // ===== 完整模式：展示动画流程 =====
    dom.btnRun.innerHTML = '<span class="btn-icon">⏳</span> Agent 协作中...';
    updateFooter('🤖 Agent 协作启动中...');

    try {

    // ===== 阶段1：理解 Agent =====
    updateFooter('🔍 理解 Agent 工作中...');
    Animation.setAgentStatus('understand', 'running', '处理中...');
    Animation.activateNode('node-understand');

    const understandResult = AgentSimulator.understandAgent(input);
    await Animation.typeLines(dom.contentUnderstand, understandResult.thinking, 25, 100);

    // 显示理解结果（追加新 div，不覆写已有内容）
    const summaryText = `✅ 需求解析完成\n• 识别关键词：${understandResult.result.keywords.join('、')}\n• 拆解任务数：${understandResult.result.taskCount} 个\n• 任务概要：${understandResult.result.summary}`;
    const sumEl = document.createElement('div');
    sumEl.style.marginTop = '8px';
    dom.contentUnderstand.appendChild(sumEl);
    await Animation.typeWriter(sumEl, summaryText, 15);
    Animation.setAgentStatus('understand', 'done', '✅ 完成');
    await Animation.sleep(300);
    await Animation.emitParticle('particle1');
    await Animation.activateArrow('arrow1', 'arrowhead1');

    // ===== 阶段2：生成 Agent =====
    updateFooter('✨ 生成 Agent 工作中...');
    Animation.setAgentStatus('generate', 'running', '生成中...');
    Animation.activateNode('node-generate');

    const genResult = AgentSimulator.generateAgent(understandResult.result);
    await Animation.typeLines(dom.contentGenerate, genResult.thinking, 25, 100);

    // 显示生成结果摘要（追加新 div）
    const genSummary = `✅ 提示词生成完成\n• Midjourney：${genResult.result.variations.length} 个方案\n• Kling：视频提示词就绪\n• Suno：音乐提示词就绪\n• 质量评估：${genResult.result.quality}`;
    const genEl = document.createElement('div');
    genEl.style.marginTop = '8px';
    dom.contentGenerate.appendChild(genEl);
    await Animation.typeWriter(genEl, genSummary, 15);
    Animation.setAgentStatus('generate', 'done', '✅ 完成');

    // 填充右侧输出面板
    dom.promptMj.textContent = genResult.result.mjPrompt;
    dom.promptKling.textContent = genResult.result.klingPrompt;
    dom.promptSuno.textContent = genResult.result.sunoPrompt;

    await Animation.sleep(300);
    await Animation.emitParticle('particle2');
    await Animation.activateArrow('arrow2', 'arrowhead2');

    // ===== 阶段3：执行 Agent =====
    updateFooter('⚡ 执行 Agent 工作中...');
    Animation.setAgentStatus('execute', 'running', '模拟执行中...');
    Animation.activateNode('node-execute');

    const execResult = AgentSimulator.executeAgent(genResult.result);
    await Animation.typeLines(dom.contentExecute, execResult.thinking, 25, 100);

    // 显示执行报告（追加新 div）
    const rptEl = document.createElement('div');
    rptEl.style.marginTop = '8px';
    dom.contentExecute.appendChild(rptEl);
    await Animation.typeWriter(rptEl, execResult.result.report, 10);
    Animation.setAgentStatus('execute', 'done', '✅ 完成');

    // 填充综合报告
    dom.contentSummary.innerHTML = formatReport(execResult.result.report);

    await Animation.sleep(300);
    await Animation.emitParticle('particle3');
    await Animation.activateArrow('arrow3', 'arrowhead3');

    // ===== 完成 =====
    currentData = {
      input,
      mj: genResult.result.mjPrompt,
      kling: genResult.result.klingPrompt,
      suno: genResult.result.sunoPrompt,
      report: execResult.result.report,
      variations: genResult.result.variations
    };

    // 绘制雷达图
    const analyzeResult = AgentSimulator.analyzePrompt(genResult.result.mjPrompt);
    if (analyzeResult) {
      drawRadarChart(analyzeResult);
    }

    updateFooter('✅ 全部完成 · 可复制或导出提示词');
    dom.btnRun.disabled = false;
    dom.btnRun.innerHTML = '<span class="btn-icon">🔄</span> 重新生成';
    isRunning = false;

    // 自动切换到第一个 tab
    switchTab('mj');

    } catch (err) {
      console.error('[AI Sight] 流程异常：', err);
      updateFooter('❌ 流程出现异常，请刷新后重试');
    } finally {
      dom.btnRun.disabled = false;
      isRunning = false;
    }
  }

  // ===== 启动解析流程 =====
  async function startAnalyze() {
    const input = dom.analyzeInput.value.trim();
    if (!input) {
      dom.analyzeInput.focus();
      dom.analyzeInput.style.borderColor = '#ef4444';
      setTimeout(() => dom.analyzeInput.style.borderColor = '', 1500);
      return;
    }

    dom.btnAnalyze.disabled = true;
    dom.btnAnalyze.innerHTML = '<span class="btn-icon">⏳</span> 解析中...';
    updateFooter('🔍 提示词解析中...');

    // 清空解析结果区域
    dom.contentAnalyze.innerHTML = '<div class="analyze-placeholder">解析中...</div>';

    // 模拟短暂处理延迟
    await Animation.sleep(600);

    const result = AgentSimulator.analyzePrompt(input);
    if (!result) {
      dom.contentAnalyze.innerHTML = '<div class="analyze-placeholder">解析失败，请检查输入内容</div>';
      dom.btnAnalyze.disabled = false;
      dom.btnAnalyze.innerHTML = '<span class="btn-icon">🔍</span> 解析提示词';
      return;
    }

    // 渲染解析结果
    renderAnalyzeResult(result, input);

    dom.btnAnalyze.disabled = false;
    dom.btnAnalyze.innerHTML = '<span class="btn-icon">🔍</span> 重新解析';
    updateFooter('✅ 解析完成 · 可查看右侧「解析结果」Tab');
    switchTab('analyze');
  }

  // ===== 启动转换流程 =====
  async function startConvert() {
    const input = dom.convertInput.value.trim();
    if (!input) {
      dom.convertInput.focus();
      dom.convertInput.style.borderColor = '#ef4444';
      setTimeout(() => dom.convertInput.style.borderColor = '', 1500);
      return;
    }

    const fromFormat = dom.convertFrom.value;
    const toFormat = dom.convertTo.value;
    if (fromFormat === toFormat) {
      showToast('⚠️ 源格式和目标格式不能相同');
      return;
    }

    dom.btnConvert.disabled = true;
    dom.btnConvert.innerHTML = '<span class="btn-icon">⏳</span> 转换中...';
    updateFooter(`🔄 正在将 ${fromFormat} 提示词转换为 ${toFormat} 格式...`);

    // 清空转换结果
    dom.promptConvert.textContent = '转换中...';

    // 模拟短暂处理延迟
    await Animation.sleep(500);

    const result = AgentSimulator.convertPrompt(input, fromFormat, toFormat);
    if (!result) {
      dom.promptConvert.textContent = '转换失败，请检查输入内容';
      dom.btnConvert.disabled = false;
      dom.btnConvert.innerHTML = '<span class="btn-icon">🔄</span> 转换格式';
      return;
    }

    dom.promptConvert.textContent = result;
    dom.convertLabel.textContent = `🔄 ${fromFormat} → ${toFormat} 转换结果`;

    dom.btnConvert.disabled = false;
    dom.btnConvert.innerHTML = '<span class="btn-icon">🔄</span> 重新转换';
    updateFooter(`✅ 转换完成 · 可复制右侧「转换结果」Tab`);
    switchTab('convert');
  }

  // ===== 渲染解析结果 =====
  function renderAnalyzeResult(result, originalText) {
    const scoreClass = result.score >= 80 ? 'good' : result.score >= 50 ? 'warn' : 'bad';
    const toolName = { midjourney: 'Midjourney', kling: 'Kling', suno: 'Suno', generic: '通用' }[result.toolType];

    let html = '';

    // 评分区域
    html += `<div class="analyze-section">
      <div class="analyze-section-title">📊 综合评分</div>
      <div class="analyze-score ${scoreClass}">${result.score}</div>
      <div class="analyze-bar"><div class="analyze-bar-fill ${scoreClass}" style="width:${result.score}%"></div></div>
      <div style="text-align:center;font-size:11px;color:var(--text-muted);margin-top:4px;">检测类型：${toolName} 提示词</div>
    </div>`;

    // 结构分析
    html += `<div class="analyze-section">
      <div class="analyze-section-title">🔬 结构分析</div>`;

    const checks = getAnalysisChecks(result);
    checks.forEach(c => {
      html += `<div style="display:flex;align-items:center;gap:6px;margin:4px 0;font-size:12px;">
        <span class="analyze-tag ${c.pass ? 'good' : 'bad'}">${c.pass ? '✅' : '❌'}</span>
        <span>${c.label}</span>
      </div>`;
    });

    html += `</div>`;

    // 改进建议
    html += `<div class="analyze-section">
      <div class="analyze-section-title">💡 改进建议</div>`;
    result.suggestions.forEach(s => {
      html += `<div class="analyze-suggestion">${s}</div>`;
    });
    html += `</div>`;

    // 改进版提示词
    if (result.improved) {
      html += `<div class="analyze-section">
        <div class="analyze-section-title">✨ 改进版提示词 <button class="btn-icon" onclick="navigator.clipboard.writeText(this.getAttribute('data-imp')).then(()=>this.textContent='✅ 已复制')" data-imp="${escapeForHtml(result.improved)}" style="margin-left:8px;font-size:11px;">📋 复制</button></div>
        <pre style="background:var(--bg-primary);padding:10px;border-radius:6px;font-size:11px;white-space:pre-wrap;max-height:200px;overflow-y:auto;">${escapeForHtml(result.improved)}</pre>
      </div>`;
    }

    dom.contentAnalyze.innerHTML = html;
  }

  // ===== 获取分析检查项 =====
  function getAnalysisChecks(result) {
    const checks = [];
    if (result.toolType === 'midjourney' || result.toolType === 'generic') {
      checks.push({ label: '主体描述', pass: result.analysis.hasSubject });
      checks.push({ label: '风格关键词', pass: result.analysis.hasStyle });
      checks.push({ label: '光照描述', pass: result.analysis.hasLighting });
      checks.push({ label: '镜头描述', pass: result.analysis.hasCamera });
      checks.push({ label: '宽高比参数(--ar)', pass: result.analysis.hasParams });
      checks.push({ label: '模型版本(--v)', pass: result.analysis.hasVersion });
    }
    if (result.toolType === 'kling' || result.toolType === 'generic') {
      checks.push({ label: '[Camera] 标签', pass: result.analysis.hasCameraTag });
      checks.push({ label: '[Duration] 标签', pass: result.analysis.hasDurationTag });
      checks.push({ label: '[Visual] 标签', pass: result.analysis.hasVisualTag });
      checks.push({ label: '[Style] 标签', pass: result.analysis.hasStyleTag });
    }
    if (result.toolType === 'suno' || result.toolType === 'generic') {
      checks.push({ label: '[Genre] 标签', pass: result.analysis.hasGenreTag });
      checks.push({ label: '[Mood] 标签', pass: result.analysis.hasMoodTag });
      checks.push({ label: '[Structure] 标签', pass: result.analysis.hasStructureTag });
      checks.push({ label: '[Tempo] 标签', pass: result.analysis.hasTempoTag });
    }
    return checks;
  }

  function escapeForHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ===== Tab 切换 =====
  function switchTab(tabName) {
    dom.tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    dom.panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });
  }

  // ===== 重置界面 =====
  function resetPanels() {
    Animation.resetNodes();
    Animation.resetAllStatus();
    dom.contentUnderstand.innerHTML = '';
    dom.contentGenerate.innerHTML = '';
    dom.contentExecute.innerHTML = '';
    dom.promptMj.textContent = '等待生成...';
    dom.promptKling.textContent = '等待生成...';
    dom.promptSuno.textContent = '等待生成...';
    dom.contentSummary.innerHTML = '等待生成...';
    dom.contentAnalyze.innerHTML = '<div class="analyze-placeholder">在左侧输入提示词并点击「解析提示词」</div>';
  }

  // ===== 重置全部 =====
  function resetAll() {
    dom.userInput.value = '';
    dom.analyzeInput.value = '';
    dom.convertInput.value = '';
    resetPanels();
    currentData = null;
    dom.btnRun.innerHTML = '<span class="btn-icon">▶</span> 启动 Agent 协作';
    dom.btnRun.disabled = false;
    dom.btnAnalyze.innerHTML = '<span class="btn-icon">🔍</span> 解析提示词';
    dom.btnAnalyze.disabled = false;
    dom.btnConvert.innerHTML = '<span class="btn-icon">🔄</span> 转换格式';
    dom.btnConvert.disabled = false;
    dom.areaTemplates.style.display = 'none';
    isRunning = false;
    currentTplTab = 'official';
    switchMode('generate');
  }

  // ===== 复制功能 =====
  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('✅ 已复制到剪贴板');
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✅ 已复制到剪贴板');
    });
  }
  
  // ===== 导出全部提示词 =====
  function exportAll() {
    if (!currentData) {
      showToast('⚠️ 请先生成提示词');
      return;
    }
    const content = `\
AI Sight 提示词导出
生成时间：${new Date().toLocaleString('zh-CN')}
═════════════════════════════

【原始需求】
${currentData.input}

【Midjourney 提示词】
${currentData.mj}

【Kling 视频提示词】
${currentData.kling}

【Suno 音乐提示词】
${currentData.suno}

【执行报告】
${currentData.report}

═════════════════════════════
由 AI Sight（多 Agent 提示词工程工作台）生成
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Sight-提示词-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📦 提示词已导出为文本文件');
  }

  // ===== Toast 提示 =====
  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = `
        position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
        background: #1a1a2e; color: #e2e8f0; padding: 10px 20px;
        border-radius: 8px; border: 1px solid #6366f1;
        font-size: 13px; z-index: 9999;
        box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        transition: opacity 0.3s;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2000);
  }

  // ===== 格式化报告 =====
  function formatReport(report) {
    return report
      .replace(/═+/g, '')
      .replace(/✅/g, '<span style="color:#22c55e">✅</span>')
      .replace(/⏱️/g, '<span style="color:#f59e0b">⏱️</span>')
      .replace(/💰/g, '<span style="color:#f59e0b">💰</span>')
      .replace(/📋/g, '<span style="color:#6366f1">📋</span>')
      .replace(/🤖/g, '<span style="color:#8b5cf6">🤖</span>')
      .replace(/\n/g, '<br>');
  }

  // ===== 更新底部状态 =====
  function updateFooter(text) {
    dom.footerStatus.textContent = text;
  }

  // ===== 启动 =====
  document.addEventListener('DOMContentLoaded', init);

  // ===== 历史记录：读取 =====
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  }

  // ===== 历史记录：保存 =====
  function saveToHistory(entry) {
    const history = getHistory();
    history.unshift({ ...entry, timestamp: Date.now() });
    if (history.length > MAX_HISTORY) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    currentHistory = history;
  }

  // ===== 历史记录：删除单个 =====
  function deleteHistoryItem(timestamp) {
    let history = getHistory();
    history = history.filter(h => h.timestamp !== timestamp);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    currentHistory = history;
    renderHistoryList();
    showToast('🗑️ 已删除');
  }

  // ===== 历史记录：清空 =====
  function clearHistory() {
    if (!currentHistory.length) { showToast('历史记录为空'); return; }
    if (confirm('确定要清空所有历史记录吗？')) {
      localStorage.setItem(HISTORY_KEY, '[]');
      currentHistory = [];
      renderHistoryList();
      showToast('🗑️ 已清空全部历史记录');
    }
  }

  // ===== 历史记录：打开弹窗 =====
  function openHistoryModal() {
    renderHistoryList();
    document.getElementById('modal-history').style.display = 'flex';
  }

  // ===== 历史记录：渲染列表 =====
  function renderHistoryList() {
    const list = document.getElementById('history-list');
    if (!currentHistory.length) {
      list.innerHTML = '<div class="history-empty">暂无历史记录</div>';
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    currentHistory.forEach(h => {
      const icon = iconMap[h.category] || '📝';
      const time = formatTime(h.timestamp);
      const preview = h.input ? h.input.slice(0, 60) + (h.input.length > 60 ? '...' : '') : h.prompt.slice(0, 60);
      html += `<div class="history-item" data-input="${escapeForHtml(h.input || h.prompt || '')}">
        <div class="history-item-icon">${icon}</div>
        <div class="history-item-content">
          <div class="history-item-text">${escapeForHtml(preview)}</div>
          <div class="history-item-time">${time}</div>
        </div>
        <button class="history-item-delete" data-time="${h.timestamp}">✕</button>
      </div>`;
    });
    list.innerHTML = html;

    // 绑定点击事件
    list.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('history-item-delete')) return;
        const input = item.getAttribute('data-input');
        dom.userInput.value = decodeHtmlEntities(input);
        document.getElementById('modal-history').style.display = 'none';
        switchMode('generate');
        showToast('📜 已加载历史记录');
      });
    });

    list.querySelectorAll('.history-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteHistoryItem(parseInt(btn.getAttribute('data-time')));
      });
    });
  }

  // ===== 格式化时间 =====
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
    return date.toLocaleDateString('zh-CN');
  }

  // ===== HTML 实体解码 =====
  function decodeHtmlEntities(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent;
  }

  // ===== 模板预览：打开 =====
  let currentPreviewTemplate = null;

  function openTemplatePreview(tpl, source) {
    currentPreviewTemplate = { tpl, source };
    const modal = document.getElementById('modal-preview');
    document.getElementById('preview-title').textContent = tpl.title || '📋 模板预览';
    document.getElementById('preview-meta').textContent = `分类：${getCategoryName(tpl.category)} | 作者：${tpl.author || '官方'}`;

    const content = tpl.prompt || tpl.convertText || '';
    document.getElementById('preview-content').textContent = content || '（无内容）';

    // 转换模板特殊处理
    const convertSection = document.getElementById('preview-convert-section');
    if (tpl.category === 'convert') {
      convertSection.style.display = 'block';
      const fromName = { midjourney: 'Midjourney', kling: 'Kling', suno: 'Suno' }[tpl.convertFrom] || tpl.convertFrom;
      const toName = { midjourney: 'Midjourney', kling: 'Kling', suno: 'Suno' }[tpl.convertTo] || tpl.convertTo;
      document.getElementById('preview-convert-info').textContent = `${fromName} → ${toName}`;
    } else {
      convertSection.style.display = 'none';
    }

    // 标签
    const tagsContainer = document.getElementById('preview-tags');
    const tags = tpl.tags || [];
    tagsContainer.innerHTML = tags.map(tag => `<span class="tpl-tag">${tag}</span>`).join('');

    modal.style.display = 'flex';
  }

  function getCategoryName(category) {
    const map = { video: '🎬 视频', image: '🖼️ 图像', music: '🎵 音乐', convert: '🔄 转换' };
    return map[category] || category;
  }

  // ===== 模板预览：复制 =====
  function copyPreviewPrompt() {
    if (!currentPreviewTemplate) return;
    const content = currentPreviewTemplate.tpl.prompt || currentPreviewTemplate.tpl.convertText || '';
    copyText(content);
    showToast('✅ 提示词已复制');
  }

  // ===== 模板预览：使用 =====
  function usePreviewTemplate() {
    if (!currentPreviewTemplate) return;
    loadTemplate(currentPreviewTemplate.tpl.id, currentPreviewTemplate.source);
    document.getElementById('modal-preview').style.display = 'none';
  }

  // ===== 增强版渲染模板网格（添加预览按钮）=====
  const originalRenderTemplateGrid = renderTemplateGrid;
  renderTemplateGrid = function(filter) {
    const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === filter);
    if (!filtered.length) {
      dom.templateGrid.innerHTML = '<div class="template-empty">该分类暂无模板</div>';
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    filtered.forEach(t => {
      const tags = t.tags.map(tag => `<span class="tpl-tag">${tag}</span>`).join('');
      const icon = iconMap[t.category] || '📦';
      html += `<div class="template-card" data-id="${t.id}" data-category="${t.category}">
  <div class="tpl-icon">${icon}</div>
  <div class="tpl-body">
    <div class="tpl-title">${t.title}</div>
    <div class="tpl-desc">${t.description}</div>
    <div class="tpl-tags">${tags}</div>
  </div>
  <button class="tpl-preview-btn" data-id="${t.id}" title="预览">👁️</button>
  <button class="tpl-use-btn">使用</button>
</div>`;
    });
    dom.templateGrid.innerHTML = html;

    // 绑定事件
    dom.templateGrid.querySelectorAll('.tpl-use-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        loadTemplate(btn.getAttribute('data-id'));
      });
    });
    dom.templateGrid.querySelectorAll('.tpl-preview-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const tpl = TEMPLATES.find(t => t.id === btn.getAttribute('data-id'));
        if (tpl) openTemplatePreview(tpl, TEMPLATES);
      });
    });
    dom.templateGrid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => loadTemplate(card.getAttribute('data-id')));
    });
  };

  // ===== 增强版渲染社区模板（添加预览按钮）=====
  const originalRenderCommunityGrid = renderCommunityGrid;
  renderCommunityGrid = function(templates, filter) {
    currentCommunityFilter = filter;
    const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter);
    if (!filtered.length) {
      dom.communityGrid.innerHTML = '<div class="tpl-empty">该分类暂无社区模板</div>';
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    filtered.forEach(t => {
      const tags = (t.tags || []).map(tag => `<span class="tpl-tag">${tag}</span>`).join('');
      const icon = iconMap[t.category] || '📦';
      html += `<div class="template-card" data-id="${t.id}" data-category="${t.category}">
  <div class="tpl-icon">${icon}</div>
  <div class="tpl-body">
    <div class="tpl-title">${t.title}<span class="tpl-author"> · ${t.author || '匿名'}</span></div>
    <div class="tpl-desc">${t.description}</div>
    <div class="tpl-tags">${tags}</div>
  </div>
  <div class="tpl-card-actions">
    <button class="tpl-preview-btn" data-id="${t.id}" title="预览">👁️</button>
    <button class="tpl-star-btn" data-id="${t.id}" title="收藏">⭐</button>
    <button class="tpl-use-btn" data-id="${t.id}">使用</button>
  </div>
</div>`;
    });
    dom.communityGrid.innerHTML = html;

    dom.communityGrid.querySelectorAll('.tpl-use-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); loadTemplate(btn.getAttribute('data-id'), currentCommunityTemplates); });
    });
    dom.communityGrid.querySelectorAll('.tpl-preview-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const tpl = currentCommunityTemplates.find(t => t.id === btn.getAttribute('data-id'));
        if (tpl) openTemplatePreview(tpl, currentCommunityTemplates);
      });
    });
    dom.communityGrid.querySelectorAll('.tpl-star-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const tpl = currentCommunityTemplates.find(t => t.id === id);
        if (tpl) {
          saveToMyTemplates(tpl);
          btn.textContent = '✅';
          btn.disabled = true;
        }
      });
    });
    dom.communityGrid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => loadTemplate(card.getAttribute('data-id'), currentCommunityTemplates));
    });
  };

  // ===== 增强版渲染我的收藏（添加预览按钮）=====
  const originalRenderMineTemplates = renderMineTemplates;
  renderMineTemplates = function() {
    const mine = getMyTemplates();
    if (!mine.length) {
      dom.mineGrid.innerHTML = '<div class="tpl-empty">还没有收藏任何模板，去社区找找吧！</div>';
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    mine.forEach(t => {
      const tags = (t.tags || []).map(tag => `<span class="tpl-tag">${tag}</span>`).join('');
      const icon = iconMap[t.category] || '📦';
      html += `<div class="template-card template-card-mine" data-id="${t.id}" data-category="${t.category}">
  <div class="tpl-icon">${icon}</div>
  <div class="tpl-body">
    <div class="tpl-title">${t.title}</div>
    <div class="tpl-desc">${t.description}</div>
    <div class="tpl-tags">${tags}</div>
  </div>
  <div class="tpl-card-actions">
    <button class="tpl-preview-btn" data-id="${t.id}" title="预览">👁️</button>
    <button class="tpl-remove-btn" data-id="${t.id}" title="移除">✕</button>
    <button class="tpl-use-btn" data-id="${t.id}">使用</button>
  </div>
</div>`;
    });
    dom.mineGrid.innerHTML = html;
    dom.mineGrid.querySelectorAll('.tpl-use-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); loadTemplate(btn.getAttribute('data-id'), mine); });
    });
    dom.mineGrid.querySelectorAll('.tpl-preview-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const tpl = mine.find(t => t.id === btn.getAttribute('data-id'));
        if (tpl) openTemplatePreview(tpl, mine);
      });
    });
    dom.mineGrid.querySelectorAll('.tpl-remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        removeFromMyTemplates(btn.getAttribute('data-id'));
      });
    });
    dom.mineGrid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => loadTemplate(card.getAttribute('data-id'), mine));
    });
  };

  // ===== 保存到历史记录（在生成完成后调用）=====
  const originalStartFlow = startFlow;
  startFlow = async function() {
    const result = await originalStartFlow.apply(this, arguments);
    // 生成完成后保存到历史记录
    if (currentData && currentData.input) {
      saveToHistory({ input: currentData.input, category: 'generate' });
      clearDraft(); // 生成成功后清除草稿
    }
    return result;
  };

  // ==================== 新增功能 ====================

  // ===== 主题切换 =====
  function toggleTheme() {
    isLightTheme = !isLightTheme;
    document.body.classList.toggle('light-theme', isLightTheme);
    const btn = document.getElementById('btn-theme');
    btn.textContent = isLightTheme ? '☀️' : '🌙';
    localStorage.setItem('ai-sight-theme', isLightTheme ? 'light' : 'dark');
    showToast(isLightTheme ? '☀️ 浅色主题已启用' : '🌙 深色主题已启用');
  }

  // ===== 快捷键处理 =====
  function handleKeyboard(e) {
    // Ctrl+Enter 启动生成
    if (e.ctrlKey && e.key === 'Enter') {
      if (currentMode === 'generate' && !isRunning) startFlow();
      if (currentMode === 'analyze') startAnalyze();
      if (currentMode === 'convert') startConvert();
    }
    // Ctrl+1/2/3 切换模式
    if (e.ctrlKey && e.key === '1') { switchMode('generate'); }
    if (e.ctrlKey && e.key === '2') { switchMode('analyze'); }
    if (e.ctrlKey && e.key === '3') { switchMode('convert'); }
    // Ctrl+4 模板市场
    if (e.ctrlKey && e.key === '4') { switchMode('templates'); }
    // Escape 关闭弹窗
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
    }
    // Ctrl+L 切换主题
    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); toggleTheme(); }
  }

  // ===== 草稿保存 =====
  function saveDraft() {
    const text = dom.userInput.value.trim();
    if (!text) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      text,
      timestamp: Date.now(),
      persona: currentPersona
    }));
    showDraftIndicator(true);
  }

  function loadDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (draft && draft.text && Date.now() - draft.timestamp < 86400000) { // 24小时内有效
        dom.userInput.value = draft.text;
        currentPersona = draft.persona || 'director';
        // 更新人格选择器
        document.querySelectorAll('.persona-chip').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-persona') === currentPersona);
        });
        showDraftIndicator(true);
      }
    } catch {}
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    document.getElementById('draft-indicator').style.display = 'none';
  }

  function showDraftIndicator(show) {
    const indicator = document.getElementById('draft-indicator');
    if (indicator) indicator.style.display = show ? '' : 'none';
  }

  // ===== 复制全部提示词 =====
  function copyAllPrompts() {
    if (!currentData) { showToast('⚠️ 请先生成提示词'); return; }
    const content = `\
═════════════════════════════
  AI Sight · 全部提示词导出
═════════════════════════════

【原始需求】
${currentData.input}

────────── Midjourney ──────────
${currentData.mj}

────────── Kling 视频 ──────────
${currentData.kling}

────────── Suno 音乐 ──────────
${currentData.suno}

═════════════════════════════
由 AI Sight 生成 · ${new Date().toLocaleString('zh-CN')}
`;
    copyText(content);
  }

  // ===== 雷达图绘制 =====
  function drawRadarChart(score) {
    const container = document.getElementById('score-radar');
    const canvas = document.getElementById('radar-canvas');
    if (!container || !canvas) return;

    // 根据分析结果计算各维度得分
    const dims = RADAR_DIMS;
    const values = dims.map(d => {
      const val = score.analysis[d.key];
      return typeof val === 'boolean' ? (val ? 1 : 0.2) : (val ? Math.min(1, val / 100) : 0.2);
    });

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 30;
    const n = dims.length;
    const angleStep = (Math.PI * 2) / n;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景网格
    for (let level = 1; level <= 3; level++) {
      const levelR = (r * level) / 3;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + levelR * Math.cos(angle);
        const y = cy + levelR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(99,102,241,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 绘制轴线
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = 'rgba(99,102,241,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 标签
      const lx = cx + (r + 18) * Math.cos(angle);
      const ly = cy + (r + 18) * Math.sin(angle);
      ctx.fillStyle = isLightTheme ? '#4a5568' : '#94a3b8';
      ctx.font = '11px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dims[i].label, lx, ly);
    }

    // 绘制数据区域
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + r * values[i] * Math.cos(angle);
      const y = cy + r * values[i] * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, 'rgba(99,102,241,0.4)');
    gradient.addColorStop(1, 'rgba(139,92,246,0.15)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制数据点
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + r * values[i] * Math.cos(angle);
      const y = cy + r * values[i] * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
    }

    container.style.display = '';
  }

  // ===== 对比模式 =====
  function openCompareMode() {
    if (!currentData || !currentData.variations || currentData.variations.length < 2) {
      showToast('⚠️ 需要至少 2 个方案才能对比');
      return;
    }
    const container = document.getElementById('compare-mode');
    const a = document.getElementById('compare-a');
    const b = document.getElementById('compare-b');
    const v1 = currentData.variations[0];
    const v2 = currentData.variations[1];
    a.innerHTML = `<div class="compare-col-title">${v1.label}</div><pre>${escapeForHtml(v1.mj)}</pre><br><strong>🎬 Kling</strong><br><pre>${escapeForHtml(v1.kling)}</pre><br><strong>🎵 Suno</strong><br><pre>${escapeForHtml(v1.suno)}</pre>`;
    b.innerHTML = `<div class="compare-col-title">${v2.label}</div><pre>${escapeForHtml(v2.mj)}</pre><br><strong>🎬 Kling</strong><br><pre>${escapeForHtml(v2.kling)}</pre><br><strong>🎵 Suno</strong><br><pre>${escapeForHtml(v2.suno)}</pre>`;
    container.style.display = '';
    switchTab('summary');
  }

  function closeCompareMode() {
    document.getElementById('compare-mode').style.display = 'none';
  }

  // ===== 历史搜索过滤 =====
  function filterHistory() {
    const keyword = document.getElementById('history-search-input').value.trim().toLowerCase();
    const list = document.getElementById('history-list');
    list.querySelectorAll('.history-item').forEach(item => {
      const text = item.querySelector('.history-item-text').textContent.toLowerCase();
      item.style.display = keyword && !text.includes(keyword) ? 'none' : '';
    });
  }

  // ===== 模板分组 =====
  function getTemplateGroups() {
    try { return JSON.parse(localStorage.getItem(GROUP_KEY) || '[]'); }
    catch { return []; }
  }

  function saveTemplateGroups(groups) {
    localStorage.setItem(GROUP_KEY, JSON.stringify(groups));
  }

  function loadTemplateGroups() {
    const groups = getTemplateGroups();
    const container = document.getElementById('template-groups');
    const mine = getMyTemplates();
    let html = '<button class="group-btn active" data-group="all">全部 <span class="group-count">(' + mine.length + ')</span></button>';
    groups.forEach(g => {
      const count = mine.filter(t => t.group === g.id).length;
      html += `<button class="group-btn" data-group="${g.id}">${g.name} <span class="group-count">(${count})</span></button>`;
    });
    container.innerHTML = html;
  }

  function createNewGroup() {
    const name = prompt('输入新分组名称：');
    if (!name || !name.trim()) return;
    const groups = getTemplateGroups();
    const id = 'group-' + Date.now();
    groups.push({ id, name: name.trim() });
    saveTemplateGroups(groups);
    loadTemplateGroups();
    showToast(`📁 分组「${name.trim()}」已创建`);
  }

  // 增强版 renderMineTemplates 支持分组筛选
  const originalRenderMineTemplatesFn = renderMineTemplates;
  renderMineTemplates = function() {
    const mine = getMyTemplates();
    const filtered = currentGroup === 'all' ? mine : mine.filter(t => t.group === currentGroup);
    if (!filtered.length) {
      dom.mineGrid.innerHTML = `<div class="tpl-empty">${currentGroup === 'all' ? '还没有收藏任何模板，去社区找找吧！' : '该分组暂无模板'}</div>`;
      return;
    }
    const iconMap = { video: '🎬', image: '🖼️', music: '🎵', convert: '🔄' };
    let html = '';
    filtered.forEach(t => {
      const tags = (t.tags || []).map(tag => `<span class="tpl-tag">${tag}</span>`).join('');
      const icon = iconMap[t.category] || '📦';
      html += `<div class="template-card template-card-mine" data-id="${t.id}" data-category="${t.category}">
  <div class="tpl-icon">${icon}</div>
  <div class="tpl-body">
    <div class="tpl-title">${t.title}</div>
    <div class="tpl-desc">${t.description}</div>
    <div class="tpl-tags">${tags}</div>
  </div>
  <div class="tpl-card-actions">
    <button class="tpl-preview-btn" data-id="${t.id}" title="预览">👁️</button>
    <button class="tpl-remove-btn" data-id="${t.id}" title="移除">✕</button>
    <button class="tpl-use-btn" data-id="${t.id}">使用</button>
  </div>
</div>`;
    });
    dom.mineGrid.innerHTML = html;

    dom.mineGrid.querySelectorAll('.tpl-use-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); loadTemplate(btn.getAttribute('data-id'), filtered); });
    });
    dom.mineGrid.querySelectorAll('.tpl-preview-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const tpl = filtered.find(t => t.id === btn.getAttribute('data-id'));
        if (tpl) openTemplatePreview(tpl, filtered);
      });
    });
    dom.mineGrid.querySelectorAll('.tpl-remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        removeFromMyTemplates(btn.getAttribute('data-id'));
        loadTemplateGroups(); // 刷新分组计数
      });
    });
    dom.mineGrid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => loadTemplate(card.getAttribute('data-id'), filtered));
    });
  };

  // ===== 拖拽导入 =====
  function handleDragDrop(e) {
    e.preventDefault();
    e.target.closest('#area-tpl-mine')?.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.json')) {
      showToast('⚠️ 请拖入 JSON 文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        const templates = Array.isArray(imported) ? imported : (imported.templates || []);
        let added = 0;
        const mine = getMyTemplates();
        templates.forEach(t => {
          if (t.title && t.prompt && !mine.find(m => m.id === t.id)) {
            mine.push({ ...t, savedAt: Date.now() });
            added++;
          }
        });
        localStorage.setItem(MINE_KEY, JSON.stringify(mine));
        renderMineTemplates();
        loadTemplateGroups();
        showToast(`✅ 拖入成功，导入 ${added} 个模板`);
      } catch {
        showToast('❌ JSON 格式错误');
      }
    };
    reader.readAsText(file);
  }

  // ===== 增强版保存到我的收藏（支持分组）=====
  const originalSaveToMyTemplates = saveToMyTemplates;
  saveToMyTemplates = function(tpl) {
    const groups = getTemplateGroups();
    if (groups.length > 0) {
      const groupId = prompt('选择收藏到的分组（输入分组名）：\n' + groups.map(g => g.name).join('\n') + '\n\n直接确定将归入「默认」分组');
      if (groupId !== null) {
        tpl.group = groupId || null;
      }
    }
    originalSaveToMyTemplates(tpl);
    loadTemplateGroups();
  };

})();
