// Buscador predictivo: sugerencias mientras se escribe (evento input) y filtro del catálogo al enviar.
// Patrón ARIA "combobox": el foco real se queda en el <input>; aria-activedescendant le dice
// al lector de pantalla cuál opción está resaltada sin mover el foco.
const formBusqueda     = document.querySelector('#form-busqueda');
const listaSugerencias = document.querySelector('#sugerencias');
const avisoBusqueda    = document.querySelector('#estado-busqueda');
const MAX_SUGERENCIAS  = 5;

let sugerencias  = []; // productos sugeridos ahora
let indiceActivo = -1; // opción resaltada con el teclado (-1 = ninguna)

function buscarSugerencias(texto) {
    if (texto.trim() === '') return [];
    return PRODUCTOS.filter((p) => coincideBusqueda(p, texto)).slice(0, MAX_SUGERENCIAS);
}

// Estado → dibujo. Los datos vienen de la red: textContent, nunca innerHTML.
function dibujarSugerencias() {
    listaSugerencias.replaceChildren(...sugerencias.map((p, i) => {
        const li = document.createElement('li');
        li.id = `sugerencia-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === indiceActivo));
        li.dataset.id = p.id;
        li.textContent = `${p.nombre} · ${formatoARS.format(p.precio)}`;
        return li;
    }));

    const abierta = sugerencias.length > 0;
    listaSugerencias.hidden = !abierta;
    campoBusqueda.setAttribute('aria-expanded', String(abierta));
    if (indiceActivo >= 0) campoBusqueda.setAttribute('aria-activedescendant', `sugerencia-${indiceActivo}`);
    else campoBusqueda.removeAttribute('aria-activedescendant');

    if (abierta) avisoBusqueda.textContent = `${sugerencias.length} sugerencias disponibles`;
    else avisoBusqueda.textContent = campoBusqueda.value.trim() === '' ? '' : 'Sin sugerencias';
}

function cerrarSugerencias() {
    sugerencias = [];
    indiceActivo = -1;
    dibujarSugerencias();
}

function aplicarBusqueda(texto) {
    filtros.busqueda = texto.trim();
    // Si el catálogo aún carga, solo se guarda el texto: renderCatalogo lo va a usar cuando llegue
    if (PRODUCTOS.length === 0) return;
    actualizarFiltrosYRedibujar();
}

function irAProducto(id) {
    location.href = `producto.html?id=${encodeURIComponent(id)}`;
}

// input se dispara en CADA cambio del texto (change solo al perder el foco)
campoBusqueda.addEventListener('input', () => {
    sugerencias = buscarSugerencias(campoBusqueda.value);
    indiceActivo = -1;
    dibujarSugerencias();
    // Borrar todo el texto también borra el filtro del catálogo
    if (campoBusqueda.value.trim() === '' && filtros.busqueda !== '') aplicarBusqueda('');
});

campoBusqueda.addEventListener('keydown', (e) => {
    const cantidad = sugerencias.length;
    if (e.key === 'ArrowDown' && cantidad > 0) {
        e.preventDefault(); // sin esto el cursor salta al final del texto
        indiceActivo = (indiceActivo + 1) % cantidad;
        dibujarSugerencias();
    } else if (e.key === 'ArrowUp' && cantidad > 0) {
        e.preventDefault();
        indiceActivo = indiceActivo <= 0 ? cantidad - 1 : indiceActivo - 1;
        dibujarSugerencias();
    } else if (e.key === 'Escape') {
        cerrarSugerencias();
    } else if (e.key === 'Enter' && indiceActivo >= 0) {
        e.preventDefault(); // opción elegida: va a la ficha en vez de enviar el formulario
        irAProducto(sugerencias[indiceActivo].id);
    }
});

// Enter sin opción resaltada, o botón Buscar: filtra el catálogo
formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault(); // sin esto el GET por defecto recargaría la página con ?q=...
    aplicarBusqueda(campoBusqueda.value);
    cerrarSugerencias();
    catalogo.scrollIntoView(); // respeta el scroll-margin-top del header sticky
});

// Delegación: la lista se recrea en cada tecla, el listener vive en el <ul> estable.
listaSugerencias.addEventListener('click', (e) => {
    const opcion = e.target.closest('li[data-id]');
    if (opcion) irAProducto(opcion.dataset.id);
});

// mousedown mantiene el foco en el input; sin esto, hacer click en una opción dispara focusout,
// la lista se cierra y el click nunca llega.
listaSugerencias.addEventListener('mousedown', (e) => e.preventDefault());

// Salir del buscador con Tab o click afuera cierra la lista
formBusqueda.addEventListener('focusout', (e) => {
    if (!formBusqueda.contains(e.relatedTarget)) cerrarSugerencias();
});
