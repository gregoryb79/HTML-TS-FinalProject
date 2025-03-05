import {getCurrentPatient, getHost, getPatient, getPatientAppointments, getPatientPrescriptions, getPatientTests} from "./model.js";


export function init(namePlacer : HTMLElement, testResults : HTMLElement,){
    
    const patientID = getCurrentPatient();
    if (patientID === ""){
        window.location.href = "./login.html";
    }

    const today = new Date;

    const currPatient = getPatient();

    namePlacer.textContent = `${currPatient.name} ${currPatient.surname}`;

    const tests = getPatientTests();
    
    if (tests.length > 0){
        testResults.innerHTML = "";
        for(const test of tests){          
            const liEL = document.createElement("li");
            const date = test.date.toLocaleString("en-IL",{year: "numeric",month: "2-digit",day: "2-digit"});                                  
            liEL.dataset.id = test.id;
            liEL.textContent = `${date} ${test.testName} - ${test.result}`;           
            testResults.appendChild(liEL);
        }
    }
    else{
        testResults.innerHTML = "";
        const liEL = document.createElement("li");
        liEL.textContent = `No tests to display.`;
        testResults.appendChild(liEL);
    }   
    
}