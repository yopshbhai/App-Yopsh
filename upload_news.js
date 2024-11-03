const imgbbApiKey = 'd524b55a2d4e0701e1706a7924c10e0c';
    const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbwCIE4LJzxa_zpPTYlO0ZhVAu8vOY8XnfBWHepb6EQIpVjeNOkB09TU5Ts5sbL6iAgh/exec'; // Replace YOUR_DEPLOY_CODE with the actual deployment code

    document.addEventListener('DOMContentLoaded', () => {
      // Fetch username from local storage and set it in the username input field
      const username = localStorage.getItem('YopshLoc_Username') || 'Anonymous';
      document.getElementById('username').value = username;
    });

    document.getElementById('newsForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      // Show the loader
      document.getElementById('loader').style.display = 'block';

      // Clear previous messages
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = '';
      messageDiv.className = 'message';

      const username = document.getElementById('username').value;
      const title = document.getElementById('title').value;
      const news = document.getElementById('news').value;
      const memeImage = document.getElementById('memeImage').files[0];

      if (!memeImage) {
        messageDiv.textContent = 'Please upload an image.';
        messageDiv.classList.add('error');
        document.getElementById('loader').style.display = 'none';
        return;
      }

      try {
        // Upload image to Imgbb
        const formData = new FormData();
        formData.append('image', memeImage);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: 'POST',
          body: formData
        });

        const imgbbData = await imgbbResponse.json();

        if (!imgbbData.success) {
          throw new Error('Image upload failed');
        }

        const imageUrl = imgbbData.data.url;

        // Prepare data to send to Google Sheets
        const postData = {
          username: username,
          title: title,
          news: news,
          imageUrl: imageUrl
        };

        // Send data to Google Sheets using Google Apps Script
        await fetch(googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors', // Use no-cors to prevent CORS issues
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });

        // Hide the loader
        document.getElementById('loader').style.display = 'none';

        // Display success message
        messageDiv.textContent = 'News submitted successfully!';
        messageDiv.classList.add('success');

        // Reset the form
        document.getElementById('newsForm').reset();
        document.getElementById('username').value = username; // Reset username field
      } catch (error) {
        console.error('Error:', error);
        
        // Display error message
        messageDiv.textContent = 'Failed to submit meme. Please try again.';
        messageDiv.classList.add('error');

        // Hide the loader
        document.getElementById('loader').style.display = 'none';
      }
    });