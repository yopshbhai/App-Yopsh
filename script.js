const menuBtn = document.getElementById('menuBtn');
    const footerBtn = document.getElementById('footerBtn');
    const sliderMenu = document.getElementById('sliderMenu');
    const sliderFooter = document.getElementById('sliderFooter');
    const overlay = document.getElementById('overlay');
    const showInput = document.getElementById('showInput');
    const inputPage = document.getElementById('inputPage');
    const mainPage = document.getElementById('mainPage');
    const backToMainPage = document.getElementById('backToMainPage');

    // Function to close sliders
    function closeSliders() {
        sliderMenu.classList.remove('show');
        sliderFooter.classList.remove('show');
        overlay.classList.remove('active');
    }

    // Toggle left slider and overlay
    menuBtn.addEventListener('click', function() {
        if (sliderFooter.classList.contains('show')) {
            sliderFooter.classList.remove('show');
        }
        sliderMenu.classList.toggle('show');
        overlay.classList.toggle('active');
    });

    // Toggle footer slider and overlay
    footerBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link action
        if (sliderMenu.classList.contains('show')) {
            sliderMenu.classList.remove('show');
        }
        sliderFooter.classList.toggle('show');
        overlay.classList.toggle('active');
    });

    // Close sliders if overlay is clicked
    overlay.addEventListener('click', function() {
        closeSliders();
    });

    // Close sliders if user clicks anywhere on the body outside the sliders
    document.body.addEventListener('click', function(event) {
        if (!sliderMenu.contains(event.target) && !menuBtn.contains(event.target) &&
            !sliderFooter.contains(event.target) && !footerBtn.contains(event.target)) {
            closeSliders();
        }
    });

    // Show input page and hide main page
    showInput.addEventListener('click', function() {
        mainPage.style.display = 'none'; // Hide the main page
        inputPage.style.display = 'block'; // Show the input page
        inputPage.querySelector('input').focus(); // Focus the input
    });

    // Go back to the main page from input-only page
    backToMainPage.addEventListener('click', function() {
        inputPage.style.display = 'none'; // Hide the input page
        mainPage.style.display = 'block'; // Show the main page
    });