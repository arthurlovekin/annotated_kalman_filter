function toggleExpandableContent(id) {
  const content = document.getElementById(id);

  // Toggle visibility
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
  } else {
    content.style.display = 'none';
  }
}

function activateButtonsAndContent(onButtonIds, onContentIds, offButtonIds, offContentIds) {
  onButtonIds.forEach(id => {
    const button = document.getElementById(id);
    button.classList.add('active-button');
    button.classList.remove('inactive-button');
  });
  offButtonIds.forEach(id => {
    const button = document.getElementById(id);
    button.classList.remove('active-button');
    button.classList.add('inactive-button');
  });
  onContentIds.forEach(id => {
    const content = document.getElementById(id);
    content.style.display = 'block';
  });
  offContentIds.forEach(id => {
    const content = document.getElementById(id);
    content.style.display = 'none';
  });
}
