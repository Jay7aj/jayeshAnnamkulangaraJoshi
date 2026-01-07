const form = document.getElementById('loginForm');
const errorEl = document.getElementById('error');
const successEl = document.getElementById('success');

// Redirect if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

// Show registration success message
const msg = localStorage.getItem('registerSuccess');
if (msg) {
    successEl.textContent = msg;
    localStorage.removeItem('registerSuccess');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorEl.textContent = '';
    successEl.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        errorEl.textContent = 'Email and password are required';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Login failed';
            return;
        }

        // Store token before redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // redirect after short delay to ensure storage
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 50);

    } catch (err) {
        console.error(err);
        errorEl.textContent = 'Network error, please try again.';
    }
});
