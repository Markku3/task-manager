const taskListActive = document.getElementById('task-list-active');
const taskListDone = document.getElementById('task-list-done');

fetch('/api/me')
  .then(res => {
    if (!res.ok) window.location.href = '/auth';
    return res.json();
  })
  .then(data => {
    fetchTodos();
  });

async function fetchTodos() {
    const res = await fetch('/api/todos');
    const data = await res.json();
    renderTodos(data.sqlite || []);
}

function renderTodos(todos) {
    taskListActive.innerHTML = '';
    taskListDone.innerHTML = '';
    todos.forEach(todo => {
        const isDone = Number(todo.completed) === 1;
        const li = document.createElement('li');
        li.className = 'task-item' + (isDone ? ' done' : '');
        if (isDone) {
            li.innerHTML = `
                <span class="task-title">${escapeHtml(todo.text)}</span>
                <span class="task-desc">${escapeHtml(todo.description || '')}</span>
                <span class="task-done-badge">Done</span>
                <div class="task-actions">
                    <button class="delete-btn" data-id="${todo.id}">Delete</button>
                </div>
            `;
            taskListDone.appendChild(li);
        } else {
            li.innerHTML = `
                <span class="task-title">${escapeHtml(todo.text)}</span>
                <span class="task-desc">${escapeHtml(todo.description || '')}</span>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${todo.id}">Edit</button>
                    <button class="delete-btn" data-id="${todo.id}">Delete</button>
                    <input type="checkbox" class="task-checkbox" data-id="${todo.id}" title="Mark as done">
                </div>
            `;
            taskListActive.appendChild(li);
        }
    });

    document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', handleDelete));
    document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', handleEdit));
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

async function handleDelete(e) {
    const id = e.target.getAttribute('data-id');
    await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
    });
    fetchTodos();
}

async function handleEdit(e) {
    const id = e.target.getAttribute('data-id');
    const res = await fetch('/api/todos');
    const data = await res.json();
    const todo = (data.sqlite || []).find(t => t.id == id);
    if (!todo) return;
    const newTitle = prompt("Edit Task Title:", todo.text);
    const newDesc = prompt("Edit Task Description:", todo.description || '');
    if (newTitle !== null) {
        await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: newTitle,
                description: newDesc !== null ? newDesc : todo.description,
                completed: todo.completed
            })
        });
        fetchTodos();
    }
}

async function handleCheck(e) {
    const id = e.target.getAttribute('data-id');
    const res = await fetch('/api/todos');
    const data = await res.json();
    const todo = (data.sqlite || []).find(t => t.id == id);
    if (!todo) return;
    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: todo.text,
            description: todo.description,
            completed: 1
        })
    });
    fetchTodos();
}

