// ES6 Set
const registeredCourses = new Set();

const input = document.getElementById("courseInput");
const message = document.getElementById("message");
const list = document.getElementById("courseList");
const total = document.getElementById("total");
const button = document.getElementById("registerBtn");

// Button event
button.addEventListener("click", registerCourse);

function registerCourse(){

    const courseName = input.value.trim();

    if(courseName === ""){
        message.innerText = "Please enter a course name!";
        message.style.color = "red";
        return;
    }

    let beforeSize = registeredCourses.size;

    registeredCourses.add(courseName);

    if(registeredCourses.size === beforeSize){
        message.innerText = courseName + " is already registered!";
        message.style.color = "red";
    }
    else{
        message.innerText = courseName + " registered successfully!";
        message.style.color = "green";
    }

    input.value = "";

    displayCourses();
}

function displayCourses(){

    list.innerHTML = "";

    // for...of loop
    for(let course of registeredCourses){
        const li = document.createElement("li");
        li.textContent = course;
        list.appendChild(li);
    }

    total.innerText = "Total Unique Courses: " + registeredCourses.size;
}