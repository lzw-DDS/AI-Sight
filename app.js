// ===== AI Sight =====
// app.js — 主逻辑：事件绑定、流程控制

(function () {
  'use strict';

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
    btnSubmitTemplate2: document.getElementById('btn-submit-template'),
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

    updateFooter('就绪 · 输入创作需求后点击「启动 Agent 协作」');
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

  // ===== 社区模板 Gist URL =====
  const COMMUNITY_GIST_URL = 'https://gist.githubusercontent.com/lzw-DDS/d7bf5665a038c6a0a717fdea13fa622f/raw/community-templates.json';
  const MINE_KEY = 'ai-sight-my-templates';

  let currentCommunityTemplates = [];
  let currentCommunityFilter = 'all';

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
    dom.btnRun.innerHTML = '<span class="btn-icon">⏳</span> Agent 协作中...';

    // 重置界面
    resetPanels();
    Animation.resetNodes();
    Animation.resetAllStatus();

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
})();
