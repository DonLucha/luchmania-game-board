// ========== SOUND EFFECTS ==========
const audioLibrary = {
    'correct': () => playAudio('correctSound'),
    'incorrect': () => playAudio('incorrectSound'),
    'timer-warning': () => playAudio('timerWarningSound'),
    'whammy': () => playAudio('whamnySound'),
    'reveal': () => createBeep(400, 200),
    'question-appear': () => createBeep(600, 150),
    'timer-end': () => createBeep(800, 300),
    'winner': () => playWinnerSound()
};

function playSound(soundName) {
    if (audioLibrary[soundName]) {
        audioLibrary[soundName]();
    }
}

function playAudio(elementId) {
    const audio = document.getElementById(elementId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// ========== WEB AUDIO API FOR SOUND EFFECTS ==========
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function createBeep(frequency, duration) {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        console.log('Beep sound failed:', e);
    }
}

function playWinnerSound() {
    try {
        const now = audioContext.currentTime;
        const notes = [262, 294, 330, 392, 440]; // C D E G A
        
        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.2, now + i * 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.2);
            
            oscillator.start(now + i * 0.2);
            oscillator.stop(now + i * 0.2 + 0.2);
        });
    } catch (e) {
        console.log('Winner sound failed:', e);
    }
}
