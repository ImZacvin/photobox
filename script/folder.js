const API_BASE_URL = 'http://localhost:3000';

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

// Function to build hierarchy from flat folder list
function buildHierarchy(flatFolders) {
  const folderMap = {}; // Map for quick lookup of folders by ID
  const hierarchy = []; // Array to hold the root-level folders

  // Initialize the folder map
  flatFolders.forEach(folder => {
    folderMap[folder.id] = { ...folder, children: [] };
  });

  // Build the hierarchy
  flatFolders.forEach(folder => {
    if (folder.parentId === null) {
      // Root-level folder
      hierarchy.push(folderMap[folder.id]);
    } else if (folderMap[folder.parentId]) {
      // Add to the parent's children array
      folderMap[folder.parentId].children.push(folderMap[folder.id]);
    }
  });

  return hierarchy; // Return the root-level folders with nested children
}

// Main function to fetch and process folders
async function processFolders() {
  const flatFolders = await getFolders(); // Fetch the flat folder list
  const hierarchy = buildHierarchy(flatFolders); // Build the hierarchy
  console.log('Folder hierarchy:', hierarchy); // Log the hierarchy for debugging
}

// Call the main function
processFolders();

// Function to process and display folders
async function renderFolderGrid() {
  const folders = await getFolders();  // Fetch the folders

  // Check if no folders are found
  if (folders.length === 0) {
    document.querySelector('.js-folders-grid').innerHTML = '<p>No folders available.</p>';
    return;
  }

  let foldersHTML = '';
  folders.forEach((folder) => {
    const contextMenuId = `contextMenu-${folder.id}`; // Unique context menu ID
    foldersHTML += `
      <div class="folder-button" data-folder-id="${folder.id}">
        <div class="folder-svg">
          <i class="fa-regular fa-folder"></i>
        </div>
        <div class="folder-title">
          ${folder.name}
        </div>
        <div class="folder-option" onclick="showContextMenuFolder(event, '${folder.id}')">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>
        
        <!-- Unique Context Menu -->
        <div class="context-menu" id="contextMenu-${folder.id}" style="display: none;">
          <ul>
            <li onclick="renameFolder('${folder.id}', '${folder.name}')">Rename</li>
            <li onclick="deleteFolder('${folder.id}')">Delete</li>
            <li onclick="downloadFolder('${folder.id}', '${folder.name}')">Download</li>
          </ul>
        </div>
      </div>
    `;
  });


  // Insert the generated HTML into the page
  document.querySelector('.js-folders-grid').innerHTML = foldersHTML;
}

// Call the renderFolderGrid function when the page loads
document.addEventListener('DOMContentLoaded', renderFolderGrid);

function closeFolderModal() {
  const modal = document.getElementById('folder-form-modal');
  modal.style.display = 'none';
}

// Download Folder Function
function downloadFolder(folderId, folderName) {
  const downloadUrl = `${API_BASE_URL}/folders/${folderId}/download`;  // URL should trigger the download of the folder (backend should handle this)
  const a = document.createElement('a');
  a.href = downloadUrl;  // URL for the folder download
  a.download = folderName;  // The folder will be downloaded with this name
  
  // Trigger the download
  a.click();
}

// Rename Folder Function
function renameFolder(folderId, oldName) {
  const newName = prompt('Enter new folder name:', oldName);
  if (newName) {
    // You need to make an API call to rename the folder on the backend
    fetch(`${API_BASE_URL}/folders/${folderId}/rename`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ newName }),
    })
    .then(response => response.json())
    .then(data => {
      alert('Folder renamed successfully');
      renderFolderGrid();  // Re-render the folder grid to reflect changes
    })
    .catch(error => console.error('Error renaming folder:', error));
  }
}

// Delete Folder Function
function deleteFolder(folderId) {
  if (confirm('Are you sure you want to delete this folder?')) {
    // You need to make an API call to delete the folder from the backend
    fetch(`${API_BASE_URL}/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      alert('Folder deleted successfully');
      renderFolderGrid();  // Re-render the folder grid to reflect changes
    })
    .catch(error => console.error('Error deleting folder:', error));
  }
}