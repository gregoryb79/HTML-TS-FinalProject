import { getPatientAppointments, getListOfDepartments, getHosts, appointmentsForDate, 
        getHostAppointments, getCurrentPatient, getPatient } from "./model.js";
import {onAppointmentConfirm} from "./controller.js";

export function init (hostTypeSelector : HTMLSelectElement, departmentSelector : HTMLSelectElement, 
                    hostSelector : HTMLSelectElement, dateSelector : HTMLInputElement,
                    timeSlotsList : HTMLElement, selection : HTMLElement, newAppointment : HTMLFormElement,
                    namePlacer : HTMLElement
                 ){

    const patientID = getCurrentPatient();
    if (patientID === ""){
        window.location.href = "./login.html";
    }
    const currPatient = getPatient();
    namePlacer.textContent = `${currPatient.name} ${currPatient.surname}`;

    //const patientAppointments = getPatientAppointments();
    
    let hostType = hostTypeSelector.value;
    populateDepartments(hostType);
    let departmentType = departmentSelector.value;
    populateHosts(departmentType,hostType);
    let currHostID = hostSelector.value;
    let currHost = hostSelector.textContent;    
    let selectedTimeDate = new Date;
    let patientSelect = false;
        
    let today = new Date;
    dateSelector.value = today.toISOString().slice(0, 10);  
    let selectedDate = new Date;
      
    updateAll();    
    
    hostTypeSelector.addEventListener("change",function(e){
        hostType = hostTypeSelector.value;
        console.log(hostType);
        populateDepartments(hostType);
        departmentType = departmentSelector.value;
        populateHosts(departmentType,hostType);
        updateAll();
    });

    departmentSelector.addEventListener("change",function(e){
        departmentType = departmentSelector.value;
        populateHosts(departmentType,hostType);
        updateAll();
    });  

    hostSelector.addEventListener("change",function(e){
        currHostID = hostSelector.value;
        currHost = hostSelector.textContent;
    });

    dateSelector.addEventListener("change",function(e){
        selectedDate = new Date(dateSelector.value);
        console.log(`Selected date is: ${selectedDate}`);
        updateAll();
    });

    timeSlotsList.addEventListener("click",function(e){
        const target = (e.target as HTMLElement).closest("li");
        if (target.classList.contains("free")){
            selectedTimeDate = new Date(target.dataset.id);
            console.log(selectedTimeDate);
            const selectedTandD = selectedTimeDate.toLocaleString("en-IL",{year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false});            
            selection.textContent = `${hostType}: ${currHost}, from ${departmentType} at ${selectedTandD}`;
            patientSelect = true;
        }         
    });

    newAppointment.addEventListener("submit",function(e){
        e.preventDefault();

        try{
            onAppointmentConfirm(selectedTimeDate,currHostID);
            console.log("appointment added, the updated appointments are:");
            console.log(getPatientAppointments());
        }catch(error){
            console.error(error);
        }
        
    });
   
    function populateDepartments(hostType : string){
        departmentSelector.innerHTML = "";        
        const departments = getListOfDepartments(hostType);
        console.log(departments);
        for(const department of departments){            
            const optionEL = document.createElement("option");
            optionEL.textContent = department;            
            departmentSelector.appendChild(optionEL);
        }
    }

    function populateHosts(departmentType : string, hostType : string){        
        hostSelector.innerHTML = "";
        const hosts = getHosts(departmentType,hostType);
        console.log(hosts);
        for(const host of hosts){            
            const optionEL = document.createElement("option");
            if ("surname" in host){
                optionEL.textContent = `${host.name} ${host.surname}`;
            } else{
                optionEL.textContent = host.name;
            }
            optionEL.value = host.id;
            hostSelector.appendChild(optionEL);
        }
    }

    function renderAvailableTimes(){
        const hostAppointments = appointmentsForDate(currHostID,selectedDate);
        timeSlotsList.innerHTML = "";
        const timeAndDate = new Date(selectedDate);
        timeAndDate.setHours(8,0);

        console.log(hostAppointments);
        for (let i = 0; i < 8; i++){
            const liEL = document.createElement("li");
            const stop = new Date(timeAndDate);
            stop.setHours(stop.getHours() + 1);
            liEL.textContent = timeAndDate.toLocaleString("en-IL",{year: "numeric",month: "2-digit",day: "2-digit",hour: "2-digit",minute: "2-digit",hour12: false});
            liEL.dataset.id = timeAndDate.toISOString();          
            if (hostAppointments.some(appointment => (appointment.date >= timeAndDate) && (appointment.date <= stop)) || (timeAndDate < today)){
                liEL.textContent = liEL.textContent + " TAKEN";
                liEL.classList.add("taken");
            } else {
                liEL.textContent = liEL.textContent + " FREE";
                liEL.classList.add("free");
            }
            timeSlotsList.appendChild(liEL);
            timeAndDate.setHours(timeAndDate.getHours() + 1);
        }
    }

    function updateAll(){
        hostType = hostTypeSelector.value;
        departmentType = departmentSelector.value;
        currHostID = hostSelector.value;
        currHost = hostSelector.textContent; 
        renderAvailableTimes();        
        console.log("All host appointment:");
        console.log(getHostAppointments(currHostID));
    }

}
