const catalogo  = document.querySelector('main#catalogo');
const plantilla = document.querySelector('#tpl-tarjeta');

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

function renderCatalogo(lista) {
    // Se conserva el <h2>: solo se reemplazan las tarjetas, que deben seguir
    // siendo hijas directas de main#catalogo para respetar el grid y los selectores CSS.
    catalogo.querySelectorAll(':scope > article').forEach((a) => a.remove());
    catalogo.append(...lista.map(crearTarjeta)); // una sola inserción en el DOM
}

renderCatalogo(PRODUCTOS);
