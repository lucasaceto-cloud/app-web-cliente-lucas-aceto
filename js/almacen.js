const CLAVE_MOCHILA = 'vertice:mochila';

function cargarMochila() {
    try {
        const crudo = localStorage.getItem(CLAVE_MOCHILA);
        if (crudo === null) return [];
        const datos = JSON.parse(crudo);
        if (!Array.isArray(datos)) return [];
        // Nunca se confía en lo guardado: se descarta lo que no tenga la forma { id: string, cantidad: entero > 0 }.
        // Si el id existe en el catálogo no se valida acá: el catálogo llega por red (asíncrono)
        // y no debe borrarse la mochila porque la red falle. Eso lo resuelve mochila.js al dibujar.
        return datos.filter((i) => i && typeof i.id === 'string'
            && Number.isInteger(i.cantidad) && i.cantidad > 0);
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
