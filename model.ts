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

type Doctor = {
    id: string;
    Name: string;
    Surname: string;
    department: string;     
}

type Laboratory = {
    id: string;
    name: string;
    department: string;
}

type Appointment = {
    id: string;
    title: string;
    remarks: string;
    date: Date;
    durationMinutes: number;
    host: Doctor | Laboratory;
    visitor: Patient;
    status: "scheduled" | "completed" | "canceled";
}

type Recepie = {
    id: string;
    doctor: Doctor;
    patient: Patient;
    drug: string;
    date: Date;        
}

type Test = {
    id: string;
    doctor: Doctor;
    patient: Patient;
    result: string;
    date: Date; 
    status: "waiting" | "ready";
}

const patientsStorageKey = "patients";
const currentPatientStorageKey = "currPatient";
const doctorsStorageKey = "doctors";
const appointmentsStorageKey = "appointments";
const recepiesStorageKey = "recepies";
const labsStorageKey = "labs";
const testsStorageKey = "tests";

let patients = loadPatients();
let doctors = loadDoctors();
let appointments = loadAppointments();
let labs = loadLabs();
let recepies = loadRecepies();
let tests = loadTests();

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
    console.log(patients);
    const patientsArray = Array.from(patients.entries()); 
    localStorage.setItem(patientsStorageKey, JSON.stringify(patientsArray));

}

function loadDoctors(): Map<string, Doctor>{
    const storedDoctors = localStorage.getItem(doctorsStorageKey);
    
    if (!storedDoctors) return new Map(); 

    const doctorsArray: [string, Doctor][] = JSON.parse(storedDoctors); 
    return new Map<string,Doctor>(doctorsArray);
}

function saveDoctord(){

}

function loadLabs() : Map<string, Laboratory>{
    const storedLabs = localStorage.getItem(labsStorageKey);
    
    if (!storedLabs) return new Map(); 

    const labsArray: [string, Laboratory][] = JSON.parse(storedLabs); 
    return new Map<string,Laboratory>(labsArray);
}

function saveLaboratories(){

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

function loadRecepies(): Map<string,Recepie>{

    const storedRecepies = localStorage.getItem(recepiesStorageKey);
    
    if (!storedRecepies) return new Map(); 

    const recepiesArray: [string, Recepie][] = JSON.parse(storedRecepies);
 
    return new Map(recepiesArray.map(([id, recepie]) => [
        id,
        { ...recepie, date: new Date(recepie.date) } // Recreate Date object
    ]));
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

export function testFunction(){
    console.log("test");
    console.log(patients);
}

async function fetchCSVFile(file: string): Promise<string> {
    try {
        const response = await fetch(file);
        const text = await response.text();  // Wait for file content as text
        console.log(`${file} is loaded.`);
        return text;  // Return the file content
    } catch (error) {
        console.error("Error loading file:", error);  // Handle any errors
        throw error;  // Throw error to be handled by the calling function
    }
}

export async function importFromCSV(){
    
    const file = "./data/patients.csv";
    const csvData = await fetchCSVFile(file);  // Wait for the CSV file to be fetched
    console.log("got csv data");  // This will be logged after the CSV data is loaded
       
    const importedPatients = parsePatiensCSV(csvData);
    savePatients(importedPatients);
    console.log ("saving imported patients to local storage");
    patients = loadPatients();
    console.log ("loading imported patients from local storage");
    console.log(patients);
}

function parsePatiensCSV(csv : string) : Map<string, Patient> {

    const lines = csv.trim().split("\n");
    const patients = new Map<string, Patient>();

    for (const line of lines.slice(1)) { 
        const [id, password, name, surname,dateOfBirth,address,contactPhone,email ] = line.split(",");

        patients.set(id,
            {id,
            password,
            name,
            surname,
            dateOfBirth: new Date(dateOfBirth),
            address,
            contactPhone,
            email}
        );
    }

    return patients;

}