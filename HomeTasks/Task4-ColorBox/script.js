function createBox(color) {
  let box = document.createElement("div");
  box.className = "color-box";
  box.style.backgroundColor = color;
  document.getElementById("boxContainer").appendChild(box);
}

function addColorBoxes() {
  let c1 = document.getElementById("color1").value;
  let c2 = document.getElementById("color2").value;
  let c3 = document.getElementById("color3").value;

  if (c1) createBox(c1);
  if (c2) createBox(c2);
  if (c3) createBox(c3);

  // BOM Info (Bonus)
  document.getElementById("bomInfo").innerHTML =
    "Window Width: " + window.innerWidth +
    "<br>Window Height: " + window.innerHeight +
    "<br>Browser: " + navigator.userAgent;
}

function clearBoxes() {
  document.getElementById("boxContainer").innerHTML = "";
}