import {onLoginFormSubmit} from "./controller.js";
import {displayToast} from "./view.js";

export function login(form : HTMLFormElement, errorMessage : HTMLElement){
    
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let isLoginSucsessful = false;       
        const formData = new FormData(form, event.submitter) as any;

        try {
            isLoginSucsessful = onLoginFormSubmit(formData);
            form.reset();
        } catch (error) {
            console.error(error);
            console.log("show toast");
            displayToast(errorMessage, error);
        } 
        console.log("back from controller");
        console.log(`isLoginSucsessful = ${isLoginSucsessful}`);

        if (isLoginSucsessful) {
            window.location.href = "./index.html" 
        }
    });

}


