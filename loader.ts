import {Patient, Doctor, Laboratory, Test, Appointment, Prescription} from "./model.js";

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