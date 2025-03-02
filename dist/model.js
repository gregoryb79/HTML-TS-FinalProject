import { importFromCSV, parsePatiensCSV } from "./loader.js";
const patientsStorageKey = "patients";
const currentPatientStorageKey = "currPatient";
const doctorsStorageKey = "doctors";
const appointmentsStorageKey = "appointments";
const perscriptionsStorageKey = "perscriptions";
const labsStorageKey = "labs";
const testsStorageKey = "tests";
let patients = loadPatients();
let doctors = loadDoctors();
let appointments = loadAppointments();
let labs = loadLabs();
let perscriptions = loadPrescriptions();
let tests = loadTests();
loadOnStart();
export function loadPatients() {
    const storedPatients = localStorage.getItem(patientsStorageKey);
    if (!storedPatients)
        return new Map();
    const patientsArray = JSON.parse(storedPatients);
    return new Map(patientsArray.map(([id, patient]) => [
        id,
        { ...patient, date: new Date(patient.dateOfBirth) } // Recreate Date object
    ]));
}
export function savePatients(patients) {
    console.log("saving patients");
    console.log(patients);
    const patientsArray = Array.from(patients.entries());
    localStorage.setItem(patientsStorageKey, JSON.stringify(patientsArray));
}
export function addPatient(patient) {
    patients.set(patient.id, patient);
}
function loadDoctors() {
    const storedDoctors = localStorage.getItem(doctorsStorageKey);
    if (!storedDoctors)
        return new Map();
    const doctorsArray = JSON.parse(storedDoctors);
    return new Map(doctorsArray);
}
function saveDoctord() {
}
function loadLabs() {
    const storedLabs = localStorage.getItem(labsStorageKey);
    if (!storedLabs)
        return new Map();
    const labsArray = JSON.parse(storedLabs);
    return new Map(labsArray);
}
function saveLaboratories() {
}
function loadAppointments() {
    const storedAppointments = localStorage.getItem(appointmentsStorageKey);
    if (!storedAppointments)
        return new Map();
    const appointmentsArray = JSON.parse(storedAppointments);
    return new Map(appointmentsArray.map(([id, appointment]) => [
        id,
        { ...appointment, date: new Date(appointment.date) } // Recreate Date object
    ]));
}
function loadPrescriptions() {
    const storedPrescriptions = localStorage.getItem(perscriptionsStorageKey);
    if (!storedPrescriptions)
        return new Map();
    const perscriptionsArray = JSON.parse(storedPrescriptions);
    return new Map(perscriptionsArray.map(([id, perscription]) => [
        id,
        { ...perscription, date: new Date(perscription.date) } // Recreate Date object
    ]));
}
function loadTests() {
    const storedTests = localStorage.getItem(testsStorageKey);
    if (!storedTests)
        return new Map();
    const testsArray = JSON.parse(storedTests);
    return new Map(testsArray.map(([id, test]) => [
        id,
        { ...test, date: new Date(test.date) } // Recreate Date object
    ]));
}
export function testFunction() {
    console.log("test");
    // console.log(patients);
}
async function loadOnStart() {
    if (patients.size === 0) {
        const csvData = await importFromCSV("./data/patients.csv");
        const importedPatients = parsePatiensCSV(csvData);
        savePatients(importedPatients);
        console.log("saving imported patients to local storage");
        patients = loadPatients();
        console.log("loading imported patients from local storage");
    }
    else {
        console.log("There are patients in local storage.");
    }
}
