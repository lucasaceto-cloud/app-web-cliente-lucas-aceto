-- Vértice Ultralight · esquema y datos del catálogo (documentación)
-- Esta es la fuente de referencia de lo que vive en Supabase (proyecto vertice-ultralight).
-- El navegador NO ejecuta este archivo: se corre una sola vez en el SQL Editor de Supabase.
-- Sustituye al antiguo js/datos.js. El peso está en gramos y el precio en pesos enteros.

create table if not exists public.productos (
    id          text primary key,                       -- slug: lo usa la URL (?id=) y la mochila
    categoria   text not null check (categoria in ('mochilas', 'refugios', 'aislamiento', 'cocina')),
    nombre      text not null,
    precio      integer not null check (precio > 0),
    peso        integer not null check (peso > 0),      -- gramos
    badge       text,
    descripcion text not null,
    imagen      text not null,
    alt         text not null,
    -- Ficha técnica: array JSON de { parametro, valor }. Es un ARRAY y no un objeto
    -- porque jsonb no conserva el orden de las claves de un objeto, y en una ficha el orden importa.
    especificaciones jsonb not null default '[]'::jsonb
        constraint productos_especificaciones_es_array check (jsonb_typeof(especificaciones) = 'array'),
    creado_en   timestamptz not null default now()
);

-- Seguridad: con RLS activado y sin policy, nadie lee ni escribe.
-- La clave pública del navegador (rol anon) solo puede LEER; no hay policy de INSERT/UPDATE/DELETE.
alter table public.productos enable row level security;

drop policy if exists "Lectura pública del catálogo" on public.productos;
create policy "Lectura pública del catálogo"
    on public.productos for select
    to anon, authenticated
    using (true);

-- Datos (12 productos). Idempotente: se puede volver a correr sin duplicar filas.
-- Las especificaciones son datos de demostración para el TP.
insert into public.productos (id, categoria, nombre, precio, peso, badge, descripcion, imagen, alt, especificaciones) values
    ('mochila-ultra-40', 'mochilas', 'Mochila Frameless Ultra 40L', 280000, 480, 'Ultra 200TX',
     'Construida en Ultra 200TX impermeable. Peso neto de 480 gramos para fastpacking y travesías.',
     'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80&auto=format&fit=crop',
     'Mochila técnica ultralight en sendero de alta montaña',
     '[{"parametro": "Material", "valor": "Ultra 200TX (laminado UHMWPE)"}, {"parametro": "Capacidad", "valor": "40 L + 8 L en bolsillos externos de malla"}, {"parametro": "Estructura", "valor": "Sin bastidor (frameless), espalda de espuma removible"}, {"parametro": "Carga máxima recomendada", "valor": "11 kg"}]'::jsonb),
    ('mochila-fastpack-20', 'mochilas', 'Chaleco Fastpack 20L', 215000, 340, 'Ultra 100X',
     'Chaleco de carga con bolsillos frontales para hidratación y comida. Pensado para fastpacking y carreras de montaña.',
     'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80&auto=format&fit=crop',
     'Mochila técnica ultralight en sendero de alta montaña',
     '[{"parametro": "Material", "valor": "Ultra 100X"}, {"parametro": "Capacidad", "valor": "20 L"}, {"parametro": "Bolsillos frontales", "valor": "4 (2 para flasks de 500 ml)"}, {"parametro": "Ajuste", "valor": "Arnés tipo chaleco con doble cierre esternal"}, {"parametro": "Carga máxima recomendada", "valor": "6 kg"}]'::jsonb),
    ('mochila-travesia-55', 'mochilas', 'Mochila Travesía Dyneema 55L', 395000, 890, 'Dyneema DCF',
     'Capacidad para travesías de varios días en tela Dyneema Composite. Cinturón desmontable y bolsillo lateral de red.',
     'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80&auto=format&fit=crop',
     'Mochila técnica ultralight en sendero de alta montaña',
     '[{"parametro": "Material", "valor": "Dyneema Composite Fabric (DCF)"}, {"parametro": "Capacidad", "valor": "55 L"}, {"parametro": "Cinturón", "valor": "Desmontable, con dos bolsillos"}, {"parametro": "Estructura", "valor": "Placa de espuma extraíble"}, {"parametro": "Carga máxima recomendada", "valor": "15 kg"}]'::jsonb),
    ('carpa-monopared-2p', 'refugios', 'Carpa Monopared Dyneema 2P', 420000, 620, '620 G',
     'Armado estructural con bastones de trekking. Columna de agua de 15.000 mm y 620 g de peso total.',
     'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&q=80&auto=format&fit=crop',
     'Carpa ultraligera montada con bastones de trekking',
     '[{"parametro": "Material", "valor": "Dyneema Composite Fabric (DCF)"}, {"parametro": "Capacidad", "valor": "2 personas"}, {"parametro": "Columna de agua", "valor": "15.000 mm"}, {"parametro": "Armado", "valor": "2 bastones de trekking (no incluidos)"}, {"parametro": "Superficie de piso", "valor": "2,1 m²"}]'::jsonb),
    ('tarp-piramide-1p', 'refugios', 'Tarp Pirámide Silnylon 1P', 165000, 410, 'Silnylon',
     'Refugio tipo pirámide para una persona. Se arma con un bastón de trekking y deja el piso libre para ventilar.',
     'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&q=80&auto=format&fit=crop',
     'Carpa ultraligera montada con bastones de trekking',
     '[{"parametro": "Material", "valor": "Silnylon 30D siliconado"}, {"parametro": "Capacidad", "valor": "1 persona"}, {"parametro": "Armado", "valor": "1 bastón de trekking central"}, {"parametro": "Altura central", "valor": "125 cm"}, {"parametro": "Piso", "valor": "Sin piso (abierto)"}]'::jsonb),
    ('vivac-impermeable', 'refugios', 'Funda de Vivac Impermeable', 190000, 280, 'Membrana 20K',
     'Funda respirable para noches despejadas o como refugio de emergencia. Entra en un bolsillo de la mochila.',
     'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&q=80&auto=format&fit=crop',
     'Carpa ultraligera montada con bastones de trekking',
     '[{"parametro": "Membrana", "valor": "20.000 mm de columna de agua, respirable"}, {"parametro": "Capacidad", "valor": "1 persona"}, {"parametro": "Cierre", "valor": "Lateral de 3/4"}, {"parametro": "Volumen empacado", "valor": "1,5 L"}]'::jsonb),
    ('quilt-modular-850', 'aislamiento', 'Quilt Modular Down 850 FP', 340000, 540, '850 FP',
     'Pluma de ganso hidrófuga certificada RDS. Rango de confort hasta -5 °C sin peso muerto de cierre.',
     'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop',
     'Campamento nocturno con equipo de descanso térmico',
     '[{"parametro": "Relleno", "valor": "Pluma de ganso 850 FP hidrófuga, certificación RDS"}, {"parametro": "Temperatura de confort", "valor": "-5 °C"}, {"parametro": "Tela exterior", "valor": "Nylon 10D"}, {"parametro": "Sistema de fijación", "valor": "Correas para sujetar a la colchoneta"}]'::jsonb),
    ('colchoneta-inflable-r42', 'aislamiento', 'Colchoneta Inflable R 4,2', 230000, 430, 'R 4,2',
     'Aislación térmica para suelo frío. Se infla en menos de dos minutos y se pliega al tamaño de una botella.',
     'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop',
     'Campamento nocturno con equipo de descanso térmico',
     '[{"parametro": "Valor R", "valor": "4,2"}, {"parametro": "Medidas", "valor": "183 × 51 × 7 cm"}, {"parametro": "Inflado", "valor": "Bolsa de inflado incluida, menos de 2 minutos"}, {"parametro": "Volumen empacado", "valor": "Similar a una botella de 1 L"}]'::jsonb),
    ('campera-plumas-800', 'aislamiento', 'Campera de Plumas 800 FP', 295000, 310, '800 FP',
     'Plumas de ganso hidrófugas para las paradas y la noche. Se comprime hasta el tamaño de un pomelo.',
     'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop',
     'Campamento nocturno con equipo de descanso térmico',
     '[{"parametro": "Relleno", "valor": "Pluma de ganso 800 FP hidrófuga"}, {"parametro": "Tela exterior", "valor": "Nylon 10D con tratamiento DWR"}, {"parametro": "Compresión", "valor": "Se guarda en su propio bolsillo"}, {"parametro": "Uso recomendado", "valor": "Paradas y campamento"}]'::jsonb),
    ('hornillo-titanio', 'cocina', 'Hornillo de Titanio Plegable', 48000, 45, 'Titanio Gr. 1',
     'Hornillo plegable para cartucho de gas. Hierve 500 ml de agua en unos tres minutos.',
     'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop',
     'Campamento nocturno con equipo de descanso térmico',
     '[{"parametro": "Material", "valor": "Titanio grado 1"}, {"parametro": "Combustible", "valor": "Cartucho de gas con rosca EN 417"}, {"parametro": "Potencia", "valor": "2.600 W"}, {"parametro": "Tiempo de hervor", "valor": "Unos 3 minutos para 500 ml"}]'::jsonb),
    ('olla-titanio-750', 'cocina', 'Olla de Titanio 750 ml', 62000, 100, '750 ml',
     'Olla con tapa y asas plegables. Alcanza para una persona y el hornillo entra adentro.',
     'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop',
     'Campamento nocturno con equipo de descanso térmico',
     '[{"parametro": "Material", "valor": "Titanio grado 1"}, {"parametro": "Capacidad", "valor": "750 ml"}, {"parametro": "Incluye", "valor": "Tapa y asas plegables"}, {"parametro": "Compatibilidad", "valor": "El hornillo y un cartucho de 100 g entran adentro"}]'::jsonb),
    ('filtro-agua-ultraliviano', 'cocina', 'Filtro de Agua Ultraliviano', 75000, 56, '0,1 µm',
     'Filtro de fibra hueca de 0,1 micrones para bacterias y protozoos. Se conecta a botellas de rosca estándar.',
     'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80&auto=format&fit=crop',
     'Campamento nocturno con equipo de descanso térmico',
     '[{"parametro": "Tecnología", "valor": "Fibra hueca de 0,1 µm"}, {"parametro": "Elimina", "valor": "Bacterias y protozoos (no virus)"}, {"parametro": "Conexión", "valor": "Rosca estándar de 28 mm"}, {"parametro": "Caudal", "valor": "Unos 1,5 L por minuto"}]'::jsonb)
on conflict (id) do update set
    categoria = excluded.categoria, nombre = excluded.nombre, precio = excluded.precio,
    peso = excluded.peso, badge = excluded.badge, descripcion = excluded.descripcion,
    imagen = excluded.imagen, alt = excluded.alt, especificaciones = excluded.especificaciones;
