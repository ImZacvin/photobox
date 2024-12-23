function showContextMenu(event) {
    event.preventDefault();
    const contextMenu = document.getElementById('contextMenu');
    const imageBox = event.target.closest('.image-box');
    
    if (!imageBox) {
      console.error('Image box not found!');
      return;
    }
    
    const imageId = imageBox.dataset.imageId;
  
    if (!imageId) {
      console.error('Image ID not found in dataset!');
      return;
    }
  
    contextMenu.dataset.imageId = imageId;
  
    const buttonRect = event.target.getBoundingClientRect();
    contextMenu.style.left = `${buttonRect.left - 100}px`;
    contextMenu.style.top = `${buttonRect.top}px`;
    contextMenu.style.display = 'block';
  }

// Hide the context menu when clicking outside
document.addEventListener('click', function (event) {
    const contextMenu = document.getElementById('contextMenu');
    if (!contextMenu.contains(event.target) && !event.target.closest('.image-option')) {
      contextMenu.style.display = 'none';
    }
  });