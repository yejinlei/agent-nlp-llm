/* ===== agent-nlp-llm 全站统一公式渲染器 =====
   解决三类问题：
   1) auto-render 是 defer 加载，site.js 立即执行时它还没就绪 -> 漏渲染
   2) 各页定界符不统一（有的只用 $...$，有的用 \(...\)）-> 部分公式裸奔
   3) 动态插入的内容（交互面板）公式不会被自动渲染
   做法：等待 KaTeX 就绪 + 多定界符 + 定时重试 + MutationObserver 兜底
*/
(function () {
  'use strict';

  var DELIMS = [
    { left: '$$', right: '$$', display: true },
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ];

  function tryRender() {
    if (!window.renderMathInElement) return false;
    try {
      renderMathInElement(document.body, {
        delimiters: DELIMS,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
        throwOnError: false,
        errorColor: '#c00'
      });
    } catch (e) { /* ignore */ }
    return true;
  }

  // 等待 KaTeX 就绪；最多重试 40 次（约 6 秒），覆盖 CDN 慢的情况
  var tries = 0;
  function boot() {
    if (tryRender()) return;
    if (++tries > 40) return;
    setTimeout(boot, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', boot);

  // 兜底：页面里后续动态插入的公式（如交互面板）也能渲染
  if (window.MutationObserver) {
    var timer = null;
    var mo = new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        // 只处理新增且尚未渲染的节点，避免整页重复渲染
        tryRender();
      }, 200);
    });
    var startObserve = function () {
      if (document.body) mo.observe(document.body, { childList: true, subtree: true });
    };
    if (document.body) startObserve();
    else document.addEventListener('DOMContentLoaded', startObserve);
  }

  // 暴露给页面手动调用（例如交互后重算公式）
  window.renderAllMath = tryRender;
})();
