const URL = 'https://script.google.com/macros/s/AKfycbzFoGKdP4CjUmXcCAerficKqLGdH9lkJj6r3Tq4xlCJx0yWochAS1NJ0gZ8MFa5kno/exec';
    const username = localStorage.getItem('YopshLoc_Username');

    function loadPosts() {
      fetch(`${URL}?action=getPosts&username=${username}`)
      .then(response => response.json())
      .then(data => {
        const dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = '';
        data.forEach((row, index) => {
          const timestamp = new Date(row[0]);
          const timeAgo = timeSince(timestamp);
          const div = document.createElement('div');
          div.id = `post-${index}`;
          div.innerHTML = `
            <p class="title-class">Title: ${row[1]}</p>
            <img src="${row[2]}" class="image-another-class">
            <p class="time-class">Posted: ${timeAgo}</p>
            <button class="remove-btn" onclick="showAlert(${index}, '${row[1]}')">Remove</button>
            <hr>
          `;
          dataContainer.appendChild(div);
        });
      })
      .catch(error => console.error(error));
    }

    function showAlert(index, title) {
      const customAlert = document.getElementById('custom-alert');
      customAlert.style.display = 'block';

      document.getElementById('yes-btn').onclick = () => removePost(index, title);
      document.getElementById('abort-btn').onclick = () => customAlert.style.display = 'none';
    }

    function removePost(index, title) {
      fetch(`${URL}?action=removePost&username=${username}&title=${encodeURIComponent(title)}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById(`post-${index}`).style.display = 'none';
        } else {
          console.error('Failed to remove post');
        }
        document.getElementById('custom-alert').style.display = 'none';
      })
      .catch(error => console.error(error));
    }

    function timeSince(date) {
      const seconds = Math.floor((new Date() - date) / 1000);
      let interval = seconds / 31536000;

      if (interval > 1) return Math.floor(interval) + " years ago";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " minutes ago";
      return Math.floor(seconds) + " seconds ago";
    }

    loadPosts();