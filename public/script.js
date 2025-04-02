const BASE_URL = "http://127.0.0.1:3000/api/v1/users";

// Register User
async function registerUser() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const messageEl = document.getElementById("register-message");

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            window.location.href = "login.html"; // Redirect to login page
        } else {
            messageEl.textContent = data.message;
        }
    } catch (error) {
        messageEl.textContent = "Registration failed!";
    }
}

// Login User
async function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const messageEl = document.getElementById("login-message");

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Important for cookies
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            messageEl.textContent = data.message;
        }
    } catch (error) {
        messageEl.textContent = "Login failed!";
    }
}

// Logout User
async function logoutUser() {
    try {
        const response = await fetch(`${BASE_URL}/logout`, {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            window.location.href = "login.html"; // Redirect to login after logout
        } else {
            document.getElementById("logout-message").textContent = "Logout failed!";
        }
    } catch (error) {
        document.getElementById("logout-message").textContent = "Logout failed!";
    }
}

// Request password reset
async function forgotPassword() {
    const email = document.getElementById("forgot-email").value;
    const message = document.getElementById("forgot-message");

    try {
        const response = await fetch("http://127.0.0.1:3000/api/v1/users/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        message.innerText = data.message;
        message.style.color = data.success ? "green" : "red";
    } catch (error) {
        message.innerText = "Something went wrong.";
        message.style.color = "red";
    }
}

// Reset password
async function resetPassword() {
    const newPassword = document.getElementById("new-password").value;
    const resetToken = document.getElementById("reset-token").value;
    const messageEl = document.getElementById("reset-message");

    try {
        const response = await fetch(`${BASE_URL}/reset-password/${resetToken}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
        });
        const data = await response.json();
        messageEl.textContent = data.message || "Password reset successful!";
        if (response.ok) {
            window.location.href = "login.html"; // Redirect to login after reset
        }
    } catch (error) {
        messageEl.textContent = "Error resetting password!";
    }
}