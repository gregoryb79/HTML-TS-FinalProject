import {addAppointment, getPassword, getPatientAppointments, isHostValid, setCurrentPatient} from "./model.js";

export function onLoginFormSubmit(formData: FormData) : boolean{
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

    if (!/^\d{9}$/.test(patientID)) {
        throw new Error("Invalid ID. Must contain exactly 9 digits.");      
    }

    if (!/^\d{10}$/.test(password)) {
        throw new Error("Invalid phone number. Must contain exactly 10 digits.");
    }
    const captchaChecked = formData.get("captcha");
    console.log(captchaChecked);
    if (!captchaChecked) {
        throw new Error ("You must check 'I'm not a robot'.");
        return;
    }
  
    const savedPassword = getPassword(patientID);    
    if (savedPassword === ""){
        throw new Error("No such patientID");
    }
    if (password === savedPassword){
        setCurrentPatient(patientID);
        return true;
    } else {
        throw new Error("ID and password dont match");        
    }      

}

export function onAppointmentConfirm(timeDate : Date, currHostID : string){
    const today = new Date;

    if (currHostID === ""){
        throw new Error("HostID must have a value");
    }
    if (typeof currHostID !== "string"){
        throw new Error("Host ID must be a string");
    }
    if (!timeDate){
        throw new Error("Time and Date must have a value");
    }
    if (timeDate < today){
        throw new Error("New appointment must be in the future");
    }
    if (!isHostValid(currHostID)){
        throw new Error("There is no such host");
    }
    const stop = new Date(timeDate);
    stop.setHours(stop.getHours() + 1);
    const currPatientAppointments = getPatientAppointments();
    if (currPatientAppointments.some(appointment => (appointment.date >= timeDate) && (appointment.date <= stop))){
        throw new Error("You already have appointment for this time");
    }



    addAppointment(timeDate,currHostID);

}