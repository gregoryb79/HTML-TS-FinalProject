import { importFromCSV, parsePatiensCSV, parseDoctorsCSV, parseLabsCSV, 
        parseTestsCSV, parsePrescriptionsCSV, parseAppointmentsCSV  } from "./loader.js";

export type Patient = {
    id: string;
    password: string;
    name: string;
    surname: string;
    dateOfBirth: Date;
    address: string;
    contactPhone: string;
    email: string;    
}

export type Doctor = {
    id: string;
    name: string;
    surname: string;
    department: string;     
}

export type Laboratory = {
    id: string;
    name: string;
    department: string;
}

export type Appointment = {
    id: string;
    title: string;
    remarks: string;
    date: Date;
    durationMinutes: number;
    hostID : string;
    host: "Doctor | Laboratory";
    visitorID: string;
    status: "scheduled" | "completed" | "canceled";
}

export type Prescription = {
    id: string;
    doctorID: string;
    patientID: string;
    drug: string;
    date: Date;        
}

export type Test = {
    id: string;
    doctorID: string;
    patientID: string;
    testName: string;
    result: string;
    date: Date; 
    status: "waiting" | "ready";
}

const patientsStorageKey = "patients";
const currentPatientStorageKey = "currPatient";
const doctorsStorageKey = "doctors";
const appointmentsStorageKey = "appointments";
const perscriptionsStorageKey = "prescriptions";
const labsStorageKey = "labs";
const testsStorageKey = "tests";

let patients = loadPatients();
let doctors = loadDoctors();
let appointments = loadAppointments();
let labs = loadLabs();
let prescriptions = loadPrescriptions();
let tests = loadTests();
let currPatient = loadCurrPatient();

loadOnStart();

/************************************/
/**         API FUNCTIONS          **/
/************************************/
export function testFunction(){
    console.log("test"); 
}

export function setCurrentPatient(patientID : string){
    sessionStorage.setItem(currentPatientStorageKey,patientID);
}

export function addPatient(patient : Patient){

    patients.set(patient.id,patient);
    savePatients(patients);

}

export function getPassword(patientID : string) : string{

    const password = patients.get(patientID)?.password ?? "";    
    if (password) {
        return password;        
    }else{
        return "";
    }     
}

export function getPatientAppointments() : Appointment[]{
    const currPatientAppointments = Array.from(appointments.values().filter(appointment => appointment.visitorID === currPatient));
    return currPatientAppointments;
}

export function getPatientTests() : Test[]{
    const currPatientTests = Array.from(tests.values().filter(test => test.patientID === currPatient));
    return currPatientTests;
}

export function getPatientPrescriptions() : Prescription[]{
    const currPatientPrescriptions = Array.from(prescriptions.values().filter(prescription => prescription.patientID === currPatient));
    return currPatientPrescriptions;
}

export function getDoctorByID(doctorID : string) : Doctor{
    return doctors.get(doctorID);
}

export function getHostAppointments(hostID : string) : Appointment[]{
    const hostAppointments = Array.from(appointments.values().filter(appointment => appointment.hostID === hostID));
    return hostAppointments;
}

export function isHostValid(hostID : string) : boolean{
    if (labs.has(hostID) || doctors.has(hostID)){
        return true;
    } else {
        return false;
    }
}

export function addAppointment(date: Date, hostID : string){
    const id = crypto.randomUUID().replaceAll("-", "").slice(-8);
    const title = "Appointment to " + (labs.get(hostID)?.name ?? ("Doctor " + doctors.get(hostID)?.name + " " + doctors.get(hostID)?.surname));
    const host = labs.has(hostID) ? "Laboratory" : "Doctor";
    const appointment : Appointment = {
        id : id,
        title: title,
        remarks: "",
        date: date,
        durationMinutes: 60,
        hostID: hostID,
        host: host as Appointment["host"],
        visitorID: currPatient,
        status: "scheduled"
    };

    appointments.set(id,appointment);
    saveAppointments(appointments);
}

export function getListOfDepartments(hostType : string) : string[]{

    let departments : string[] = [];
    if (hostType === "Doctor"){
        departments = Array.from(new Set(Array.from(doctors.values()).map(doctor => doctor.department)));
    }
    if (hostType === "Laboratory"){
        departments = Array.from(new Set(Array.from(labs.values()).map(lab => lab.department)));
    }

    return departments;
}   

export function getHosts(departmentType : string, hostType : string){
    if (hostType === "Doctor"){
        const doctorsAtDepartment = Array.from(doctors.values().filter(doctor => doctor.department === departmentType));
        return doctorsAtDepartment;
    }
    if (hostType === "Laboratory"){
        const labsAtDepartment = Array.from(labs.values().filter(lab => lab.department === departmentType));
        return labsAtDepartment;
    }
}

export function appointmentsForDate(hostID : string, day : Date) : Appointment[]{
    
    const start = new Date(day);
    start.setHours(0,0,0,1);
    const stop = new Date(day);
    stop.setHours(23,59,59,99);
    console.log(`Time interval is from ${start} to ${stop}`);
    
    const hostAppointmentsForDate = Array.from(appointments.values().filter(appointment => (appointment.hostID === hostID) && (appointment.date > start) && (appointment.date < stop)));    
    hostAppointmentsForDate.sort((a,b) => a.date.getTime() - b.date.getTime());     

    return hostAppointmentsForDate ?? [];
}

/************************************/

function loadCurrPatient() : string{
    return sessionStorage.getItem(currentPatientStorageKey) ?? "";
}

function loadPatients(): Map<string, Patient> {
    const storedPatients = localStorage.getItem(patientsStorageKey);
    
    if (!storedPatients) return new Map(); 

    const patientsArray: [string, Patient][] = JSON.parse(storedPatients);
 
    return new Map(patientsArray.map(([id, patient]) => [
        id,
        { ...patient, date: new Date(patient.dateOfBirth) } // Recreate Date object
    ]));
}

function savePatients(patients: Map<string, Patient>){
    console.log("saving patients");    
    const patientsArray = Array.from(patients.entries()); 
    localStorage.setItem(patientsStorageKey, JSON.stringify(patientsArray));

}

function loadDoctors(): Map<string, Doctor>{
    const storedDoctors = localStorage.getItem(doctorsStorageKey);
    
    if (!storedDoctors) return new Map(); 

    const doctorsArray: [string, Doctor][] = JSON.parse(storedDoctors); 
    return new Map<string,Doctor>(doctorsArray);
}

function saveDoctors(doctors : Map<string, Doctor>){
    console.log("saving doctors");    
    const doctorsArray = Array.from(doctors.entries()); 
    localStorage.setItem(doctorsStorageKey, JSON.stringify(doctorsArray));
}

function loadLabs() : Map<string, Laboratory>{
    const storedLabs = localStorage.getItem(labsStorageKey);
    
    if (!storedLabs) return new Map(); 

    const labsArray: [string, Laboratory][] = JSON.parse(storedLabs); 
    return new Map<string,Laboratory>(labsArray);
}

function saveLabs(labs :  Map<string, Laboratory>){
    console.log("saving labs");    
    const labsArray = Array.from(labs.entries()); 
    localStorage.setItem(labsStorageKey, JSON.stringify(labsArray));
}

function loadAppointments(): Map<string,Appointment>{

    const storedAppointments = localStorage.getItem(appointmentsStorageKey);
    
    if (!storedAppointments) return new Map(); 

    const appointmentsArray: [string, Appointment][] = JSON.parse(storedAppointments);
 
    return new Map(appointmentsArray.map(([id, appointment]) => [
        id,
        { ...appointment, date: new Date(appointment.date) } // Recreate Date object
    ]));
}

function saveAppointments(appointments : Map<string,Appointment>){
    console.log("saving Appointments");    
    const appointmentsArray = Array.from(appointments.entries()); 
    localStorage.setItem(appointmentsStorageKey, JSON.stringify(appointmentsArray));
}

function loadPrescriptions(): Map<string,Prescription>{

    const storedPrescriptions = localStorage.getItem(perscriptionsStorageKey);
    
    if (!storedPrescriptions) return new Map(); 

    const perscriptionsArray: [string, Prescription][] = JSON.parse(storedPrescriptions);
 
    return new Map(perscriptionsArray.map(([id, perscription]) => [
        id,
        { ...perscription, date: new Date(perscription.date) } // Recreate Date object
    ]));
}

function savePrescriptions(prescriptions : Map<string,Prescription>){
    console.log("saving Prescriptions");    
    const prescriptionsArray = Array.from(prescriptions.entries()); 
    localStorage.setItem(perscriptionsStorageKey, JSON.stringify(prescriptionsArray));
}

function loadTests(): Map<string,Test>{

    const storedTests = localStorage.getItem(testsStorageKey);
    
    if (!storedTests) return new Map(); 

    const testsArray: [string, Test][] = JSON.parse(storedTests);
 
    return new Map(testsArray.map(([id, test]) => [
        id,
        { ...test, date: new Date(test.date) } // Recreate Date object
    ]));
}

function saveTests(tests : Map<string,Test>){
    console.log("saving Prescriptions");    
    const testsArray = Array.from(tests.entries()); 
    localStorage.setItem(testsStorageKey, JSON.stringify(testsArray));
}

//Loads some pre generated data - for demo mode, if the local storage is empty
async function loadOnStart(){
    if (patients.size === 0){
        const csvData = await importFromCSV("./data/patients.csv");
        const importedPatients = parsePatiensCSV(csvData);
        savePatients(importedPatients);
        console.log ("saving imported patients to local storage");
        patients = loadPatients();
        console.log ("loading imported patients from local storage");        
    } else {
        console.log("There are patients in local storage.");
    }

    if (doctors.size === 0){
        const csvData = await importFromCSV("./data/doctors.csv");
        const importedDoctors = parseDoctorsCSV(csvData);
        saveDoctors(importedDoctors);
        console.log ("saving imported doctors to local storage");
        doctors = loadDoctors();
        console.log ("loading imported doctors from local storage");        
    } else {
        console.log("There are doctors in local storage.");
    }

    if(labs.size === 0){
        const csvData = await importFromCSV("./data/laboratories.csv");
        const importedLabs = parseLabsCSV(csvData);
        saveLabs(importedLabs);
        console.log ("saving imported labs to local storage");
        labs = loadLabs();
        console.log ("loading imported labs from local storage"); 
    } else {
        console.log("There are labs in local storage.");
    }

    if(tests.size === 0){
        const csvData = await importFromCSV("./data/tests.csv");
        const importedTests = parseTestsCSV(csvData);
        saveTests(importedTests);
        console.log ("saving imported tests to local storage");
        tests = loadTests();
        console.log ("loading imported tests from local storage"); 
    } else {
        console.log("There are tests in local storage.");
    }

    if(prescriptions.size === 0){
        const csvData = await importFromCSV("./data/prescriptions.csv");
        const importedPrescriptions = parsePrescriptionsCSV(csvData);
        savePrescriptions(importedPrescriptions);
        console.log ("saving imported prescriptions to local storage");
        prescriptions = loadPrescriptions();
        console.log ("loading imported prescriptions from local storage"); 
    } else {
        console.log("There are prescriptions in local storage.");
    }

    if(appointments.size === 0){
        const csvData = await importFromCSV("./data/appointments.csv");
        const importedPerscriptions = parseAppointmentsCSV(csvData);
        saveAppointments(importedPerscriptions);
        console.log ("saving imported appointments to local storage");
        appointments = loadAppointments();
        console.log ("loading imported appointments from local storage"); 
    } else {
        console.log("There are appointments in local storage.");
    }

}