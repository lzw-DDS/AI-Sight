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
  let currentMode = 'generate'; // 'generate' | 'analyze'

  // ===== 状态 =====
  let currentData = null;
  let isRunning = false;

  // ===== 模式切换 =====
  function switchMode(mode) {
    currentMode = mode;
    dom.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    const isGenerate = mode === 'generate';
    dom.areaGenerate.style.display = isGenerate ? '' : 'none';
    dom.presetsGenerate.style.display = isGenerate ? '' : 'none';
    dom.btnRun.style.display = isGenerate ? '' : 'none';
    dom.areaAnalyze.style.display = isGenerate ? 'none' : '';
    dom.btnAnalyze.style.display = isGenerate ? 'none' : '';
    updateFooter(isGenerate ? '就绪 · 输入创作需求后点击「启动 Agent 协作」' : '就绪 · 粘贴提示词后点击「解析提示词」');
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

    // 操作按钮
    dom.btnExportAll.addEventListener('click', exportAll);
    dom.btnReset.addEventListener('click', resetAll);

    updateFooter('就绪 · 输入创作需求后点击「启动 Agent 协作」');
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

    // ===== 阶段1：理解 Agent =====
    updateFooter('🔍 理解 Agent 工作中...');
    Animation.setAgentStatus('understand', 'running', '处理中...');
    Animation.activateNode('node-understand');

    const understandResult = AgentSimulator.understandAgent(input);
    await Animation.typeLines(dom.contentUnderstand, understandResult.thinking, 35, 150);

    // 显示理解结果
    const summaryText = `✅ 需求解析完成\n• 识别关键词：${understandResult.result.keywords.join('、')}\n• 拆解任务数：${understandResult.result.taskCount} 个\n• 任务概要：${understandResult.result.summary}`;
    await Animation.typeWriter(dom.contentUnderstand, '\n' + summaryText, 20);
    Animation.setAgentStatus('understand', 'done', '✅ 完成');
    await Animation.sleep(300);
    await Animation.emitParticle('particle1');
    await Animation.activateArrow('arrow1', 'arrowhead1');

    // ===== 阶段2：生成 Agent =====
    updateFooter('✨ 生成 Agent 工作中...');
    Animation.setAgentStatus('generate', 'running', '生成中...');
    Animation.activateNode('node-generate');

    const genResult = AgentSimulator.generateAgent(understandResult.result);
    await Animation.typeLines(dom.contentGenerate, genResult.thinking, 35, 150);

    // 显示生成结果摘要
    const genSummary = `✅ 提示词生成完成\n• Midjourney：${genResult.result.variations.length} 个方案\n• Kling：视频提示词就绪\n• Suno：音乐提示词就绪\n• 质量评估：${genResult.result.quality}`;
    await Animation.typeWriter(dom.contentGenerate, '\n' + genSummary, 20);
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
    await Animation.typeLines(dom.contentExecute, execResult.thinking, 35, 150);

    // 显示执行报告
    await Animation.typeWriter(dom.contentExecute, '\n' + execResult.result.report, 15);
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
    resetPanels();
    currentData = null;
    dom.btnRun.innerHTML = '<span class="btn-icon">▶</span> 启动 Agent 协作';
    dom.btnRun.disabled = false;
    dom.btnAnalyze.innerHTML = '<span class="btn-icon">🔍</span> 解析提示词';
    dom.btnAnalyze.disabled = false;
    isRunning = false;
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
