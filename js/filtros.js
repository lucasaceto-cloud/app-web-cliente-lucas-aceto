// Estado de los filtros del catálogo. Vive en sessionStorage, no en localStorage:
// es una preferencia de ESTA pestaña mientras navegás (ver un producto y volver
// no debería resetear el filtro), pero no algo que valga la pena arrastrar para
// siempre entre visitas distintas, como sí vale la mochila.
const CLAVE_FILTROS = 'vertice:filtros';
const FILTROS_PREDETERMINADOS = { categoria: 'todas', precioMin: null, precioMax: null, orden: 'relevancia' };

function cargarFiltros() {
    try {
        const crudo = sessionStorage.getItem(CLAVE_FILTROS);
        if (crudo === null) return { ...FILTROS_PREDETERMINADOS };
        // Se fusiona sobre los predeterminados para no romper si en el futuro se suma un campo nuevo
        return { ...FILTROS_PREDETERMINADOS, ...JSON.parse(crudo) };
    } catch (error) {
        return { ...FILTROS_PREDETERMINADOS }; // JSON corrupto o almacenamiento bloqueado
    }
}

function guardarFiltros(filtros) {
    try {
        sessionStorage.setItem(CLAVE_FILTROS, JSON.stringify(filtros));
    } catch (error) {
        // Almacenamiento lleno o bloqueado: los filtros siguen funcionando en memoria
    }
}
