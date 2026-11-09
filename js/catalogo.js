const catalogo  = document.querySelector('main#catalogo');
const plantilla = document.querySelector('#tpl-tarjeta');
const estado    = document.querySelector('#estado-catalogo');

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
}

function mostrarError(error) {
    console.error('No se pudo cargar el catálogo:', error); // el detalle va a la consola, no al usuario
    mostrarEstado('No pudimos cargar el catálogo.', true);
}

function renderCatalogo(lista) {
    // Se conserva el <h2>: solo se reemplazan las tarjetas, que deben seguir
    // siendo hijas directas de main#catalogo para respetar el grid y los selectores CSS.
    catalogo.querySelectorAll(':scope > article').forEach((a) => a.remove());

    // Un 200 con [] es posible (p. ej. RLS sin policy de lectura): no es un error de red, es "vacío"
    if (lista.length === 0) {
        mostrarEstado('Todavía no hay productos para mostrar.');
        return;
    }
    estado.hidden = true;
    catalogo.append(...lista.map(crearTarjeta)); // una sola inserción en el DOM
}

// Delegación: el botón se recrea en cada mostrarEstado(), el listener vive en el <p> estable.
// Reintentar = recargar: el arranque completo (config → api → catálogo → mochila) vuelve a correr
// y mochila.js se entera sin acoplar archivos. La mochila sobrevive porque está en localStorage.
estado.addEventListener('click', (e) => {
    if (e.target.closest('button[data-accion="reintentar"]')) location.reload();
});

mostrarEstado('Cargando catálogo…');
productosListos.then(renderCatalogo).catch(mostrarError);
