const express = require('express');
const app = express();
const PORT = 3000;

const students = ["Ali", "Ahmed", "Sara", "Ayesha", "Rumaisa"];

// 🔹 Common Layout (Navbar + Styling)
function layout(title, content) {
    return `
    <html>
    <head>
        <title>${title}</title>
        <style>
            body {
                margin: 0;
                font-family: 'Segoe UI';
                background: #ffe4ec;
                color: #1f2937;
            }

            nav {
                background: white;
                padding: 15px;
                text-align: center;
                border-bottom: 2px solid #f9a8d4;
            }

            nav a {
                margin: 10px;
                text-decoration: none;
                color: #db2777;
                font-weight: 600;
            }

            .container {
                padding: 40px;
                text-align: center;
            }

            .card {
                background: white;
                margin: 20px auto;
                padding: 25px;
                width: 320px;
                border-radius: 12px;
                box-shadow: 0 6px 16px rgba(219,39,119,0.15);
            }

            h1, h2, h3 {
                color: #db2777;
            }

            ul {
                padding: 0;
            }

            li {
                list-style: none;
                padding: 10px;
                border-bottom: 1px solid #fbcfe8;
            }

            li:last-child {
                border-bottom: none;
            }

            a.button {
                display: inline-block;
                margin-top: 10px;
                padding: 8px 15px;
                background: #db2777;
                color: white;
                border-radius: 6px;
            }
        </style>
    </head>

    <body>

        <nav>
            <a href="/">Home</a>
            <a href="/students">Students</a>
            <a href="/home">Home Page</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/user/Rumaisa">User</a>
        </nav>

        <div class="container">
            ${content}
        </div>

    </body>
    </html>
    `;
}

////////////////////////////////////////////////////
// ✅ Task 4 → Main Landing Page
////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send(layout("Main Page", `
        <div class="card">
            <h1>🌸 Rumaisa's Express App</h1>
            <p>Select a feature below:</p>

            <a class="button" href="/students">Student List</a><br><br>
            <a class="button" href="/home">Message Routes</a><br><br>
            <a class="button" href="/user/Rumaisa">User Page</a>
        </div>
    `));
});

////////////////////////////////////////////////////
// ✅ Task 1 → Student List
////////////////////////////////////////////////////
app.get('/students', (req, res) => {

    let list = "";
    students.forEach(s => {
        list += "<li>" + s + "</li>";
    });

    res.send(layout("Students", `
        <div class="card">
            <h2>👩‍🎓 Student List</h2>
            <ul>${list}</ul>
        </div>
    `));
});

////////////////////////////////////////////////////
// ✅ Task 2 → Routes
////////////////////////////////////////////////////
app.get('/home', (req, res) => {
    res.send(layout("Home", `
        <div class="card">
            <h2>Welcome Home</h2>
            <p>This is Home Page - Rumaisa</p>
        </div>
    `));
});

app.get('/about', (req, res) => {
    res.send(layout("About", `
        <div class="card">
            <h2>About Page</h2>
            <p>About Us - Rumaisa</p>
        </div>
    `));
});

app.get('/contact', (req, res) => {
    res.send(layout("Contact", `
        <div class="card">
            <h2>Contact Page</h2>
            <p>Contact Us - Rumaisa</p>
        </div>
    `));
});

////////////////////////////////////////////////////
// ✅ Task 3 → Dynamic User
////////////////////////////////////////////////////
app.get('/user/:name', (req, res) => {
    const name = req.params.name;

    res.send(layout("User", `
        <div class="card">
            <h2>👤 ${name}</h2>
            <p>Hello ${name} 💖</p>
            <small>Rumaisa</small>
        </div>
    `));
});

////////////////////////////////////////////////////
// 🚀 Server Start
////////////////////////////////////////////////////
app.listen(PORT, () => {
    console.log("App running at http://localhost:3000");
});