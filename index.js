import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-94277-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const todoListInDB = ref(database, "todoList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const todoListEl = document.getElementById("todo-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(todoListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(todoListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let tasksArray = Object.entries(snapshot.val())
    
        clearTodoListEl()
        
        for (let i = 0; i < tasksArray.length; i++) {
            let currentTask = tasksArray[i]
            let currentTaskID = currentTask[0]
            let currentTaskValue = currentTask[1]
            
            appendTaskToTodoListEl(currentTask)
        }    
    } else {
        todoListEl.innerHTML = "No tasks here... yet"
    }
})

function clearTodoListEl() {
    todoListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendTaskToTodoListEl(task) {
    let taskID = task[0]
    let taskValue = task[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = taskValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfTaskInDB = ref(database, `todoList/${taskID}`)
        
        remove(exactLocationOfTaskInDB)
    })
    
    todoListEl.append(newEl)
}
