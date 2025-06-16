const taskListActive = document.getElementById('task-list-active');
const taskListDone = document.getElementById('task-list-done');
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
    taskListActive.innerHTML = '';
    taskListDone.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' done' : '');
        if (task.done) {
            li.innerHTML = `
                <span class="task-title">${escapeHtml(task.title)}</span>
                <span class="task-desc">${escapeHtml(task.desc)}</span>
                <span class="task-done-badge">Done</span>
                <div class="task-actions">
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            taskListDone.appendChild(li);
        } else {
            li.innerHTML = `
                <span class="task-title">${escapeHtml(task.title)}</span>
                <span class="task-desc">${escapeHtml(task.desc)}</span>
                <div class="task-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            taskListActive.appendChild(li);
        }
    });

    document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', handleEdit));
    document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', handleDelete));
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function handleDelete(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    loadTasks();
}

function handleEdit(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    const tasks = getTasks();
    const task = tasks[index];
    const newTitle = prompt("Edit Task Title:", task.title);
    const newDesc = prompt("Edit Task Description:", task.desc);
    if (newTitle !== null) {
        tasks[index] = { ...task, title: newTitle, desc: newDesc !== null ? newDesc : task.desc };
        saveTasks(tasks);
        loadTasks();
    }
}

window.onload = loadTasks;