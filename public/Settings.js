console.log('Settings.js loaded');
const fullScreenToggle = document.getElementById('fullscreentoggle');

fullScreenToggle.addEventListener('click', () => {
    if (fullScreenToggle.checked) {
        document.documentElement.requestFullscreen();
        console.log('entered fullscreen');
    } else {
        document.exitFullscreen();
        console.log('exited fullscreen');
    }
});
