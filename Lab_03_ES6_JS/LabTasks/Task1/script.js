// ES6 Student Class
class Student {
    constructor(id, name, semester, courses) {
        this.id = id;
        this.name = name;
        this.semester = semester;
        this.courses = courses;
    }

    renderRow() {
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.name}</td>
                <td>${this.semester}</td>
                <td>${this.courses.join(", ")}</td>
            </tr>
        `;
    }
}

// Student data (const used properly)
const students = [
    new Student(201, "Ali Khan", "4th", ["OOP", "DSA", "Web Engineering"]),
    new Student(202, "Ayesha Malik", "3rd", ["Software Engineering", "AI", "DBMS"]),
    new Student(203, "Usman Ahmed", "2nd", ["Programming Fundamentals", "ICT", "Math"])
];

// DOM reference
const tableBody = document.getElementById("studentTableBody");

// Dynamic rendering
let tableContent = "";
students.forEach(student => {
    tableContent += student.renderRow();
});

tableBody.innerHTML = tableContent;