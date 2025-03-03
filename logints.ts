document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("login-form") as HTMLFormElement;
    const errorMessage = document.getElementById("error-message") as HTMLElement;

    // Fetch the patients.csv file and parse it into an array of objects
    async function loadPatients(): Promise<{ id: string; password: string }[]> {
        try {
            const response = await fetch("/data/patients.csv"); // Fetch from the "data" folder
            const text = await response.text();
            const rows = text.split("\n").map(row => row.trim().split(","));
    
            // Assuming first row is the header: ["id", "password"]
            return rows.slice(1).map(row => ({
                id: row[0], 
                password: row[1]
            }));
        } catch (error) {
            console.error("Error loading patient data:", error);
            return [];
        }
    }
    

    // Load patients data before form submission
    const patients = await loadPatients();

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

        // Check if ID and password match a record in patients.csv
        const isValidUser = patients.some(patient => patient.id === id && patient.password === password);

        if (isValidUser) {
            errorMessage.textContent = "";
            alert("Login successful!");
        } else {
            errorMessage.textContent = "Invalid ID or password.";
        }
    });
});
