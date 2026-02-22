function completeTask(button) {
  let taskDiv = button.parentElement;
  taskDiv.classList.add("completed");

  // Loop styling (requirement)
  let allTasks = document.querySelectorAll(".task");
  allTasks.forEach(task => {
    if (task.classList.contains("completed")) {
      task.style.opacity = "0.6";
    }
  });
}

function removeTask(button) {
  button.parentElement.remove();
}