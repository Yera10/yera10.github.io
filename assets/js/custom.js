/*
 * 사이드바 카테고리 트리 (_includes/nav_list_main)
 * 1) 펼침/접힘 상태 기억
 *    - 사용자가 펼치거나 접은 상태를 localStorage 에 기억해서 다른 글로 이동해도 유지
 *    - 지금 보고 있는 글의 카테고리(data-current)는 항상 펼친 상태로 시작
 *    - 사이드바가 길면 지금 보고 있는 글이 보이도록 사이드바만 스크롤
 * 2) 글 영역만 바꿔 끼우는 이동
 *    - 사이드바의 글 링크를 누르면 페이지 전체를 새로 불러오지 않고 #main 의 글 영역만 교체
 *    - 주소창, 뒤로/앞으로 가기, 탭 제목은 일반 이동처럼 동작
 *    - 문제가 생기면 일반 페이지 이동으로 대신 처리
 */
(function () {
  'use strict';

  var nav = document.querySelector('.docs-nav');
  if (!nav) return;

  var forEach = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* ---------- 1) 펼침/접힘 상태 기억 ---------- */

  var STORAGE_KEY = 'docsNavOpenState';
  var state = {};
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    state = {};
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* 저장이 막힌 환경(시크릿 모드 등)에서는 기억만 안 함 */
    }
  }

  forEach(nav.querySelectorAll('details[data-nav-id]'), function (details) {
    var id = details.getAttribute('data-nav-id');

    // 지금 글의 경로가 아닌 그룹은 마지막으로 둔 상태 복원
    if (!details.hasAttribute('data-current') && Object.prototype.hasOwnProperty.call(state, id)) {
      details.open = state[id];
    }

    details.addEventListener('toggle', function () {
      state[id] = details.open;
      saveState();
    });
  });

  var sidebar = nav.closest('.sidebar');

  // 지금 보고 있는 글이 사이드바 화면 안에 보이도록 사이드바만 스크롤
  function scrollSidebarToActive() {
    var active = nav.querySelector('a.active');
    if (!active || !sidebar || sidebar.scrollHeight <= sidebar.clientHeight) return;
    var top = active.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
    if (top < 0 || top > sidebar.clientHeight - 40) {
      sidebar.scrollTop += top - sidebar.clientHeight / 3;
    }
  }

  scrollSidebarToActive();

  /* ---------- 2) 글 영역만 바꿔 끼우는 이동 ---------- */

  var main = document.getElementById('main');
  if (!main || !window.fetch || !window.DOMParser || !window.history || !history.pushState) return;

  var currentPath = location.pathname;
  var pending = null;

  // #main 안에서 왼쪽 사이드바를 뺀 나머지(글 본문, 관련 글 등)가 교체 대상
  function isLeftSidebar(el) {
    return el.classList && el.classList.contains('sidebar');
  }

  // 사이드바에서 지금 글 표시 옮기기
  function setActive(path) {
    forEach(nav.querySelectorAll('a.active'), function (a) {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });
    forEach(nav.querySelectorAll('.docs-nav__post a'), function (a) {
      if (a.pathname !== path) return;
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
      // 이 글이 들어 있는 카테고리 펼치기
      for (var d = a.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) {
        d.open = true;
      }
    });
    scrollSidebarToActive();
  }

  // innerHTML 로 들어간 <script> 는 실행되지 않으므로 새로 만들어서 실행
  function runScripts(root) {
    forEach(root.querySelectorAll('script'), function (old) {
      var s = document.createElement('script');
      forEach(old.attributes, function (attr) { s.setAttribute(attr.name, attr.value); });
      s.text = old.text;
      old.parentNode.replaceChild(s, old);
    });
  }

  // 페이지를 처음 열 때 테마(main.min.js)와 플러그인이 하던 작업을 새 글에 다시 적용
  function enhanceContent() {
    var $ = window.jQuery;

    // 동영상 비율 맞추기
    if ($ && $.fn.fitVids) $(main).fitVids();

    // 이미지 클릭 시 크게 보기
    if ($ && $.fn.magnificPopup) {
      $(main).find("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']")
        .has('> img').addClass('image-popup');
      $(main).find('.image-popup').magnificPopup({
        type: 'image',
        gallery: { enabled: true, navigateByImgClick: true, preload: [0, 1] },
        removalDelay: 500,
        mainClass: 'mfp-zoom-in',
        closeOnContentClick: true,
        midClick: true
      });
    }

    // 제목 옆 링크 아이콘
    var content = main.querySelector('.page__content');
    if (content) {
      forEach(content.querySelectorAll('h1, h2, h3, h4, h5, h6'), function (h) {
        var id = h.getAttribute('id');
        if (!id || h.querySelector('.header-link')) return;
        var anchor = document.createElement('a');
        anchor.className = 'header-link';
        anchor.href = '#' + id;
        anchor.title = 'Permalink';
        anchor.innerHTML = '<span class="sr-only">Permalink</span><i class="fas fa-link"></i>';
        h.appendChild(anchor);
      });
    }

    // 오른쪽 목차(TOC)에서 지금 읽는 위치 표시
    if (window.Gumshoe && main.querySelector('nav.toc')) {
      new window.Gumshoe('nav.toc a', {
        navClass: 'active',
        contentClass: 'active',
        nested: false,
        nestedClass: 'active',
        offset: 20,
        reflow: true,
        events: true
      });
    }

    // Mermaid 다이어그램
    var mermaid = window.mermaid;
    if (mermaid && main.querySelector('.mermaid')) {
      try {
        if (mermaid.run) {
          var p = mermaid.run({ querySelector: '#main .mermaid' });
          if (p && p.catch) p.catch(function (e) { console.error(e); });
        } else if (mermaid.init) {
          mermaid.init(undefined, '#main .mermaid');
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 수식 (MathJax 가 이미 로드된 경우만. 없으면 swap 전에 일반 이동으로 처리)
    var MathJax = window.MathJax;
    if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, main]);
    } else if (MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([main]);
    }
  }

  function scrollAfterSwap(url) {
    var hash = new URL(url, location.href).hash;
    var target = null;
    if (hash) {
      try {
        target = document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch (e) {
        target = null;
      }
    }
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }

  function swapTo(url, push) {
    if (pending && pending.abort) pending.abort();
    var ctrl = window.AbortController ? new AbortController() : null;
    pending = ctrl;
    document.documentElement.classList.add('docs-nav-loading');

    fetch(url, { credentials: 'same-origin', signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newMain = doc.getElementById('main');

        // 같은 레이아웃(사이드바 트리가 있는 글)이 아니면 일반 이동
        if (!newMain || !newMain.querySelector('.docs-nav')) throw new Error('different layout');
        // 수식이 있는 글인데 지금 페이지에 MathJax 가 없으면 일반 이동
        if (!window.MathJax && doc.querySelector('script[src*="MathJax"], script[src*="mathjax"]')) {
          throw new Error('needs MathJax');
        }

        // 왼쪽 사이드바는 그대로 두고 나머지만 교체
        forEach(Array.prototype.slice.call(main.children), function (el) {
          if (!isLeftSidebar(el)) main.removeChild(el);
        });
        forEach(Array.prototype.slice.call(newMain.children), function (el) {
          if (!isLeftSidebar(el)) main.appendChild(document.importNode(el, true));
        });

        document.title = doc.title;
        if (doc.body) document.body.className = doc.body.className;
        var desc = doc.querySelector('meta[name="description"]');
        var curDesc = document.querySelector('meta[name="description"]');
        if (desc && curDesc) curDesc.setAttribute('content', desc.getAttribute('content'));

        if (push) history.pushState({ docsNav: true }, '', url);
        currentPath = location.pathname;

        // 모바일에서 열려 있던 카테고리 메뉴 닫기
        var menuToggle = document.getElementById('ac-toc');
        if (menuToggle) menuToggle.checked = false;

        setActive(currentPath);
        scrollAfterSwap(url);
        runScripts(main);
        enhanceContent();
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return;
        window.location.href = url;
      })
      .then(function () {
        if (pending === ctrl) {
          pending = null;
          document.documentElement.classList.remove('docs-nav-loading');
        }
      });
  }

  // 사이드바의 글 링크 클릭 가로채기 (새 탭 열기 등은 그대로 둠)
  nav.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.docs-nav__post a');
    if (!a) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.origin !== location.origin) return;

    e.preventDefault();
    if (a.pathname === currentPath) {
      window.scrollTo(0, 0);
      return;
    }
    swapTo(a.href, true);
  });

  // 뒤로/앞으로 가기: 다른 글로 바뀐 경우만 글 영역 교체 (같은 글 안의 # 이동은 그대로)
  history.replaceState(history.state || { docsNav: true }, '', location.href);
  window.addEventListener('popstate', function () {
    if (location.pathname !== currentPath) swapTo(location.href, false);
  });
})();
