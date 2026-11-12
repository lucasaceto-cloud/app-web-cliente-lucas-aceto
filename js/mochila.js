// ESTADO: la única verdad. El DOM es solo un dibujo de esto.
let mochila = cargarMochila(); // [{ id, cantidad }]
let estadoCatalogo = 'cargando'; // 'cargando' | 'listo' | 'error' (el catálogo llega por red)

// Referencias al DOM (se buscan una sola vez)
const listaMochila = document.querySelector('#mochila-lista');
const elPeso       = document.querySelector('#mochila-peso');
const elPrecio     = document.querySelector('#mochila-precio');
const medidor      = document.querySelector('#mochila-medidor');
const aviso        = document.querySelector('#mochila-aviso');

// --- Lógica (funciones sobre el estado) ---

function agregar(id) {
    const item = mochila.find((i) => i.id === id);
    if (item && item.cantidad >= CANTIDAD_MAXIMA) return; // mismo tope que la ficha y el carrito
    if (item) item.cantidad += 1;
    else mochila.push({ id, cantidad: 1 });
}

function quitar(id) {
    const item = mochila.find((i) => i.id === id);
    if (!item) return;
    item.cantidad -= 1;
    if (item.cantidad === 0) mochila = mochila.filter((i) => i.id !== id);
}

// Ids guardados que ya no existen en el catálogo (o catálogo aún sin cargar): se ignoran al calcular
// y dibujar, pero NO se borran del almacenamiento. Si la red falla, la mochila del usuario sigue intacta.
const itemsConocidos = () => mochila.filter((i) => buscarProducto(i.id));

const cantidadTotal = () => mochila.reduce((acc, i) => acc + i.cantidad, 0);
const pesoTotal     = () => itemsConocidos().reduce((acc, i) => acc + buscarProducto(i.id).peso   * i.cantidad, 0);
const precioTotal   = () => itemsConocidos().reduce((acc, i) => acc + buscarProducto(i.id).precio * i.cantidad, 0);

// --- Vista: lee el estado y dibuja ---
// Los datos del catálogo ahora vienen de la red: se dibujan con textContent (nunca como HTML)
// para que un nombre con "<" o "&" se muestre como texto y no se interprete como marcado.
function crearMensaje(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    return li;
}

function crearItem({ id, cantidad }) {
    const p = buscarProducto(id);
    const li = document.createElement('li');

    const detalle = document.createElement('span');
    detalle.textContent = `${p.nombre} × ${cantidad} · ${p.peso * cantidad} g`;

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.dataset.accion = 'quitar';
    boton.dataset.id = id;
    boton.textContent = 'Quitar';

    li.append(detalle, boton);
    return li;
}

function render() {
    const items = itemsConocidos();
    const peso = pesoTotal();

    if (estadoCatalogo === 'cargando') {
        listaMochila.replaceChildren(crearMensaje('Cargando tu mochila…'));
    } else if (estadoCatalogo === 'error') {
        listaMochila.replaceChildren(crearMensaje('No se pudo cargar el catálogo. Tu mochila sigue guardada.'));
    } else if (items.length === 0) {
        listaMochila.replaceChildren(crearMensaje('Tu mochila está vacía.'));
    } else {
        listaMochila.replaceChildren(...items.map(crearItem));
    }

    mostrarContador(cantidadTotal());
    elPeso.textContent   = `${peso} g`;
    elPrecio.textContent = formatoARS.format(precioTotal());
    medidor.max   = LIMITE_PESO_G;
    medidor.value = peso;
    aviso.hidden  = peso <= LIMITE_PESO_G;
}

// --- Eventos: delegación ---
catalogo.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-accion="agregar"]');
    if (!boton) return;
    const tarjeta = boton.closest('article[data-id]');
    if (!tarjeta) return;
    agregar(tarjeta.dataset.id);
    guardarMochila(mochila);
    render();
});

// La lista se recrea en cada render(): un listener directo en cada "Quitar" se perdería.
listaMochila.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-accion="quitar"]');
    if (!boton) return;
    quitar(boton.dataset.id);
    guardarMochila(mochila);
    render();
});

document.querySelector('#mochila-limite').textContent = `${LIMITE_PESO_G} g`;
render(); // primer dibujo: "Cargando…" hasta que lleguen los productos

// Se espera al catálogo: sin PRODUCTOS no se puede calcular peso ni precio.
// then → listo; catch → error; el último then corre en ambos casos y redibuja.
productosListos
    .then(() => { estadoCatalogo = 'listo'; })
    .catch(() => { estadoCatalogo = 'error'; })
    .then(render);

// Mantiene sincronizadas las pestañas: 'storage' solo se dispara en las otras
window.addEventListener('storage', (e) => {
    if (e.key !== CLAVE_MOCHILA) return;
    mochila = cargarMochila();
    render();
});
