// Redirect to index.html if already signed in
if (localStorage.getItem('currentUser')) {
    window.location.href = 'index.html';
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

authForm.onsubmit = function(e) {
    e.preventDefault();
    clearError();
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;
    if (!username || !password) {
        showError("Please fill in both fields.");
        return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (mode === 'signup') {
        if (users[username]) {
            showError("Username already exists.");
            return;
        }
        users[username] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
    } else {
        if (!users[username] || users[username].password !== password) {
            showError("Incorrect username or password.");
            return;
        }
        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
    }
};