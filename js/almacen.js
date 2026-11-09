const CLAVE_MOCHILA = 'vertice:mochila';

function cargarMochila() {
    try {
        const crudo = localStorage.getItem(CLAVE_MOCHILA);
        if (crudo === null) return [];
        const datos = JSON.parse(crudo);
        if (!Array.isArray(datos)) return [];
        // Nunca se confía en lo guardado: se descartan ítems inválidos o de productos inexistentes
        return datos.filter((i) => i && typeof i.id === 'string'
            && Number.isInteger(i.cantidad) && i.cantidad > 0 && buscarProducto(i.id));
    } catch (error) {
        return []; // JSON corrupto o almacenamiento bloqueado
    }
}

function guardarMochila(mochila) {
    try {
        localStorage.setItem(CLAVE_MOCHILA, JSON.stringify(mochila));
    } catch (error) {
        // Almacenamiento lleno o bloqueado: la mochila sigue funcionando en memoria
    }
}
