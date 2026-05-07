// ===== AI Sight =====
// app.js — 主逻辑：事件绑定、流程控制

(function () {
  'use strict';

  // ===== DOM 元素 =====
  const dom = {
    input: document.getElementById('user-input'),
    btnRun: document.getElementById('btn-run'),
    presetBtns: document.querySelectorAll('.preset-btn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    panels: document.querySelectorAll('.tab-panel'),
    // 输出区域
    contentUnderstand: document.getElementById('content-understand'),
    contentGenerate: document.getElementById('content-generate'),
    contentExecute: document.getElementById('content-execute'),
    // 提示词输出
    promptMj: document.getElementById('prompt-mj'),
    promptKling: document.getElementById('prompt-kling'),
    promptSuno: document.getElementById('prompt-suno'),
    contentSummary: document.getElementById('content-summary'),
    // 底部状态
    footerStatus: document.getElementById('footer-status'),
    // 弹窗
    modalApply: document.getElementById('modal-apply'),
    modalHow: document.getElementById('modal-how'),
    btnApply: document.getElementById('btn-apply'),
    btnHow: document.getElementById('btn-howitworks'),
    modalCloseApply: document.getElementById('modal-close-apply'),
    modalCloseHow: document.getElementById('modal-close-how'),
    // 复制按钮
    copyMj: document.getElementById('copy-mj'),
    copyKling: document.getElementById('copy-kling'),
    copySuno: document.getElementById('copy-suno'),
    copySummary: document.getElementById('copy-summary'),
    copyApplyAll: document.getElementById('copy-apply-all'),
    // 操作按钮
    btnExportAll: document.getElementById('btn-export-all'),
    btnReset: document.getElementById('btn-reset'),
  };

  // ===== 状态 =====
  let currentData = null; // 存储当前生成结果
  let isRunning = false;

  // ===== 初始化 =====
  function init() {
    // 绑定启动按钮
    dom.btnRun.addEventListener('click', startFlow);

    // 绑定示例按钮
    dom.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.input.value = btn.getAttribute('data-prompt');
        startFlow();
      });
    });

    // 绑定 Tab 切换
    dom.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    // 绑定弹窗
    dom.btnApply.addEventListener('click', () => {
      dom.modalApply.style.display = 'flex';
    });
    dom.btnHow.addEventListener('click', () => {
      dom.modalHow.style.display = 'flex';
    });
    dom.modalCloseApply.addEventListener('click', () => {
      dom.modalApply.style.display = 'none';
    });
    dom.modalCloseHow.addEventListener('click', () => {
      dom.modalHow.style.display = 'none';
    });

    // 点击遮罩关闭弹窗
    [dom.modalApply, dom.modalHow].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    });

    // 绑定复制按钮
    dom.copyMj.addEventListener('click', () => copyText(dom.promptMj.textContent));
    dom.copyKling.addEventListener('click', () => copyText(dom.promptKling.textContent));
    dom.copySuno.addEventListener('click', () => copyText(dom.promptSuno.textContent));
    dom.copySummary.addEventListener('click', () => copyText(dom.contentSummary.textContent));
    dom.copyApplyAll.addEventListener('click', copyApplyText);

    // 绑定操作按钮
    dom.btnExportAll.addEventListener('click', exportAll);
    dom.btnReset.addEventListener('click', resetAll);

    updateFooter('就绪 · 输入创作需求后点击「启动 Agent 协作」');
  }

  // ===== 启动流程 =====
  async function startFlow() {
    const input = dom.input.value.trim();
    if (!input) {
      dom.input.focus();
      dom.input.style.borderColor = '#ef4444';
      setTimeout(() => dom.input.style.borderColor = '', 1500);
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
    dom.contentSummary.textContent = '等待生成...';
  }

  // ===== 重置全部 =====
  function resetAll() {
    dom.input.value = '';
    resetPanels();
    currentData = null;
    dom.btnRun.innerHTML = '<span class="btn-icon">▶</span> 启动 Agent 协作';
    dom.btnRun.disabled = false;
    isRunning = false;
    updateFooter('就绪 · 输入创作需求后点击「启动 Agent 协作」');
    switchTab('mj');
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

  function copyApplyText() {
    const text = `项目名称：AI Sight — 多 Agent 提示词工程工作台\n\n项目解决的核心痛点：\nAI 创作者在多模型协作（Midjourney + Kling + Suno 等）中面临提示词管理混乱、版本迭代困难、跨工具提示词适配成本高的痛点。现有工具多为单一模型优化，缺乏系统化的提示词工程工作流。\n\n核心逻辑流（长链推理 / 多 Agent 协作）：\n项目采用三 Agent 协作架构：理解 Agent 负责解析用户创作需求并拆解为结构化任务；生成 Agent 针对每个 AI 工具的特性生成专用提示词，支持多版本迭代优化；执行 Agent 模拟完整工具链调用流程并可视化展示。三个 Agent 通过共享上下文实现长链推理，用户输入一个创作需求，系统自动完成需求理解 → 提示词生成 → 工作流模拟的全链路处理。\n\n实际效果（落地情况、数据）：\n项目采用纯前端架构，零 API 成本即可运行，已内置多组典型创作场景的完整输出示例。后续可无缝接入 MiMo API 替换模拟推理，实现真实 AI 驱动。项目可直接演示多 Agent 协作的完整工作流，适合作为 Agent 生态建设的参考案例。`;
    copyText(text);
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
