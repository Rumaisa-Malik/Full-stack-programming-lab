const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const form = document.getElementById("myForm");
const successMessage = document.getElementById("successMessage");

nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

function validateName(){

if(nameInput.value.trim() === ""){
document.getElementById("nameError").textContent = "Name is required";
nameInput.classList.add("error-border");
return false;
}
else{
document.getElementById("nameError").textContent = "";
nameInput.classList.remove("error-border");
nameInput.classList.add("success-border");
return true;
}

}

function validateEmail(){

if(!emailInput.value.includes("@")){
document.getElementById("emailError").textContent = "Enter valid email";
emailInput.classList.add("error-border");
return false;
}
else{
document.getElementById("emailError").textContent = "";
emailInput.classList.remove("error-border");
emailInput.classList.add("success-border");
return true;
}

}

function validatePassword(){

if(passwordInput.value.length < 6){
document.getElementById("passwordError").textContent = "Password must be 6 characters";
passwordInput.classList.add("error-border");
return false;
}
else{
document.getElementById("passwordError").textContent = "";
passwordInput.classList.remove("error-border");
passwordInput.classList.add("success-border");
return true;
}

}

form.addEventListener("submit", function(e){

e.preventDefault();

let validName = validateName();
let validEmail = validateEmail();
let validPassword = validatePassword();

if(validName && validEmail && validPassword){
successMessage.textContent = "Form submitted successfully!";
}

});