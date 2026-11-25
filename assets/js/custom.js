/*
 * 사이드바 카테고리 트리 (_includes/nav_list_main)
 * - 사용자가 펼치거나 접은 상태를 localStorage 에 기억해서 다른 글로 이동해도 유지
 * - 지금 보고 있는 글의 카테고리(data-current)는 항상 펼친 상태로 시작
 * - 사이드바가 길면 지금 보고 있는 글이 보이도록 사이드바만 스크롤
 */
(function () {
  var nav = document.querySelector('.docs-nav');
  if (!nav) return;

  var STORAGE_KEY = 'docsNavOpenState';
  var state = {};
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    state = {};
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* 저장이 막힌 환경(시크릿 모드 등)에서는 기억만 안 함 */
    }
  }

  var groups = nav.querySelectorAll('details[data-nav-id]');
  Array.prototype.forEach.call(groups, function (details) {
    var id = details.getAttribute('data-nav-id');

    // 지금 글의 경로가 아닌 그룹은 마지막으로 둔 상태 복원
    if (!details.hasAttribute('data-current') && Object.prototype.hasOwnProperty.call(state, id)) {
      details.open = state[id];
    }

    details.addEventListener('toggle', function () {
      state[id] = details.open;
      save();
    });
  });

  // 지금 보고 있는 글이 사이드바 화면 안에 보이도록 스크롤
  var active = nav.querySelector('a.active');
  var sidebar = nav.closest('.sidebar');
  if (active && sidebar && sidebar.scrollHeight > sidebar.clientHeight) {
    var offset = active.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
    sidebar.scrollTop += offset - sidebar.clientHeight / 3;
  }
})();
