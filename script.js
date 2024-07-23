function reload() {
    setActiveButton('btnReload');
    location.reload();
}

function openDiv(divNumber) {
    if (divNumber === 2) {
        setActiveButton('btnGame');
    } else if (divNumber === 3) {
        setActiveButton('btnFire');
    }
    document.getElementById(`div${divNumber}`).style.display = 'block';
    document.getElementById('blurBackground').style.display = 'block';
}

function closeDiv(divNumber) {
    document.getElementById(`div${divNumber}`).style.display = 'none';
    document.getElementById('blurBackground').style.display = 'none';
}

function setActiveButton(buttonId) {
    const buttons = document.querySelectorAll('footer button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
}
