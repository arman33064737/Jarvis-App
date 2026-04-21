
// আপনার Google Gemini API Key এখানে বসান
const API_KEY = "AIzaSyCMX0YLJhHK33L9Wa85IizIOloxXBwP0fA"; 

const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status');
const userText = document.getElementById('user-text');
const jarvisText = document.getElementById('jarvis-text');

// ভয়েস রিকগনিশন সেটআপ (কথা শোনার জন্য)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;

micBtn.addEventListener('click', () => {
    recognition.start();
    statusText.innerText = "Listening...";
});

recognition.onresult = async (event) => {
    const command = event.results[0][0].transcript;
    userText.innerText = command;
    statusText.innerText = "Thinking...";
    
    // API এর মাধ্যমে কমান্ড পাঠানো
    fetchAIResponse(command);
};

// Gemini API এর সাথে যোগাযোগ
async function fetchAIResponse(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
    
    const requestBody = {
        contents: [{ parts: [{ text: "You are a helpful AI assistant named Jarvis. Keep your answers short and clear. " + prompt }] }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        
        jarvisText.innerText = reply;
        statusText.innerText = "Tap the mic and speak...";
        
        // উত্তরটি মুখে পড়ে শোনানো
        speak(reply);
        
    } catch (error) {
        jarvisText.innerText = "Sorry, network error!";
        statusText.innerText = "Error!";
    }
}

// কথা বলার ফাংশন
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1; // স্পিড
    window.speechSynthesis.speak(speech);
}
