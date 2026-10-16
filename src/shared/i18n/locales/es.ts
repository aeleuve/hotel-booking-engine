import type { MessageSchema } from '../schema'

export default {
  topBar: {
    official: 'Web oficial. Mejor precio garantizado.',
    call: 'Llama al {phone}',
    whatsapp: 'WhatsApp',
  },
  nav: {
    label: 'Principal',
    rooms: 'Habitaciones',
    offers: 'Ofertas',
    services: 'Servicios',
    location: 'Cómo llegar',
    reviews: 'Opiniones',
    faq: 'Preguntas',
    book: 'Reservar',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  locale: { label: 'Idioma' },
  hero: {
    title: 'Duerme a seis minutos de tu puerta de embarque',
    lede: 'Hotel de negocios en Madrid-Barajas. Shuttle gratis a todas las terminales desde las 05:30, desayuno desde las 05:00 y salas de reuniones hasta 120 personas.',
    stars: 'Hotel de {n} estrellas',
  },
  booking: {
    title: 'Encuentra tu habitación',
    checkIn: 'Entrada',
    checkOut: 'Salida',
    guests: 'Huéspedes',
    adults: 'Adultos',
    children: 'Niños',
    rooms: 'Habitaciones',
    guestSummary:
      '{adults} adultos, {children} niños, {rooms} habitación | {adults} adultos, {children} niños, {rooms} habitaciones',
    done: 'Listo',
    submit: 'Ver disponibilidad',
    searching: 'Consultando precios',
    errors: {
      'check-in-past': 'La entrada no puede ser en el pasado. Elige hoy o una fecha posterior.',
      'check-out-before-check-in': 'La salida debe ser al menos una noche después de la entrada.',
      'too-many-nights': 'Las estancias de más de 30 noches se cotizan por teléfono. Llámanos.',
      'no-adults': 'Añade al menos un adulto.',
      network: 'No se cargaron los precios. Revisa tu conexión y vuelve a intentarlo.',
    },
  },
  availability: {
    summary: '{nights} noche, {guests} huéspedes | {nights} noches, {guests} huéspedes',
    direct: 'Nuestro precio para tu estancia',
    taxes: 'Impuestos incluidos',
    compare: 'La misma estancia en otros sitios',
    book: 'Pedir este precio por email',
    unpriced: 'No hay precios en vivo para estas fechas. Llama al {phone} y te damos precio.',
    edit: 'Cambiar búsqueda',
  },
  rooms: {
    title: 'Habitaciones',
    lede: 'Triple acristalamiento, cortinas opacas y un escritorio de verdad en todas las habitaciones.',
    size: '{n} m²',
    guests: 'Hasta {n} personas',
    bed: { double: 'Cama doble', king: 'Cama king' },
    from: 'Desde {price} la noche',
    items: {
      standard: {
        name: 'Estándar',
        text: 'Habitación tranquila con vistas al jardín. Cabe un viajero y su maleta con espacio de sobra.',
      },
      executive: {
        name: 'Ejecutiva',
        text: 'Plantas altas, cafetera espresso y acceso al lounge para desayuno y copa por la tarde.',
      },
      suite: {
        name: 'Junior suite',
        text: 'Salón independiente con sofá cama. Para una familia o una pequeña sesión de trabajo.',
      },
    },
  },
  offers: {
    title: 'Ofertas',
    lede: 'Reserva en esta web y se aplican solas.',
    off: '{n}% de descuento',
    from: 'Desde {price}',
    items: {
      'early-booking': {
        name: 'Reserva anticipada',
        text: 'Reserva con al menos 10 días de antelación.',
      },
      'crew-rest': {
        name: 'Descanso entre vuelos',
        text: 'Uso de día o noche completa, con salida hasta las 16:00.',
      },
      'meeting-day': {
        name: 'Jornada de reunión',
        text: 'Sala, dos pausas café y almuerzo, por persona.',
      },
    },
    benefitsTitle: 'Reservando aquí tienes',
    benefits: [
      'El precio más bajo online, o lo igualamos',
      'Salida tardía bajo petición',
      '35% de descuento en el parking durante tu viaje',
      'Shuttle gratis al aeropuerto y a IFEMA',
    ],
  },
  services: {
    title: 'Servicios',
    items: {
      shuttle: { name: 'Shuttle al aeropuerto', text: 'Gratis, a la T4 y luego T1 y T2.' },
      breakfast: { name: 'Desayuno desde las 05:00', text: 'Bolsa para llevar si vuelas antes.' },
      meetings: {
        name: 'Salas de reuniones',
        text: 'Siete salas de 8 a 120 personas, todas con luz natural.',
      },
      wifi: { name: 'Wi-Fi', text: 'Gratis en todo el hotel, apto para videollamadas.' },
      pool: { name: 'Piscina exterior', text: 'Abierta de junio a septiembre.' },
      gym: { name: 'Gimnasio', text: 'Abierto 24 horas.' },
      parking: {
        name: 'Parking',
        text: 'Cubierto, con cargadores eléctricos. Deja el coche mientras viajas.',
      },
      restaurant: { name: 'Restaurante', text: 'Cocina madrileña, abierto hasta las 23:30.' },
    },
  },
  location: {
    title: 'Cómo llegar',
    lede: 'Entre el aeropuerto e IFEMA, a 20 minutos en coche del centro.',
    distances: {
      t4: 'Terminal 4',
      t12: 'Terminales 1 y 2',
      ifema: 'Feria IFEMA',
      centre: 'Puerta del Sol',
    },
    minutes: '{n} min',
    shuttleTitle: 'Salidas del shuttle desde la puerta del hotel',
    shuttleNote:
      'Reserva tu plaza en recepción. Fuera de horario, te pedimos un taxi al precio del shuttle.',
    openMap: 'Abrir en mapas',
    mapTitle: 'Mapa con el Hotel Pista Siete junto al aeropuerto de Madrid-Barajas',
  },
  reviews: {
    title: 'Opiniones de huéspedes',
    score: '{score} sobre 10',
    count: 'De {count} estancias verificadas',
  },
  faq: {
    title: 'Preguntas',
    items: [
      {
        q: '¿Cómo llego del aeropuerto al hotel?',
        a: 'El shuttle recoge en llegadas de la T4, puerta 7, y de la T2, puerta 4. Llama a recepción al aterrizar y te decimos cuándo llega el siguiente.',
      },
      {
        q: '¿A qué hora son la entrada y la salida?',
        a: 'Entrada desde las 14:00, salida hasta las 12:00. Recepción abre 24 horas: si llegas pronto, deja el equipaje y usa las duchas del gimnasio.',
      },
      {
        q: '¿Puedo organizar una reunión o evento?',
        a: 'Sí. Tenemos siete salas de 8 a 120 personas, con pantallas, videoconferencia y catering. Escríbenos con fecha y número de asistentes.',
      },
      {
        q: '¿Hay parking mientras viajo?',
        a: 'Sí. Si reservas aquí tienes un 35% de descuento en el parking cubierto durante todo tu viaje, con el shuttle incluido.',
      },
      {
        q: '¿Puedo cancelar mi reserva?',
        a: 'Las tarifas flexibles se cancelan gratis hasta las 18:00 del día anterior a la llegada. Las de reserva anticipada no son reembolsables.',
      },
    ],
  },
  footer: {
    contact: 'Contacto',
    legal: 'Legal',
    privacy: 'Política de privacidad',
    cookies: 'Política de cookies',
    notice: '© {year} Hotel Pista Siete. Hotel ficticio creado como demo.',
  },
} satisfies MessageSchema
