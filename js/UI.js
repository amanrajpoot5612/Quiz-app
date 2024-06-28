import { numberOfQuestions, questions, currentQuestionIndex } from "./index.js";

// Query Selectors
const rulesContainer = document.querySelector(".quiz-rules");
const quizContainer = document.querySelector(".quiz");
const startBtn = document.getElementById("start-btn");
const subjectSpan = document.querySelector(".subject span");
const questionTitle = document.querySelector(".question .title");
const answersContainer = document.querySelector(".answers");
const bulletsContainer = document.querySelector(".bullets");
const resultContainer = document.querySelector(".result");
const timerContainer = document.querySelector(".timer span");
const nextBtn = document.getElementById("next-btn");

// Globals
let numberOfCorrectAnswers = 0,
  timer,
  numberOfSeconds = 60;

// UI interface
export class UI {
  static hide(element) {
    element.style.display = "none";
  }
  static show(element) {
    element.style.display = "initial";
  }

  static showRules() {
    UI.hide(startBtn);
    UI.show(rulesContainer);
  }
  static hideRules() {
    UI.hide(rulesContainer);
    UI.show(startBtn);
  }

  static showQuiz(subject) {
    UI.hide(startBtn);
    UI.hide(rulesContainer);
    UI.show(quizContainer);
    // handle subject part of the quiz
    subjectSpan.innerHTML = subject;
    // Create Bullets
    UI.updateBullets(currentQuestionIndex + 1);
    // show the question
    UI.showQuestion(questions[currentQuestionIndex]);
    // set new timer
    UI.setTimer(numberOfSeconds);
  }

  static showQuestion(question) {
    const { answers } = question;
    // show question title
    questionTitle.textContent = question.title;
    // Clear previous answers
    answersContainer.innerHTML = "";
    for (let i = 0; i < answers.length; i++) {
      // Create answer div
      const answerContainer = document.createElement("div");
      answerContainer.className = "answer";
      // Create input of type radio
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answers";
      input.id = `answer-${i}`;
      if (i === 0) input.checked = true;
      // Create label for input
      const label = document.createElement("label");
      label.setAttribute("for", `answer-${i}`);
      label.textContent = answers[i];

      // Append
      answerContainer.appendChild(input);
      answerContainer.appendChild(label);
      answersContainer.appendChild(answerContainer);
    }
  }

  static updateBullets(numberOfActiveQuestions) {
    // Clear Bullets
    bulletsContainer.innerHTML = "";
    // Create Bullets
    for (let i = 0; i < numberOfQuestions; i++) {
      const span = document.createElement("span");
      if (i < numberOfActiveQuestions) {
        span.className = "active";
      }
      bulletsContainer.appendChild(span);
    }
  }

  static showNextQuestion() {
    // Clear pervious timer
    clearInterval(timer);
    // Check answer for current question
    const userAnswer = UI.getUserAnswer();
    const correctAnswer = questions[currentQuestionIndex - 1]["correct-answer"];
    if (userAnswer === correctAnswer) {
      numberOfCorrectAnswers++;
    }
    if (questions[currentQuestionIndex]) {
      // Show next question
      UI.showQuestion(questions[currentQuestionIndex]);
      // Set new Timer
      UI.setTimer(numberOfSeconds);
      // Update Bullets
      UI.updateBullets(currentQuestionIndex + 1);
    } else {
      UI.showResult();
    }
  }

  static showResult() {
    UI.hide(quizContainer);
    UI.show(resultContainer);
    const msg = document.querySelector(".msg-content");
    msg.innerHTML = `You have finished this quiz!
                     and your score is ${numberOfCorrectAnswers} out of ${numberOfQuestions}`;
  }

  static whatInputIsChecked() {
    return [...document.querySelectorAll("input[name='answers']")].filter(
      (input) => input.checked
    )[0].id;
  }

  static getUserAnswer() {
    return document.querySelector(`label[for=${UI.whatInputIsChecked()}]`)
      .textContent;
  }

  static setTimer(numberOfSeconds) {
    timer = setInterval(() => {
      let minutes = parseInt(numberOfSeconds / 60);
      minutes = minutes > 9 ? `${minutes}`:`0${minutes}`;
      let seconds = parseInt(numberOfSeconds % 60);
      seconds = seconds > 9 ? `${seconds}`:`0${seconds}`;
      
      timerContainer.innerHTML = `${minutes}:${seconds}`;
      if (--numberOfSeconds < 0) {
        // Clear interval
        clearInterval(timer);
        // Go to next question
        nextBtn.click();
      }
    }, 1000);
  }
}
