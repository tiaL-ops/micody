// Attend que le contenu de la page soit chargé
document.addEventListener('DOMContentLoaded', () => {


   //bah les question tu vois hein
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


    const quizContainer = document.getElementById('quiz-container');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('result');
    const nameInput = document.getElementById('crushName');

    // Fonction pour générer le quiz
    function buildQuiz() {
        let output = [];

        questions.forEach((currentQuestion, questionNumber) => {
            
            // Crée les 9 options de radio boutons
            let options = '';
            for (let i = 1; i <= 9; i++) {
                options += `
                    <div>
                        <input type="radio" id="q${questionNumber}-opt${i}" name="question${questionNumber}" value="${i}">
                        <label for="q${questionNumber}-opt${i}">${i}</label>
                    </div>
                `;
            }

           
            output.push(
                `<div class="question-item">
                    <p>
                        ${questionNumber + 1}. 
                        ${currentQuestion.part1}
                        <span class="dynamic-name">______</span>
                        ${currentQuestion.part2}
                    </p>
                    <div class="options">${options}</div>
                </div>`
            );
        });

        // Affiche le HTML généré dans le conteneur du quiz
        quizContainer.innerHTML = output.join('');
    }

   
    function updateNameInQuestions() {
        const newName = nameInput.value;
        const nameSpans = document.querySelectorAll('.dynamic-name');
        
        let displayName = "______"; 
        if (newName.trim() !== "") {
            displayName = newName;
        }

        // Met à jour chaque <span> avec le nouveau nom
        nameSpans.forEach(span => {
            span.textContent = displayName;
        });
    }

    // Fonction pour calculer le score et afficher le résultat
    function showResults() {
        let totalScore = 0;
        let allAnswered = true;
        const crushName = nameInput.value || "Cette personne"; // Nom par défaut

        // Vérifie si le nom est entré
        if (nameInput.value.trim() === "") {
            alert("N'oublie pas d'entrer le nom de ta personne spéciale !");
            nameInput.focus(); 
            return;
        }

        // Calcule le score
        questions.forEach((_, questionNumber) => {
            const selector = `input[name="question${questionNumber}"]:checked`;
            const userAnswer = (quizContainer.querySelector(selector) || {}).value;

            if (userAnswer) {
                totalScore += parseInt(userAnswer);
            } else {
                allAnswered = false;
            }
        });

        // Vérifie si toutes les questions sont répondues
        if (!allAnswered) {
            alert("Oops ! Tu dois répondre à toutes les questions.");
            return;
        }

        // Logique pour les messages amusants (Score min 15, max 135)
        let message = '';
        if (totalScore <= 45) {
            message = `Score : ${totalScore}. <br> Euh... Pourquoi remplis-tu ce formulaire ? Es-tu sûr(e) que tu aimes ${crushName} ? On dirait plus une connaissance.`;
        } else if (totalScore <= 75) {
            message = `Score : ${totalScore}. <br> Hmm, c'est un bon début avec ${crushName}. On dirait un crush de collège. C'est mignon !`;
        } else if (totalScore <= 105) {
            message = `Score : ${totalScore}. <br> D'accord, ça chauffe ! On entre dans la zone "obsession" pour ${crushName}. Tu y penses en te brossant les dents, c'est ça ?`;
        } else {
            message = `Score : ${totalScore}. <br> AU FEU ! Appelez les pompiers ! C'est l'amour fou avec ${crushName}, le vrai, celui des films ! (Ou alors... va prendre l'air, tu es peut-être un peu *trop* passionné(e) !)`;
        }

        
        resultContainer.innerHTML = message;
        resultContainer.style.display = 'block';
    }

  
    buildQuiz();


    nameInput.addEventListener('input', updateNameInQuestions);
    
    submitBtn.addEventListener('click', showResults);
});