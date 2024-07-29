document.addEventListener("DOMContentLoaded", () => {
label();
  const addTodo = document.querySelector(".add");
  const saveBtn = document.querySelector(".save");
  const editBtn = document.querySelectorAll(".edit-task");
  const checkbox = document.querySelectorAll(".task section input");
  const unstar = document.querySelectorAll(".unstar");
  const deleteBtn = document.querySelectorAll(".delete");
  const editDiscard = document.querySelector(".edit-discard");
  const saveDiscard = document.querySelector(".discard");
  const mode = document.querySelector(".theme-btn");

  const updateTodoBtn = document.querySelector(".update");
  const todoStatus = document.querySelector(".todo-title");
  //Global variable
  let clickedTask = "";

  function label() {
    let dayOne = document.querySelector(".day-1");
    let dayTwo = document.querySelector(".day-2");
    let dayThree = document.querySelector(".day-3");
    let past = document.querySelector(".day-4");

    if (!dayOne.nextElementSibling.children.length > 0) {
      dayOne.parentElement.style.display = "none";
    } else {
      dayOne.parentElement.style.display = "block";
    }
    if (!dayTwo.nextElementSibling.children.length > 0) {
      dayTwo.parentElement.style.display = "none";
    } else {
      dayTwo.parentElement.style.display = "block";
    }
    if (!dayThree.nextElementSibling.children.length > 0) {
      dayThree.parentElement.style.display = "none";
    } else {
      dayThree.parentElement.style.display = "block";
    }
    if (!past.nextElementSibling.children.length > 0) {
      past.parentElement.style.display = "none";
    } else {
      past.parentElement.style.display = "block";
    }
    if (
      !dayTwo.nextElementSibling.children.length > 0 &&
      !dayOne.nextElementSibling.children.length > 0 &&
      !past.nextElementSibling.children.length > 0 &&
     ! dayThree.nextElementSibling.children.length > 0
    ) {
      document.querySelector('.empty').style.display = 'flex'
    }else{
      document.querySelector('.empty').style.display = 'none'
    }
  }
  
  function isStared(unstar) {
    let stared = "";
    if (unstar.classList.contains("fa-regular")) {
      stared = "fa-solid";
      unstar.classList.remove("fa-regular");
      unstar.classList.add("fa-solid");
    } else {
      stared = "fa-regular";
      unstar.classList.add("fa-regular");
      unstar.classList.remove("fa-solid");
    }
    let data =
      unstar.parentElement.previousElementSibling.children[1].textContent;
    let todoId = unstar.parentElement.parentElement.dataset.todoId;
    updateTodo(todoId, data, stared);
  }

  function isChecked(box) {
    let completed = "";
    if (box.checked) {
      completed = "checked";
      box.setAttribute("checked", "checked");
      box.nextElementSibling.style.textDecoration = "line-through";
      box.parentElement.parentElement.classList.add("checked");
    } else {
      completed = "unchecked";
      box.setAttribute("checked", "unchecked");
      box.parentElement.parentElement.classList.remove("checked");
      box.nextElementSibling.style.textDecoration = "none";
    }
    let todoId = box.parentElement.parentElement.dataset.todoId;
    let data = box.nextElementSibling.textContent;
    let stared =
      box.parentElement.nextElementSibling.lastElementChild.classList.contains(
        "fa-solid"
      )
        ? "fa-solid"
        : "fa-regular";
    updateTodo(todoId, data, stared, completed);
  }

  function editTask(task) {
    clickedTask = task.parentElement.previousElementSibling.children[1];
    document.querySelector("header").classList.remove("searchbar-active");
    document.querySelector(".todo-box").classList.remove("active");
    let todoId = task.parentElement.parentElement.dataset.todoId;
    let inputBox = document.querySelector(".input-box input#edited-data");
    inputBox.dataset.todoId = todoId;
    let textData =
      task.parentElement.previousElementSibling.children[1].textContent;
    document.querySelector(".edit-box").classList.toggle("active");
    inputBox.value = textData;
    setTimeout(() => {
      inputBox.focus();
    }, 700);
  }

  updateTodoBtn.addEventListener("click", () => {
    let inputBox = document.querySelector(".input-box input#edited-data");
    let data = inputBox.value.trim();
    if (data.length === 0 || data == " ") {
      return;
    }
    let todoId = inputBox.dataset.todoId;
    updateTodo(todoId, inputBox.value); //Database operation function
    closeEditBox(editDiscard);
  });

  //Theme functionality ----------------------------------------------
  const theme = JSON.parse(localStorage.getItem("theme"));
  if (theme == "dark") {
    document.querySelector(".container").classList.add("dark");
    document.querySelector(".switch-theme").classList.add("active");
  } else {
    document.querySelector(".container").classList.remove("dark");
  }

  mode.addEventListener("click", () => {
    let theme = document.querySelector(".container").classList.toggle("dark");
    if (document.querySelector(".container").classList.contains("dark")) {
      localStorage.setItem("theme", JSON.stringify("dark"));
    } else {
      localStorage.setItem("theme", JSON.stringify("white"));
    }
  });

  //------------------------------------------------------------------

  function reloadFunctionality() {
    const editBtn = document.querySelectorAll(".edit-task");
    const checkbox = document.querySelectorAll(".task section input");
    const unstar = document.querySelectorAll(".unstar");
    const deleteBtn = document.querySelectorAll(".delete");
    unstar.forEach((unstar) => {
      unstar.addEventListener("click", () => isStared(unstar));
    });

    editBtn.forEach((task) => {
      task.addEventListener("click", () => editTask(task));
    });

    checkbox.forEach((box) => {
      box.addEventListener("click", () => isChecked(box));
    });

    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const todoId = btn.dataset.todoId;
        const userId = btn.dataset.userId;
        deleteTodo(todoId, userId);
        btn.parentElement.remove();
      });
    });
  }

  //------------------------------------------------------------------

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const todoId = btn.dataset.todoId;
      const userId = btn.dataset.userId;
      deleteTodo(todoId, userId);
      btn.parentElement.remove();
    });
  });
  unstar.forEach((unstar) => {
    unstar.addEventListener("click", () => isStared(unstar));
  });

  checkbox.forEach((box) => {
    box.addEventListener("click", () => isChecked(box));
  });

  editBtn.forEach((task) => {
    task.addEventListener("click", () => editTask(task));
  });

  function closeEditBox(btn) {
    btn.parentElement.parentElement.classList.remove("active");
  }

  editDiscard.addEventListener("click", () => closeEditBox(editDiscard));

  addTodo.addEventListener("click", openInputBox);
  saveBtn.addEventListener("click", () => getData(saveBtn));

  saveDiscard.addEventListener("click", closeInputBox);

  function openInputBox() {
    document.querySelector("header").classList.remove("searchbar-active");
    document.querySelector(".todo-box").classList.toggle("active");
    setTimeout(() => {
      document.querySelector(".input-box input").focus();
    }, 700);
  }
  function closeInputBox() {
    document.querySelector(".todo-box").classList.toggle("active");
  }
  function getData(btn) {
    const userId = btn.dataset.userId;

    let data = document.querySelector("#data").value.trim();
    if (data.length == 0 || data == " ") {
      closeInputBox();
      return;
    }
    createPost(userId, data);
  }

  //Create Functionality---------------------------------------
  async function createPost(userId, data) {
closeInputBox();
    let todo = {
      title: data,
      ref: userId,
    };
    let req = await fetch(`/api/v1/todo/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    let { savedTodo, status } = await req.json();
    let dayOne = document.querySelector(".day-1");
    if (!dayOne.nextElementSibling.children.length > 0) {
      dayOne.parentElement.style.display = "block";
    }
    let template = `
    <li class="task" data-todo-Id="${savedTodo._id}">
       <section>
         <input type="checkbox" />
         <p>${savedTodo.title}</p>
       </section>
       <div class="todo-operations">
         <i class="fa-solid fa-pen-to-square edit-task"></i>
         <i class="fa-regular fa-star unstar"></i>
       </div>
       <div data-user-Id=${userId} class="delete"  data-todo-Id=${savedTodo._id}>
         <i class="fa-regular fa-trash-can"></i>
       </div>
     </li>
   `;

    document.querySelector(".day-1+ul").innerHTML += template;
    document.querySelector(".input-box input").value = "";
    
    reloadFunctionality();

    if (status === 201) {
      document.querySelector(".success-tostal").classList.add("active");
      let successWidth = 100;
      const successIntervalId = setInterval(() => {
        document.querySelector(".success-line").style.width =
          successWidth - 1 + "%";
        if (successWidth <= -10) {
          document.querySelector(".success-tostal").classList.remove("active");
          clearInterval(successIntervalId);
          successWidth = 0;
          document.querySelector(".success-line").style.width = "100%";
        }
        successWidth--;
      }, 20);
      taskDetails(document.querySelector(".hamburger").dataset.userId);
    }
    label();
  }

  //Delete Functionality--------------------------------------
  async function deleteTodo(todoId, userId) {
    let data = { userId };
    
    let req = await fetch(`/api/v1/todo/${todoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await req.json();
  
    label();
    taskDetails(document.querySelector(".hamburger").dataset.userId);
  }

  //Update Functionality---------------------------------------
  async function updateTodo(todoId, title, stared, completed) {
    let updatedTodo = {
      todoId,
      title,
      stared,
      completed,
    };
    let req = await fetch(`/api/v1/todo/${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });
    let res = await req.json();
    if (res.message === "Successfully Updated.") {
      clickedTask.innerHTML = title;
      document.querySelector(".success-tostal").classList.add("active");
      let successWidth = 100;
      const successIntervalId = setInterval(() => {
        document.querySelector(".success-line").style.width =
          successWidth - 1 + "%";
        if (successWidth <= -10) {
          document.querySelector(".success-tostal").classList.remove("active");
          clearInterval(successIntervalId);
          successWidth = 0;
          document.querySelector(".success-line").style.width = "100%";
        }
        successWidth--;
      }, 20);
      taskDetails(document.querySelector(".hamburger").dataset.userId);
    }
  }
});

//Acount page funcationality
let total = document.querySelector(".total-count");
let stared = document.querySelector(".star-count");
let done = document.querySelector(".done-count");
let pending = document.querySelector(".pending-count");
let logoutToggle = document.querySelector(".logout-btn");
let deleteToggle = document.querySelector(".delete-btn");
let themeToggle = document.querySelector(".theme-btn");

deleteToggle.addEventListener("click", () => {
  document.querySelector(".switch-delete").classList.toggle("active");
  deleteUser(deleteToggle.dataset.userId);
});
logoutToggle.addEventListener("click", () => {
  document.querySelector(".switch-logout").classList.toggle("active");
  logout();
});
themeToggle.addEventListener("click", () => {
  document.querySelector(".switch-theme").classList.toggle("active");
});

async function logout() {
  await fetch("/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  window.location.reload();
  window.location.href = "/";
}
async function deleteUser(userId) {
  await fetch("/", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  window.location.reload();
  window.location.href = "/";
}

async function taskDetails(id) {
  let req = await fetch(`/api/v1/user/todos/details/${id}`);
  let res = await req.json();
  let { todos } = res;

  let { totalTasks } = res;

  let staredTasks = todos.filter((todo) => todo.stared == "fa-solid");
  let doneTasks = todos.filter((todo) => todo.completed == "checked");
  let pendingTasks = todos.filter((todo) => todo.completed == "unchecked");
  total.innerHTML = totalTasks;
  stared.innerHTML = staredTasks.length;
  done.innerHTML = doneTasks.length;
  pending.innerHTML = pendingTasks.length;
}

let hamburger = document.querySelector(".hamburger");
let closeAccountPage = document.querySelector(".close");

function isActive() {
  let aPage = document.querySelector(".account-page");
  if (aPage.classList.contains("active")) {
    document.querySelector(".add").style.display = "none";
  } else {
    document.querySelector(".add").style.display = "flex";
  }
}

hamburger.addEventListener("click", () => {
  document.querySelector(".account-page").classList.toggle("active");
  taskDetails(hamburger.dataset.userId);
  isActive();
});

closeAccountPage.addEventListener("click", () => {
  document.querySelector(".account-page").classList.toggle("active");
  isActive();
});

document.querySelector(".today-date").innerHTML = new Date()
  .toString()
  .split(" ")
  .slice(0, 4)
  .join(" ");
document.querySelector(".copyright").innerHTML = new Date().getFullYear();
