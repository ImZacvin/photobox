// Function to fetch folders from the backend
async function getFolders() {
    try {
      const token = localStorage.getItem('authToken');  // Get the token from localStorage
  
      // Fetch folders from the /folders API with the Authorization header
      const response = await fetch(`${API_BASE_URL}/folders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Make sure the token is added correctly
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }
  
      // Parse the JSON response
      const data = await response.json();
      console.log('Folders fetched:', data);  // Log the entire data for debugging
  
      return data;  // Return the array of folders
    } catch (error) {
      console.error('Error fetching folders:', error);  // Handle error
      return [];  // Return empty array in case of error
    }
  }
  
  // Function to process and display folders
  async function renderFolderGrid() {
    const folders = await getFolders();  // Fetch the folders
  
    // Check if no folders are found
    if (folders.length === 0) {
      document.querySelector('.js-folders-grid').innerHTML = '<p>No folders available.</p>';
      return;
    }
  
    // Loop over the fetched folders and create HTML for each one
    let foldersHTML = '';
    folders.forEach((folder) => {
      // Generate HTML for each folder and make it clickable
      foldersHTML += `
        <div class="folder-button" data-folder-id="${folder.id}">
          <div class="folder-svg">
            <i class="fa-regular fa-folder"></i>
          </div>
          <div class="folder-title">
            ${folder.name}
          </div>
        </div>
      `;
    });
  
    // Insert the generated HTML into the page
    document.querySelector('.js-folders-grid').innerHTML = foldersHTML;
  
    // Add click event listeners to each folder button
    const folderButtons = document.querySelectorAll('.folder-button');
    folderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const folderId = button.getAttribute('data-folder-id');
        window.location.href = `/folder/${folderId}`;  // Redirect to the folder page
      });
    });
  }
  
  // Call the renderFolderGrid function when the page loads
  document.addEventListener('DOMContentLoaded', renderFolderGrid);
  