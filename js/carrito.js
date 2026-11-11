// Carrito: dibuja la MISMA mochila de localStorage que usan el catálogo y la ficha.
// Patrón de siempre: estado → render() → DOM. Los botones cambian el estado, nunca la tabla.

const DESCUENTO_TRANSFERENCIA = 0.10;

// ESTADO
let mochila = cargarMochila();   // [{ id, cantidad }]
let estadoCatalogo = 'cargando'; // 'cargando' | 'listo' | 'error'

// Referencias al DOM (se buscan una sola vez)
const estadoCarrito   = document.querySelector('#estado-carrito');
const contenido       = document.querySelector('#contenido-carrito');
const filas           = document.querySelector('#carrito-filas');
const elSubtotal      = document.querySelector('#carrito-subtotal');
const elPeso          = document.querySelector('#carrito-peso');
const filaDescuento   = document.querySelector('#fila-descuento');
const elDescuento     = document.querySelector('#carrito-descuento');
const elTotal         = document.querySelector('#carrito-total');
const seccionDespacho = document.querySelector('#seccion-despacho');
const formDespacho    = document.querySelector('#form-despacho');
const confirmacion    = document.querySelector('#confirmacion-pedido');
const detalleConfirm  = document.querySelector('#confirmacion-detalle');
const tituloConfirm   = document.querySelector('#confirmacion-titulo');

// --- Cálculos (funciones puras sobre el estado) ---
// Solo cuentan los productos que existen en el catálogo; los "no disponibles" no suman plata ni peso.
const itemsDisponibles = () => mochila.filter((i) => buscarProducto(i.id));
const subtotal = () => itemsDisponibles().reduce((acc, i) => acc + buscarProducto(i.id).precio * i.cantidad, 0);
const pesoTotal = () => itemsDisponibles().reduce((acc, i) => acc + buscarProducto(i.id).peso * i.cantidad, 0);
const cantidadTotal = () => mochila.reduce((acc, i) => acc + i.cantidad, 0);

// form.elements.metodo_pago es un RadioNodeList: su .value es el value del radio marcado
const metodoPago = () => formDespacho.elements.metodo_pago.value;
const descuento = () => (metodoPago() === 'transferencia' ? Math.round(subtotal() * DESCUENTO_TRANSFERENCIA) : 0);

// --- Acciones sobre el estado ---
function cambiarCantidad(id, delta) {
    const item = mochila.find((i) => i.id === id);
    if (!item) return;
    const nueva = item.cantidad + delta;
    if (nueva < 1 || nueva > CANTIDAD_MAXIMA) return; // para bajar de 1 está "Eliminar"
    item.cantidad = nueva;
}

function eliminar(id) {
    mochila = mochila.filter((i) => i.id !== id);
}

// --- Vista ---
function crearBoton(accion, id, texto, etiqueta, deshabilitado = false) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.dataset.accion = accion;
    boton.dataset.id = id;
    boton.textContent = texto;
    boton.setAttribute('aria-label', etiqueta); // "−" solo no dice nada a un lector de pantalla
    boton.disabled = deshabilitado;
    return boton;
}

// etiqueta: en mobile la tabla se apila como tarjetas y el CSS la muestra con attr(data-label)
function crearCelda(contenidoCelda, etiqueta = '') {
    const td = document.createElement('td');
    if (etiqueta) td.dataset.label = etiqueta;
    td.append(contenidoCelda); // append acepta nodos o strings (los strings entran como texto, nunca como HTML)
    return td;
}

function crearFila({ id, cantidad }) {
    const p = buscarProducto(id);
    const fila = document.createElement('tr');

    if (!p) {
        // Id guardado que ya no existe en el catálogo: se muestra para que el usuario pueda limpiarlo
        const aviso = crearCelda('Producto no disponible (ya no está en el catálogo)');
        aviso.colSpan = 4;
        fila.append(aviso, crearCelda(crearBoton('eliminar', id, 'Eliminar', 'Eliminar producto no disponible')));
        return fila;
    }

    const enlace = document.createElement('a');
    enlace.href = `producto.html?id=${encodeURIComponent(id)}`;
    enlace.textContent = p.nombre;

    const control = document.createElement('div');
    control.className = 'control-cantidad';
    const numero = document.createElement('span');
    numero.textContent = cantidad;
    control.append(
        crearBoton('restar', id, '−', `Quitar una unidad de ${p.nombre}`, cantidad <= 1),
        numero,
        crearBoton('sumar', id, '+', `Agregar una unidad de ${p.nombre}`, cantidad >= CANTIDAD_MAXIMA),
    );

    fila.append(
        crearCelda(enlace),
        crearCelda(formatoARS.format(p.precio), 'Precio unitario'),
        crearCelda(control, 'Cantidad'),
        crearCelda(formatoARS.format(p.precio * cantidad), 'Subtotal'),
        crearCelda(crearBoton('eliminar', id, 'Eliminar', `Eliminar ${p.nombre} del carrito`)),
    );
    return fila;
}

function mostrarEstado(mensaje, accion = null) {
    estadoCarrito.textContent = mensaje;
    if (accion === 'reintentar') {
        estadoCarrito.append(' ', crearBoton('reintentar', '', 'Reintentar', 'Reintentar la carga del catálogo'));
    } else if (accion === 'catalogo') {
        const enlace = document.createElement('a');
        enlace.href = 'index.html#catalogo';
        enlace.textContent = 'Ir al catálogo';
        estadoCarrito.append(' ', enlace);
    }
    estadoCarrito.hidden = false;
    contenido.hidden = true;
}

function render() {
    mostrarContador(cantidadTotal());

    if (estadoCatalogo === 'cargando') {
        mostrarEstado('Cargando tu carrito…');
        return;
    }
    if (estadoCatalogo === 'error') {
        mostrarEstado('No pudimos cargar el catálogo. Tu carrito sigue guardado.', 'reintentar');
        return;
    }
    if (mochila.length === 0) {
        mostrarEstado('Tu carrito está vacío.', 'catalogo');
        return;
    }

    filas.replaceChildren(...mochila.map(crearFila)); // una sola inserción en el DOM

    const montoDescuento = descuento();
    elSubtotal.textContent = formatoARS.format(subtotal());
    elPeso.textContent = `${pesoTotal()} g`;
    filaDescuento.hidden = montoDescuento === 0;
    elDescuento.textContent = `− ${formatoARS.format(montoDescuento)}`;
    elTotal.textContent = formatoARS.format(subtotal() - montoDescuento);

    // Si solo quedan productos no disponibles, no hay nada que despachar
    seccionDespacho.hidden = itemsDisponibles().length === 0;

    estadoCarrito.hidden = true;
    contenido.hidden = false;
}

function actualizar() {
    guardarMochila(mochila);
    render();
}

// --- Eventos ---
// Delegación: las filas se destruyen y recrean en cada render(), el <tbody> es estable.
filas.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-accion]');
    if (!boton) return;
    const { accion, id } = boton.dataset;
    if (accion === 'sumar') cambiarCantidad(id, +1);
    if (accion === 'restar') cambiarCantidad(id, -1);
    if (accion === 'eliminar') eliminar(id);
    actualizar();
});

// 'change' en el form: el evento de cada radio sube (burbuja) hasta el <form>
formDespacho.addEventListener('change', (e) => {
    if (e.target.name === 'metodo_pago') render();
});

// 'submit' SOLO se dispara si pasó la validación nativa (required, type="email", pattern)
formDespacho.addEventListener('submit', (e) => {
    e.preventDefault(); // sin esto el navegador recargaría la página
    if (itemsDisponibles().length === 0) return;

    const unidades = itemsDisponibles().reduce((acc, i) => acc + i.cantidad, 0);
    const total = subtotal() - descuento();
    const medio = metodoPago() === 'transferencia' ? 'transferencia bancaria' : 'tarjeta';
    detalleConfirm.textContent =
        `Registramos ${unidades} ${unidades === 1 ? 'unidad' : 'unidades'} por ${formatoARS.format(total)}, ` +
        `con pago por ${medio}. Es un pedido de demostración: no se cobró nada y tus datos no se guardaron.`;

    mochila = [];
    guardarMochila(mochila);
    formDespacho.reset();
    mostrarContador(0);

    contenido.hidden = true;
    estadoCarrito.hidden = true;
    confirmacion.hidden = false;
    tituloConfirm.focus(); // lleva al lector de pantalla (y a la vista) al mensaje nuevo
});

estadoCarrito.addEventListener('click', (e) => {
    if (e.target.closest('button[data-accion="reintentar"]')) location.reload();
});

// Otra pestaña cambió la mochila (agregaste algo en el catálogo): se relee y se redibuja
window.addEventListener('storage', (e) => {
    if (e.key !== CLAVE_MOCHILA) return;
    mochila = cargarMochila();
    if (mochila.length > 0) confirmacion.hidden = true;
    if (confirmacion.hidden) render();
});

// --- Arranque ---
render(); // "Cargando…" hasta que lleguen los productos
productosListos
    .then(() => { estadoCatalogo = 'listo'; })
    .catch((error) => {
        console.error('No se pudo cargar el catálogo:', error);
        estadoCatalogo = 'error';
    })
    .then(render);
