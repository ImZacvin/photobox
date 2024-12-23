async function renameImage() {
    const contextMenu = document.getElementById('contextMenu');
    const imageId = contextMenu.dataset.imageId; // Retrieve the image ID from the context menu
  
    if (!imageId) {
      console.error('No image ID found for renaming!');
      return;
    }
  
    // Prompt the user for a new name
    const newName = prompt('Enter a new name for the image:');
  
    if (!newName) {
      console.error('No new name provided!');
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/photos/${imageId}`, {
        method: 'PUT', // or PUT depending on your backend implementation
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }), // Send the new name
      });
  
      if (!response.ok) {
        throw new Error('Failed to rename image');
      }
  
      console.log('Image renamed successfully:', newName);
      renderImageGrid(); // Refresh the grid to reflect the new name
    } catch (error) {
      console.error('Error renaming image:', error);
    }
  }
  