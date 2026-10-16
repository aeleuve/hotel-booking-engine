import type { MessageSchema } from '../schema'

export default {
  topBar: {
    official: 'Site officiel. Meilleur prix garanti.',
    call: 'Appeler le {phone}',
    whatsapp: 'WhatsApp',
  },
  nav: {
    label: 'Principal',
    rooms: 'Chambres',
    offers: 'Offres',
    services: 'Services',
    location: 'Accès',
    reviews: 'Avis',
    faq: 'Questions',
    book: 'Réserver',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  locale: { label: 'Langue' },
  hero: {
    title: 'Dormez à six minutes de votre porte d’embarquement',
    lede: 'Hôtel d’affaires à Madrid-Barajas. Navette gratuite vers tous les terminaux dès 05h30, petit-déjeuner dès 05h00, salles de réunion jusqu’à 120 personnes.',
    stars: 'Hôtel {n} étoiles',
  },
  booking: {
    title: 'Trouver votre chambre',
    checkIn: 'Arrivée',
    checkOut: 'Départ',
    guests: 'Voyageurs',
    adults: 'Adultes',
    children: 'Enfants',
    rooms: 'Chambres',
    guestSummary:
      '{adults} adultes, {children} enfants, {rooms} chambre | {adults} adultes, {children} enfants, {rooms} chambres',
    done: 'OK',
    submit: 'Voir les disponibilités',
    searching: 'Vérification des prix',
    errors: {
      'check-in-past':
        'L’arrivée ne peut pas être dans le passé. Choisissez aujourd’hui ou plus tard.',
      'check-out-before-check-in': 'Le départ doit être au moins une nuit après l’arrivée.',
      'too-many-nights': 'Au-delà de 30 nuits, nous faisons un devis par téléphone. Appelez-nous.',
      'no-adults': 'Ajoutez au moins un adulte.',
      network: 'Les prix ne se sont pas chargés. Vérifiez votre connexion et réessayez.',
    },
  },
  availability: {
    summary: '{nights} nuit, {guests} voyageurs | {nights} nuits, {guests} voyageurs',
    direct: 'Notre prix pour votre séjour',
    taxes: 'Taxes incluses',
    compare: 'Le même séjour ailleurs',
    book: 'Demander ce prix par e-mail',
    unpriced:
      'Pas de prix en direct pour ces dates. Appelez le {phone}, nous vous ferons un devis.',
    edit: 'Modifier la recherche',
  },
  rooms: {
    title: 'Chambres',
    lede: 'Triple vitrage, rideaux occultants et un vrai bureau dans chaque chambre.',
    size: '{n} m²',
    guests: 'Jusqu’à {n} personnes',
    bed: { double: 'Lit double', king: 'Lit king size' },
    from: 'À partir de {price} la nuit',
    items: {
      standard: {
        name: 'Standard',
        text: 'Chambre calme côté jardin. Assez de place pour un voyageur et son bagage cabine.',
      },
      executive: {
        name: 'Executive',
        text: 'Étages supérieurs, machine à espresso et accès au lounge pour le petit-déjeuner et l’apéritif.',
      },
      suite: {
        name: 'Junior suite',
        text: 'Salon séparé avec canapé-lit. Pour une famille ou une petite séance de travail.',
      },
    },
  },
  offers: {
    title: 'Offres',
    lede: 'Réservez sur ce site, elles s’appliquent toutes seules.',
    off: '-{n}%',
    from: 'À partir de {price}',
    items: {
      'early-booking': {
        name: 'Réservation anticipée',
        text: 'Réservez au moins 10 jours à l’avance.',
      },
      'crew-rest': {
        name: 'Escale',
        text: 'En journée ou pour la nuit, départ jusqu’à 16h00.',
      },
      'meeting-day': {
        name: 'Journée d’étude',
        text: 'Salle, deux pauses café et déjeuner, par personne.',
      },
    },
    benefitsTitle: 'En réservant ici, vous avez',
    benefits: [
      'Le prix le plus bas en ligne, ou nous l’alignons',
      'Départ tardif sur demande',
      '35% de réduction sur le parking pendant votre voyage',
      'Navette gratuite vers l’aéroport et l’IFEMA',
    ],
  },
  services: {
    title: 'Services',
    items: {
      shuttle: { name: 'Navette aéroport', text: 'Gratuite, vers T4 puis T1 et T2.' },
      breakfast: {
        name: 'Petit-déjeuner dès 05h00',
        text: 'Sac à emporter si vous partez plus tôt.',
      },
      meetings: {
        name: 'Salles de réunion',
        text: 'Sept salles de 8 à 120 personnes, toutes à la lumière du jour.',
      },
      wifi: { name: 'Wi-Fi', text: 'Gratuit partout, assez rapide pour la visio.' },
      pool: { name: 'Piscine extérieure', text: 'Ouverte de juin à septembre.' },
      gym: { name: 'Salle de sport', text: 'Ouverte 24 h/24.' },
      parking: {
        name: 'Parking',
        text: 'Couvert, avec bornes de recharge. Laissez la voiture pendant votre voyage.',
      },
      restaurant: { name: 'Restaurant', text: 'Cuisine madrilène, ouvert jusqu’à 23h30.' },
    },
  },
  location: {
    title: 'Accès',
    lede: 'Entre l’aéroport et l’IFEMA, à 20 minutes en voiture du centre-ville.',
    distances: {
      t4: 'Terminal 4',
      t12: 'Terminaux 1 et 2',
      ifema: 'Salon IFEMA',
      centre: 'Puerta del Sol',
    },
    minutes: '{n} min',
    shuttleTitle: 'Départs de la navette devant l’hôtel',
    shuttleNote:
      'Réservez votre place à la réception. Hors horaires, nous vous appelons un taxi au prix de la navette.',
    openMap: 'Ouvrir dans Plans',
    mapTitle: 'Carte de l’Hotel Pista Siete près de l’aéroport de Madrid-Barajas',
  },
  reviews: {
    title: 'Avis des clients',
    score: '{score} sur 10',
    count: 'Sur {count} séjours vérifiés',
  },
  faq: {
    title: 'Questions',
    items: [
      {
        q: 'Comment aller de l’aéroport à l’hôtel ?',
        a: 'La navette passe aux arrivées du T4, porte 7, et du T2, porte 4. Appelez la réception à l’atterrissage, nous vous dirons quand passe la suivante.',
      },
      {
        q: 'À quelle heure sont l’arrivée et le départ ?',
        a: 'Arrivée dès 14h00, départ jusqu’à 12h00. La réception est ouverte 24 h/24 : en avance, déposez vos bagages et utilisez les douches de la salle de sport.',
      },
      {
        q: 'Puis-je organiser une réunion ou un événement ?',
        a: 'Oui. Sept salles de 8 à 120 personnes, avec écrans, visioconférence et traiteur. Écrivez-nous avec la date et le nombre de participants.',
      },
      {
        q: 'Puis-je laisser ma voiture pendant mon voyage ?',
        a: 'Oui. En réservant ici, vous avez 35% de réduction sur le parking couvert pour tout votre voyage, navette comprise.',
      },
      {
        q: 'Puis-je annuler ma réservation ?',
        a: 'Les tarifs flexibles s’annulent gratuitement jusqu’à 18h00 la veille de l’arrivée. Les tarifs de réservation anticipée ne sont pas remboursables.',
      },
    ],
  },
  footer: {
    contact: 'Contact',
    legal: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    cookies: 'Politique de cookies',
    notice: '© {year} Hotel Pista Siete. Hôtel fictif créé pour une démo.',
  },
} satisfies MessageSchema
