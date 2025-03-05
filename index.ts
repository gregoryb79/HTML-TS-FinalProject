import {getCurrentPatient, getHost, getPatient, getPatientAppointments, getPatientPrescriptions, getPatientTests} from "./model.js";


export function init(namePlacer : HTMLElement, appointmentList : HTMLElement, 
                    testResults : HTMLElement, prescriptionList : HTMLElement){
    
    const patientID = getCurrentPatient();
    if (patientID === ""){
        window.location.href = "./login.html";
    }

    const today = new Date;

    const currPatient = getPatient();

    namePlacer.textContent = `${currPatient.name} ${currPatient.surname}`;

    const maxRows = 5;// Maximum number of rows on dashboard
    const allAppointments = getPatientAppointments();
    console.log(allAppointments);
    const appointments = allAppointments.filter(appointment => appointment.date > today);
    console.log(appointments);

    let rowsToPrint = Math.min(appointments.length,maxRows);
    console.log(rowsToPrint);
    if (rowsToPrint > 0){
        appointmentList.innerHTML = "";
        for(let i = 0; i < rowsToPrint; i++){            
            const appointment = appointments[i];
            const liEL = document.createElement("li");
            const date = appointment.date.toLocaleString("en-IL",{year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false});           
            const host = getHost(appointment.host,appointment.hostID);            
            liEL.dataset.id = appointment.id;
            liEL.textContent = `${date} `;
            if ("surname" in host){
                liEL.textContent = liEL.textContent + `Dr. ${host.name} ${host.surname}`;
            } else{
                liEL.textContent = liEL.textContent + `${host.name}`;
            }
            appointmentList.appendChild(liEL);
        }
    }
    else{
        appointmentList.innerHTML = "";
        const liEL = document.createElement("li");
        liEL.textContent = `No upcoming appointments.`;
        appointmentList.appendChild(liEL);
    }

    const tests = getPatientTests();
    rowsToPrint = Math.min(tests.length,maxRows);
    if (rowsToPrint > 0){
        testResults.innerHTML = "";
        for(let i = 0; i < rowsToPrint; i++){            
            const test = tests[i];
            const liEL = document.createElement("li");
            const date = test.date.toLocaleString("en-IL",{year: "numeric",month: "2-digit",day: "2-digit"});                                  
            liEL.dataset.id = test.id;
            liEL.textContent = `${date} ${test.testName} ${test.result}`;           
            testResults.appendChild(liEL);
        }
    }
    else{
        testResults.innerHTML = "";
        const liEL = document.createElement("li");
        liEL.textContent = `No tests to display.`;
        testResults.appendChild(liEL);
    }

    const prescriptions = getPatientPrescriptions();
    rowsToPrint = Math.min(prescriptions.length,maxRows);
    if (rowsToPrint > 0){
        prescriptionList.innerHTML = "";
        for(let i = 0; i < rowsToPrint; i++){            
            const prescription = prescriptions[i];
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