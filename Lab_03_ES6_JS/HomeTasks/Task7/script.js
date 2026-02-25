document.getElementById("loadBtn").addEventListener("click", loadStudents);

function loadStudents(){

    // 1️⃣ Create 3 student objects
    const students = [
        {
            name:"Ali",
            age:20,
            semester:3,
            courses:["OOP","DSA","Database"]
        },
        {
            name:"Ahmed",
            age:21,
            semester:5,
            courses:["Web Dev","AI","Operating System"]
        },
        {
            name:"Sara",
            age:19,
            semester:2,
            courses:["Programming","Math","Physics"]
        }
    ];


    // 2️⃣ Convert objects to JSON
    const jsonData = JSON.stringify(students);
    console.log("JSON Data:", jsonData);


    // 3️⃣ Convert JSON back to objects
    const parsedStudents = JSON.parse(jsonData);
    console.log("Back to Objects:", parsedStudents);


    // 5️⃣ Display in HTML
    const output = document.getElementById("output");
    output.innerHTML = "";


    // 6️⃣ Loop using forEach
    parsedStudents.forEach(student => {

        // 4️⃣ Destructuring
        const {name, age, semester, courses} = student;

        const courseList = courses.join(", ");

        output.innerHTML += `
            <div class="card">
                <b>Name:</b> ${name}<br>
                <b>Age:</b> ${age}<br>
                <b>Semester:</b> ${semester}<br>
                <b>Courses:</b> ${courseList}
            </div>
        `;
    });

}