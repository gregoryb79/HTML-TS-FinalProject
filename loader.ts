import {Patient, Doctor, Laboratory, Test, Appointment, Prescription} from "./model.js";
/*
    Loads some pre generated data so there will be something in local storage
    to work with in demo mode.
*/

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

export async function importFromCSV(file : string){        
    
    const csvData = await fetchCSVFile(file);  // Wait for the CSV file to be fetched     

    return csvData.toString();    
}

export function parsePatiensCSV(csv : string) : Map<string, Patient> {

    const lines = csv.trim().split("\n").map(line => line.replace(/\r/g, ""));
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

export function parseDoctorsCSV(csv : string) : Map<string, Doctor> {

    const lines = csv.trim().split("\n").map(line => line.replace(/\r/g, ""));
    const doctors = new Map<string, Doctor>();

    for (const line of lines.slice(1)) { 
        console.log(line);
        const [id,name, surname, department] = line.split(",");
        
        doctors.set(id,
            {id,            
            name,
            surname,
            department}
        );
    }
    return doctors;
}


export function parseLabsCSV(csv : string) : Map<string, Laboratory> {

    const lines = csv.trim().split("\n").map(line => line.replace(/\r/g, ""));
    const labs = new Map<string, Laboratory>();

    for (const line of lines.slice(1)) { 
        const [id,name,department] = line.split(",");
        
        labs.set(id,
            {id,            
            name,            
            department}
        );
    }
    return labs;
}

export function parseTestsCSV(csv : string) : Map<string, Test> {

    const lines = csv.trim().split("\n").map(line => line.replace(/\r/g, ""));
    const tests = new Map<string, Test>();

    for (const line of lines.slice(1)) { 
        const [doctorID,patientID,testName,result,date,status] = line.split(",");
        const id = crypto.randomUUID().replaceAll("-", "").slice(-8);
        tests.set(id,
            {id,            
            doctorID,            
            patientID,
            testName,
            result,
            date: new Date(date),
            status: status as Test["status"]}
        );
    }
    return tests;
}

export function parsePrescriptionsCSV(csv : string) : Map<string, Prescription> {

    const lines = csv.trim().split("\n").map(line => line.replace(/\r/g, ""));
    const perscriptions = new Map<string, Prescription>();

    for (const line of lines.slice(1)) { 
        const [doctorID,patientID,drug,date] = line.split(",");
        const id = crypto.randomUUID().replaceAll("-", "").slice(-8);
        perscriptions.set(id,
            {id,            
            doctorID,            
            patientID,
            drug,            
            date: new Date(date)}
        );
    }
    return perscriptions;
}

export function parseAppointmentsCSV(csv : string) : Map<string, Appointment> {

    const lines = csv.trim().split("\n").map(line => line.replace(/\r/g, ""));
    const appointments = new Map<string, Appointment>();

    for (const line of lines.slice(1)) { 
        const [title,remarks,date,durationMinutes,hostID,host,visitorID,status] = line.split(",");
        const id = crypto.randomUUID().replaceAll("-", "").slice(-8);
        const today = new Date();
        const appointmentDate = new Date(date);
        appointmentDate.setHours(appointmentDate.getHours() - 2);//the generated file in Zoolo Time, so 2h shift is needed to get normal times
        let appointmentStatus = "";
        if (appointmentDate < today){
            appointmentStatus = "completed";
        } else {
            appointmentStatus = "scheduled";
        }
        appointments.set(id,
            {id,
            title,
            remarks,
            date: new Date(date),
            durationMinutes: parseInt(durationMinutes),
            hostID,            
            host: host as Appointment["host"],
            visitorID,
            status: appointmentStatus as Appointment["status"]            
            }
        );
    }
    return appointments;
}
