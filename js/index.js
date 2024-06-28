import { UI } from "./UI.js";
// Query Selectors
const subject = document.querySelector("select[name='subject']");

// Globals
let chosenSubject = "";
export let questions, currentQuestionIndex, numberOfQuestions;

// Event Listeners
document.addEventListener("click", handleClick);

async function handleClick(e) {
  // target element
  const { target } = e;
  // switch for all buttons
  switch (target.id) {
    case "start-btn":
      UI.showRules();
      break;
    case "quit-btn":
      UI.hideRules();
      break;
    case "continue-btn":
      // extract chosen subject
      chosenSubject = subject.options[subject.options.selectedIndex].innerHTML;
      // fetch questions
      questions = await fetchQuestions(chosenSubject);
      // initialize globals
      currentQuestionIndex = 0;
      numberOfQuestions = questions.length;
      // show first question
      UI.showQuiz(chosenSubject);
      break;
    case "next-btn":
      if (currentQuestionIndex < numberOfQuestions) {
        // get new question
        currentQuestionIndex++;
        // Show next question
        UI.showNextQuestion();
      }
      break;

    case "restart-btn":
      location.reload();
    default:
      break;
  }
}

async function fetchQuestions(subject) {
  try {
    const res = await fetch("questions.json");
    const data = await res.json();
    return data[subject];
  } catch (err) {
    alert("Error: " + err + "\n try again later!");
    location.reload();
    console.log(err);
  }
}
