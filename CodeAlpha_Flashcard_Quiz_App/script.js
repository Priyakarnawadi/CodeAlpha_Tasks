let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [
    {
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language"
    },
    {
        question: "What does CSS stand for?",
        answer: "Cascading Style Sheets"
    },
    {
        question: "What does JS stand for?",
        answer: "JavaScript"
    },
    {
        question: "Which language is used to style web pages?",
        answer: "CSS"
    },
    {
        question: "Which language is used to add interactivity to websites?",
        answer: "JavaScript"
    },
    {
    question: "What does URL stand for?",
    answer: "Uniform Resource Locator"
},
{
    question: "What does CPU stand for?",
    answer: "Central Processing Unit"
},
{
    question: "What does RAM stand for?",
    answer: "Random Access Memory"
},
{
    question: "What does ROM stand for?",
    answer: "Read Only Memory"
},
{
    question: "Which HTML tag is used to create a hyperlink?",
    answer: "<a>"
},
{
    question: "Which HTML tag is used to insert an image?",
    answer: "<img>"
},
{
    question: "Which CSS property changes the text color?",
    answer: "color"
},
{
    question: "Which CSS property changes the background color?",
    answer: "background-color"
},
{
    question: "Which JavaScript keyword declares a variable?",
    answer: "let, const, or var"
},
{
    question: "How do you write a comment in JavaScript?",
    answer: "// This is a comment"
},
{
    question: "Which symbol is used for IDs in CSS?",
    answer: "#"
},
{
    question: "Which symbol is used for classes in CSS?",
    answer: "."
},
{
    question: "Which method displays a popup message in JavaScript?",
    answer: "alert()"
},
{
    question: "Which method writes a message to the browser console?",
    answer: "console.log()"
},
{
    question: "Which method is used to select an element by ID?",
    answer: "document.getElementById()"
},
{
    question: "Which company developed JavaScript?",
    answer: "Netscape"
},
{
    question: "What does API stand for?",
    answer: "Application Programming Interface"
},
{
    question: "Which HTML tag is used for the largest heading?",
    answer: "<h1>"
},
{
    question: "Which HTML tag creates a paragraph?",
    answer: "<p>"
},
{
    question: "Which CSS property makes text bold?",
    answer: "font-weight"
},
{
    question: "What does DOM stand for?",
    answer: "Document Object Model"
},
{
    question: "What is Git?",
    answer: "A Version Control System"
},
{
    question: "What is GitHub?",
    answer: "A Platform for Hosting Git Repositories"
},
{
    question: "What is Local Storage?",
    answer: "Browser storage that saves data even after refresh"
},
{
    question: "Which language is used for web page structure?",
    answer: "HTML"
},
{
    question: "Which language is used for web page styling?",
    answer: "CSS"
},
{
    question: "Which language is used for web page functionality?",
    answer: "JavaScript"
},
{
    question: "What does JSON stand for?",
    answer: "JavaScript Object Notation"
},
{
    question: "Which operator checks equality and type in JavaScript?",
    answer: "==="
},
{
    question: "Which method converts an object to a JSON string?",
    answer: "JSON.stringify()"
}
];

let currentCard = 0;
let isEditing = false;

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const showBtn = document.getElementById("showBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const deleteBtn = document.getElementById("deleteBtn");
const editBtn = document.getElementById("editBtn");
const newQuestion = document.getElementById("newQuestion");
const newAnswer = document.getElementById("newAnswer");
const addBtn = document.getElementById("addBtn");
const cardCounter = document.getElementById("cardCounter");

function showFlashcard() {
    question.textContent = flashcards[currentCard].question;
    answer.textContent = flashcards[currentCard].answer;
    answer.style.display = "none";
    showBtn.textContent = "Show Answer";
    cardCounter.textContent = `Card ${currentCard + 1} of ${flashcards.length}`;
}

if (!localStorage.getItem("flashcards")) {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

showFlashcard();

// Show / Hide Answer
showBtn.addEventListener("click", () => {
    if (answer.style.display === "none") {
        answer.style.display = "block";
        showBtn.textContent = "Hide Answer";
    } else {
        answer.style.display = "none";
        showBtn.textContent = "Show Answer";
    }
});

// Next Flashcard
nextBtn.addEventListener("click", () => {
    currentCard++;

    if (currentCard >= flashcards.length) {
        currentCard = 0;
    }

    showFlashcard();
});

// Previous Flashcard
prevBtn.addEventListener("click", () => {
    currentCard--;

    if (currentCard < 0) {
        currentCard = flashcards.length - 1;
    }

    showFlashcard();
});

// Add Flashcard
addBtn.addEventListener("click", () => {

    const questionText = newQuestion.value.trim();
    const answerText = newAnswer.value.trim();

    if (questionText === "" || answerText === "") {
        alert("Please enter both question and answer!");
        return;
    }

   if (isEditing) {

    flashcards[currentCard].question = questionText;
    flashcards[currentCard].answer = answerText;

    isEditing = false;
    addBtn.textContent = "Add Flashcard";

    alert("Flashcard Updated Successfully!");

} else {

    flashcards.push({
        question: questionText,
        answer: answerText
    });

    currentCard = flashcards.length - 1;

    alert("Flashcard Added Successfully!");
}

localStorage.setItem("flashcards", JSON.stringify(flashcards));

showFlashcard();

newQuestion.value = "";
newAnswer.value = "";
});

// Delete Flashcard
deleteBtn.addEventListener("click", () => {

    if (flashcards.length === 1) {
        alert("You must have at least one flashcard!");
        return;
    }

    flashcards.splice(currentCard, 1);

    localStorage.setItem("flashcards", JSON.stringify(flashcards));

    if (currentCard >= flashcards.length) {
        currentCard = flashcards.length - 1;
    }

    showFlashcard();

    alert("Flashcard Deleted Successfully!");
});

// Edit Flashcard
// Edit Flashcard
editBtn.addEventListener("click", () => {

    newQuestion.value = flashcards[currentCard].question;
    newAnswer.value = flashcards[currentCard].answer;

    isEditing = true;
    addBtn.textContent = "Update Flashcard";

});