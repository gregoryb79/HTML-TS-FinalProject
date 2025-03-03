import { getPassword, setCurrentPatient } from "./model.js";
export function onLoginFormSubmit(formData) {
    const patientID = formData.get("id");
    if (typeof patientID !== "string") {
        throw new Error("Username must be a string");
    }
    const password = formData.get("password");
    if (typeof password !== "string") {
        throw new Error("Password must be a string");
    }
    console.log(password);
    console.log(`patientID: <${patientID}>`);
    if (!patientID) {
        throw new Error("patientID can't be empty");
    }
    if (!password) {
        throw new Error("Password can't be empty");
    }
    const savedPassword = getPassword(patientID);
    if (savedPassword === "") {
        throw new Error("No such patientID");
    }
    if (password === savedPassword) {
        setCurrentPatient(patientID);
        return true;
    }
    else {
        throw new Error("username and password dont match");
    }
}
