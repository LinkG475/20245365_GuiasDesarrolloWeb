// Accediendo a los elementos del DOM
const inputCarnet = document.getElementById("idTxtCarnet");
const inputNombre = document.getElementById("idTxtNombre");
const inputDui = document.getElementById("idTxtDui");
const inputNit = document.getElementById("idTxtNit");
const inputFecha = document.getElementById("idTxtFecha");
const inputCorreo = document.getElementById("idTxtCorreo");
const inputEdad = document.getElementById("idTxtEdad");

const btnValidar = document.getElementById("idBtnValidar");
const btnLimpiar = document.getElementById("idBtnLimpiar");
const btnBorrarStorage = document.getElementById("idBtnBorrarStorage");
const contenedorTabla = document.getElementById("idTablaEstudiantes");

// Diccionario de Expresiones Regulares
const regex = {
    carnet: /^[A-Za-z]{2}[0-9]{3}$/,
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/,
    dui: /^[0-9]{8}-[0-9]{1}$/,
    nit: /^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}$/,
    fecha: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/,
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    edad: /^[0-9]{1,3}$/
};

// 1. CARGAR DATOS DESDE LOCALSTORAGE AL INICIAR
let arrayEstudiantes = JSON.parse(localStorage.getItem("estudiantesGuardados")) || [];

// Función auxiliar para aplicar las clases visuales de Bootstrap (is-valid / is-invalid)
const evaluarCampo = (input, expresion) => {
    const valor = input.value.trim();
    if (expresion.test(valor)) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
};

// Función para limpiar el formulario y los estados visuales
const limpiarFormulario = () => {
    const inputs = [inputCarnet, inputNombre, inputDui, inputNit, inputFecha, inputCorreo, inputEdad];
    inputs.forEach(input => {
        input.value = "";
        input.classList.remove("is-valid", "is-invalid");
    });
    inputCarnet.focus();
};

// Función para validar todos los campos y guardar el estudiante
const registrarEstudiante = () => {
    const vCarnet = evaluarCampo(inputCarnet, regex.carnet);
    const vNombre = evaluarCampo(inputNombre, regex.nombre);
    const vDui = evaluarCampo(inputDui, regex.dui);
    const vNit = evaluarCampo(inputNit, regex.nit);
    const vFecha = evaluarCampo(inputFecha, regex.fecha);
    const vCorreo = evaluarCampo(inputCorreo, regex.correo);
    const vEdad = evaluarCampo(inputEdad, regex.edad);

    if (vCarnet && vNombre && vDui && vNit && vFecha && vCorreo && vEdad) {
        const nuevoEstudiante = {
            carnet: inputCarnet.value.trim().toUpperCase(),
            nombre: inputNombre.value.trim(),
            dui: inputDui.value.trim(),
            nit: inputNit.value.trim(),
            fecha: inputFecha.value.trim(),
            correo: inputCorreo.value.trim(),
            edad: inputEdad.value.trim()
        };

        arrayEstudiantes.push(nuevoEstudiante);

        // 2. GUARDAR ARREGLO ACTUALIZADO EN LOCALSTORAGE
        localStorage.setItem("estudiantesGuardados", JSON.stringify(arrayEstudiantes));

        imprimirEstudiantes();
        limpiarFormulario();
    }
};

// Función para renderizar la tabla de estudiantes
const imprimirEstudiantes = () => {
    if (arrayEstudiantes.length === 0) {
        contenedorTabla.innerHTML = `<p class="text-muted text-center my-4">No hay estudiantes registrados.</p>`;
        return;
    }

    let filas = "";
    arrayEstudiantes.forEach((est, index) => {
        filas += `
            <tr>
                <td class="text-center fw-bold">${index + 1}</td>
                <td><span class="badge bg-primary">${est.carnet}</span></td>
                <td>${est.nombre}</td>
                <td>${est.dui}</td>
                <td>${est.nit}</td>
                <td>${est.fecha}</td>
                <td>${est.correo}</td>
                <td class="text-center">${est.edad}</td>
            </tr>
        `;
    });

    contenedorTabla.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-bordered align-middle">
                <thead class="table-dark text-center">
                    <tr>
                        <th>#</th>
                        <th>Carnet</th>
                        <th>Nombre</th>
                        <th>DUI</th>
                        <th>NIT</th>
                        <th>Nacimiento</th>
                        <th>Correo</th>
                        <th>Edad</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        </div>
    `;
};

// Eventos de botones
btnValidar.addEventListener("click", registrarEstudiante);
btnLimpiar.addEventListener("click", limpiarFormulario);

btnBorrarStorage.addEventListener("click", () => {
    localStorage.removeItem("estudiantesGuardados");
    arrayEstudiantes = [];
    imprimirEstudiantes();
});

// Mostrar datos guardados apenas cargue el documento
imprimirEstudiantes();