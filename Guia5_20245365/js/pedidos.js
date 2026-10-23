const pedidos = [];

const formPedido = document.getElementById("form-pedido");
const inputProducto = document.getElementById("input-producto");
const inputPrecio = document.getElementById("input-precio");
const inputCantidad = document.getElementById("input-cantidad");
const alertaValidacion = document.getElementById("alerta-validacion");
const inputPrecioMax = document.getElementById("input-precio-max");
const btnFiltrar = document.getElementById("btn-filtrar");
const btnMostrarTodos = document.getElementById("btn-mostrar-todos");
const btnLimpiar = document.getElementById("btn-limpiar");
const tablaPedidos = document.getElementById("tabla-pedidos");
const totalUnidades = document.getElementById("total-unidades");
const montoTotal = document.getElementById("monto-total");

function actualizarTabla(listaParaMostrar) {
    if (listaParaMostrar.length === 0) {
        tablaPedidos.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    No hay pedidos para mostrar.
                </td>
            </tr>`;
        return;
    }
    const filasHTML = listaParaMostrar.map(function(pedido) {
        const subtotal = pedido.precio * pedido.cantidad;
        return `
            <tr>
                <td class="ps-4">${pedido.producto}</td>
                <td class="text-end">$${pedido.precio.toFixed(2)}</td>
                <td class="text-center">${pedido.cantidad}</td>
                <td class="text-end pe-4 fw-semibold">$${subtotal.toFixed(2)}</td>
            </tr>`;
        });
        
        tablaPedidos.innerHTML = filasHTML.join("");
}

function actualizarIndicadores() {
    const totales = calcularTotales(pedidos);
    totalUnidades.textContent = totales.unidades;
    montoTotal.textContent = "$" + totales.monto.toFixed(2);
}

function validarPedido(producto, precio, cantidad) {
    if (producto.length === 0) {
        return "El nombre del producto no puede estar vacío.";   
    }
    if (precio <= 0 || isNaN(precio)) {
        return "El precio debe ser un número mayor a cero.";
    }
    if (isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
        return "La cantidad debe ser un número entero positivo.";
    }
    return "";
}

function agregarPedido(producto, precio, cantidad) {
    const nuevoPedido = {
        producto: producto,
        precio: precio,
        cantidad: cantidad
    };
    pedidos.push(nuevoPedido);
}

function filtrarProductos(precioMax){
    return pedidos.filter(function(pedido) { return pedido.precio <= precioMax;});
}

function calcularTotales(listaPedidos){
    const unidades = listaPedidos.reduce(function(acumulador, pedido){
        return acumulador + pedido.cantidad;
    }, 0);

    const monto = listaPedidos.reduce(function(acumulador, pedido){
        const subtotal = pedido.precio * pedido.cantidad;
        return acumulador+subtotal;
    }, 0);

    return {unidades: unidades, monto: monto};
}

function vaciarPedidos() {
    pedidos.length = 0;
};

function manejarAgregarPedido(event) {
    event.preventDefault();

    const producto = inputProducto.value.trim();
    const precio = Number(inputPrecio.value);
    const cantidad = Number(inputCantidad.value);

    const mensajeError = validarPedido(producto, precio, cantidad);
    if (mensajeError !== "") {
        alertaValidacion.textContent = mensajeError;
        alertaValidacion.classList.remove("d-none");
        return;
    }
    alertaValidacion.classList.add("d-none");
    registrarPedidoEnArreglo(producto, precio, cantidad);
    
    actualizarTabla(pedidos);
    actualizarIndicadores();
    formPedido.reset();
}

formPedido.addEventListener('submit', ManejarAgregarPedido());
