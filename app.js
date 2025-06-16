const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');
const username = localStorage.getItem('currentUser');

// Redirect to /auth if not signed in
if (!username) window.location.href = '/auth';

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks_' + username)) || [];
}
function saveTasks(tasks) {
    localStorage.setItem('tasks_' + username, JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasks();
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (task.done) return; // Show only active tasks
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-title">${escapeHtml(task.title)}</span>
            <span class="task-desc">${escapeHtml(task.desc)}</span>
            <input type="checkbox" class="task-checkbox" data-index="${index}" title="Mark as done">
        `;
        taskList.appendChild(li);
    });
    document.querySelectorAll('.task-checkbox').forEach(cb =>
        cb.addEventListener('change', handleCheck));
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

taskForm.onsubmit = function(e) {
    e.preventDefault();
    const title = taskTitle.value.trim();
    const desc = taskDesc.value.trim();
    if (title === '') return;
    const tasks = getTasks();
    tasks.push({ title, desc, done: false });
    saveTasks(tasks);
    taskTitle.value = '';
    taskDesc.value = '';
    loadTasks();
};

function handleCheck(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    const tasks = getTasks();
    tasks[index].done = true;
    saveTasks(tasks);
    loadTasks();
}

window.onload = loadTasks;