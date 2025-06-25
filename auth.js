const authForm = document.getElementById('auth-form');
const authBtn = document.getElementById('auth-btn');
const toggleLink = document.getElementById('toggle-link');
const authError = document.getElementById('auth-error');
const usernameInput = document.getElementById('auth-username');
const passwordInput = document.getElementById('auth-password');

let isLogin = true;

function setMode(loginMode) {
  isLogin = loginMode;
  authBtn.textContent = loginMode ? 'Sign In' : 'Sign Up';
  toggleLink.textContent = loginMode
    ? "Don't have an account? Sign up"
    : "Already have an account? Sign in";
  authError.style.display = 'none';
  authError.textContent = '';
}

toggleLink.onclick = function () {
  setMode(!isLogin);
};

authForm.onsubmit = async function (e) {
  e.preventDefault();
  authError.style.display = 'none';
  authError.textContent = '';
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) return;

  const endpoint = isLogin ? '/api/sqlite/login' : '/api/sqlite/register';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.error) {
    authError.textContent = data.error;
    authError.style.display = '';
  } else {
    window.location.href = '/index';
    console.log('Successul login:', data.message);
  }

  
};




setMode(true);