const catalogo  = document.querySelector('main#catalogo');
const plantilla = document.querySelector('#tpl-tarjeta');
const estado    = document.querySelector('#estado-catalogo');
const contadorResultados = document.querySelector('#contador-resultados');
const sinResultados       = document.querySelector('#sin-resultados');

const gruposCategoria = document.querySelector('#filtro-categorias');
const formPrecio      = document.querySelector('#form-precio');
const errorPrecio     = document.querySelector('#error-precio');
const selectOrden     = document.querySelector('#orden-catalogo');

// --- Estado de filtros (compartido con la URL de sessionStorage vía filtros.js) ---
let filtros = cargarFiltros();

function crearTarjeta(p) {
    const tarjeta = plantilla.content.cloneNode(true); // DocumentFragment con una copia del <article>
    const campo = (nombre) => tarjeta.querySelector(`[data-campo="${nombre}"]`);
    const url = `producto.html?id=${encodeURIComponent(p.id)}`;

    tarjeta.querySelector('article').dataset.id = p.id;
    campo('enlace-imagen').href = url;
    campo('enlace-imagen').setAttribute('aria-label', `Ver detalle de ${p.nombre}`);
    campo('imagen').src = p.imagen;
    campo('imagen').alt = p.alt;
    campo('badge').textContent = p.badge;
    campo('enlace-titulo').href = url;
    campo('enlace-titulo').textContent = p.nombre;
    campo('descripcion').textContent = p.descripcion;
    campo('peso').textContent = `${p.peso} g`;
    campo('precio').textContent = formatoARS.format(p.precio);
    return tarjeta;
}

// --- Estados de la carga: cargando / error / vacío ---
function mostrarEstado(mensaje, conReintento = false) {
    estado.textContent = mensaje; // textContent también vacía lo que hubiera (botón anterior incluido)
    if (conReintento) {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.dataset.accion = 'reintentar';
        boton.textContent = 'Reintentar';
        estado.append(' ', boton);
    }
    estado.hidden = false;
    contadorResultados.hidden = true;
    sinResultados.hidden = true;
}

function mostrarError(error) {
    console.error('No se pudo cargar el catálogo:', error); // el detalle va a la consola, no al usuario
    mostrarEstado('No pudimos cargar el catálogo.', true);
}

// --- Filtrado y orden: funciones puras sobre PRODUCTOS, nunca lo modifican ---
// Cada comparador es (a, b) => número: negativo si a va antes, positivo si va después.
const COMPARADORES = {
    'precio-asc':  (a, b) => a.precio - b.precio,
    'precio-desc': (a, b) => b.precio - a.precio,
    'peso-asc':    (a, b) => a.peso - b.peso,
    'nombre-asc':  (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
};

function aplicarFiltros(lista) {
    let resultado = filtros.categoria === 'todas'
        ? lista
        : lista.filter((p) => p.categoria === filtros.categoria);

    if (filtros.precioMin !== null) resultado = resultado.filter((p) => p.precio >= filtros.precioMin);
    if (filtros.precioMax !== null) resultado = resultado.filter((p) => p.precio <= filtros.precioMax);

    const comparador = COMPARADORES[filtros.orden];
    // sort() muta el array sobre el que se llama. resultado YA es una copia si hubo algún filter();
    // si "Todas" + sin precio, resultado todavía ES el PRODUCTOS original, así que acá sí hace falta
    // copiarlo con [...resultado] antes de ordenar, para no reordenar la fuente de verdad.
    return comparador ? [...resultado].sort(comparador) : resultado;
}

function renderCatalogo(lista) {
    // Se conserva el <h2>: solo se reemplazan las tarjetas, que deben seguir
    // siendo hijas directas de main#catalogo para respetar el grid y los selectores CSS.
    catalogo.querySelectorAll(':scope > article').forEach((a) => a.remove());

    // Un 200 con [] es posible (p. ej. RLS sin policy de lectura): no es un error de red, es "vacío"
    if (lista.length === 0) {
        contadorResultados.hidden = true;
        sinResultados.hidden = true;
        mostrarEstado('Todavía no hay productos para mostrar.');
        return;
    }
    estado.hidden = true;

    const visibles = aplicarFiltros(lista);
    contadorResultados.hidden = false;
    contadorResultados.textContent = `Mostrando ${visibles.length} de ${lista.length} productos`;

    if (visibles.length === 0) {
        sinResultados.hidden = false;
        return;
    }
    sinResultados.hidden = true;
    catalogo.append(...visibles.map(crearTarjeta)); // una sola inserción en el DOM
}

// Redibuja con el PRODUCTOS ya cargado (no vuelve a pedir nada a Supabase: filtrar es local)
function actualizarFiltrosYRedibujar() {
    guardarFiltros(filtros);
    renderCatalogo(PRODUCTOS);
}

function sincronizarControles() {
    gruposCategoria.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.categoria === filtros.categoria));
    });
    formPrecio.elements.precio_min.value = filtros.precioMin ?? '';
    formPrecio.elements.precio_max.value = filtros.precioMax ?? '';
    selectOrden.value = filtros.orden;
}

// --- Eventos de filtro: un listener por zona (delegación), no uno por botón ---
gruposCategoria.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-categoria]');
    if (!boton) return;
    filtros.categoria = boton.dataset.categoria;
    sincronizarControles();
    actualizarFiltrosYRedibujar();
});

formPrecio.addEventListener('submit', (e) => {
    e.preventDefault(); // sin esto el GET por defecto recargaría la página con ?precio_min=...
    const min = formPrecio.elements.precio_min.value;
    const max = formPrecio.elements.precio_max.value;
    const precioMin = min === '' ? null : Number(min);
    const precioMax = max === '' ? null : Number(max);

    const invalido = (precioMin !== null && precioMin < 0) || (precioMax !== null && precioMax < 0)
        || (precioMin !== null && precioMax !== null && precioMin > precioMax);
    if (invalido) {
        errorPrecio.textContent = 'Revisá el rango: no puede tener valores negativos ni un mínimo mayor que el máximo.';
        errorPrecio.hidden = false;
        return;
    }
    errorPrecio.hidden = true;
    filtros.precioMin = precioMin;
    filtros.precioMax = precioMax;
    actualizarFiltrosYRedibujar();
});

selectOrden.addEventListener('change', () => {
    filtros.orden = selectOrden.value;
    actualizarFiltrosYRedibujar();
});

// Delegación: el botón "Limpiar filtros" se recrea cada vez que renderCatalogo lo vuelve a mostrar
sinResultados.addEventListener('click', (e) => {
    if (!e.target.closest('button[data-accion="limpiar-filtros"]')) return;
    filtros = { ...FILTROS_PREDETERMINADOS };
    errorPrecio.hidden = true;
    sincronizarControles();
    actualizarFiltrosYRedibujar();
});

// Delegación: el botón se recrea en cada mostrarEstado(), el listener vive en el <p> estable.
// Reintentar = recargar: el arranque completo (config → api → catálogo → mochila) vuelve a correr
// y mochila.js se entera sin acoplar archivos. La mochila sobrevive porque está en localStorage.
estado.addEventListener('click', (e) => {
    if (e.target.closest('button[data-accion="reintentar"]')) location.reload();
});

sincronizarControles(); // si venís de "ver un producto y volver", los filtros ya elegidos se reflejan
mostrarEstado('Cargando catálogo…');
productosListos.then(renderCatalogo).catch(mostrarError);
