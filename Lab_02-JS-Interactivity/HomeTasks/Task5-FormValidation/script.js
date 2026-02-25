function validateForm() {
  let valid = true;

  // Clear messages
  document.querySelectorAll(".error").forEach(e => e.innerHTML = "");
  document.getElementById("successMsg").innerHTML = "";

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let age = document.getElementById("age").value;
  let password = document.getElementById("password").value;

  if (name === "") {
    document.getElementById("nameError").innerHTML = "Name is required";
    valid = false;
  }

  if (!email.includes("@")) {
    document.getElementById("emailError").innerHTML = "Invalid email";
    valid = false;
  }

  if (age < 18 || age > 60) {
    document.getElementById("ageError").innerHTML = "Age must be 18–60";
    valid = false;
  }

  if (password.length < 6) {
    document.getElementById("passwordError").innerHTML = "Password must be at least 6 characters";
    valid = false;
  }

  if (valid) {
    document.getElementById("successMsg").innerHTML = "Registration Successful!";
    confirm("Do you want to submit the form?");
    alert("Thank you for registering!");
  }

  return false; // prevent real submission
}