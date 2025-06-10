// Simple Task Manager using localStorage

const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span>
                <strong>${task.title}</strong>: ${task.desc}
            </span>
            <span>
                <button onclick="deleteTask(${index})">Delete</button>
            </span>
        `;
        taskList.appendChild(li);
    });
}

// Add new task
taskForm.onsubmit = function(e) {
    e.preventDefault();
    const title = taskTitle.value.trim();
    const desc = taskDesc.value.trim();
    if (title === '') return;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ title, desc });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskTitle.value = '';
    taskDesc.value = '';
    loadTasks();
};

// Delete task
function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Initial load
window.onload = loadTasks;