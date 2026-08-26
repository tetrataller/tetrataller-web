const systems = {
  grid: {
    eyebrow: "Cajones y superficies",
    name: "Grid",
    cover: ["ORDENA", "CADA CAJÓN"],
    lead: "Construye el interior de cada cajón con módulos que puedes combinar, mover y ampliar.",
    intro: "Desde papelería hasta herramientas: una base común permite que cada recipiente tenga un lugar y que la distribución cambie contigo.",
    story: "Un mismo sistema para actividades muy distintas.",
    images: [
      ["assets/grid-office.jpg", "Oficina", "Papelería, memorias y cables siempre en su lugar."],
      ["assets/grid-taller.jpg", "Taller", "Cada dado, punta y tornillo tiene un espacio definido."],
      ["assets/grid-costura.jpg", "Costura", "Combina módulos para hilos, botones y herramientas."],
      ["assets/grid-comercio.jpg", "Comercio", "Organiza monedas, etiquetas y consumibles del mostrador."],
    ],
    benefits: [
      ["01", "Reconfigurable", "Cambia los módulos sin reemplazar todo el sistema."],
      ["02", "A tu medida", "La base se adapta al tamaño disponible en cada cajón."],
      ["03", "Ampliable", "Agrega nuevos recipientes cuando cambien tus objetos."],
    ],
    prev: ["Custom", "tetra-custom.html"],
    next: ["Wall", "tetra-wall.html"],
  },
  wall: {
    eyebrow: "Organización vertical",
    name: "Wall",
    cover: ["LIBERA", "TU MESA"],
    lead: "Convierte una pared en una estación ordenada, visible y fácil de modificar.",
    intro: "Ganchos, recipientes, soportes y repisas para paneles modulares tipo SKÅDIS, configurados según tu actividad.",
    story: "Libera superficies y aprovecha cada centímetro de pared.",
    images: [
      ["assets/wall-office.jpg", "Oficina", "Audífonos, papelería, cables y dispositivos al alcance."],
      ["assets/wall-workshop.jpg", "Taller", "Herramientas, brocas y piezas pequeñas en una sola pared."],
      ["assets/wall-sewing.jpg", "Costura", "Una estación creativa completa, ordenada y visible."],
      ["assets/wall-retail.jpg", "Comercio", "Etiquetas, marcadores y suministros listos para trabajar."],
    ],
    benefits: [
      ["01", "Visible", "Encuentra cada herramienta sin abrir cajones."],
      ["02", "Intercambiable", "Mueve los accesorios cuando cambie tu rutina."],
      ["03", "Compatible", "Podemos diseñar piezas para paneles y objetos existentes."],
    ],
    prev: ["Grid", "tetra-grid.html"],
    next: ["Flow", "tetra-flow.html"],
  },
  flow: {
    eyebrow: "Gestión de cables",
    name: "Flow",
    cover: ["ADIÓS AL", "DESORDEN"],
    lead: "Guía, sujeta y oculta cables sin perder la posibilidad de modificarlos.",
    intro: "Canaletas conectables, curvas, derivaciones y soportes para cargadores, multicontactos, routers y tiras LED.",
    story: "La misma lógica modular, desde el escritorio hasta el taller.",
    images: [
      ["assets/flow-office.jpg", "Oficina", "Canaletas y soportes bajo el escritorio para trabajar sin cables a la vista."],
      ["assets/flow-retail.jpg", "Comercio", "Terminal, impresora y router conectados sin desorden en el mostrador."],
      ["assets/flow-entertainment.jpg", "Entretenimiento", "Energía, HDMI y consolas con rutas claras y accesibles."],
      ["assets/flow-workshop.jpg", "Taller", "Clips resistentes, iluminación y cargadores organizados."],
    ],
    benefits: [
      ["01", "Modificable", "Abre una canaleta y agrega un cable sin rehacer la instalación."],
      ["02", "Discreto", "Aprovecha la parte inferior y posterior de los muebles."],
      ["03", "Seguro", "Separa y sujeta cables para reducir tirones y tropiezos."],
    ],
    prev: ["Wall", "tetra-wall.html"],
    next: ["Hidden", "tetra-hidden.html"],
  },
  hidden: {
    eyebrow: "Almacenamiento oculto",
    name: "Hidden",
    cover: ["DESCUBRE", "MÁS ESPACIO"],
    lead: "Descubre espacio útil debajo de escritorios, repisas y mostradores.",
    intro: "Cajones delgados, bandejas y soportes discretos para guardar lo que necesitas sin ocupar la superficie.",
    story: "Más capacidad sin agregar otro mueble.",
    images: [
      ["assets/hidden-drawer.jpg", "Cajón discreto", "Papelería y memorias bajo el escritorio, a un movimiento de distancia."],
      ["assets/hidden-accessories.jpg", "Accesorios", "Controles y audífonos guardados sin ocupar la mesa."],
      ["assets/hidden-retail.jpg", "Mostrador", "Etiquetas y suministros ocultos pero listos para usarse."],
      ["assets/hidden-devices.jpg", "Dispositivos", "Laptop, adaptadores y objetos personales suspendidos de forma ordenada."],
    ],
    benefits: [
      ["01", "Aprovechamiento", "Usa superficies inferiores que normalmente quedan vacías."],
      ["02", "Discreción", "El contenido permanece fuera de la vista."],
      ["03", "Integración", "Los interiores pueden recibir módulos Grid."],
    ],
    prev: ["Flow", "tetra-flow.html"],
    next: ["Display", "tetra-display.html"],
  },
  display: {
    eyebrow: "Exhibición modular",
    name: "Display",
    cover: ["EXHIBE", "MEJOR"],
    lead: "Presenta productos y colecciones de una forma ordenada, atractiva y ampliable.",
    intro: "Niveles, bases, bandejas y soportes que ayudan a mostrar mejor piezas pequeñas en comercios, ferias o colecciones.",
    story: "Una presentación diferente para cada producto.",
    images: [
      ["assets/display-retail.jpg", "Accesorios", "Niveles y soportes para joyería y piezas pequeñas."],
      ["assets/display-collection.jpg", "Colecciones", "Exhibidores ampliables para figuras, miniaturas y vehículos."],
      ["assets/display-market.jpg", "Ferias", "Bases coordinadas para montar y desmontar rápidamente."],
      ["assets/display-cafe.jpg", "Mostrador", "Bandejas y portaprecios para productos empacados."],
    ],
    benefits: [
      ["01", "Escalable", "Comienza con pocos módulos y amplía la exhibición."],
      ["02", "Transportable", "Ideal para ferias, bazares y exhibiciones temporales."],
      ["03", "Personalizable", "Colores, alturas y soportes según el producto."],
    ],
    prev: ["Hidden", "tetra-hidden.html"],
    next: ["Station", "tetra-station.html"],
  },
  station: {
    eyebrow: "Estaciones completas",
    name: "Station",
    cover: ["TODO EN", "SU LUGAR"],
    lead: "Integra varios sistemas en una estación diseñada alrededor de una actividad.",
    intro: "Grid, Wall, Flow, Hidden y accesorios Custom trabajando juntos para crear un espacio listo para producir.",
    story: "No son piezas aisladas: es una solución completa.",
    images: [
      ["assets/station-electronics.jpg", "Electrónica", "Herramientas, componentes y accesorios en una estación de reparación."],
      ["assets/station-sewing.jpg", "Costura", "Materiales, herramientas y superficies coordinadas."],
      ["assets/station-printing.jpg", "Impresión 3D", "Mantenimiento, repuestos y herramientas organizados."],
      ["assets/station-packing.jpg", "Empaque", "Una estación compacta para preparar y etiquetar pedidos."],
    ],
    benefits: [
      ["01", "Integral", "Resuelve almacenamiento, superficie, pared y cables."],
      ["02", "Por actividad", "Cada estación nace de un flujo de trabajo real."],
      ["03", "Evolutiva", "Puede crecer conforme aumenten tus herramientas o producción."],
    ],
    prev: ["Display", "tetra-display.html"],
    next: ["Custom", "tetra-custom.html"],
  },
  custom: {
    eyebrow: "Hecho para ti",
    name: "Custom",
    cover: ["HECHO", "PARA TI"],
    lead: "Cuando una pieza común no resuelve el problema, diseñamos una especial.",
    intro: "Medidas, uniones, soportes, divisiones y mecanismos creados alrededor de tus objetos y tu manera de trabajar.",
    story: "La personalización conecta y amplía todo el ecosistema.",
    images: [
      ["assets/custom-snap.jpg", "Ensamble", "Uniones y mecanismos para una función concreta."],
      ["assets/custom-dock.jpg", "Dispositivos", "Soportes integrados para celular, tableta y accesorios."],
      ["assets/custom-tools.jpg", "Herramientas", "Piezas diseñadas alrededor de formas especiales."],
      ["assets/custom-craft.jpg", "Distribución", "Medidas y divisiones adaptadas exactamente a tu actividad."],
    ],
    benefits: [
      ["01", "Específico", "La pieza se diseña para tu objeto y no al revés."],
      ["02", "Compatible", "Puede conectarse con las otras familias Tetra."],
      ["03", "Repetible", "Una solución probada puede fabricarse nuevamente."],
    ],
    prev: ["Station", "tetra-station.html"],
    next: ["Grid", "tetra-grid.html"],
  },
};

const key = document.body.dataset.system;
const system = systems[key];
const main = document.querySelector("#system-page");

if (system && main) {
  main.innerHTML = `
    <section class="system-detail-hero">
      <div class="system-detail-hero-copy">
        <p class="eyebrow">${system.eyebrow}</p>
        <h1>${system.name}</h1>
        <p class="hero-intro">${system.lead}</p>
        <p>${system.intro}</p>
        <a class="button button-primary" href="#ejemplos">Ver posibilidades</a>
      </div>
      <div id="ejemplos" class="system-hero-visual">
        <div class="family-carousel system-hero-carousel" data-carousel aria-label="Ejemplos de ${system.name}">
          <div class="carousel-track">
            ${system.images
              .map(
                ([src, title, caption], index) => `
                  <figure class="carousel-slide">
                    <img src="${src}" alt="${title}: ${caption}" />
                    ${
                      index === 0
                        ? `<div class="cover-message" aria-hidden="true">
                            <span>${system.cover[0]}</span>
                            <strong>${system.cover[1]}</strong>
                          </div>`
                        : `<span class="hero-slide-label">${title}</span>`
                    }
                  </figure>`,
              )
              .join("")}
          </div>
          <div class="carousel-controls">
            <button type="button" class="carousel-arrow" data-prev aria-label="Imagen anterior">←</button>
            <div class="carousel-dots" aria-hidden="true"></div>
            <button type="button" class="carousel-arrow" data-next aria-label="Imagen siguiente">→</button>
          </div>
        </div>
      </div>
    </section>
    <section class="system-benefits">
      <div class="section-heading">
        <p class="eyebrow">Por qué funciona</p>
        <h2>Diseñado para adaptarse.</h2>
      </div>
      <div class="benefit-grid">
        ${system.benefits
          .map(
            ([number, title, copy]) => `
              <article class="benefit-card">
                <span>${number}</span><h3>${title}</h3><p>${copy}</p>
              </article>`,
          )
          .join("")}
      </div>
    </section>
    <nav class="system-navigation" aria-label="Otras familias del sistema modular">
      <a class="system-next" href="${system.prev[1]}"><span>Anterior</span><strong>← ${system.prev[0]}</strong></a>
      <a class="system-next" href="${system.next[1]}"><span>Siguiente</span><strong>${system.next[0]} →</strong></a>
    </nav>
    <section class="contact">
      <p class="eyebrow">Diseñemos tu sistema</p>
      <h2>Cuéntanos qué necesitas organizar.</h2>
      <p>Revisamos medidas, objetos, colores y la mejor forma de comenzar. Al final de esta página puedes escribirnos por correo o WhatsApp.</p>
    </section>
  `;
}
