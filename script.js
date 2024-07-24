function reload() {
        setActiveButton('btnReload');
        location.reload();
    }

    function openDiv(divNumber) {
        setActiveButton(divNumber === 2 ? 'btnGame' : 'btnFire');
        document.querySelectorAll('.content-div').forEach(div => {
            div.style.display = 'none';
            div.style.opacity = '0';
        });
        const div = document.getElementById(`div${divNumber}`);
        div.style.display = 'block';
        setTimeout(() => div.style.opacity = '1', 0);  // Trigger the CSS animation
    }

    function setActiveButton(buttonId) {
        document.querySelectorAll('footer button').forEach(button => button.classList.remove('active'));
        document.getElementById(buttonId).classList.add('active');
    }
