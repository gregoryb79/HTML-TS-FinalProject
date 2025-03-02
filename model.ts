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

}

type Recepie = {

}

type Test = {

}

function loadPatients(){

}

function savePatients(){

}

function loadDoctors(){

}

function saveDoctord(){

}

function loadLaboratories(){

}

function saveLaboratories(){

}