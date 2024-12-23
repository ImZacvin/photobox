async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('You need to log in first!');
    window.location.href = 'login.html'; // Redirect to login if no token
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);

  // Optional: Only add 'folderId' if it's needed
  // If folderId can be left blank or null, you can either not append it or append 'null'
  // formData.append('folderId', null);  // If the folderId should be null
  // Or simply do nothing if it's not required

  // Log the formData contents to verify
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  try {
    const response = await fetch('http://localhost:3000/photos/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error uploading photo:', errorText);
      throw new Error(`Failed to upload photo: ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    renderImageGrid();  // Render image grid after successful upload
  } catch (error) {
    console.error('Error uploading photo:', error);
    alert('Failed to upload photo. Please try again.');
  }
}



// This function triggers the hidden file input when the button is clicked
function triggerFileInput() {
  document.getElementById('file-input-upload').click();  // Use the correct ID here
}

