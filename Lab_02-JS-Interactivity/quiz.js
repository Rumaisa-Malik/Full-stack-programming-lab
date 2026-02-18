// Dynamic Questions Array
const quizData = [
    { question: "1. What is 2 + 3?", answer: "5" },
    { question: "2. Which language runs in the browser?", answer: "javascript" },
    { question: "3. HTML is used to ______ a webpage?", answer: "structure" }
];

const container = document.getElementById("quiz-container");

// Dynamically render questions
quizData.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("question");
    div.innerHTML = `
        <p>${q.question}</p>
        <input type="text" id="a${index}" placeholder="Type your answer...">
    `;
    container.appendChild(div);
});

function checkQuiz() {
    let score = 0;

    quizData.forEach((q, index) => {
        const userAnswer = document.getElementById(`a${index}`).value.trim().toLowerCase();
        const correctAnswer = q.answer.toLowerCase();

        if (userAnswer === correctAnswer) score++;

        // Console output
        console.log(`Q${index + 1}: "${q.question}"`);
        console.log("Your answer:", userAnswer, "| Correct:", correctAnswer);
    });

    const resultBox = document.getElementById("result");
    resultBox.innerHTML = `Score: ${score}/${quizData.length}`;

    if (score === quizData.length) {
        resultBox.style.background = "#9370db";
        resultBox.innerHTML += "<br>Perfect! You got all answers right!";
    } else if (score >= 2) {
        resultBox.style.background = "#dda0dd";
        resultBox.innerHTML += "<br>Good Job!";
    } else {
        resultBox.style.background = "#e6e6fa";
        resultBox.innerHTML += "<br>Keep Practicing!";
    }

    console.log("Total Score:", score, "/", quizData.length);
}

function resetQuiz() {
    quizData.forEach((_, index) => {
        document.getElementById(`a${index}`).value = "";
    });
    document.getElementById("result").innerHTML = "";
}
