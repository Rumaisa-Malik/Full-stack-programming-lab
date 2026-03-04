const questions = [

{
question:"Which language is used for web apps?",
options:["Python","JavaScript","C++","Java"],
answer:"JavaScript"
},

{
question:"Which tag is used for CSS?",
options:["<css>","<script>","<style>","<design>"],
answer:"<style>"
},

{
question:"Which company developed JavaScript?",
options:["Google","Microsoft","Netscape","Apple"],
answer:"Netscape"
}

];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;

const questionElement = document.getElementById("question");
const options = document.querySelectorAll(".option");
const nextBtn = document.getElementById("nextBtn");
const result = document.getElementById("result");

function loadQuestion(){

let q = questions[currentQuestion];

questionElement.textContent = q.question;

options.forEach((btn,index)=>{
btn.textContent = q.options[index];
btn.classList.remove("selected");

btn.onclick = function(){

options.forEach(b=>b.classList.remove("selected"));

this.classList.add("selected");
selectedOption = this.textContent;

}

});

}

nextBtn.addEventListener("click",function(){

if(selectedOption === questions[currentQuestion].answer){
score++;
}

currentQuestion++;

selectedOption = null;

if(currentQuestion < questions.length){
loadQuestion();
}
else{
showResult();
}

});

function showResult(){

document.getElementById("quiz").style.display="none";

result.innerHTML = `Your Score: ${score} / ${questions.length}`;

}

loadQuestion();