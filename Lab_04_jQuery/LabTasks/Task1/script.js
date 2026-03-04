document.getElementById("addBtn").addEventListener("click", addItem);

function addItem(){

    let input = document.getElementById("itemInput");
    let value = input.value.trim();

    if(value === ""){
        alert("Please enter an item");
        return;
    }

    let li = document.createElement("li");
    li.textContent = value;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtn";

    deleteBtn.addEventListener("click", function(){
        li.remove();
    });

    li.appendChild(deleteBtn);

    document.getElementById("itemList").appendChild(li);

    input.value = "";
}