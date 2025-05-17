let storedData = [];

window.onload = () => {
    loadData().then(() => {
        showMainMenu();
    });
};

function showMainMenu() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Servicio de Validación</h2>
        <button onclick="validateCedula()">Validar Cédula</button>
        <button onclick="registerCedula()">Registrar Cédula</button>
    `;
}

function validateCedula() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Validar Cédula</h2>
        <input type="text" id="cedula" placeholder="Introduce la cédula">
        <button onclick="checkCedula()">Validar</button>
        <button onclick="showMainMenu()">Volver</button>
    `;
}

function checkCedula() {
    const cedula = document.getElementById('cedula').value.trim();
    if (!modulo10(cedula)) {
        alert("Cédula inválida");
        return;
    }

    const match = storedData.find(d => d.cedula === cedula);
    if (match) {
        alert(`Cédula válida\nNombre: ${match.nombre}\nEdad: ${match.edad}\nSexo: ${match.sexo}`);
        showMainMenu();
    } else {
        if (confirm("Cédula válida pero no registrada. ¿Deseas registrarla?")) {
            registerCedula(cedula);
        } else {
            showMainMenu();
        }
    }
}

function registerCedula(prefilledCedula = "") {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Registrar Cédula</h2>
        <input type="text" id="nombre" placeholder="Nombre completo">
        <input type="number" id="edad" placeholder="Edad">
        <select id="sexo">
            <option value="">Seleccione sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
        </select>
        <input type="text" id="cedula" value="${prefilledCedula}" placeholder="Cédula">
        <button onclick="saveCedula()">Guardar</button>
        <button onclick="showMainMenu()">Cancelar</button>
    `;
}

function saveCedula() {
    const nombre = document.getElementById('nombre').value.trim();
    const edad = document.getElementById('edad').value.trim();
    const sexo = document.getElementById('sexo').value;
    const cedula = document.getElementById('cedula').value.trim();

    if (!nombre || !edad || !sexo || !cedula) {
        alert("Completa todos los campos.");
        return;
    }

    if (!modulo10(cedula)) {
        alert("La cédula no es válida.");
        return;
    }

    storedData.push({ nombre, edad, sexo, cedula });
    saveData();
    alert("Registro exitoso.");
    showMainMenu();
}

function modulo10(cedula) {
    if (!/^\d{11}$/.test(cedula)) return false;

    let suma = 0;
    for (let i = 0; i < 10; i++) {
        let num = parseInt(cedula[i]);
        if ((i % 2) === 0) num *= 1;
        else num *= 2;
        if (num > 9) num -= 9;
        suma += num;
    }
    let verificador = (10 - (suma % 10)) % 10;
    return verificador === parseInt(cedula[10]);
}

function loadData() {
    const local = localStorage.getItem('cedulas');
    if (local) {
        storedData = JSON.parse(local);
        return Promise.resolve();
    } else {
        return fetch('data.json')
            .then(response => response.json())
            .then(data => {
                storedData = data;
                saveData(); 
            })
            .catch(error => {
                console.error('Error al cargar data.json:', error);
            });
    }
}

function saveData() {
    localStorage.setItem('cedulas', JSON.stringify(storedData));
}
