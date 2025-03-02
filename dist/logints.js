document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("login-form");
    var errorMessage = document.getElementById("error-message");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var id = document.getElementById("id").value.trim();
        var password = document.getElementById("password").value.trim();
        var captchaChecked = document.getElementById("captcha").checked;
        if (!/^\d{9}$/.test(id)) {
            errorMessage.textContent = "Invalid ID. Must contain exactly 9 digits.";
            return;
        }
        if (!/^\d{10}$/.test(password)) {
            errorMessage.textContent = "Invalid phone number. Must contain exactly 10 digits.";
            return;
        }
        if (!captchaChecked) {
            errorMessage.textContent = "You must check 'I'm not a robot'.";
            return;
        }
        errorMessage.textContent = "";
        alert("Login successful!");
    });
});
