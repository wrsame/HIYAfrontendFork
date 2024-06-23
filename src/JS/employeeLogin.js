import { loginEmployee } from "../api/data/postData.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const credentialsEM = {
            email: document.getElementById("login-email").value,
            password: document.getElementById("login-password").value
        };

        try {
            await loginEmployee(credentialsEM);
            console.log("Login successful");
            window.history.back();
        } catch (error) {
            console.error("Login failed", error);
        }
    });
});
