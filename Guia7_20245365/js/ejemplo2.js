// Obteniendo la referencia de los elementos
// por medio de sus arreglos asociativos
// aqui se esta utilizando el atributo name de cada elemento
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
// PARA IMPRIMIR EL RESULTADO
const bodyModal = document.getElementById("idBodyModal");

// Recorrer el formulario
const recorrerFormulario = function () {
    let totText = 0;
    let totRadio = 0;
    let totCheck = 0;
    let totDate = 0;
    let totSelect = 0;
    let totFile = 0;
    let totPass = 0;
    let totEmail = 0;

    // Recorriendo elementos del formulario
    let elementos = formulario.elements;
    let totalElementos = elementos.length;

    for (let index = 0; index < totalElementos; index++) {
        // Accediendo a cada hijo del formulario
        let elemento = elementos[index];

        // verificando el tipo de control en el formulario
        let tipoElemento = elemento.type;
        // verificando el tipo de nodo
        let tipoNode = elemento.nodeName;

        // Contabilizando el total de INPUT TYPE = TEXT
        if (tipoElemento == "text" && tipoNode == "INPUT") {
            console.log(elemento);
            totText++;
        }
        // Contabilizando el total de INPUT TYPE = PASSWORD
        else if (tipoElemento == "password" && tipoNode == "INPUT") {
            console.log(elemento);
            totPass++;
        }
        // Contabilizando el total de INPUT TYPE = EMAIL
        else if (tipoElemento == "email" && tipoNode == "INPUT") {
            console.log(elemento);
            totEmail++;
        }
        // Contabilizando el total de INPUT TYPE = RADIO
        else if (tipoElemento == "radio" && tipoNode == "INPUT") {
            console.log(elemento);
            totRadio++;
        }
        // Contabilizando el total de INPUT TYPE = CHECKBOX
        else if (tipoElemento == "checkbox" && tipoNode == "INPUT") {
            console.log(elemento);
            totCheck++;
        }
        // Contabilizando el total de INPUT TYPE = FILE
        else if (tipoElemento == "file" && tipoNode == "INPUT") {
            console.log(elemento);
            totFile++;
        }
        // Contabilizando el total de INPUT TYPE = DATE
        else if (tipoElemento == "date" && tipoNode == "INPUT") {
            console.log(elemento);
            totDate++;
        }
        // Contabilizando el total de INPUT TYPE = EMAIL
        else if (tipoNode == "SELECT") {
            console.log(elemento);
            totSelect++;
        }
    }

    let resultado = `
        Total de input[type="text"] = ${totText}<br>
        Total de input[type="password"] = ${totPass}<br>
        Total de input[type="radio"] = ${totRadio}<br>
        Total de input[type="checkbox"] = ${totCheck}<br>
        Total de input[type="date"] = ${totDate}<br>
        Total de input[type="email"] = ${totEmail}<br>
        Total de select = ${totSelect}<br>
    `;

    bodyModal.innerHTML = resultado;
    //Funcion que permite mostrar el modal de Bootstrap
    //Esta funcion es definida por Bootstrap
    modal.show();
};

//agregando eventos al boton
button.onclick = () => {
    // Se comenta la función original para que no choque con la nueva tabla
    //recorrerFormulario();
    validarFormulario();
};

// Ejercicio complementario 1
const validarFormulario = function () {
        // Obteniendo los valores de los campos
        const nombre = document.getElementById("idNombre").value.trim();
        const apellidos = document.getElementById("idApellidos").value.trim();
        const fechaNacimiento = document.getElementById("idFechaNac").value;
        const correo = document.getElementById("idCorreo").value.trim();
        const password = document.getElementById("idPassword").value;
        const repeatPassword = document.getElementById("idPasswordRepetir").value;
        const selectPais = document.getElementById("idCmPais");
        const pais = selectPais.value;
        const inputArchivo = document.getElementById("idArchivo")
        
        // Obteniendo el radio seleccionado
        const carrera = document.querySelector('input[name="idRdCarrera"]:checked');
        // Obteniendo los checkboxes seleccionados
        const interesesSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');

        // a. Validar que los campos no estén vacíos
        if (!nombre || !apellidos || !fechaNacimiento || !correo || !password || !repeatPassword) {
            alert("Error: Por favor, complete todos los campos de texto.");
            return;
        }

        // b. Validar que la fecha de nacimiento no supere la fecha actual
        const fechaIngresada = new Date(fechaNacimiento);
        const fechaActual = new Date();
        if (fechaIngresada > fechaActual) {
            alert("Error: La fecha de nacimiento no puede ser en el futuro.");
            return;
        }

        // c. Validar correo con Expresiones Regulares
        const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!regexCorreo.test(correo)) {
            alert("Error: El formato del correo electrónico no es válido.");
            return;
        }

        // d. Validar contraseñas iguales
        if (password !== repeatPassword) {
            alert("Error: Las contraseñas no coinciden.");
            return;
        }

        // e. Validar al menos un interés seleccionado
        if (interesesSeleccionados.length === 0) {
            alert("Error: Debe seleccionar al menos una opción en 'Intereses'.");
            return;
        }

        // f. Validar selección de carrera
        if (!carrera) {
            alert("Error: Debe seleccionar una carrera.");
            return;
        }

        // g. Validar selección de país
        if (pais === "") {
            alert("Error: Debe seleccionar un país de origen.");
            return;
        }

        // Si pasa todas las validaciones, extraemos el texto de los intereses, pais y carrera
        const paisTexto = selectPais.options[selectPais.selectedIndex].text;
        const labelCarrera = document.querySelector(`label[for="${carrera.id}"]`);
        const carreraTexto = labelCarrera ? labelCarrera.textContent.trim() : carreraRadio.value;
        let listaIntereses = [];
        interesesSeleccionados.forEach(checkbox => {
            const labelInteres = document.querySelector(`label[for="${checkbox.id}"]`)
            listaIntereses.push(labelInteres ? labelInteres.textContent.trim() : checkbox.value);
        });

        let archivoAvatar = null;
        if (inputArchivo.files.length > 0) {
            archivoAvatar = inputArchivo.files[0]; // Extrae solo el nombre, ej: "mi_foto.jpg"
        }

        mostrarModalDOM(nombre, apellidos, fechaNacimiento, correo, listaIntereses.join(", "), carreraTexto, paisTexto, archivoAvatar);
};

/**
 * Función para generar la tabla y mostrarla en el modal
 */
function mostrarModalDOM(nombre, apellidos, fecha, correo, intereses, carrera, pais, archivoAvatar) {
    // Limpiamos el contenedor por si había datos previos (sin usar innerHTML = "")
    while (bodyModal.firstChild) {
        bodyModal.removeChild(bodyModal.firstChild);
    }

    // Creamos la tabla y le asignamos clases de Bootstrap
    const tabla = document.createElement("table");
    tabla.setAttribute("class", "table table-striped table-bordered");

    // Creamos el cuerpo de la tabla (tbody)
    const tbody = document.createElement("tbody");

    // Utilizamos una función de ayuda para no repetir el código de creación de filas
    tbody.appendChild(crearFila("Nombre:", nombre));
    tbody.appendChild(crearFila("Apellidos:", apellidos));
    tbody.appendChild(crearFila("Fecha de Nacimiento:", fecha));
    tbody.appendChild(crearFila("Correo:", correo));
    tbody.appendChild(crearFila("Intereses:", intereses));
    tbody.appendChild(crearFila("Carrera:", carrera));
    tbody.appendChild(crearFila("País:", pais));
    
    if (archivoAvatar) {
        // Creamos un enlace temporal local para previsualizar la imagen
        const urlImagen = URL.createObjectURL(archivoAvatar);
        
        // Creamos el elemento img con el DOM
        const img = document.createElement("img");
        img.setAttribute("src", urlImagen);
        img.setAttribute("class", "img-thumbnail mt-2");
        img.setAttribute("style", "max-width: 120px; max-height: 120px; object-fit: cover;");
        img.setAttribute("alt", "Avatar del usuario");

        // Pasamos el elemento 'img' a nuestra función de filas
        tbody.appendChild(crearFila("Avatar:", img));
    } else {
        tbody.appendChild(crearFila("Avatar:", "Ninguna imagen seleccionada"));
    }

    // Añadimos el tbody a la tabla y la tabla al modal
    tabla.appendChild(tbody);
    bodyModal.appendChild(tabla);

    // Mostramos el modal usando la API de Bootstrap 5
    modal.show();
}

/**
 * Función de ayuda para crear una fila (tr) con dos columnas (td)
 */
function crearFila(etiqueta, valor) {
    const tr = document.createElement("tr");

    const tdEtiqueta = document.createElement("th"); // Usamos 'th' para que salga en negrita
    tdEtiqueta.textContent = etiqueta; // textContent es el estándar DOM para agregar texto

    const tdValor = document.createElement("td");
    
    if (valor instanceof HTMLElement) {
        tdValor.appendChild(valor);
    } else {
        // Si es un texto normal, usamos textContent
        tdValor.textContent = valor;
    }

    tr.appendChild(tdEtiqueta);
    tr.appendChild(tdValor);

    return tr;
}
