document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form") as HTMLFormElement;
    const errorMessage = document.getElementById("error-message") as HTMLElement;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const id = (document.getElementById("id") as HTMLInputElement).value.trim();
        const password = (document.getElementById("password") as HTMLInputElement).value.trim();
        const captchaChecked = (document.getElementById("captcha") as HTMLInputElement).checked;

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
