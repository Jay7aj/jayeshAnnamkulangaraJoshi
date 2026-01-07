const form = document.getElementById('registerForm');
const errorEl = document.getElementById('error');
// const successEl = document.getElementById('success');

if (localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    // successEl.textContent = '';

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.toLowerCase().trim();
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        errorEl.textContent = 'All fields are required';
        return;
    }

    if (!isValidEmail(email)) {
        errorEl.textContent = 'Please enter a valid email address';
        return;
    }



    const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        errorEl.textContent = data.error || 'Registration failed';
        return;
    }

    localStorage.setItem('registerSuccess', 'Registration successful. Please login.');
    window.location.href = 'login.html';

    // successEl.textContent = 'Registration successful. You can now login.';


});
