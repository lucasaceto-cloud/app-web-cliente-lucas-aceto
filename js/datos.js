// Fuente de datos única. El peso está en gramos.
// TODO: reemplazar las imágenes repetidas por fotos propias en /img.
const IMG_MOCHILA    = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80&auto=format&fit=crop';
const IMG_REFUGIO    = 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&q=80&auto=format&fit=crop';
const IMG_CAMPAMENTO = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop';
const ALT_MOCHILA    = 'Mochila técnica ultralight en sendero de alta montaña';
const ALT_REFUGIO    = 'Carpa ultraligera montada con bastones de trekking';
const ALT_CAMPAMENTO = 'Campamento nocturno con equipo de descanso térmico';

const PRODUCTOS = [
    // --- Mochilas ---
    { id: 'mochila-ultra-40', categoria: 'mochilas', nombre: 'Mochila Frameless Ultra 40L', precio: 280000, peso: 480, badge: 'Ultra 200TX',
      descripcion: 'Construida en Ultra 200TX impermeable. Peso neto de 480 gramos para fastpacking y travesías.', imagen: IMG_MOCHILA, alt: ALT_MOCHILA },
    { id: 'mochila-fastpack-20', categoria: 'mochilas', nombre: 'Chaleco Fastpack 20L', precio: 215000, peso: 340, badge: 'Ultra 100X',
      descripcion: 'Chaleco de carga con bolsillos frontales para hidratación y comida. Pensado para fastpacking y carreras de montaña.', imagen: IMG_MOCHILA, alt: ALT_MOCHILA },
    { id: 'mochila-travesia-55', categoria: 'mochilas', nombre: 'Mochila Travesía Dyneema 55L', precio: 395000, peso: 890, badge: 'Dyneema DCF',
      descripcion: 'Capacidad para travesías de varios días en tela Dyneema Composite. Cinturón desmontable y bolsillo lateral de red.', imagen: IMG_MOCHILA, alt: ALT_MOCHILA },

    // --- Refugios y carpas ---
    { id: 'carpa-monopared-2p', categoria: 'refugios', nombre: 'Carpa Monopared Dyneema 2P', precio: 420000, peso: 620, badge: '620 G',
      descripcion: 'Armado estructural con bastones de trekking. Columna de agua de 15.000 mm y 620 g de peso total.', imagen: IMG_REFUGIO, alt: ALT_REFUGIO },
    { id: 'tarp-piramide-1p', categoria: 'refugios', nombre: 'Tarp Pirámide Silnylon 1P', precio: 165000, peso: 410, badge: 'Silnylon',
      descripcion: 'Refugio tipo pirámide para una persona. Se arma con un bastón de trekking y deja el piso libre para ventilar.', imagen: IMG_REFUGIO, alt: ALT_REFUGIO },
    { id: 'vivac-impermeable', categoria: 'refugios', nombre: 'Funda de Vivac Impermeable', precio: 190000, peso: 280, badge: 'Membrana 20K',
      descripcion: 'Funda respirable para noches despejadas o como refugio de emergencia. Entra en un bolsillo de la mochila.', imagen: IMG_REFUGIO, alt: ALT_REFUGIO },

    // --- Aislamiento y quilts ---
    { id: 'quilt-modular-850', categoria: 'aislamiento', nombre: 'Quilt Modular Down 850 FP', precio: 340000, peso: 540, badge: '850 FP',
      descripcion: 'Pluma de ganso hidrófuga certificada RDS. Rango de confort hasta -5 °C sin peso muerto de cierre.', imagen: IMG_CAMPAMENTO, alt: ALT_CAMPAMENTO },
    { id: 'colchoneta-inflable-r42', categoria: 'aislamiento', nombre: 'Colchoneta Inflable R 4,2', precio: 230000, peso: 430, badge: 'R 4,2',
      descripcion: 'Aislación térmica para suelo frío. Se infla en menos de dos minutos y se pliega al tamaño de una botella.', imagen: IMG_CAMPAMENTO, alt: ALT_CAMPAMENTO },
    { id: 'campera-plumas-800', categoria: 'aislamiento', nombre: 'Campera de Plumas 800 FP', precio: 295000, peso: 310, badge: '800 FP',
      descripcion: 'Plumas de ganso hidrófugas para las paradas y la noche. Se comprime hasta el tamaño de un pomelo.', imagen: IMG_CAMPAMENTO, alt: ALT_CAMPAMENTO },

    // --- Cocina y filtrado ---
    { id: 'hornillo-titanio', categoria: 'cocina', nombre: 'Hornillo de Titanio Plegable', precio: 48000, peso: 45, badge: 'Titanio Gr. 1',
      descripcion: 'Hornillo plegable para cartucho de gas. Hierve 500 ml de agua en unos tres minutos.', imagen: IMG_CAMPAMENTO, alt: ALT_CAMPAMENTO },
    { id: 'olla-titanio-750', categoria: 'cocina', nombre: 'Olla de Titanio 750 ml', precio: 62000, peso: 100, badge: '750 ml',
      descripcion: 'Olla con tapa y asas plegables. Alcanza para una persona y el hornillo entra adentro.', imagen: IMG_CAMPAMENTO, alt: ALT_CAMPAMENTO },
    { id: 'filtro-agua-ultraliviano', categoria: 'cocina', nombre: 'Filtro de Agua Ultraliviano', precio: 75000, peso: 56, badge: '0,1 µm',
      descripcion: 'Filtro de fibra hueca de 0,1 micrones para bacterias y protozoos. Se conecta a botellas de rosca estándar.', imagen: IMG_CAMPAMENTO, alt: ALT_CAMPAMENTO }
];

const LIMITE_PESO_G = 5000; // presupuesto de peso base
