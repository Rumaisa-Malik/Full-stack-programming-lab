const list = document.getElementById("sortableList");
let draggedItem = null;

const items = document.querySelectorAll("#sortableList li");

items.forEach(item => {

item.addEventListener("dragstart", function(){

draggedItem = this;
this.classList.add("dragging");

});

item.addEventListener("dragend", function(){

this.classList.remove("dragging");

});

item.addEventListener("dragover", function(e){

e.preventDefault();

});

item.addEventListener("drop", function(){

if(draggedItem !== this){

let temp = this.innerHTML;
this.innerHTML = draggedItem.innerHTML;
draggedItem.innerHTML = temp;

}

});

});