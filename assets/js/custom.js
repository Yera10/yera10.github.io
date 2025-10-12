// 카테고리 토글 함수
function toggleCategory(categoryId) {
  const element = document.getElementById('cat-' + categoryId);
  const icon = document.getElementById('icon-' + categoryId);
  
  if (element.style.display === 'none') {
    element.style.display = 'block';
    icon.textContent = '▼';
  } else {
    element.style.display = 'none';
    icon.textContent = '▶';
  }
}