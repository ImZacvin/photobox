const API_BASE_URL = 'https://sigmaboy.cloud';

// Function to fetch photos from the backend
async function getPhotos() {
  try {
    const token = localStorage.getItem('authToken');  // Get the token from localStorage

    // Fetch photos from the /photos API with the Authorization header
    const response = await fetch(`${API_BASE_URL}/photos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Make sure the token is added correctly
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('Photos fetched:', data);  // Log the entire data for debugging

    return data;  // Return the array of photos
  } catch (error) {
    console.error('Error fetching photos:', error);  // Handle error
    return [];  // Return empty array in case of error
  }
}

// Function to process and display photos
async function renderImageGrid() {
  const photos = await getPhotos();  // Fetch the photos

  // Check if no photos are found
  if (photos.length === 0) {
    document.querySelector('.js-images-grid').innerHTML = '<p>No images available.</p>';
    return;
  }

  // Loop over the fetched photos and create HTML for each one
  let imagesHTML = '';
  photos.forEach((photo) => {
    imagesHTML += `
      <div class="image-box" data-image-id="${photo.id}">
        <div class="image">
          <img class="images" src="${photo.url}" alt="${photo.name}">
        </div>
        <div class="image-info">
          <div class="image-type">
            <i class="fa-regular fa-file-image"></i>
          </div>
          <div class="image-name-size">
            <div class="image-name">
              <p>${photo.name}</p>
            </div>
            <div class="image-size">
              <p>${(photo.size / 1000000).toFixed(2)} MB</p>
            </div>
          </div>
          <div class="image-option" onclick="showContextMenu(event)">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </div>
        </div>
      </div>
      
      <!-- Context Menu -->
      <div class="context-menu" id="contextMenu">
        <ul>
          <li onclick="renameImage()">Rename</li>
          <li onclick="deleteImage()">Delete</li>
          <li onclick="moveImage()">Move</li>
        </ul>
      </div>
        </div>
      </div>
    </div>
    `;
  });

  // Insert the generated HTML into the page
  document.querySelector('.js-images-grid').innerHTML = imagesHTML;
}

// Call the renderImageGrid function when the page loads
document.addEventListener('DOMContentLoaded', renderImageGrid);
