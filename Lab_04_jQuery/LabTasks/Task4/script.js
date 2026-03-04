const buttons = document.querySelectorAll(".tabBtn");
const contents = document.querySelectorAll(".tabContent");

buttons.forEach(button => {

button.addEventListener("click", function(){

let tabId = this.getAttribute("data-tab");

contents.forEach(content => {
content.classList.remove("active");
});

let activeTab = document.getElementById(tabId);

activeTab.classList.add("active");

activeTab.scrollIntoView({
behavior: "smooth"
});

});

});