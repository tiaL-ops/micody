document.addEventListener('DOMContentLoaded', () => {

    const questions = [
        { part1: "Je ressentirais un profond désespoir si ", part2: " me quittait." },
        { part1: "Parfois, j'ai l'impression de ne pas pouvoir contrôler mes pensées ; elles sont obsédées par ", part2: "." },
        { part1: "Je me sens heureux(se) quand je fais quelque chose pour rendre ", part2: " heureux(se)." },
        { part1: "Je préférerais être avec ", part2: " plutôt qu'avec n'importe qui d'autre." },
        { part1: "Personne d'autre ne pourrait aimer ", part2: " comme moi." },
        { part1: "Je désire ", part2: " - physiquement, émotionnellement, mentalement." },
        { part1: "J'ai un appétit sans fin pour l'affection de la part de ", part2: "." },
        { part1: "Pour moi, ", part2: " est le/la partenaire romantique parfait(e)." },
        { part1: "Je sens mon corps réagir quand ", part2: " me touche." },
        { part1: "Je veux que ", part2: " me connaisse - mes pensées, mes peurs et mes espoirs." },
        { part1: "Je recherche avidement des signes indiquant le désir de ", part2: " pour moi." },
        { part1: "Si ", part2: " traversait une période difficile, je mettrais de côté mes propres préoccupations pour l'aider." },
        { part1: "En présence de ", part2: ", j'ai très envie de toucher et d'être touché(e)." },
        { part1: "Je ressens une puissante attraction pour ", part2: "." },
        { part1: "Je deviens extrêmement déprimé(e) quand les choses ne vont pas bien dans ma relation avec ", part2: "." }
    ];

    const memeBank = {
        lowScore: [
            'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmtsMjR2ZzF1ZDg5OGdvZmh0azNiMDA2NXRya3B4dTRxa29pdTVtZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Goby1XSCJr7lOA4OeD/giphy.gif',
        ],
        midLowScore: [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzNzeW55b3NwZ3JtbHRhNnJ2eXNpYmZqdG9xOHNvcmJ2dWZldTU4MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9xijGdDIMovchalhxN/giphy.gif',
        ],
        midHighScore: [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2Nrd2NvcmxyZ3JlcmE5aDVidmg0aTNjbWNzNGxkeDZ4Y2hmYmVmYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/HJZblxmxHb7CbZtmNy/giphy.gif',
        ],
        highScore: [
           'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW1hZWVodGVmaHUxN3ZuanUyaDd1OG1rN3lsaXZmeWRpYTVvN3N6aSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TSv66KyEAgohhGGvXB/giphy.gif',
        ],
        default: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNmOTBuOTAwNXgzZm5hajd6cm14NjlkMjVkNGR5cDFvMWhsM2ZrNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Xev2JdopBxGj1LuGvt/giphy.gif'
    };

    const quizContainer = document.getElementById('quiz-container');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('result');
    const nameInput = document.getElementById('crushName');
    const ourSecret = document.getElementById("ourSecret");
    const memePopup = document.getElementById('meme-popup');
    const memeImg = memePopup.querySelector('.meme-img');
    const closeMemeBtn = memePopup.querySelector('.close-meme');

    let typingTimer;

    nameInput.addEventListener("keyup", function(event) {
        const inputValue = event.target.value;
        clearTimeout(typingTimer);
        if (inputValue.trim() !== "") typingTimer = setTimeout(doneTyping, 500);
        else ourSecret.innerHTML = "";
    });

    function doneTyping() {
        const content = `
                <p>
                    Ce sera entre nous t'inquiètes ! ( ͡° ͜ʖ ͡°)
                </p>
                <img src="gif/our_secret.gif" alt="It's a secret to everybody">
            `;
        ourSecret.innerHTML = content;
    }

    // ============================================================
    // 🎉 CONTRIBUTION ZONE - ADD YOUR GIF HERE! 🎉
    // ============================================================
    // 
    // HOW TO ADD YOUR GIF:
    // 1. Put your GIF file in the /gif folder
    // 2. Add a line below with the question number and filename
    // 
    // EXAMPLE:
    // 0: 'mygif.gif',        // Question 1
    // 1: 'anothergif.gif',   // Question 2
    // 
    // Question numbers: 0-14 (Question 1 = 0, Question 15 = 14)
    //
    const questionGifs = {
        1: 'whiguyblink.gif',  // Question 2 - Example GIF
        13: 'attraction.gif',
        
        // ADD YOUR GIFS BELOW:
        // 0: 'yourgif.gif',   // Question 1
        // 2: 'yourgif.gif',   // Question 3
        // 3: 'yourgif.gif',   // Question 4
        // 4: 'yourgif.gif',   // Question 5
        // 5: 'yourgif.gif',   // Question 6
        // 6: 'yourgif.gif',   // Question 7
        // 7: 'yourgif.gif',   // Question 8
        // 8: 'yourgif.gif',   // Question 9
        // 9: 'yourgif.gif',   // Question 10
        // 10: 'yourgif.gif',  // Question 11
        // 11: 'yourgif.gif',  // Question 12
        // 12: 'yourgif.gif',  // Question 13
        // 13: 'yourgif.gif',  // Question 14
        // 14: 'yourgif.gif',  // Question 15
    };
    // ============================================================

    function buildQuiz() {
        let output = [];

        questions.forEach((currentQuestion, questionNumber) => {
            const rangeInput = `
                    <div class="range-controls">
                        <input 
                            type="range" 
                            id="q${questionNumber}" 
                            name="question${questionNumber}" 
                            min="1" max="9" value="1" step="1" 
                            class="range-meme" 
                            data-question-number="${questionNumber}">
                        <div class="range-value-display">
                            <span class="current-value" id="q${questionNumber}-value">1</span>
                        </div>
                    </div>
            `;

            // Check if there's a GIF for this question
            let gifHTML = '';
            if (questionGifs[questionNumber]) {
                gifHTML = `<div class="question-gif"><img src="gif/${questionGifs[questionNumber]}" alt="Question GIF"></div>`;
            }

            output.push(
                `<div class="question-item">
                    <p>
                        ${questionNumber + 1}.
                        ${currentQuestion.part1}
                        <span class="dynamic-name">______</span>
                        ${currentQuestion.part2}
                    </p>
                    ${gifHTML}
                    <div class="options">${rangeInput}</div>
                </div>`
            );
        });
        quizContainer.innerHTML = output.join('');
        attachRangeListeners();
    }

    // Manage cursos value display
    function attachRangeListeners() {
        const rangeInputs = document.querySelectorAll('.range-meme');
        rangeInputs.forEach(input => {
            const updateDisplay = () => {
                const value = input.value;
                document.getElementById(`q${input.dataset.questionNumber}-value`).textContent = value;
                
                const scaleValue = 1 + (value / 9) * 0.5;
                input.style.setProperty('--heart-scale', scaleValue);
            };

            input.addEventListener('input', updateDisplay);
            
            updateDisplay(); 
        });
    }

    function updateNameInQuestions() {
        const newName = nameInput.value;
        const nameSpans = document.querySelectorAll('.dynamic-name');

        let displayName = "______";
        if (newName.trim() !== "") {
            displayName = newName;
        }

        nameSpans.forEach(span => {
            span.textContent = displayName;
        });
    }

    function getRandomMeme(memeArray) {
        const randomIndex = Math.floor(Math.random() * memeArray.length);
        return memeArray[randomIndex];
    }

    function showMemePopup(memeUrl) {
        memeImg.src = memeUrl;
        memePopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMemePopup() {
        memePopup.classList.remove('active');
        document.body.style.overflow = '';
        memeImg.src = '';
    }

    function showResults() {
        let totalScore = 0;
        // let allAnswered = true;
        const crushName = nameInput.value || "Cette personne";

        if (nameInput.value.trim() === "") {
            alert("N'oublie pas d'entrer le nom de ta personne spéciale !");
            nameInput.focus();
            return;
        }

        questions.forEach((_, questionNumber) => {
            const selector = `input[name="question${questionNumber}"]`;
            const userAnswer = (quizContainer.querySelector(selector) || {}).value;

            // if (userAnswer !== "0") {
                totalScore += parseInt(userAnswer);
            // } else {
            //     allAnswered = false;
            // }
        });

        // if (!allAnswered) {
        //     alert("Oops ! Tu dois répondre à toutes les questions.");
        //     return;
        // }

        let message = '';
        let selectedMemeUrl = memeBank.default;

        if (totalScore <= 45) {
            message = `Score : ${totalScore}. <br> Euh... Pourquoi remplis-tu ce formulaire ? Es-tu sûr(e) que tu aimes ${crushName} ? On dirait plus une connaissance. 😬`;
            selectedMemeUrl = getRandomMeme(memeBank.lowScore);
        } else if (totalScore <= 75) {
            message = `Score : ${totalScore}. <br> Hmm, c'est un bon début avec ${crushName}. On dirait un crush de collège. C'est mignon ! 🥰`;
            selectedMemeUrl = getRandomMeme(memeBank.midLowScore);
        } else if (totalScore <= 105) {
            message = `Score : ${totalScore}. <br> D'accord, ça chauffe ! On entre dans la zone "obsession" pour ${crushName}. Tu y penses en te brossant les dents, c'est ça ? 🤯`;
            selectedMemeUrl = getRandomMeme(memeBank.midHighScore);
        } else {
            message = `Score : ${totalScore}. <br> AU FEU ! Appelez les pompiers ! C'est l'amour fou avec ${crushName}, le vrai, celui des films ! (Ou alors... va prendre l'air, tu es peut-être un peu *trop* passionné(e) !) 🔥❤️‍🔥`;
            selectedMemeUrl = getRandomMeme(memeBank.highScore);
        }

        resultContainer.innerHTML = message;
        resultContainer.style.display = 'flex';
        showMemePopup(selectedMemeUrl);

        resultContainer.classList.remove('flash');
        void resultContainer.offsetWidth;
        resultContainer.classList.add('flash');
    }

    buildQuiz();
    updateNameInQuestions();

    nameInput.addEventListener('input', updateNameInQuestions);
    submitBtn.addEventListener('click', showResults);
    closeMemeBtn.addEventListener('click', closeMemePopup);
    memePopup.addEventListener('click', (event) => {
        if (event.target === memePopup) {
            closeMemePopup();
        }
    });

});