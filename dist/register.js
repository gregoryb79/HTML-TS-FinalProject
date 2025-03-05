import { onRegisterFormSubmit } from "./controller.js";
import { displayToast } from "./view.js";
export function register(patientForm, errorMessage) {
    patientForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(patientForm, event.submitter);
        try {
            onRegisterFormSubmit(formData);
            patientForm.reset();
            window.location.href = "./login.html";
        }
        catch (error) {
            console.error(error);
            console.log("show toast");
            displayToast(errorMessage, error);
        }
    });
}
