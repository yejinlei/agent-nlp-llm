/* ===== agent-nlp-llm 全站公共脚本 ===== */
(function () {
  'use strict';

  // 1. 目录高亮（滚动联动）
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length) {
    var secs = tocLinks
      .map(function (a) {
        var el = document.getElementById(a.getAttribute('href').slice(1));
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);

    function onScroll() {
      var y = window.scrollY + 130;
      var cur = secs.length ? secs[0] : null;
      secs.forEach(function (s) { if (s.el.offsetTop <= y) cur = s; });
      tocLinks.forEach(function (a) { a.classList.remove('on'); });
      if (cur) cur.link.classList.add('on');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. 平滑锚点跳转（适配固定导航高度）
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: 'smooth' });
      document.querySelectorAll('.nav-links').forEach(function (n) { n.classList.remove('open'); });
    });
  });

  // 3. 进入视口淡入
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('revealed'); });
  }

  // 4. KaTeX 自动渲染
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    } catch (e) { /* ignore */ }
  }
})();
