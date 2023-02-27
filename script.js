const quiz = document.getElementById('quiz');
const submitBtn = document.getElementById('submit');
let currentQuiz = 0;
let score = 0;
let quizData = [];

function loadQuiz() {
    deselectAnswers();

    if (currentQuiz < quizData.length) {
        const currentQuizData = quizData[currentQuiz];
        const questionEl = document.getElementById('question');
        questionEl.innerText = currentQuizData.question;

        const answerEls = document.querySelectorAll('.answer');
        const progress = document.getElementById('progress');
        const a_text = document.getElementById('a_text');
        const b_text = document.getElementById('b_text');
        const c_text = document.getElementById('c_text');
        const d_text = document.getElementById('d_text');

        let answers = [
            currentQuizData.answers
        ];
        answers = shuffleArray(answers[0]);

        progress.innerText = ""+(currentQuiz+1)+"/10"; 
        a_text.innerText = answers[0].replace('&quot;','"');
        b_text.innerText = answers[1].replace('&quot;','"');
        c_text.innerText = answers[2].replace('&quot;','"');
        d_text.innerText = answers[3].replace('&quot;','"');
    } else {
        quiz.innerHTML = `
           <h2>You answered ${score}/${quizData.length} questions correctly</h2>
           <button onclick="location.reload()">Reload</button>
           `;
    }
}

function deselectAnswers() {
    const answerEls = document.querySelectorAll('.answer');
    answerEls.forEach(answerEl => {
        answerEl.checked = false;
    });
}

function getSelected() {
    let answer = '';
    const answerEls = document.querySelectorAll('.answer');
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) { 
        var j = Math.floor(Math.random() * (i + 1));
                   
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
       
    return array;
}

function fetchQuizData() {
    fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple')
        .then(response => response.json())
        .then(data => {
            quizData = data.results.map(result => {
                const question = result.question;
                const correctAnswer = result.correct_answer;
                const incorrectAnswers = result.incorrect_answers;
                return {
                    question: question,
                    answers: [...incorrectAnswers, correctAnswer],
                    correct: correctAnswer
                };
            });
            loadQuiz();
        });
}

fetchQuizData();

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    if (answer) {
        if (answer === quizData[currentQuiz].correct) {
            score++;
        }
        currentQuiz++;
        loadQuiz();
    }
});
