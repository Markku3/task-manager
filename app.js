const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');

// Remove legacy localStorage keys except currentUser
Object.keys(localStorage).forEach(key => {
  if (key !== 'currentUser') localStorage.removeItem(key);
});

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const data = await res.json();
  renderTodos(data.sqlite || []);
}

function renderTodos(todos) {
  taskList.innerHTML = '';
  todos.forEach(todo => {
    if (Number(todo.completed) === 1) return; // Only show active (not done) todos
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <span class="task-title">${escapeHtml(todo.text)}</span>
      <span class="task-desc">${escapeHtml(todo.description || '')}</span>
      <div class="task-actions">
          <input type="checkbox" class="task-checkbox" data-id="${todo.id}" title="Mark as done">
          <button data-id="${todo.id}" class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  document.querySelectorAll('.task-checkbox').forEach(cb =>
    cb.addEventListener('change', handleCheck));
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

if (taskForm) {
  taskForm.onsubmit = async function (e) {
    e.preventDefault();
    const text = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    if (text === '') return;
    await createTodo(text, description);
    taskTitle.value = '';
    taskDesc.value = '';
    fetchTodos();
  };
}

// Creating a todo:
async function createTodo(text, description) {
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, description })
  });
}

async function handleCheck(e) {
  const id = e.target.getAttribute('data-id');
  // Get the todo to update its text/desc
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

async function handleDelete(e) {
  const id = e.target.getAttribute('data-id');
  await fetch(`/api/todos/${id}`, {
    method: 'DELETE'
  });
  fetchTodos();
}

fetch('/api/me')
  .then(res => {
    if (!res.ok) window.location.href = '/auth';
    return res.json();
  })
  .then(data => {
    fetchTodos();
  });