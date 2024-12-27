

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

  // Function to format ISO date to a readable format
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleString(); // Adjust for your preferred locale
  }

  // Loop over the fetched photos and create HTML for each one
  let imagesHTML = '';
  photos.forEach((photo) => {
    imagesHTML += `
      <div class="image-box" data-image-id="${photo.id}">
        <div class="image" onclick="openImageModal('${photo.url}', '${photo.name}', '${photo.createdAt}')">
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
          <div class="image-option" onclick="showContextMenuImage(event, '${photo.id}')">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </div>
        </div>
      </div>
      
      <!-- Context Menu -->
      <div class="context-menuIm" id="contextMenuIm-${photo.id}">
        <ul>
          <li onclick="renameImage('${photo.id}', '${photo.name}')">Rename</li>
          <li onclick="deleteImage('${photo.id}')">Delete</li>
          <li onclick="downloadImage('${photo.url}', '${photo.name}')">Download</li>
        </ul>
      </div>
    `;
  });

  // Insert the generated HTML into the page
  document.querySelector('.js-images-grid').innerHTML = imagesHTML;
}

// Call the renderImageGrid function when the page loads
document.addEventListener('DOMContentLoaded', renderImageGrid);

// Function to open modal
function openImageModal(url, name, createdAt) {
  const modal = document.getElementById('image-form-modal');
  modal.querySelector('.image-modal img').src = url;
  modal.querySelector('.image-name-modal p').textContent = name;
  modal.querySelector('.image-created-modal p').textContent = `Created At: ${createdAt}`;
  modal.querySelector('.download-button').setAttribute('href', url);
  modal.querySelector('.download-button').setAttribute('download', name);
  modal.style.display = 'flex';
}

// Function to close modal
function closeImageModal() {
  const modal = document.getElementById('image-form-modal');
  modal.style.display = 'none';
}

function downloadImage(fileUrl, fileName) {
  const a = document.createElement('a');
  a.href = fileUrl;  // URL to the image file
  a.download = fileName;  // Set the filename for the download
  
  // Set the anchor to trigger the download
  a.style.display = 'none';  // Hide the element
  document.body.appendChild(a);  // Append the element to the body
  
  a.click();  // Trigger the download

  document.body.removeChild(a);  // Clean up by removing the anchor tag
}

