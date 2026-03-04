const text = document.getElementById("text");

let fontSize = 18;

document.getElementById("increaseFont").addEventListener("click", function(){
fontSize += 2;
text.style.fontSize = fontSize + "px";
});

document.getElementById("decreaseFont").addEventListener("click", function(){
fontSize -= 2;
text.style.fontSize = fontSize + "px";
});

document.getElementById("textColor").addEventListener("click", function(){
text.style.color = "blue";
});

document.getElementById("bgColor").addEventListener("click", function(){
text.style.backgroundColor = "lightyellow";
});

document.getElementById("boldBtn").addEventListener("click", function(){
text.classList.toggle("bold");
});

document.getElementById("italicBtn").addEventListener("click", function(){
text.classList.toggle("italic");
});