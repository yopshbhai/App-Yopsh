function showCustomAlert(message) {
    document.getElementById('custom-alert-message').textContent = message;
    document.getElementById('custom-alert').style.display = 'block';
}

function closeCustomAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('memes-content').innerHTML = '';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleEmojiClick(event, memeId, reactionType) {
    const emojiElement = event.target;
    if (hasUserReacted(memeId)) {
        showCustomAlert("You've already reacted to this meme!");
        return;
    }
    const currentCount = parseInt(emojiElement.dataset.count) || 0;
    emojiElement.dataset.count = currentCount + 1;
    emojiElement.textContent = `${emojiElement.dataset.emoji} ${emojiElement.dataset.count}`;
    emojiElement.classList.add('reacted');
    const emojiContainer = emojiElement.closest('.emoji-container');
    emojiContainer.querySelectorAll('.emoji').forEach(emoji => {
        emoji.classList.add('reacted');
    });
    fetch('https://script.google.com/macros/s/AKfycbwz6zLPwOaOX1mAjpfNabQXA3RBsyY3iWM6EEpDv-i46bi9zBT1pje6eyKSBlp7ujcL/exec', {
        method: 'POST',
        body: JSON.stringify({
            memeId: memeId,
            reactionType: reactionType
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            saveReaction(memeId);
        } else {
            showCustomAlert('Failed to update reaction. Please try again.');
            emojiElement.dataset.count = currentCount;
            emojiElement.textContent = `${emojiElement.dataset.emoji} ${currentCount}`;
            emojiElement.classList.remove('reacted');
            emojiContainer.querySelectorAll('.emoji').forEach(emoji => {
                emoji.classList.remove('reacted');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showCustomAlert('Error updating reaction. Please try again later.');
        emojiElement.dataset.count = currentCount;
        emojiElement.textContent = `${emojiElement.dataset.emoji} ${currentCount}`;
        emojiElement.classList.remove('reacted');
        emojiContainer.querySelectorAll('.emoji').forEach(emoji => {
            emoji.classList.remove('reacted');
        });
    });
}

function hasUserReacted(memeId) {
    const reactions = JSON.parse(localStorage.getItem('memeReactions') || '{}');
    return reactions[memeId] === true;
}

function saveReaction(memeId) {
    const reactions = JSON.parse(localStorage.getItem('memeReactions') || '{}');
    reactions[memeId] = true;
    localStorage.setItem('memeReactions', JSON.stringify(reactions));
}

function fetchMemes() {
    showLoading();
    fetch('https://script.google.com/macros/s/AKfycbwz6zLPwOaOX1mAjpfNabQXA3RBsyY3iWM6EEpDv-i46bi9zBT1pje6eyKSBlp7ujcL/exec')
    .then(response => response.json())
    .then(data => {
        hideLoading();
        const memesContent = document.getElementById('memes-content');
        const shuffledData = shuffleArray(data);
        shuffledData.forEach((row) => {
            const timestamp = moment(row.timestamp).fromNow();
            const memeContainer = document.createElement('div');
            memeContainer.className = 'meme-container';
            const userReacted = hasUserReacted(row.id);
            memeContainer.innerHTML = `
            <p class="title-class">${timestamp}</p>
            <p class="username-class" style="margin-top: -10px;"><strong>${row.username}:</strong> ${row.text}</p>
            <img src="${row.imageUrl}" alt="Meme" class="image-another-class">
            <div class="emoji-container">
            <span class="emoji ${userReacted ? 'reacted' : ''}" data-emoji="😂" data-count="${row.reactions.laugh}" onclick="handleEmojiClick(event, '${row.id}', 'laugh')" style="color: yellow;">😂 ${row.reactions.laugh}</span>&nbsp;&nbsp;
            <span class="emoji ${userReacted ? 'reacted' : ''}" data-emoji="❤️" data-count="${row.reactions.heart}" onclick="handleEmojiClick(event, '${row.id}', 'heart')" style="color: deeppink;">❤️ ${row.reactions.heart}</span>&nbsp;&nbsp;
            <span class="emoji ${userReacted ? 'reacted' : ''}" data-emoji="🔥" data-count="${row.reactions.fire}" onclick="handleEmojiClick(event, '${row.id}', 'fire')" style="color: red;">🔥 ${row.reactions.fire}</span>
            </div>
            <hr class="head-hr">
            `;
            memesContent.appendChild(memeContainer);
        });
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        document.getElementById('memes-content').innerHTML = 'Error loading data. Please try again later.';
    });
}

fetchMemes();
