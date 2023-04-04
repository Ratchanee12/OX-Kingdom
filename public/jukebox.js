// Get the current page URL
const currentPage = window.location.href;

console.log(currentPage);

// Create a new audio element
const audio = new Audio();

// Check the current page and set the audio file to play
if (currentPage.includes("SignUpPage_remastered.html")) {
  audio.src = "https://example.com/huuray.mp3";
} else if (currentPage.includes("index.html")) {
  audio.src = "https://example.com/ambient.mp3";
} else {
  // default audio file to play if the current page is not recognized
  audio.src = "https://example.com/default.mp3";
}

// Set the audio to loop and autoplay
audio.loop = true;
audio.autoplay = true;

// Append the audio element to the body
document.body.appendChild(audio);

// Create a volume control element
const volumeControl = document.createElement("input");
volumeControl.type = "range";
volumeControl.min = 0;
volumeControl.max = 1;
volumeControl.step = 0.1;
volumeControl.value = audio.volume;

// Update the volume of the audio element when the volume control changes
volumeControl.addEventListener("input", (event) => {
  audio.volume = event.target.value;
});

// Append the volume control element to the body
document.body.appendChild(volumeControl);
