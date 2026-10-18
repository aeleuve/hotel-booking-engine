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
    myBooking: 'Ma réservation',
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
    childAge: 'Âge de l’enfant {n}',
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
      'child-age-missing': 'Choisissez l’âge de chaque enfant.',
      network: 'Les prix ne se sont pas chargés. Vérifiez votre connexion et réessayez.',
    },
  },
  results: {
    title: 'Chambres pour vos dates',
    searching: 'Vérification des prix en direct pour chaque chambre',
    summary: '{nights} nuit, {guests} voyageurs | {nights} nuits, {guests} voyageurs',
    empty: 'Plus de chambres pour ces dates. Essayez d’autres dates ou appelez le {phone}.',
  },
  rates: {
    reserve: 'Réserver',
    nonRefundable: 'Non remboursable',
    freeCancellation: 'Annulation gratuite',
    freeUntil: 'Annulation gratuite jusqu’au {date}',
    forNights: 'Total pour {n} nuit | Total pour {n} nuits',
    payAtHotel: 'plus {amount} à l’hôtel',
    showMore: 'Voir {n} tarifs de plus',
  },
  flexible: {
    title: 'Meilleurs prix du mois',
    progress: 'Vérification de {done} dates sur {total}',
    best: 'Meilleur prix',
    unavailable: 'Complet',
    failed: 'Indisponible pour le moment',
    noResults:
      'Plus de chambres à aucune de ces dates. Essayez un autre mois ou appelez le {phone}.',
    error: 'Nous n’avons pas pu vérifier les prix. Réessayez ou appelez le {phone}.',
    tooManyGuests:
      'Ce nombre de voyageurs ne peut pas être réservé en ligne. Appelez le {phone} et nous vous trouverons des chambres.',
    noResultsNoPhone: 'Plus de chambres à aucune de ces dates. Essayez un autre mois.',
    errorNoPhone: 'Nous n’avons pas pu vérifier les prix. Réessayez.',
    tooManyGuestsNoPhone:
      'Ce nombre de voyageurs ne peut pas être réservé en ligne. Contactez l’hôtel et nous vous trouverons des chambres.',
    noDates: 'Il ne reste plus de dates ce mois-ci. Essayez un autre mois.',
    choose: 'Voir les prix pour {range}',
  },
  summary: {
    dates: 'Dates',
    room: 'Chambre',
    cancellation: 'Annulation',
    total: 'Total',
  },
  checkout: {
    title: 'Finaliser votre réservation',
    back: 'Retour aux chambres',
    guestStep: 'Coordonnées du voyageur',
    paymentStep: 'Paiement',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    toPayment: 'Continuer vers le paiement',
    priceChanged: 'L’hôtel a mis à jour ce tarif. Nouveau total : {price}.',
    termsChanged:
      'La pension ou les conditions d’annulation ont changé. Vérifiez le récapitulatif avant de payer.',
    payNow: 'Vous payez {price} maintenant',
    secure:
      'Les données de carte vont directement au prestataire de paiement. Sandbox : utilisez la carte 4242 4242 4242 4242.',
    payTest: 'Payer avec la carte de test',
    errors: {
      required: 'Remplissez ce champ.',
      email: "Saisissez un e-mail comme nom{'@'}exemple.fr.",
      phone: 'Saisissez un numéro avec l’indicatif du pays.',
      'hold-failed':
        'Ce tarif n’est plus disponible. Revenez en arrière et choisissez une autre chambre.',
      'payment-failed':
        'Le formulaire de paiement ne s’est pas chargé. Rechargez la page pour réessayer.',
      'booking-failed':
        'Le paiement est passé mais la réservation n’est pas confirmée. Appelez-nous avant de repayer.',
      'session-lost':
        'Nous avons perdu cette réservation en cours. Recherchez à nouveau vos dates.',
    },
  },
  complete: {
    confirming: 'Confirmation de votre réservation',
    title: 'Réservation confirmée',
    bookingId: 'Numéro de réservation',
    confirmationCode: 'Confirmation de l’hôtel',
    pendingCode: 'Envoyée par e-mail quand l’hôtel confirme',
    emailSent: 'Les détails ont été envoyés à {email}.',
    manage: 'Gérer cette réservation',
    failedTitle: 'Réservation non confirmée',
    backHome: 'Retour à l’hôtel',
  },
  myBooking: {
    title: 'Ma réservation',
    lede: 'Saisissez le numéro de réservation de votre confirmation et l’e-mail utilisé pour réserver.',
    bookingId: 'Numéro de réservation',
    email: 'E-mail',
    find: 'Trouver la réservation',
    notFound: 'Aucune réservation ne correspond à ce numéro et cet e-mail.',
    status: {
      confirmed: 'Confirmée',
      cancelled: 'Annulée',
      pending: 'En attente',
    },
    holder: 'Réservé par',
    cancel: 'Annuler la réservation',
    confirmFree: 'Annuler cette réservation ? C’est gratuit et le montant total est remboursé.',
    confirmCharged: 'Ce tarif n’est pas remboursable. Annuler quand même ?',
    confirmCancel: 'Oui, annuler',
    keep: 'Garder la réservation',
    notRefundable: 'L’annulation gratuite n’est plus possible pour cette réservation.',
    cancelled: 'Réservation annulée. Remboursement {refund}, frais {fee}.',
    cancelFailed: 'La réservation n’a pas été annulée. Réessayez ou appelez-nous.',
  },
  rooms: {
    title: 'Chambres',
    lede: 'Triple vitrage, rideaux occultants et un vrai bureau dans chaque chambre.',
    size: '{n} m²',
    guests: 'Jusqu’à {n} personnes',
    showAll: 'Voir les {n} chambres',
    showLess: 'Voir moins de chambres',
    checkPrices: 'Voir les prix',
  },
  offers: {
    title: 'En réservant ici, vous avez',
    lede: 'Réservez sur ce site, c’est inclus dans chaque séjour.',
    benefits: [
      'Navette gratuite vers tous les terminaux et l’IFEMA',
      'Départ tardif sur demande',
      'Sac petit-déjeuner pour les vols matinaux',
      'Modification ou annulation en ligne sur les tarifs remboursables',
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
    notice:
      '© {year} Hotel Pista Siete. Marque fictive ; chambres, prix et réservations viennent du sandbox LiteAPI.',
  },
} satisfies MessageSchema
