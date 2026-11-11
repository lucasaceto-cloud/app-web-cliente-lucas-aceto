// Configuración. Se carga primero: api.js y mochila.js dependen de estas constantes.
// La clave "publishable" está pensada para vivir en el navegador (es pública por diseño):
// lo que protege los datos es RLS en la base, no ocultar la clave.
// La clave secret / service_role NUNCA va en este repo ni en ningún archivo del front.
const SUPABASE_URL = 'https://azpioecpnqlquofosltb.supabase.co';
const SUPABASE_CLAVE_PUBLICA = 'sb_publishable_kQGk5AZd295wqjlFOz6EUw__hMuMf5E';

const LIMITE_PESO_G = 5000; // presupuesto de peso base, en gramos
const CANTIDAD_MAXIMA = 10; // tope de unidades por producto en la mochila (catálogo, ficha y carrito)
