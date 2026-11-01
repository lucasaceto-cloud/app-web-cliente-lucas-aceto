// Helpers compartidos. Los scripts clásicos comparten el ámbito global,
// y declarar el mismo `const` en dos archivos da SyntaxError.
const formatoARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const buscarProducto = (id) => PRODUCTOS.find((p) => p.id === id);
