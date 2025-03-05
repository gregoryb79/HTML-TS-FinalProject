import {Patient} from "./model.js"

let currentPatient: Patient | null = null;

document.getElementById('patientForm')!.addEventListener('submit', function(event) {
    event.preventDefault();
    currentPatient = {
        id: (document.getElementById('id') as HTMLInputElement).value,
        password: (document.getElementById('password') as HTMLInputElement).value,
        name: (document.getElementById('name') as HTMLInputElement).value,
        surname: (document.getElementById('surname') as HTMLInputElement).value,
        dateOfBirth: new Date((document.getElementById('dateOfBirth') as HTMLInputElement).value),
        address: (document.getElementById('address') as HTMLInputElement).value,
        contactPhone: (document.getElementById('contactPhone') as HTMLInputElement).value,
        email: (document.getElementById('email') as HTMLInputElement).value,
    };
    document.getElementById('output')!.innerHTML = `<pre>${JSON.stringify(currentPatient, null, 2)}</pre>`;
});

document.getElementById('updateBtn')!.addEventListener('click', function() {
    if (currentPatient) {
        (document.getElementById('id') as HTMLInputElement).value = currentPatient.id;
        (document.getElementById('password') as HTMLInputElement).value = currentPatient.password;
        (document.getElementById('name') as HTMLInputElement).value = currentPatient.name;
        (document.getElementById('surname') as HTMLInputElement).value = currentPatient.surname;
        (document.getElementById('dateOfBirth') as HTMLInputElement).value = currentPatient.dateOfBirth.toISOString().split('T')[0];
        (document.getElementById('address') as HTMLInputElement).value = currentPatient.address;
        (document.getElementById('contactPhone') as HTMLInputElement).value = currentPatient.contactPhone;
        (document.getElementById('email') as HTMLInputElement).value = currentPatient.email;
    }
});

document.getElementById('exportBtn')!.addEventListener('click', function() {
    if (currentPatient) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentPatient));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "patient_info.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }
});

