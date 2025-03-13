const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

const synth = window.speechSynthesis;
let isSpeaking = false; // Prevent overlapping speech

function askAssistant(query) {
    if (!query.trim()) return; // Prevent empty queries

    fetch(`http://127.0.0.1:8000/ask?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            console.log("Assistant:", data.answer);
            
            let responseBox = document.getElementById("responseBox");
            if (responseBox) {
                responseBox.innerText = data.answer;
                responseBox.scrollTop = responseBox.scrollHeight; // Auto-scroll to latest response
            } else {
                console.error("Response box not found!");
            }

            speakResponse(data.answer);
        })
        .catch(error => console.error("Error fetching assistant response:", error));
}

function speakResponse(text) {
    if (isSpeaking) {
        console.log("Already speaking. Skipping...");
        return;
    }

    // ✅ Cancel any ongoing speech before starting a new one
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onstart = function () {
        isSpeaking = true;
        animateLips(true);
        animateHands(true);  // 🖐 Start hand movements
    };
    
    utterance.onend = function () {
        isSpeaking = false;
        animateLips(false);
        animateHands(false);  // 🖐 Stop hand movements

        // ✅ Restart recognition only after speaking
        if (!isSpeaking) {
            startListening();
        }
    };

    // ✅ Ensure no speech overlap by setting a delay
    setTimeout(() => {
        synth.speak(utterance);
    }, 200);
}

function startListening() {
    try {
        if (!isSpeaking) {
            recognition.start();
        }
    } catch (error) {
        console.error("Speech recognition start error:", error);
    }
}

// Handle voice input
recognition.onresult = (event) => {
    const lastResultIndex = event.results.length - 1;
    const transcript = event.results[lastResultIndex][0].transcript.trim();
    console.log("You said:", transcript);
    askAssistant(transcript);
};

// Restart speech recognition if it stops unexpectedly
recognition.onend = () => {
    console.warn("Speech recognition stopped. Restarting...");
    setTimeout(() => {
        if (!isSpeaking) startListening();
    }, 500);
};

// Handle errors
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setTimeout(() => {
        if (!isSpeaking) startListening();
    }, 1000); // Restart after error
};

// ✅ Only start listening—DO NOT say "Hello, how can I help you?" on page load
window.onload = () => {
    startListening();
};
