let currentPatient = null;
document.getElementById('patientForm').addEventListener('submit', function (event) {
    event.preventDefault();
    currentPatient = {
        id: document.getElementById('id').value,
        password: document.getElementById('password').value,
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        dateOfBirth: new Date(document.getElementById('dateOfBirth').value),
        address: document.getElementById('address').value,
        contactPhone: document.getElementById('contactPhone').value,
        email: document.getElementById('email').value,
    };
    document.getElementById('output').innerHTML = `<pre>${JSON.stringify(currentPatient, null, 2)}</pre>`;
});
document.getElementById('updateBtn').addEventListener('click', function () {
    if (currentPatient) {
        document.getElementById('id').value = currentPatient.id;
        document.getElementById('password').value = currentPatient.password;
        document.getElementById('name').value = currentPatient.name;
        document.getElementById('surname').value = currentPatient.surname;
        document.getElementById('dateOfBirth').value = currentPatient.dateOfBirth.toISOString().split('T')[0];
        document.getElementById('address').value = currentPatient.address;
        document.getElementById('contactPhone').value = currentPatient.contactPhone;
        document.getElementById('email').value = currentPatient.email;
    }
});
document.getElementById('exportBtn').addEventListener('click', function () {
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
