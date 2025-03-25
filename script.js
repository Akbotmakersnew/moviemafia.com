// Get the login form and error message elements
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

// Get the sign-up form and error message elements
const signupForm = document.getElementById('signup-form');
const signupErrorMsg = document.getElementById('signup-error-msg');

// Get the sign-up link element
const signupLink = document.getElementById('signup-link');

// Get the login and sign-up container elements
const loginContainer = document.querySelector('.login-container');
const signupContainer = document.querySelector('.signup-container');

// Add an event listener to the login form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate user input
    if (username === '' || password === '') {
        errorMsg.textContent = 'Please enter both username and password';
        return;
    }

    // Call the login function
    login(username, password);
});

// Add an event listener to the sign-up form
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate user input
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
        signupErrorMsg.textContent = 'Please fill out all fields';
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        signupErrorMsg.textContent = 'Passwords do not match';
        return;
    }

    // Call the sign-up function
    signup(username, email, password);
});

// Add an event listener to the sign-up link
signupLink.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

// Login function
async function login(username, password) {
    try {
        // Make a POST request to the server with the user credentials
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        // Get the response data
        const data = await response.json();

        // If the login is successful, redirect to the dashboard
        if (data.success) {
            window.location.href = '/dashboard.html';
        } else {
            // Display an error message
            errorMsg.textContent = data.message;
        }
    } catch (error) {
        console.error(error);
    }
}

// Sign-up function
async function signup(username, email, password) {
    try {
        // Make a POST request to the server with the user credentials
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        // Get the response data
        const data = await response.json();

        // If the sign-up is successful, redirect to the login page
        if (data.success) {
            window.location.href = '/index.html';
        } else {
            // Display an error message
            signupErrorMsg.textContent = data.message;
        }
    } catch (error) {
        console.error(error);
    }
}
