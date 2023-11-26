let questions = [];
let currentQuestion;
let score = 0;
let questionCount = 1;
let timeRemaining = 60;
let timer;

async function startQuiz() {
  document.getElementById('start-button').style.display = 'none';
  await fetchQuestions();
  selectRandomQuestion();
  timer = setInterval(updateTimer, 1000);
}

async function fetchQuestions() {
  const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
  const data = await response.json();
  questions = data.results.map(question => {
    return {
      question: question.question,
      options: [...question.incorrect_answers, question.correct_answer],
      correctAnswer: question.correct_answer
    };
  });
}

function selectRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];
  questions.splice(randomIndex, 1); // Remove selected question from the pool
  showQuestion();
}

function updateTimer() {
  timeRemaining--;
  document.getElementById('time').textContent = timeRemaining;

  if (timeRemaining <= 0) {
    clearInterval(timer);
    showResult();
  }
}

function showQuestion() {
  const questionContainer = document.getElementById('question-container');
  const optionsContainer = document.getElementById('options-container');
  const nextButton = document.getElementById('next-button');
  const questionCountElement = document.getElementById('question-count');
  const feedbackElement = document.getElementById('feedback');

  questionCountElement.textContent = `Question: ${questionCount}/10`;
  feedbackElement.textContent = ''; // Clear previous feedback

  questionContainer.innerHTML = `
    <div class="question-content">${currentQuestion.question}</div>
  `;

  optionsContainer.innerHTML = '';
  const optionLetters = ['A', 'B', 'C', 'D'];

  currentQuestion.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = `${optionLetters[index]}. ${option}`;
    optionElement.onclick = () => checkAnswer(option, optionElement);

    optionsContainer.appendChild(optionElement);
  });

  nextButton.disabled = true; // Disable Next button until an option is selected
  nextButton.style.display = 'inline-block';
}

function checkAnswer(selectedAnswer, optionElement) {
  const options = document.querySelectorAll('.option');

  options.forEach(option => {
    option.classList.remove('correct', 'incorrect', 'selected');
    option.classList.remove('correct', 'incorrect', 'selected');
    option.innerHTML = option.textContent;
  });

  if (selectedAnswer === currentQuestion.correctAnswer) {
    optionElement.classList.add('correct');
    optionElement.innerHTML = `${optionElement.textContent} - Correct Answer`;
    score++;
  } else {
    optionElement.classList.add('incorrect');
    optionElement.innerHTML = `${optionElement.textContent} - Wrong Answer`;
  }

  const nextButton = document.getElementById('next-button');
  nextButton.disabled = false; // Enable Next button after an option is selected
}

function nextQuestion() {
  const options = document.querySelectorAll('.option');
  options.forEach(option => option.classList.remove('correct', 'incorrect', 'selected'));

  if (questions.length > 0) {
    questionCount++;
    selectRandomQuestion();
  } else {
    clearInterval(timer);
    showResult();
  }
}

function showResult() {
  const resultElement = document.getElementById('result');
  resultElement.textContent = `Your score is ${score} out of 10.`;
}
