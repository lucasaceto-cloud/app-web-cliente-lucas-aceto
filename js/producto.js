// Página de detalle. Lee el id de la URL, espera al catálogo de Supabase y dibuja UN producto.

// Etiquetas visibles de cada categoría (en la base se guarda el slug: 'mochilas', 'cocina'...)
const NOMBRES_CATEGORIA = {
    mochilas:    'Mochilas Frameless',
    refugios:    'Refugios y Carpas',
    aislamiento: 'Aislamiento y Quilts',
    cocina:      'Cocina & Filtrado',
};
// CANTIDAD_MAXIMA vive en config.js: catálogo, ficha y carrito respetan el mismo tope.

// producto.html?id=mochila-ultra-40 → location.search es "?id=mochila-ultra-40"
const idProducto = new URLSearchParams(location.search).get('id'); // null si no vino ?id=

const ficha          = document.querySelector('#ficha');
const estadoProducto = document.querySelector('#estado-producto');
const migaCategoria  = document.querySelector('#miga-categoria');
const migaProducto   = document.querySelector('#miga-producto');
const tablaSpecs     = document.querySelector('#tabla-especificaciones');
const inputCantidad  = document.querySelector('#cantidad');
const botonAgregar   = document.querySelector('#boton-agregar');
const confirmacion   = document.querySelector('#confirmacion-agregado');
const campo = (nombre) => ficha.querySelector(`[data-campo="${nombre}"]`);

let productoActual = null; // se completa cuando llegan los datos

// --- Estados: cargando / error de red / producto inexistente ---
// accion: 'reintentar' (falló la red: volver a pedir sirve) o 'volver' (el id no existe: reintentar no sirve)
function mostrarEstadoProducto(mensaje, accion = null) {
    estadoProducto.textContent = mensaje;
    if (accion === 'reintentar') {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.dataset.accion = 'reintentar';
        boton.textContent = 'Reintentar';
        estadoProducto.append(' ', boton);
    } else if (accion === 'volver') {
        const enlace = document.createElement('a');
        enlace.href = 'index.html#catalogo';
        enlace.textContent = 'Volver al catálogo';
        estadoProducto.append(' ', enlace);
    }
    estadoProducto.hidden = false;
    ficha.hidden = true;
}

// --- Vista ---
function crearFilaEspecificacion([parametro, valor]) {
    const fila = document.createElement('tr');
    const celdaParametro = document.createElement('th');
    celdaParametro.scope = 'row'; // el <th> de cada fila describe esa fila (lectores de pantalla)
    celdaParametro.textContent = parametro;
    const celdaValor = document.createElement('td');
    celdaValor.textContent = valor;
    fila.append(celdaParametro, celdaValor);
    return fila;
}

function renderProducto(p) {
    const categoria = NOMBRES_CATEGORIA[p.categoria] ?? p.categoria;

    document.title = `Vértice Ultralight | ${p.nombre}`; // el <title> también es parte del DOM
    campo('nombre').textContent = p.nombre;
    campo('imagen').src = p.imagen;
    campo('imagen').alt = p.alt;
    campo('descripcion').textContent = p.descripcion;
    campo('precio').textContent = formatoARS.format(p.precio);

    migaCategoria.textContent = categoria;
    migaCategoria.dataset.categoria = p.categoria;
    migaProducto.textContent = p.nombre;

    // Ficha técnica: primero las columnas comunes a todos, después el array propio del producto
    const especificaciones = Array.isArray(p.especificaciones) ? p.especificaciones : [];
    const filas = [
        ['Categoría', categoria],
        ['Peso neto', `${p.peso} g`],
        ['Distintivo técnico', p.badge],
        ...especificaciones.map((e) => [e.parametro, e.valor]),
    ].filter(([, valor]) => valor); // badge puede ser null en la base: esa fila no se dibuja

    tablaSpecs.replaceChildren(...filas.map(crearFilaEspecificacion)); // un solo cambio en el DOM

    estadoProducto.hidden = true;
    ficha.hidden = false;
}

function iniciar() {
    productoActual = idProducto ? buscarProducto(idProducto) : undefined;
    if (!productoActual) {
        // Los datos llegaron bien, pero ese id no existe (URL escrita a mano o producto borrado)
        migaProducto.textContent = 'Producto no encontrado';
        document.title = 'Vértice Ultralight | Producto no encontrado';
        mostrarEstadoProducto('No encontramos ese producto.', 'volver');
        return;
    }
    renderProducto(productoActual);
}

// --- Eventos ---
// Listener directo, sin delegación: este botón existe una sola vez y nunca se recrea.
// (En el catálogo sí hace falta delegar, porque cada render destruye y recrea las tarjetas.)
botonAgregar.addEventListener('click', () => {
    if (!productoActual) return;
    const cantidad = Number(inputCantidad.value); // .value de un input SIEMPRE es string
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > CANTIDAD_MAXIMA) {
        confirmacion.textContent = `Elegí una cantidad entera entre 1 y ${CANTIDAD_MAXIMA}.`;
        return;
    }

    // Misma clave de localStorage que la mochila del catálogo: es UNA sola mochila en todo el sitio
    const mochila = cargarMochila();
    const item = mochila.find((i) => i.id === productoActual.id);
    const yaTenias = item ? item.cantidad : 0;
    // El tope es por producto en TODA la mochila, no por click: 8 + 5 superaría el máximo
    if (yaTenias + cantidad > CANTIDAD_MAXIMA) {
        confirmacion.textContent = `Ya tenés ${yaTenias} en tu mochila: el máximo es ${CANTIDAD_MAXIMA} por producto.`;
        return;
    }
    if (item) item.cantidad += cantidad;
    else mochila.push({ id: productoActual.id, cantidad });
    guardarMochila(mochila);

    actualizarContador(); // contador.js relee el almacenamiento y actualiza el header
    confirmacion.textContent = `Agregaste ${cantidad} × ${productoActual.nombre} a tu mochila.`;
});

// Breadcrumb → catálogo ya filtrado. No hace falta preventDefault: sessionStorage.setItem es
// síncrono, así que el filtro queda escrito ANTES de que el navegador siga el link.
migaCategoria.addEventListener('click', () => {
    const categoria = migaCategoria.dataset.categoria;
    if (!categoria) return; // todavía cargando o producto inexistente: link común al catálogo
    guardarFiltros({ ...cargarFiltros(), categoria, precioMin: null, precioMax: null });
});

estadoProducto.addEventListener('click', (e) => {
    if (e.target.closest('button[data-accion="reintentar"]')) location.reload();
});

// --- Arranque ---
mostrarEstadoProducto('Cargando producto…');
productosListos.then(iniciar).catch((error) => {
    console.error('No se pudo cargar el producto:', error);
    migaProducto.textContent = 'Error';
    mostrarEstadoProducto('No pudimos cargar el producto.', 'reintentar');
});
