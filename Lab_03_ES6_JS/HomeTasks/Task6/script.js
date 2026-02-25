// ================= CLASS =================
class Student {

    constructor(id, name){
        this.id = id;
        this.name = name;
        this.courses = new Set();   // SET (each student has unique courses)
    }

    addCourse(course){
        this.courses.add(course);
    }
}


// ================= MAP (Student Database) =================
const students = new Map();


// Buttons
document.getElementById("addStudentBtn").addEventListener("click", addStudent);
document.getElementById("registerCourseBtn").addEventListener("click", registerCourse);


// ========== PROMISE (simulate saving to server) ==========
function saveToServer(data){

    return new Promise((resolve,reject)=>{

        setTimeout(()=>{

            // pretend saving success
            resolve("Saved successfully to university database!");

        },1500);

    });

}


// ========== ADD STUDENT ==========
async function addStudent(){

    const id = Number(document.getElementById("sid").value);
    const name = document.getElementById("sname").value;
    const msg = document.getElementById("studentMsg");

    if(students.has(id)){
        msg.innerText="Student already exists!";
        msg.style.color="red";
        return;
    }

    const student = new Student(id,name);

    // Promise simulation
    msg.innerText="Saving student...";
    msg.style.color="orange";

    await saveToServer(student);

    students.set(id,student);

    msg.innerText="Student added successfully!";
    msg.style.color="green";

    displayStudents();
}


// ========== REGISTER COURSE (SET) ==========
function registerCourse(){

    const sid = Number(document.getElementById("courseSid").value);
    const course = document.getElementById("courseName").value;
    const msg = document.getElementById("courseMsg");

    if(!students.has(sid)){
        msg.innerText="Student not found!";
        msg.style.color="red";
        return;
    }

    const student = students.get(sid);

    let before = student.courses.size;
    student.addCourse(course);

    if(student.courses.size === before){
        msg.innerText="Course already registered!";
        msg.style.color="red";
    }
    else{
        msg.innerText="Course registered!";
        msg.style.color="green";
    }

    displayStudents();
}


// ========== DISPLAY ==========
function displayStudents(){

    const list=document.getElementById("studentList");
    list.innerHTML="";

    for(let [id,student] of students){

        let courses=[...student.courses].join(", ");
        if(courses==="") courses="No courses";

        const li=document.createElement("li");
        li.innerHTML=`<b>ID:</b> ${id} | <b>Name:</b> ${student.name}<br>
                      <b>Courses:</b> ${courses}`;

        list.appendChild(li);
    }
}