// ===== AI Sight =====
// animation.js — 打字机效果 + SVG 流程动画

const Animation = {
  // 打字机效果：逐字显示文字
  typeWriter(element, text, speed = 30) {
    return new Promise((resolve) => {
      // 用 textNode + cursor 双节点方案，避免 innerHTML += 每次重建 DOM 导致 cursor 引用失效
      element.innerHTML = '';
      const textNode = document.createTextNode('');
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      element.appendChild(textNode);
      element.appendChild(cursor);

      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          textNode.textContent += text[i];
          i++;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            cursor.remove();
            resolve();
          }, 500);
        }
      }, speed);
    });
  },

  // 逐行打字机（用于多行输出，保留已有内容，依次追加新行）
  typeLines(element, lines, lineSpeed = 40, lineDelay = 200) {
    return new Promise((resolve) => {
      let lineIndex = 0;

      const addLine = () => {
        if (lineIndex >= lines.length) {
          resolve();
          return;
        }
        const line = lines[lineIndex];
        const lineEl = document.createElement('div');
        lineEl.style.minHeight = '1.4em';
        element.appendChild(lineEl);
        lineIndex++;

        this.typeWriter(lineEl, line, lineSpeed).then(() => {
          setTimeout(addLine, lineDelay);
        });
      };

      addLine();
    });
  },

  // 激活 Agent 节点（SVG 高亮）
  activateNode(nodeId) {
    const node = document.getElementById(nodeId);
    if (node) {
      node.classList.add('active');
      node.setAttribute('stroke-width', '3');
    }
  },

  // 重置所有节点
  resetNodes() {
    ['node-understand', 'node-generate', 'node-execute'].forEach(id => {
      const node = document.getElementById(id);
      if (node) {
        node.classList.remove('active');
        node.setAttribute('stroke-width', '2');
      }
    });
    // 重置箭头
    ['arrow1', 'arrowhead1', 'arrow2', 'arrowhead2', 'arrow3', 'arrowhead3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('arrow-active');
        el.style.opacity = '0.3';
      }
    });
    // 隐藏粒子
    ['particle1', 'particle2', 'particle3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = '0';
      }
    });
  },

  // 激活箭头动画
  activateArrow(arrowId, headId, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const arrow = document.getElementById(arrowId);
        const head = document.getElementById(headId);
        if (arrow) {
          arrow.classList.add('arrow-active');
          arrow.style.opacity = '1';
        }
        if (head) {
          head.classList.add('arrow-active');
          head.style.opacity = '1';
        }
        resolve();
      }, delay);
    });
  },

  // 发射粒子动画
  emitParticle(particleId, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const p = document.getElementById(particleId);
        if (p) {
          p.style.opacity = '1';
          p.style.transition = 'all 1.2s ease-in';
          if (particleId === 'particle1') {
            p.setAttribute('cy', '155');
          } else if (particleId === 'particle2') {
            p.setAttribute('cy', '295');
          } else if (particleId === 'particle3') {
            p.setAttribute('cx', '360');
          }
          setTimeout(() => {
            p.style.opacity = '0';
            resolve();
          }, 1300);
        } else {
          resolve();
        }
      }, delay);
    });
  },

  // 完整流程动画
  async runFlowAnimation() {
    this.resetNodes();

    this.activateNode('node-understand');
    await this.sleep(400);
    await this.emitParticle('particle1');
    await this.activateArrow('arrow1', 'arrowhead1');

    this.activateNode('node-generate');
    await this.sleep(400);
    await this.emitParticle('particle2');
    await this.activateArrow('arrow2', 'arrowhead2');

    this.activateNode('node-execute');
    await this.sleep(400);
    await this.emitParticle('particle3');
    await this.activateArrow('arrow3', 'arrowhead3');
  },

  // 更新 Agent 状态标签
  setAgentStatus(agentId, status, text) {
    const el = document.getElementById(`status-${agentId}`);
    if (el) {
      el.textContent = text;
      el.className = `agent-status ${status}`;
    }
    const outputEl = document.getElementById(`output-${agentId}`);
    if (outputEl) {
      if (status === 'running') {
        outputEl.classList.add('active');
      } else if (status === 'done') {
        outputEl.classList.add('active');
      }
    }
  },

  // 重置所有 Agent 状态
  resetAllStatus() {
    ['understand', 'generate', 'execute'].forEach(id => {
      this.setAgentStatus(id, '', '等待中');
      const outputEl = document.getElementById(`output-${id}`);
      if (outputEl) outputEl.classList.remove('active');
      const contentEl = document.getElementById(`content-${id}`);
      if (contentEl) contentEl.innerHTML = '';
    });
  },

  // 工具函数：sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 工具函数：转义 HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
