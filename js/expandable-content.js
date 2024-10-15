function toggleExpandableContent(id) {
  const content = document.getElementById(id);

  // Toggle visibility
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
  } else {
    content.style.display = 'none';
  }
}