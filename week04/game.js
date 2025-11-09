// Word associations database
const words = {
  "computer": ["code", "software", "hardware", "programming", "internet", "keyboard", "mouse", "monitor", "laptop", "desktop", "CPU", "GPU", "RAM", "binary", "data", "algorithm", "network", "server", "python", "java"],
  "ocean": ["water", "blue", "deep", "wave", "beach", "fish", "whale", "shark", "coral", "reef", "tide", "current", "boat", "ship", "salt", "pacific", "atlantic", "coast", "marine", "seaweed"],
  "music": ["sound", "rhythm", "melody", "harmony", "note", "instrument", "guitar", "piano", "drums", "sing", "song", "album", "artist", "concert", "classical", "rock", "pop", "hip-hop", "jazz", "beats"],
  "book": ["read", "page", "chapter", "author", "novel", "story", "text", "cover", "library", "words", "fiction", "non-fiction", "ebook", "paperback", "hardcover", "plot", "character", "genre", "literature", "bookmark"],
  "coffee": ["bean", "morning", "caffeine", "mug", "hot", "brew", "espresso", "latte", "energy", "aroma", "roast", "filter", "grind", "cream", "sugar", "barista", "cup", "drink", "awake", "mocha"],
  "car": ["engine", "wheels", "drive", "road", "transport", "speed", "gasoline", "electric", "tire", "steering", "seat", "window", "traffic", "commute", "vehicle", "auto", "license", "insurance", "mechanic", "highway"],
  "tree": ["wood", "leaf", "branch", "root", "forest", "bark", "green", "oxygen", "plant", "nature", "oak", "pine", "maple", "trunk", "shade", "climb", "sapling", "grove", "lumber", "canopy"],
  "food": ["eat", "hungry", "restaurant", "cook", "kitchen", "dinner", "lunch", "breakfast", "fruit", "vegetable", "meat", "bread", "water", "drink", "delicious", "tasty", "grocery", "recipe", "chef", "plate"],
  "phone": ["call", "text", "mobile", "cell", "smartphone", "iPhone", "Android", "app", "screen", "ring", "number", "contact", "internet", "message", "camera", "battery", "charge", "SIM", "5G", "communication"],
  "game": ["play", "video", "board", "card", "fun", "rules", "player", "win", "lose", "score", "level", "controller", "console", "PC", "online", "multiplayer", "puzzle", "strategy", "RPG", "character"],
  "movie": ["film", "cinema", "actor", "actress", "director", "screenplay", "plot", "scene", "theater", "popcorn", "Hollywood", "action", "comedy", "drama", "soundtrack", "camera", "watch", "review", "sequel", "blockbuster"],
  "sport": ["game", "play", "team", "ball", "win", "lose", "score", "athlete", "field", "court", "stadium", "fan", "football", "basketball", "soccer", "baseball", "tennis", "olympics", "run", "compete"],
  "love": ["heart", "romance", "passion", "care", "affection", "relationship", "couple", "kiss", "hug", "family", "friendship", "emotion", "feeling", "dating", "marriage", "forever", "sweet", "valentine", "trust", "devotion"],
  "space": ["outer", "galaxy", "stars", "planet", "universe", "rocket", "astronaut", "NASA", "alien", "comet", "asteroid", "black hole", "cosmos", "nebula", "orbit", "gravity", "vacuum", "shuttle", "launch", "mission"],
  "sun": ["light", "star", "solar", "warm", "day", "yellow", "shine", "heat", "energy", "system", "sunrise", "sunset", "rays", "sunscreen", "eclipse", "vitamin D", "daylight", "bright", "sky", "summer"],
  "beach": ["sand", "ocean", "water", "wave", "sun", "swim", "shell", "coast", "shore", "surf", "towel", "sunscreen", "umbrella", "tide", "island", "vacation", "boardwalk", "seagull", "lifeguard", "relax"],
  "city": ["urban", "building", "skyscraper", "street", "traffic", "crowd", "people", "metropolis", "subway", "taxi", "park", "capital", "downtown", "lights", "noise", "apartment", "mayor", "government", "New York", "London"],
  "school": ["student", "teacher", "class", "homework", "learn", "education", "college", "university", "desk", "book", "test", "exam", "grade", "subject", "math", "science", "recess", "principal", "campus", "degree"],
  "sleep": ["night", "bed", "dream", "rest", "tired", "awake", "pajamas", "pillow", "blanket", "snore", "alarm", "morning", "REM", "deep", "nap", "insomnia", "eight hours", "yawn", "doze", "slumber"]
};

// Game state
let gameState = {
    totalPlayers: 3,
    players: [],
    currentRound: 1,
    maxRounds: 4,
    secretWord: '',
    imposterIndex: -1,
    allUsedWords: new Set(),
    currentPlayerIndex: 0,
    roundComplete: false,
    selectedVote: -1
};

// Initialize game
function startGame() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    gameState.totalPlayers = playerCount;
    gameState.currentRound = 1;
    gameState.allUsedWords = new Set();
    
    // Initialize players
    gameState.players = [];
    for (let i = 0; i < playerCount; i++) {
        gameState.players.push({
            id: i,
            name: i === 0 ? 'You' : `Player ${i + 1}`,
            isHuman: i === 0,
            words: [],
            avatar: generateAvatarUrl(i)
        });
    }
    
    // Select random imposter
    gameState.imposterIndex = Math.floor(Math.random() * playerCount);
    
    // Select random secret word
    const wordKeys = Object.keys(words);
    gameState.secretWord = wordKeys[Math.floor(Math.random() * wordKeys.length)];
    
    // Show game screen
    showScreen('gameScreen');
    startRound();
}

// Generate DiceBear avatar URL
function generateAvatarUrl(playerId) {
    const styles = ['avataaars', 'bottts', 'fun-emoji', 'identicon', 'initials', 'lorelei', 'micah', 'personas', 'pixel-art'];
    const style = styles[playerId % styles.length];
    const seed = `player${playerId}${Date.now()}`;
    return `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=ffffff`;
}

// Start a new round
function startRound() {
    document.getElementById('roundNumber').textContent = `ROUND ${gameState.currentRound}`;
    
    // Display role
    const roleDisplay = document.getElementById('roleDisplay');
    if (gameState.players[0].id === gameState.imposterIndex) {
        roleDisplay.textContent = '🎭 YOU ARE THE IMPOSTER! Try to blend in without knowing the secret word.';
        roleDisplay.className = 'role-display imposter';
    } else {
        roleDisplay.textContent = `🔑 Secret Word: ${gameState.secretWord.toUpperCase()}`;
        roleDisplay.className = 'role-display';
    }
    
    // Reset round state
    gameState.currentPlayerIndex = 0;
    gameState.roundComplete = false;
    
    // Display players
    displayPlayers();
    
    // Show/hide input based on if it's human turn
    updateInputSection();
    
    document.querySelector('.btn-secondary').classList.remove('active');
}

// Display players
function displayPlayers() {
    const container = document.getElementById('playersContainer');
    container.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        if (player.isHuman) card.classList.add('you');
        
        const avatar = document.createElement('img');
        avatar.src = player.avatar;
        avatar.alt = player.name;
        avatar.className = 'player-avatar';
        
        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = player.name;
        
        card.appendChild(avatar);
        card.appendChild(name);
        
        // Show current round word if available
        if (player.words.length >= gameState.currentRound) {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'player-word';
            wordDiv.textContent = player.words[gameState.currentRound - 1];
            card.appendChild(wordDiv);
        }
        
        container.appendChild(card);
    });
}

// Update input section
function updateInputSection() {
    const wordInput = document.getElementById('wordInput');
    const submitBtn = document.querySelector('.input-section .btn');
    
    // Display used words
    displayUsedWords();
    
    if (gameState.roundComplete) {
        wordInput.disabled = true;
        wordInput.value = '';
        submitBtn.style.display = 'none';
        return;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayer.isHuman) {
        wordInput.disabled = false;
        wordInput.focus();
        submitBtn.style.display = 'block';
    } else {
        wordInput.disabled = true;
        wordInput.value = '';
        submitBtn.style.display = 'none';
        // Bot plays automatically
        setTimeout(() => botPlay(), 1000);
    }
}

// Display used words
function displayUsedWords() {
    const container = document.getElementById('usedWords');
    if (gameState.allUsedWords.size === 0) {
        container.innerHTML = '<h3>No words used yet</h3>';
        return;
    }
    
    container.innerHTML = '<h3>Words used this game:</h3>';
    gameState.allUsedWords.forEach(word => {
        const tag = document.createElement('span');
        tag.className = 'word-tag';
        tag.textContent = word;
        container.appendChild(tag);
    });
}

// Submit word
function submitWord() {
    const input = document.getElementById('wordInput');
    const word = input.value.trim().toLowerCase();
    
    if (!word) {
        alert('Please enter a word!');
        return;
    }
    
    if (gameState.allUsedWords.has(word)) {
        alert('That word was already used! Try another.');
        return;
    }
    
    // Add word to current player
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.words.push(word);
    gameState.allUsedWords.add(word);
    
    input.value = '';
    
    // Move to next player
    nextPlayer();
}

// Bot play
function botPlay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    let word;
    
    if (currentPlayer.id === gameState.imposterIndex) {
        // Imposter bot - guess based on other players' words
        word = botPlayImposter();
    } else {
        // Innocent bot - use word from secret word list
        word = botPlayInnocent();
    }
    
    currentPlayer.words.push(word);
    gameState.allUsedWords.add(word);
    
    displayPlayers();
    
    // Move to next player
    setTimeout(() => nextPlayer(), 500);
}

// Bot play as innocent
function botPlayInnocent() {
    const available = words[gameState.secretWord].filter(w => !gameState.allUsedWords.has(w));
    if (available.length > 0) {
        return available[Math.floor(Math.random() * available.length)];
    }
    return 'related';
}

// Bot play as imposter
function botPlayImposter() {
    // Get recent words from other players
    const recentWords = [];
    gameState.players.forEach(player => {
        if (player.id !== gameState.currentPlayerIndex && player.words.length > 0) {
            recentWords.push(...player.words.slice(-2));
        }
    });
    
    if (recentWords.length === 0) {
        return 'thing';
    }
    
    // Try to find related words from our database
    for (const recentWord of recentWords) {
        for (const [category, relatedWords] of Object.entries(words)) {
            if (relatedWords.includes(recentWord)) {
                const available = relatedWords.filter(w => !gameState.allUsedWords.has(w));
                if (available.length > 0) {
                    return available[Math.floor(Math.random() * available.length)];
                }
            }
        }
    }
    
    // Fallback: pick any unused word from database
    const allWords = Object.values(words).flat();
    const available = allWords.filter(w => !gameState.allUsedWords.has(w));
    if (available.length > 0) {
        return available[Math.floor(Math.random() * available.length)];
    }
    
    return 'object';
}

// Move to next player
function nextPlayer() {
    gameState.currentPlayerIndex++;
    
    if (gameState.currentPlayerIndex >= gameState.totalPlayers) {
        // Round complete
        gameState.roundComplete = true;
        document.querySelector('.btn-secondary').classList.add('active');
        updateInputSection();
        displayPlayers();
    } else {
        updateInputSection();
    }
}

// Continue to next round or voting
function continueGame() {
    if (gameState.currentRound < gameState.maxRounds) {
        gameState.currentRound++;
        startRound();
    } else {
        // Go to voting
        showVoting();
    }
}

// Show voting screen
function showVoting() {
    showScreen('votingScreen');
    
    const container = document.getElementById('votingPlayers');
    container.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.onclick = () => selectVote(index);
        
        const avatar = document.createElement('img');
        avatar.src = player.avatar;
        avatar.alt = player.name;
        avatar.className = 'player-avatar';
        
        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = player.name;
        
        card.appendChild(avatar);
        card.appendChild(name);
        container.appendChild(card);
    });
}

// Select vote
function selectVote(index) {
    document.querySelectorAll('#votingPlayers .player-card').forEach((card, i) => {
        if (i === index) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    gameState.selectedVote = index;
}

// Submit vote
function submitVote() {
    if (gameState.selectedVote === -1) {
        alert('Please select a player to vote for!');
        return;
    }
    
    showResults();
}

// Show results
function showResults() {
    showScreen('resultsScreen');
    
    const imposterPlayer = gameState.players[gameState.imposterIndex];
    const correct = gameState.selectedVote === gameState.imposterIndex;
    
    // Result title
    document.getElementById('resultTitle').textContent = correct ? '🎉 YOU WON!' : '❌ GAME OVER';
    
    // Imposter reveal
    const revealDiv = document.getElementById('imposterReveal');
    revealDiv.textContent = `The imposter was ${imposterPlayer.name}!`;
    revealDiv.className = correct ? 'imposter-reveal correct' : 'imposter-reveal';
    
    // All words summary
    const allWordsDiv = document.getElementById('allWords');
    allWordsDiv.innerHTML = '<h2>All Words Said:</h2>';
    
    gameState.players.forEach(player => {
        const summary = document.createElement('div');
        summary.className = player.id === gameState.imposterIndex ? 'player-summary imposter-summary' : 'player-summary';
        
        const title = document.createElement('h3');
        title.textContent = `${player.name} ${player.id === gameState.imposterIndex ? '(IMPOSTER)' : '(Innocent)'}`;
        
        const wordsList = document.createElement('p');
        wordsList.textContent = player.words.join(', ');
        
        summary.appendChild(title);
        summary.appendChild(wordsList);
        allWordsDiv.appendChild(summary);
    });
}

// Restart game
function restartGame() {
    gameState = {
        totalPlayers: 3,
        players: [],
        currentRound: 1,
        maxRounds: 4,
        secretWord: '',
        imposterIndex: -1,
        allUsedWords: new Set(),
        currentPlayerIndex: 0,
        roundComplete: false,
        selectedVote: -1
    };
    showScreen('setupScreen');
}

// Show screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('wordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitWord();
        }
    });
});