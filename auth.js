// Redirect to / if already signed in
if (localStorage.getItem('currentUser')) {
    window.location.href = '/';
}

const authForm = document.getElementById('auth-form');
const authBtn = document.getElementById('auth-btn');
const toggleLink = document.getElementById('toggle-link');
const authError = document.getElementById('auth-error');
let mode = 'signin'; // or 'signup'

function showError(msg) {
    authError.textContent = msg;
    authError.style.display = 'block';
}

function clearError() {
    authError.textContent = '';
    authError.style.display = 'none';
}

toggleLink.onclick = function() {
    if (mode === 'signin') {
        mode = 'signup';
        authBtn.textContent = 'Sign Up';
        toggleLink.textContent = 'Already have an account? Sign in';
    } else {
        mode = 'signin';
        authBtn.textContent = 'Sign In';
        toggleLink.textContent = "Don't have an account? Sign up";
    }
    clearError();
};

async function register(username, password) {
    const res = await fetch('/api/sqlite/register', { // <--- relative path!
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return await res.json();
}

async function login(username, password) {
    const res = await fetch('/api/sqlite/login', { // <--- relative path!
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return await res.json();
}

authForm.onsubmit = async function(e) {
    e.preventDefault();
    clearError();
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;

    if (!username || !password) {
        showError("Please fill in both fields.");
        return;
    }

    if (mode === 'signup') {
        const result = await register(username, password);
        if (result.error) {
            showError(result.error);
            return;
        }
        localStorage.setItem('currentUser', username);
        window.location.href = '/';
    } else {
        const result = await login(username, password);
        if (result.error) {
            showError(result.error);
            return;
        }
        localStorage.setItem('currentUser', username);
        window.location.href = '/';
    }
};