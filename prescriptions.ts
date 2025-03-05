import {getCurrentPatient, getHost, getPatient, getPatientAppointments, getPatientPrescriptions, getPatientTests} from "./model.js";


export function init(namePlacer : HTMLElement, prescriptionList : HTMLElement){
    
    const patientID = getCurrentPatient();
    if (patientID === ""){
        window.location.href = "./login.html";
    }

    const today = new Date;

    const currPatient = getPatient();

    namePlacer.textContent = `${currPatient.name} ${currPatient.surname}`;

    
    const prescriptions = getPatientPrescriptions();
    
    if (prescriptions.length  > 0){
        prescriptionList.innerHTML = "";
        for(const prescription of prescriptions){            
            const liEL = document.createElement("li");
            const date = prescription.date.toLocaleString("en-IL",{year: "numeric",month: "2-digit",day: "2-digit"});                                  
            liEL.dataset.id = prescription.id;
            liEL.textContent = `${date} ${prescription.drug}`;           
            prescriptionList.appendChild(liEL);
        }
    }
    else{
        prescriptionList.innerHTML = "";
        const liEL = document.createElement("li");
        liEL.textContent = `No prescriptions to display.`;
        prescriptionList.appendChild(liEL);
    }
    
}