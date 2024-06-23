import { registerUser, loginUser } from "../api/data/postData.js";


document.addEventListener("DOMContentLoaded", function () {

    //redirecting to 
    const customer = JSON.parse(sessionStorage.getItem('customer-HIYA'));
    if(customer){
        window.location.href="/src/HTML/profile.html"
    }

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const showSignupLink = document.getElementById("show-signup");
    const showLoginLink = document.getElementById("show-login");

    showSignupLink.addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", function (e) {
        e.preventDefault();
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

            try {
                await registerUser(userData);
                goToPreviousPage()
            } catch (error) {
                alert(error)
            }
        }
    });

    loginForm.addEventListener("submit", async function (e) {
        
        const errorDiv = document.querySelector(".error-msg");
        errorDiv ? errorDiv.textContent = "" : null;
        
        e.preventDefault();
        const credentials = {
            email: document.getElementById("login-email").value,
            password: document.getElementById("login-password").value
        };

        try {
            await loginUser(credentials);
            console.log("Login successful");
            goToPreviousPage()
        } catch (error) {
            console.error("Login failed", error);
            
            const errorMsg = document.createElement("div")
            errorMsg.textContent = "Adgangskode eller brugernavn er forkert. Prøv igen"
            errorMsg.classList.add("error-msg")
            errorMsg.classList.add("text-red-600")
            loginForm.appendChild(errorMsg)
        }
    });
});

function goToPreviousPage(){

    const previousUrl = document.referrer;
    window.location.href = previousUrl;
}
