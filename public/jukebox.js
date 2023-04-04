// Get the current page URL
const currentPage = window.location.href;

// Create a new audio element
const audio = new Audio();

// Check the current page and set the audio file to play
if (currentPage.includes("SignUpPage_remastered.html")) {
    audio.src = "Sounds/Celtic_Fantasy.mp3";
} else if (currentPage.includes("index.html")) {
    audio.src = "https://example.com/ambient.mp3";
} else {
    // default audio file to play if the current page is not recognized
    audio.src = "https://example.com/default.mp3";
}

// Set the audio to loop and autoplay
audio.loop = true;
audio.autoplay = true;

// Check if audio state is stored in localStorage
const audioState = JSON.parse(localStorage.getItem('audioState'));
if (audioState) {
    audio.currentTime = audioState.time;
    if (audioState.playing) {
        audio.play();
    }
}

// Add an event listener to the audio element to detect when it's paused
audio.addEventListener('pause', () => {
    // Store the audio's current time and state (playing or paused) in localStorage
    localStorage.setItem('audioState', JSON.stringify({time: audio.currentTime, playing: false}));
});

// Add an event listener to the audio element to detect when it's played
audio.addEventListener('play', () => {
    // Store the audio's current time and state (playing or paused) in localStorage
    localStorage.setItem('audioState', JSON.stringify({time: audio.currentTime, playing: true}));
});

// Append the audio element to the body
document.body.appendChild(audio);
