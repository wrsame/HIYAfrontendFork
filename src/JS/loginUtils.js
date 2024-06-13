import { registerUser, loginUser } from "../api/data/postData.js";


document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const showSignupLink = document.getElementById("show-signup");
    const showLoginLink = document.getElementById("show-login");

    showSignupLink.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Login link clicked");
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Login link clicked");
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const password = document.getElementById("signup-password").value;
        const repeatPassword = document.getElementById("signup-repeat-password").value;

        if (password !== repeatPassword) {
            alert("Passwords do not match!");
        } else {
            const userData = {
                firstName: document.getElementById("signup-firstname").value,
                lastName: document.getElementById("signup-lastname").value,
                email: document.getElementById("signup-email").value,
                password: password,
                password_confirmation: repeatPassword, 
                phone: document.getElementById("signup-phone").value
            };

            console.log(userData)

            try {
                await registerUser(userData);
                console.log("Sign up successful");
                window.history.back();
                // signupForm.reset();
                // signupForm.classList.add("hidden");
                // loginForm.classList.remove("hidden");
            } catch (error) {
                console.error("Sign up failed", error);
            }
        }
    });


    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const credentials = {
            email: document.getElementById("login-email").value,
            password: document.getElementById("login-password").value
        };

        try {
            await loginUser(credentials);
            console.log("Login successful");
            window.history.back();
            // loginForm.reset();
        } catch (error) {
            console.error("Login failed", error);
        }
    });
});
