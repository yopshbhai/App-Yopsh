const fetchUrl = 'https://script.google.com/macros/s/AKfycbxaanSAHrlaxUbgihFjyIeZ7WbO1RfpsJNrrgJ6SAsQSfqKEmKgeW-5exf-QJy3YaYT/exec';
let currentUsername = '';

async function initializeApp() {
    try {
        const response = await fetch(`${fetchUrl}?action=getAllUsernames`);
        const allUsernames = await response.json();

        // Check local storage for username
        const localUsername = localStorage.getItem('YopshLoc_Username');

        if (localUsername && allUsernames.includes(localUsername)) {
            currentUsername = localUsername;
            await fetchData(); // Fetch data directly if username is valid
        } else {
            // No valid username in local storage or server, handle by skipping prompt and directly displaying data
            console.log("No valid username found. Proceeding without user-specific actions.");
            await fetchData(); // Fetch data without a username
        }

    } catch (error) {
        console.error('Error initializing app:', error);
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

async function fetchData() {
    try {
        document.getElementById('loadingOverlay').style.display = 'block';
        const response = await fetch(`${fetchUrl}?action=getPosts`);
        const data = await response.json();
        const shuffledData = shuffleArray(data);
        displayData(shuffledData);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function displayData(data) {
    const container = document.getElementById('dataContainer');
    container.innerHTML = '';

    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        const title = document.createElement('div');
        title.className = 'title-class';
        title.textContent = `${item.title}`;
        itemDiv.appendChild(title);

        const news = document.createElement('div');
        news.className = 'news-class';
        news.textContent = `News: ${item.news}`;
        itemDiv.appendChild(news);

        const username = document.createElement('div');
        username.className = 'username-class';
        username.textContent = `Username: ${item.username}`;
        itemDiv.appendChild(username);

        const image = document.createElement('img');
        image.className = 'image-another-class';
        image.src = item.imageUrl;
        image.alt = item.title;
        itemDiv.appendChild(image);
        
        const saveButton = document.createElement('button');
        saveButton.className = 'save-button';
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-bookmark';
        saveButton.appendChild(icon);
        saveButton.onclick = () => savePost(item, icon);
        itemDiv.appendChild(saveButton);

        container.appendChild(itemDiv);

        // Add horizontal line after each post
        const hr = document.createElement('hr');
        hr.className = 'head-r';
        container.appendChild(hr);
    });

    // If username is available, check saved posts and update icons
    if (currentUsername) {
        const savedPostsResponse = await fetch(`${fetchUrl}?action=getSavedPosts&username=${currentUsername}`);
        const savedPosts = await savedPostsResponse.json();
        savedPosts.forEach(savedPost => {
            const savedPostElements = [...document.querySelectorAll('.item')].filter(item =>
                item.querySelector('.title-class').textContent.includes(savedPost.title) &&
                item.querySelector('.username-class').textContent.includes(savedPost.username)
            );
            savedPostElements.forEach(element => {
                const icon = element.querySelector('.fa-bookmark');
                icon.classList.add('saved-icon');
            });
        });
    }
}

async function savePost(post, icon) {
    if (!currentUsername) return; // Do nothing if no valid username
    try {
        const response = await fetch(`${fetchUrl}?action=savePost&username=${currentUsername}&title=${encodeURIComponent(post.title)}&news=${encodeURIComponent(post.news)}&imageUrl=${encodeURIComponent(post.imageUrl)}`);
        const result = await response.json();
        if (result.success) {
            icon.classList.add('saved-icon');
            showAlert('Yopsh! Your post has been saved.');
        } else {
            showAlert('This post is already saved!');
        }
    } catch (error) {
        console.error('Error saving post:', error);
        showAlert('An error occurred while saving the post.');
    }
}

function showAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'block';
}

function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

initializeApp();