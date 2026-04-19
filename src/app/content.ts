// ─── CONTENIDO DE LA LANDING ─────────────────────────────────────────────────
// Edita los textos aquí. Los cambios se reflejan automáticamente en la página.

export interface Speaker {
  name:      string;
  role?:     string | null;     // "Host", "Co-host" o null
  title:     string;            // bio corta (quién es)
  topic:     string;            // de qué va a hablar en el Bootcamp
  pillar?:   "Mentalidad" | "Velocidad" | "Entorno";
  ig?:       string;            // handle sin @
  photo?:    string;            // ruta a /public/speakers/<handle>.jpg (fallback a iniciales)
  featured?: boolean;
  initial?:  string;
  bg?:       string;
}

export const content = {

  // ─── REPLAY MODE (a partir del 9 de junio de 2026) ──────────────────────
  // Después de esta fecha, la home muestra un pop-up redirigiendo a /repeticion
  // donde la persona se registra para ver la repetición. Se activa automáticamente.
  replay: {
    enabled_from: "2026-06-09T00:00:00-06:00", // America/Mexico_City
    alt_path:     "/repeticion",
    popup_title:  "El Bootcamp ya terminó en vivo",
    popup_body:   "Puedes registrarte para ver la repetición por tiempo limitado. Solo para personas que no pudieron conectarse los días 5, 6 y 7 de junio.",
    popup_cta:    "Ver repetición",
    popup_dismiss: "Cerrar",
  },

  // ─── SEO ─────────────────────────────────────────────────────────────────
  seo: {
    title:       "Bootcamp de Aceleración de Emprendimiento 2026 · Synergy Education",
    description: "3 días en vivo con +20 speakers internacionales (Daniel Marcos, Fernando Anzures, Claudia Lizaldi, Coral Mujaes, Alejandro Kasuga y más). Mentalidad, ventas digitales y alto rendimiento. Acceso digital de cortesía si te registras antes del 20 de mayo. 5, 6 y 7 de Junio 2026.",
    url:         "https://synergyforeducation.mx",
    keywords: [
      "bootcamp emprendimiento",
      "synergy education",
      "sinergéticos 2026",
      "bootcamp online",
      "curso negocios latam",
      "marketing digital",
      "ventas digitales",
      "Jorge Serratos",
      "Daniel Marcos",
      "Fernando Anzures",
      "Claudia Lizaldi",
      "Alejandro Kasuga",
      "Coral Mujaes",
      "emprendedores latam",
      "aceleración de negocios",
      "evento online negocios 2026",
    ].join(", "),
  },

  // ─── TOP BAR ──────────────────────────────────────────────────────────────
  topbar: {
    date:   "5, 6 y 7 de Junio 2026",
    online: "EN VIVO · Sin repetición · Sin grabación",
    free:   "Acceso digital de cortesía hasta 20 de mayo",
    cta:    "Asegura tu lugar",
  },

  // ─── HERO ─────────────────────────────────────────────────────────────────
  hero: {
    badge:    "Evento Synergy Education · 3 Días · +20 Speakers",
    h1_part1: "Transforma tu negocio",
    h1_em:    "en 3 días",
    subhead:  "Evento con valor de $497 USD. Si te registras antes del 20 de mayo, tu acceso digital es 100% de cortesía. Tres días en vivo con más de 20 speakers internacionales en mentalidad, ventas, marketing digital y alto rendimiento.",
    date_nums:  "5, 6 y 7",
    date_month: "Junio 2026",
    date_tag:   "100% online · Cortesía hasta 20 Mayo",
    cta:        "Reserva tu lugar de cortesía",
    price_strike: "$497 USD",
    price_now:    "GRATIS hasta 20/Mayo",
  },

  // ─── STATS ────────────────────────────────────────────────────────────────
  stats: [
    { number: "21+",   label: "Speakers"       },
    { number: "3",     label: "Días en vivo"   },
    { number: "$10K+", label: "USD en premios" },
  ],

  // ─── PROBLEMA ─────────────────────────────────────────────────────────────
  problem: {
    label:    "La brecha real · Escucha esto",
    title_1:  "Ya sabes lo que debes hacer.",
    title_em: "¿Por qué carajos no está pasando?",
    body_lead: "No es falta de motivación. No es falta de información. YouTube, Google e Instagram te entregaron TODO lo que necesitas para escalar. Y aun así, estás atorado.",
    body:      "El problema no es la información — es que la información sin ejecución pesa. Cada día con ese peso encima, alguien más joven, con menos experiencia y menos talento que tú se está moviendo primero. Y lo sabes. Duele porque lo sabes.",
    bullets: [
      "Llevas +2 años con el mismo techo de facturación — aunque trabajas más horas que nunca",
      "Sabes que tu producto vale más caro, pero cada vez que piensas en subir el precio te agarra el miedo",
      "Ves a gente con la mitad de tu experiencia facturar el triple — y no te explicas cómo",
      "Tu negocio depende 100% de ti. Si paras, todo se detiene. Vacaciones, enfermedad, distracción: cero ingresos",
      "Ya tomaste cursos. Lo escribiste. Lo guardaste. Nunca lo ejecutaste. Ese es el verdadero costo",
    ],
    quote: "Lo que hoy te limita, en 3 días puede dejar de existir.",
    callout_title: "El Bootcamp es el punto de quiebre.",
    callout_body:  "No otro curso. No otra motivación. Tres días en vivo — sin grabación, sin repetición — donde instalas mentalidad, velocidad y entorno al mismo tiempo.",
    journey: {
      eyebrow: "Así se atraviesa el dolor",
      title:   "3 días · 3 capas · 1 negocio distinto",
      steps: [
        { day: "Día 1", tag: "Mentalidad",  title: "Rompes el techo invisible",   body: "Identificas exactamente qué modelo mental te frena y lo reemplazas por el del empresario." },
        { day: "Día 2", tag: "Velocidad",   title: "Activas las 3 palancas",       body: "Subes ticket, escalas adquisición y conviertes compra única en recurrencia." },
        { day: "Día 3", tag: "Entorno",     title: "Cambias tu círculo",           body: "Conectas con +20 referentes y miles de builders que juegan al nivel al que tú quieres llegar." },
      ],
      result: "Sales con un plan distinto al que entraste.",
    },
  },

  // ─── "¿QUÉ ES UN BOOTCAMP?" ──────────────────────────────────────────────
  whatIs: {
    label:    "Esto no existe en el mercado hispano",
    title_1:  "Esto",
    title_em: "NO es",
    title_2:  "otro curso.",
    intro:    "Lo que estás a punto de experimentar no se vende en ningún lado. No se repite. No queda grabado. Es un evento comprimido de 3 días donde aprendes mientras ejecutas — diseñado para emprendedores que ya están ocupados ganando dinero, no para estudiantes buscando motivación.",
    notHeader: "Lo que NO estás a punto de recibir",
    notItems: [
      { t: "No es un curso grabado",     d: "40 horas de video que nunca terminas. Que se acumulan en tu drive junto a los otros 8 que compraste." },
      { t: "No es otro webinar",         d: "60 minutos de humo con un pitch al final. Sales igual que entraste." },
      { t: "No es mentoría 1 a 1 lenta", d: "6 meses de llamadas para ver qué pasa. Aquí se mueve todo en 72 horas." },
      { t: "No es motivación vacía",     d: "No vas a salir 'inspirado'. Vas a salir con un plan ejecutado, no con ganas." },
      { t: "No es teoría universitaria", d: "Cero modelos académicos. Solo lo que funciona en negocios reales con dinero real moviéndose." },
    ],
    bridge: "En cambio, esto es lo que SÍ vas a recibir",
    isHeader: "Lo que SÍ vas a experimentar",
    isItems: [
      { t: "Inmersión total · EN VIVO",  d: "3 días comprimidos. Sin repetición. Sin grabación. Si no estás conectado, te lo perdiste." },
      { t: "Ejecutas mientras aprendes", d: "Subes precios, rediseñas oferta y activas canales durante el Bootcamp. Los resultados empiezan el mismo día." },
      { t: "+21 speakers en un solo evento", d: "Daniel Marcos, Fernando Anzures, Claudia Lizaldi, Alejandro Kasuga, Coral Mujaes… juntos. No existe en otro lugar." },
      { t: "Comunidad que ya factura",   d: "Miles de emprendedores hispanos conectados en vivo. El networking de 3 días que abre puertas los siguientes 3 años." },
      { t: "+$10,000 USD en premios",    d: "Sorteos en vivo: iPads, MacBooks, accesos premium, experiencias. Solo para quienes están presentes." },
    ],
    closing_1: "Esto es una",
    closing_em: "decisión de 3 días",
    closing_2: "que cambia los siguientes 3 años.",
    closing_foot: "Si eres de los que ejecutan — no de los que coleccionan cursos — fue diseñado exactamente para ti.",
    live_badge: "SOLO EN VIVO · Sin grabación",
  },

  // ─── 3 PILARES (reemplaza el carrusel de promises) ──────────────────────
  pillars: {
    label:    "Los 3 pilares",
    title_1:  "La aceleración que hace",
    title_em: "3× tu negocio",
    subtitle: "No son pasos. Son tres capas que se apilan. Ninguna funciona sola. Las tres juntas cambian el juego.",
    items: [
      {
        n: "01",
        tag: "Mentalidad",
        title: "Rompe los techos mentales",
        headline: "Piensa como empresario, no como emprendedor.",
        body: "Instalamos el sistema operativo del empresario: decisiones con datos, delegación, margen sobre esfuerzo y claridad sobre caos. Lo que hoy te frena no es tu mercado — es tu modelo mental.",
        bullets: [
          "De auto-empleado a dueño de negocio",
          "Sistemas > esfuerzo",
          "Decisiones por ROI, no por emoción",
        ],
        color: "#00e040",
      },
      {
        n: "02",
        tag: "Velocidad",
        title: "Acelera con las 3 palancas",
        headline: "Más caro. A más personas. Con más recurrencia.",
        body: "La velocidad no es trabajar más horas — es mover las palancas correctas. Te damos el método para subir ticket, escalar adquisición y convertir compra única en relación de valor recurrente.",
        bullets: [
          "Pricing y posicionamiento premium",
          "Adquisición digital que no depende de ti",
          "LTV por suscripción y ascensores",
        ],
        color: "#4ade80",
      },
      {
        n: "03",
        tag: "Entorno",
        title: "Cambia tu ecosistema",
        headline: "Tu próximo nivel depende de tu siguiente círculo.",
        body: "No se crece solo. Conectas con +20 speakers y miles de emprendedores que ya facturan al nivel al que tú quieres llegar. El network que construyes en 3 días es el que abre puertas los siguientes 3 años.",
        bullets: [
          "Networking intencional con builders reales",
          "Proveedores, socios y primeras ventas",
          "Comunidad que sostiene tu crecimiento",
        ],
        color: "#fbbf24",
      },
    ],
    synthesis: {
      title: "Los 3 juntos =",
      result: "negocio transformado",
      caption: "Mentalidad + Velocidad + Entorno. Cuando las tres capas operan al mismo tiempo, el negocio deja de ser lineal y empieza a escalar.",
    },
  },

  // ─── PROMESAS (backup legacy, no renderizado) ────────────────────────────
  promises: {
    label:    "Los 3 ejes",
    title_1:  "En 3 días vas a",
    title_em: "operar diferente",
    items: [
      { n: "01", title: "Vender más caro",      body: "Pricing, posicionamiento y construcción de oferta para que cobres lo que vales sin justificarte." },
      { n: "02", title: "A más personas",       body: "Sistemas de adquisición digital que no dependen del boca a boca. Atraes en automático y con intención." },
      { n: "03", title: "Con más recurrencia",  body: "Convertir compra única en relación. Ascensores de valor, suscripciones y programas que generan LTV." },
    ],
  },

  // ─── CALCULADORA ─────────────────────────────────────────────────────────
  calculator: {
    label:    "Velocidad · Calculadora de impacto",
    title_1:  "Esto es lo que significaría el Bootcamp",
    title_em: "para tu negocio",
    subtitle: "Pon tu ticket promedio y cuántos clientes atiendes al mes. Después mueve las 3 palancas — pricing, volumen y recurrencia — para ver tu facturación proyectada.",
    inputs: {
      ticket_label:    "Ticket promedio (USD)",
      ticket_hint:     "Lo que cobras por cliente hoy",
      clients_label:   "Clientes al mes",
      clients_hint:    "Promedio mensual actual",
    },
    levers: {
      price_label:      "Vender más caro",
      price_hint:       "Aumento de ticket (%)",
      volume_label:     "A más personas",
      volume_hint:      "Aumento de clientes (%)",
      recurrence_label: "Con más recurrencia",
      recurrence_hint:  "Ventas por cliente al año (x)",
    },
    outputs: {
      current_month:  "Facturación actual / mes",
      projected_month: "Proyección / mes",
      projected_year:  "Proyección / año",
      delta_year:      "Diferencia anual",
      cta:             "Quiero acelerar esto · Reservar lugar",
    },
    footnote: "Cálculo ilustrativo. El resultado real depende de tu ejecución — el Bootcamp te da el método.",
  },

  // ─── DETALLES DEL EVENTO ──────────────────────────────────────────────────
  details: {
    label: "El evento",
    title: "Tres días diseñados para que no salgas igual",
    items: [
      { title: "3 días inmersivos",              body: "Estrategias y herramientas que puedes aplicar mientras el evento está pasando." },
      { title: "+21 speakers internacionales",   body: "Los referentes de negocios, mentalidad y ventas en español, en un mismo espacio." },
      { title: "+$10,000 USD en premios",        body: "iPads, MacBooks, accesos a eventos, experiencias y becas educativas en sorteos en vivo." },
      { title: "100% online",                    body: "Desde donde estés. Sin vuelos, sin hotel, sin pretextos." },
    ],
  },

  // ─── PREMIOS ─────────────────────────────────────────────────────────────
  prizes: {
    label:    "Premios en vivo",
    title_1:  "+$10,000 USD en premios",
    title_em: "para asistentes",
    subtitle: "Sorteos distribuidos a lo largo de los 3 días. Solo participan quienes estén conectados en vivo.",
    items: [
      { icon: "📱", title: "iPad Pro",          body: "Último modelo para llevar tu negocio a todos lados." },
      { icon: "💻", title: "MacBook",           body: "La herramienta de trabajo del emprendedor serio." },
      { icon: "🎟️", title: "Accesos a eventos", body: "Entradas a nuestros siguientes eventos presenciales y Premium." },
      { icon: "🎵", title: "Conciertos",         body: "Entradas dobles a conciertos y shows." },
      { icon: "🌎", title: "Experiencias",       body: "Viajes, cenas y experiencias únicas con el equipo Sinergéticos." },
      { icon: "📚", title: "Becas educativas",   body: "Educación adicional para seguir escalando tras el Bootcamp." },
    ],
    footnote: "Bases aplicables. Para participar debes estar registrado y conectado en vivo el día del sorteo.",
  },

  // ─── SPEAKERS ─────────────────────────────────────────────────────────────
  speakers: {
    label:    "Speakers confirmados",
    title_1:  "21 referentes del mundo hispano",
    title_em: "en 3 días",
    subtitle: "Negocios, ventas, marketing digital, mentalidad, finanzas y alto rendimiento. Todos en vivo.",
    mystery_name:  "Por revelar",
    mystery_title: "Próximo anuncio",
    note:     "La lista puede actualizarse. Seguimos los anuncios oficiales en redes.",
    // IG handles: mejor aproximación pública conocida (verificar + reemplazar donde aplique).
    // Fotos: sube cada imagen a /public/speakers/<handle>.jpg y el sistema las toma automáticamente.
    list: [
      { name: "Jorge Serratos",     role: "Host",     title: "Fundador Sinergéticos · Autor Best Seller · Podcast #1 Negocios México",
        topic: "Cómo construir un movimiento, no solo un negocio",
        pillar: "Entorno", featured: true, ig: "jorgeserratos", photo: "/speakers/jorgeserratos.jpg", initial: "J", bg: "linear-gradient(135deg,#00e040,#005a18)" },

      { name: "Manuel de León",     role: "Co-host",  title: "COO Sinergéticos · Experto en IA, tráfico y contenido digital",
        topic: "IA + tráfico + contenido: el stack técnico del crecimiento en 2026",
        pillar: "Velocidad", featured: true, ig: "manueldeleonmjr", photo: "/speakers/manueldeleonmjr.jpg", initial: "M", bg: "linear-gradient(135deg,#4ade80,#00a030)" },

      { name: "Daniel Marcos",      title: "CEO Growth Institute · Coautor de Scaling Up en LATAM · Referente en escalamiento empresarial",
        topic: "Scaling Up: el playbook para pasar de $100K a $10M anuales",
        pillar: "Velocidad", ig: "dmarcos", photo: "/speakers/dmarcos.jpg", initial: "D", bg: "linear-gradient(135deg,#38bdf8,#0c4a6e)" },

      { name: "Fernando Anzures",   title: "CEO ExmaCon · Autor 'El Consumidor es el Medio' · Referente en consumer marketing LATAM",
        topic: "El consumidor es el medio: vender sin vender en la era del algoritmo",
        pillar: "Velocidad", ig: "fernandoanzures", photo: "/speakers/fernandoanzures.jpg", initial: "F", bg: "linear-gradient(135deg,#f97316,#7c2d12)" },

      { name: "Claudia Lizaldi",    title: "Conductora, actriz y empresaria · Expertise en marca personal y reinvención",
        topic: "Reinvención después de los 40: construir una marca personal que paga",
        pillar: "Mentalidad", ig: "claudializaldi", photo: "/speakers/claudializaldi.jpg", initial: "C", bg: "linear-gradient(135deg,#a855f7,#581c87)" },

      { name: "Alejandro Kasuga",   title: "Empresario mexicano (Yakult México) · Autor y speaker en Kaizen y liderazgo consciente",
        topic: "Kaizen empresarial: mejoras del 1% que transforman negocios de décadas",
        pillar: "Mentalidad", ig: "alejandrokasuga", photo: "/speakers/alejandrokasuga.jpg", initial: "A", bg: "linear-gradient(135deg,#fbbf24,#78350f)" },

      { name: "Alejandro Saracho",  title: "Coach ejecutivo · Autor 'Despertando al líder que está en ti'",
        topic: "De operador a dueño: el salto mental que desbloquea la libertad",
        pillar: "Mentalidad", ig: "alejandrosaracho", photo: "/speakers/alejandrosaracho.jpg", initial: "A", bg: "linear-gradient(135deg,#22d3ee,#0e7490)" },

      { name: "Coral Mujaes",       title: "Ex boxeadora profesional · Autora y coach · Mindset, hábitos y resiliencia",
        topic: "Disciplina de campeona: el mindset deportivo aplicado a tu negocio",
        pillar: "Mentalidad", ig: "coralmujaes", photo: "/speakers/coralmujaes.jpg", initial: "C", bg: "linear-gradient(135deg,#ec4899,#831843)" },

      { name: "Spencer Hoffmann",   title: "CEO Chopper · Speaker en liderazgo, productividad y hábitos de alto rendimiento",
        topic: "La rutina que construye imperios: hábitos de alto rendimiento del fundador",
        pillar: "Mentalidad", ig: "spencerhoffmann", photo: "/speakers/spencerhoffmann.jpg", initial: "S", bg: "linear-gradient(135deg,#84cc16,#365314)" },

      { name: "Efrén Martínez",     title: "Coach internacional · Formador de formadores · Desarrollo humano aplicado a empresarios",
        topic: "Romper las programaciones mentales heredadas que sabotean tu crecimiento",
        pillar: "Mentalidad", ig: "efrenmartinezcoach", photo: "/speakers/efrenmartinezcoach.jpg", initial: "E", bg: "linear-gradient(135deg,#14b8a6,#134e4a)" },

      { name: "Salvador Alba",      title: "Empresario y speaker · Estrategia comercial y escalamiento B2B",
        topic: "Estrategia B2B: cerrar contratos de 6 cifras sin depender de ti",
        pillar: "Velocidad", ig: "salvadoralba", photo: "/speakers/salvadoralba.jpg", initial: "S", bg: "linear-gradient(135deg,#6366f1,#312e81)" },

      { name: "Pavo Gómez",         title: "Creador digital · Storytelling de marca y contenido que convierte",
        topic: "Storytelling que vende: tu historia como tu diferenciador más caro",
        pillar: "Velocidad", ig: "pavogomez", photo: "/speakers/pavogomez.jpg", initial: "P", bg: "linear-gradient(135deg,#f43f5e,#881337)" },

      { name: "Karla Barajas",      title: "Empresaria y speaker · Liderazgo femenino y marca personal rentable",
        topic: "Marca personal femenina: cobrar lo que vales sin justificarte",
        pillar: "Mentalidad", ig: "karlabarajasoficial", photo: "/speakers/karlabarajasoficial.jpg", initial: "K", bg: "linear-gradient(135deg,#e879f9,#701a75)" },

      { name: "Mike Munzvil",       title: "Speaker internacional · Ventas de alto ticket y negociación",
        topic: "Negociación de alto ticket: vender valor, nunca precio",
        pillar: "Velocidad", ig: "mikemunzvil", photo: "/speakers/mikemunzvil.jpg", initial: "M", bg: "linear-gradient(135deg,#0ea5e9,#082f49)" },

      { name: "Dr. Roch",           title: "Médico y speaker · Salud, hormonas y performance ejecutivo",
        topic: "Energía del emprendedor: la biología que sostiene tu ejecución",
        pillar: "Mentalidad", ig: "doctor.roch", photo: "/speakers/doctor.roch.jpg", initial: "R", bg: "linear-gradient(135deg,#10b981,#064e3b)" },

      { name: "Tati Arias",         title: "Experta en marca personal · Comunicación y posicionamiento para emprendedores",
        topic: "Posicionarte como autoridad en 12 meses (aunque hoy nadie te conozca)",
        pillar: "Velocidad", ig: "tatiarias", photo: "/speakers/tatiarias.jpg", initial: "T", bg: "linear-gradient(135deg,#eab308,#713f12)" },

      { name: "Luis Fallas",        title: "Emprendedor y speaker · Ventas, liderazgo y equipos comerciales",
        topic: "Equipos de ventas que venden sin ti: estructura, KPIs y comisiones",
        pillar: "Velocidad", ig: "luisfallas", photo: "/speakers/luisfallas.jpg", initial: "L", bg: "linear-gradient(135deg,#8b5cf6,#4c1d95)" },

      { name: "Valentina Ortiz",    title: "Creadora de contenido y empresaria · Marketing digital y comunidad",
        topic: "Comunidad pagada: convertir audiencia en ingresos recurrentes",
        pillar: "Entorno", ig: "valentinaortiz", photo: "/speakers/valentinaortiz.jpg", initial: "V", bg: "linear-gradient(135deg,#f472b6,#9d174d)" },

      { name: "Javi Rodríguez",     title: "Experto en medios pagados · Funnels y escalamiento de campañas Meta/Google",
        topic: "Meta Ads 2026: CPL predecible para negocios de servicios",
        pillar: "Velocidad", ig: "javirodriguez", photo: "/speakers/javirodriguez.jpg", initial: "J", bg: "linear-gradient(135deg,#06b6d4,#164e63)" },

      { name: "Titto Luzardo",      title: "Empresario y speaker · Libertad financiera y negocios digitales",
        topic: "Separar persona y negocio: la arquitectura financiera del dueño libre",
        pillar: "Velocidad", ig: "tittoluzardo", photo: "/speakers/tittoluzardo.jpg", initial: "T", bg: "linear-gradient(135deg,#fb923c,#7c2d12)" },

      { name: "Brando Angulo",      title: "Emprendedor digital · Ventas online y marca personal rentable",
        topic: "Lanzamientos digitales: cómo facturar 6 cifras en 7 días",
        pillar: "Velocidad", ig: "brandoangulo", photo: "/speakers/brandoangulo.jpg", initial: "B", bg: "linear-gradient(135deg,#34d399,#065f46)" },

      { name: "Alejandro Cardona",  title: "Experto en ventas consultivas · Procesos comerciales para negocios de servicios",
        topic: "Ventas consultivas: el proceso que cierra 4 de cada 10 llamadas",
        pillar: "Velocidad", ig: "alejandrocardona", photo: "/speakers/alejandrocardona.jpg", initial: "A", bg: "linear-gradient(135deg,#fde047,#a16207)" },
    ] as Speaker[],
  },

  // ─── TESTIMONIOS ──────────────────────────────────────────────────────────
  testimonials: {
    label:    "Resultados reales",
    title_1:  "Personas que ya cruzaron",
    title_em: "al siguiente nivel",
    subtitle: "Empezaron donde estás tú hoy. Esto es lo que pasó.",
    items: [
      { quote: "Tenía un negocio físico que dependía de que la gente me conociera en persona. Tres días después del Bootcamp empecé a vender por WhatsApp. Hoy el 40% de mis clientes nunca me ha visto en persona.", result: "40% de ventas 100% digital", name: "Sandra Vargas", role: "Nutrióloga · CDMX" },
      { quote: "Me mudé a EE.UU. sin clientes y sin permiso de trabajo. Digitalicé mi curso de nail art y generé $9,000 USD en mi primer mes.", result: "$9,000 USD en el primer mes", name: "Janet", role: "México → Estados Unidos" },
      { quote: "Pasé de dar consultas a $200 USD a lanzar un programa de 8 semanas. 23 personas a $497 cada una.", result: "$11,431 USD en 30 días", name: "Carlos", role: "Asesor financiero" },
    ],
    featured_quote:  "En la calle te cansas, pero en el internet no hay límites.",
    featured_author: "Janet",
    featured_role:   "miembro del ecosistema Sinergéticos",
  },

  // ─── CREDENCIALES (Jorge) ─────────────────────────────────────────────────
  credentials: {
    host_badge: "Tu host en el Bootcamp",
    name_1:     "Jorge",
    name_em:    "Serratos",
    bio:        "No es un nativo digital. Es abogado y empresario que construyó todo esto desde cero, igual que tú. Hoy lidera el movimiento sinergético más grande del mundo hispano y viene al Bootcamp a despertarte, no a motivarte.",
    stats: [
      { number: "+20,000",   label: "emprendedores ayudados a convertir su conocimiento en un negocio digital rentable" },
      { number: "+$2M USD",  label: "invertidos en capacitación con los mejores del mundo" },
      { number: "209M",      label: "personas de alcance · Podcast Sinergéticos #1 Negocios México · +100k calificaciones" },
    ],
  },

  // ─── BONO ─────────────────────────────────────────────────────────────────
  bonus: {
    tag:        "Solo para asistentes del Bootcamp",
    title_1:    "Sé entrevistado en el",
    title_em:   "Podcast #1 de Negocios",
    body_intro: "Quienes confirmen su",
    body_product: "Synergy Unlimited Black Access",
    body_mid:   "durante el evento entran al sorteo para ser entrevistados por Jorge Serratos en el podcast",
    body_rank:  "#1 en negocios en México",
    body_reach: "209 millones de personas de alcance",
    body_end:   "y más de 100,000 calificaciones.",
  },

  // ─── REGISTRO ─────────────────────────────────────────────────────────────
  registration: {
    label:    "Tu lugar te espera",
    title_1:  "Tres días que pueden",
    title_em: "cambiar el siguiente año",
    subtitle: "Cupos de cortesía limitados. Regístrate antes del 20 de mayo y obtén tu acceso digital sin costo (valor $497 USD).\nEl Bootcamp es 100% en vivo, sin repetición.",
    form: {
      name_label:        "Nombre completo",
      name_placeholder:  "Tu nombre y apellido",
      email_label:       "Correo electrónico",
      email_placeholder: "tucorreo@ejemplo.com",
      whatsapp_label:       "WhatsApp (con lada)",
      whatsapp_placeholder: "+52 55 1234 5678",
      country_label:       "País",
      country_placeholder: "Selecciona tu país",
      cta:         "Reserva mi acceso de cortesía",
      cta_loading: "Registrando...",
      disclaimer:  "Al registrarte aceptas recibir información sobre el evento y aceptas nuestra Política de Privacidad. Sin spam.",
    },
    success: {
      title:   "¡Ya tienes tu lugar!",
      message: "Revisa tu correo, te enviamos los detalles del Bootcamp.\nNos vemos el 5 de Junio de 2026.",
    },
  },

  // ─── SOCIAL-PROOF POP-UP ─────────────────────────────────────────────────
  popup: {
    title_prefix: "se registró al Bootcamp",
    urgency:      "Accesos de cortesía limitados · quedan pocos",
    people: [
      { name: "María G.",   city: "CDMX, MX",         minutes: 2  },
      { name: "Andrés R.",  city: "Bogotá, CO",       minutes: 3  },
      { name: "Valeria P.", city: "Guadalajara, MX",  minutes: 5  },
      { name: "Carlos E.",  city: "Miami, US",        minutes: 7  },
      { name: "Natalia C.", city: "Medellín, CO",     minutes: 9  },
      { name: "Jorge L.",   city: "Monterrey, MX",    minutes: 12 },
      { name: "Paulina O.", city: "Santiago, CL",     minutes: 14 },
      { name: "Luis F.",    city: "Buenos Aires, AR", minutes: 16 },
      { name: "Daniela K.", city: "Lima, PE",         minutes: 19 },
      { name: "Roberto M.", city: "Quito, EC",        minutes: 22 },
      { name: "Ana S.",     city: "Santo Domingo, DO",minutes: 26 },
      { name: "Iván T.",    city: "Panamá, PA",       minutes: 29 },
      { name: "Sofía V.",   city: "Barcelona, ES",    minutes: 33 },
      { name: "Julián Z.",  city: "Asunción, PY",     minutes: 38 },
      { name: "Camila H.",  city: "San José, CR",     minutes: 41 },
    ],
  },

  // ─── FOOTER ───────────────────────────────────────────────────────────────
  footer: {
    logo_1:  "Synergy",
    logo_em: " Education",
    copy:    "Sinergéticos / Synergy Education · Todos los derechos reservados 2026",
    url:     "synergyforeducation.mx",
    disclaimers: [
      "Este sitio no es parte de Meta Platforms Inc. (Facebook / Instagram) ni ha sido avalado por Meta. Facebook e Instagram son marcas registradas de Meta Platforms Inc.",
      "Este sitio no es parte de Google LLC ni ha sido avalado por Google. Google, YouTube y Ads son marcas registradas de Google LLC.",
      "Los resultados y testimonios mostrados no representan una garantía. Los resultados dependen del esfuerzo, experiencia y compromiso de cada participante.",
    ],
    links: [
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Política de Cookies",    href: "/cookies" },
      { label: "Eliminar mis datos",     href: "/eliminar-datos" },
      { label: "Contacto",               href: "mailto:hola@synergyforeducation.mx" },
    ],
    contact: {
      email:   "hola@synergyforeducation.mx",
      company: "Synergy Education · Sinergéticos",
    },
  },
};
