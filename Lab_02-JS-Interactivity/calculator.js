function calculate() {
    const n1 = parseFloat(document.getElementById("num1").value);
    const n2 = parseFloat(document.getElementById("num2").value);
    const op = document.getElementById("operation").value;
    const resultBox = document.getElementById("result");

    if (isNaN(n1) || isNaN(n2)) {
        resultBox.innerHTML = "⚠ Enter valid numbers!";
        resultBox.style.background = "#dda0dd";
        console.log("Invalid input");
        return;
    }

    let result;

    if (op === "add") result = n1 + n2;
    else if (op === "sub") result = n1 - n2;
    else if (op === "mul") result = n1 * n2;
    else if (op === "div") {
        if (n2 === 0) {
            resultBox.innerHTML = "Cannot divide by zero!";
            resultBox.style.background = "#ffb6c1";
            console.log("Division by zero");
            return;
        }
        result = n1 / n2;
    }

    resultBox.innerHTML = `Result: ${result}`;

    // Lavender background for positive, soft pink for negative
    if (result >= 0) resultBox.style.background = "#9370db";
    else resultBox.style.background = "#dda0dd";

    // Console output
    console.log(`Operation: ${n1} ${op} ${n2} = ${result}`);
}
