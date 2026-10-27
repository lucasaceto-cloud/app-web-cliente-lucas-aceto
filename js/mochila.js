// ESTADO: la única verdad. El DOM es solo un dibujo de esto.
let mochila = []; // [{ id, cantidad }]

// Referencias al DOM (se buscan una sola vez)
const catalogo     = document.querySelector('main#catalogo');
const listaMochila = document.querySelector('#mochila-lista');
const contador     = document.querySelector('#contador-mochila');
const elPeso       = document.querySelector('#mochila-peso');
const elPrecio     = document.querySelector('#mochila-precio');
const medidor      = document.querySelector('#mochila-medidor');
const aviso        = document.querySelector('#mochila-aviso');

const formatoARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// --- Lógica (funciones sobre el estado) ---
const buscarProducto = (id) => PRODUCTOS.find((p) => p.id === id);

function agregar(id) {
    const item = mochila.find((i) => i.id === id);
    if (item) item.cantidad += 1;
    else mochila.push({ id, cantidad: 1 });
}

function quitar(id) {
    const item = mochila.find((i) => i.id === id);
    if (!item) return;
    item.cantidad -= 1;
    if (item.cantidad === 0) mochila = mochila.filter((i) => i.id !== id);
}

const cantidadTotal = () => mochila.reduce((acc, i) => acc + i.cantidad, 0);
const pesoTotal     = () => mochila.reduce((acc, i) => acc + buscarProducto(i.id).peso   * i.cantidad, 0);
const precioTotal   = () => mochila.reduce((acc, i) => acc + buscarProducto(i.id).precio * i.cantidad, 0);

// --- Vista: lee el estado y dibuja ---
function render() {
    const peso = pesoTotal();

    listaMochila.innerHTML = mochila.length === 0
        ? '<li>Tu mochila está vacía.</li>'
        : mochila.map(({ id, cantidad }) => {
            const p = buscarProducto(id);
            return `<li>
                <span>${p.nombre} × ${cantidad} · ${p.peso * cantidad} g</span>
                <button type="button" data-accion="quitar" data-id="${id}">Quitar</button>
            </li>`;
        }).join('');

    contador.textContent = cantidadTotal();
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
    render();
});

// La lista se recrea en cada render(): un listener directo en cada "Quitar" se perdería.
listaMochila.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-accion="quitar"]');
    if (!boton) return;
    quitar(boton.dataset.id);
    render();
});

document.querySelector('#mochila-limite').textContent = `${LIMITE_PESO_G} g`;
render(); // primer dibujo (estado vacío)
