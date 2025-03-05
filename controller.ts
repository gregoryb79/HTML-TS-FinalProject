import {addAppointment, addPatient, getPassword, getPatientAppointments, isHostValid, setCurrentPatient} from "./model.js";

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

export function onRegisterFormSubmit(formData: FormData){
    
    const name = formData.get("name");
    if (typeof name !== "string") {
        throw new Error("Name must be a string");
    }     
    if (!name) {
        throw new Error("Name can't be empty");
    } 
    console.log(name);

    const surname = formData.get("surname");
    if (typeof surname !== "string") {
        throw new Error("Surame must be a string");
    }     
    if (!surname) {
        throw new Error("Surame can't be empty");
    } 
    console.log(surname);
    
    const patientID = formData.get("id"); 
    if (typeof patientID !== "string") {
        throw new Error("Username must be a string");
    }  
    console.log(`patientID: <${patientID}>`); 
    if (!patientID) {
        throw new Error("patientID can't be empty");
    } 
    if (!/^\d{9}$/.test(patientID)) {
        throw new Error("Invalid ID. Must contain exactly 9 digits.");      
    }
    const password = getPassword(patientID);
    if (password){
        throw new Error("Such ID already on file");
    }

    const dateRaw = formData.get("dateOfBirth").toString();    
    if (!dateRaw) {
        throw new Error("Date can't be empty");
    }       
    const dateOfBirth = new Date(dateRaw);

    const address = formData.get("address");
    if (typeof address !== "string") {
        throw new Error("Address must be a string");
    }     
    if (!address) {
        throw new Error("Address can't be empty");
    } 

    const contactPhone = formData.get("contactPhone");
    if (typeof contactPhone !== "string") {
        throw new Error("Contact phone must be a string");
    } 
    if (!/^\d{10}$/.test(contactPhone)) {
        throw new Error("Invalid phone number. Must contain exactly 10 digits.");
    }
       
    const email = formData.get("email");
    if (typeof email !== "string") {
        throw new Error("email must be a string");
    }     
    if (!email) {
        throw new Error("email can't be empty");
    } 
    console.log(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        throw new Error("Invalid email format.");
    }    
    
    addPatient({id : patientID,
                password: contactPhone,
                name: name,
                surname: surname,
                dateOfBirth: dateOfBirth,
                address: address,
                contactPhone: contactPhone,
                email: email});    

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