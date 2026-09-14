Crear la estructura inicial de index.html para un e-commerce en HTML5 semántico puro (sin CSS ni JavaScript). La página debe incluir: un encabezado (<header>) con marca, barra de búsqueda y navegación principal (<nav>); una barra lateral (<aside>) con filtros y categorías; una sección principal (<main>) con un catálogo central compuesto por tarjetas de producto (<article>) que contengan imagen, título, descripción, precio y acciones (agregar al carrito y favoritos); y un pie de página (<footer>) con información institucional y enlaces.  

## Predicción 2: Páginas complementarias (Producto, Carrito y Contacto)

**Prompt utilizado**:
"Generar las páginas complementarias para el e-commerce en HTML5 semántico puro: 
1. producto.html con ficha técnica en tabla (thead/tbody), selector de variantes y formulario de agregado al carrito.
2. carrito.html con tabla completa de resumen de productos (thead/tbody/tfoot), cálculo de total y formulario de envío/facturación.
3. contacto.html con formulario estructurado mediante fieldsets, legends, select, textarea y validaciones nativas de HTML5."

## Predicción 3: Diseño visual y estilos CSS (Neo-brutalismo)

**Prompt utilizado:**
"Diseñar una hoja de estilos externa (style.css) con estética neo-brutalista moderna para el e-commerce:
- Variables CSS en :root para paleta de colores, degradés direccionales y sombras duras sin desenfoque (blur 0px).
- Reseteo universal con box-sizing: border-box para control del modelo de caja.
- Tipografía accesible del sistema con interlineado legible (line-height: 1.6).
- Layout responsivo utilizando CSS Grid (auto-fit, minmax) en el catálogo y Flexbox en cabecera y tarjetas.
- Microinteracciones en botones y enlaces usando transform y transiciones suaves al hover y active."

## Predicción 4: Pivot temático a Vértice Ultralight y blindaje de Grid

**Prompt utilizado:**
"Actualizá el contenido completo de index.html, producto.html, carrito.html y contacto.html para pivotar la tienda hacia 'Vértice Ultralight' (equipamiento técnico de montaña y senderismo rápido). En producto.html modelá la 'Mochila Frameless Ultra 40L' con tabla semántica de especificaciones (material Ultra 200TX, columna de agua de 20.000 mm, peso base de 480 g) y variantes de talle de torso y cinturón. En style.css corregí dos problemas estructurales de Clase 3:
1. Reemplazá el selector genérico 'article' por el combinador de hijo directo 'main#catalogo > article' para aislar la vista de producto individual de los estilos y elevaciones del catálogo.
2. Saca el riesgo de que se rompan los límites de columna y se distorsione por completo la estructura del layout. Cambia las columnas de layout y catálogo de '1fr' a 'minmax(0, 1fr)'."