async function deleteImage() {
    const contextMenu = document.getElementById('contextMenu');
    const imageId = contextMenu.dataset.imageId; // Retrieve the image ID from the context menu dataset
  
    if (!imageId) {
      alert('No image selected for deletion.');
      return;
    }
  
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  
    if (!token) {
      alert('You are not logged in. Please log in and try again.');
      return;
    }
  
    try {
      // Make the DELETE request
      const response = await fetch(`${API_BASE_URL}/photos/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert('Photo deleted successfully!');
        // Remove the corresponding image-box from the UI
        const imageBox = document.querySelector(`.image-box[data-image-id="${imageId}"]`);
        if (imageBox) {
          imageBox.remove();
        }
      } else {
        alert('Failed to delete the photo.');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('An error occurred while deleting the photo. Please try again.');
    }
  
    // Hide the context menu
    contextMenu.style.display = 'none';
  }
  