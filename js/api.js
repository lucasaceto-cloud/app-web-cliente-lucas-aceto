// Único archivo que habla con Supabase. El resto del código solo ve PRODUCTOS y productosListos.
// Se llena de forma asíncrona: hasta que productosListos se resuelve, PRODUCTOS está vacío.
let PRODUCTOS = [];

async function pedirProductos() {
    // PostgREST: la tabla public.productos se expone como /rest/v1/productos
    const url = `${SUPABASE_URL}/rest/v1/productos?select=*&order=precio.asc`;
    const respuesta = await fetch(url, { headers: { apikey: SUPABASE_CLAVE_PUBLICA } });

    // fetch solo rechaza ante fallas de red; un 401/404/500 igual "resuelve", por eso se chequea .ok
    if (!respuesta.ok) throw new Error(`Supabase respondió ${respuesta.status}`);

    const datos = await respuesta.json();
    if (!Array.isArray(datos)) throw new Error('Respuesta inesperada de Supabase');
    return datos;
}

// Promesa compartida: catalogo.js y mochila.js se enganchan a ella con .then()
const productosListos = pedirProductos().then((lista) => {
    PRODUCTOS = lista;
    return lista;
});
