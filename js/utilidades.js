// Helpers compartidos. Los scripts clásicos comparten el ámbito global,
// y declarar el mismo `const` en dos archivos da SyntaxError.
const formatoARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const buscarProducto = (id) => PRODUCTOS.find((p) => p.id === id);

// Quita mayúsculas, tildes y espacios de más: "  TRÁVESIA " → "travesia".
// normalize('NFD') separa cada letra de su tilde ("í" → "i" + marca combinada);
// el rango \u0300-\u036f son esas marcas, que se borran.
const normalizarTexto = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Un producto coincide si CADA palabra buscada aparece en su nombre, categoría o badge (la descripción no entra: daba resultados que no se veían en el título).
const coincideBusqueda = (producto, texto) => {
    const palabras = normalizarTexto(texto).split(/\s+/).filter(Boolean);
    const contenido = normalizarTexto(`${producto.nombre} ${producto.categoria} ${producto.badge ?? ''}`);
    return palabras.every((palabra) => contenido.includes(palabra));
};
