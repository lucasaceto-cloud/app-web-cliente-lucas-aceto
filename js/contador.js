const elContador = document.querySelector('#contador-mochila');

function mostrarContador(cantidad) {
    if (elContador) elContador.textContent = cantidad;
}

function actualizarContador() {
    mostrarContador(cargarMochila().reduce((acc, i) => acc + i.cantidad, 0));
}

actualizarContador();

// 'storage' se dispara en las OTRAS pestañas cuando una cambia el almacenamiento
window.addEventListener('storage', (e) => {
    if (e.key === CLAVE_MOCHILA) actualizarContador();
});
