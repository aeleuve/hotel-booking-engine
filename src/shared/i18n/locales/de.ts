import type { MessageSchema } from '../schema'

export default {
  topBar: {
    official: 'Offizielle Website. Bestpreisgarantie.',
    call: 'Anrufen: {phone}',
    whatsapp: 'WhatsApp',
  },
  nav: {
    label: 'Hauptmenü',
    rooms: 'Zimmer',
    offers: 'Angebote',
    services: 'Services',
    location: 'Anreise',
    reviews: 'Bewertungen',
    faq: 'Fragen',
    myBooking: 'Meine Buchung',
    book: 'Buchen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
  },
  locale: { label: 'Sprache' },
  hero: {
    title: 'Schlafen Sie sechs Minuten von Ihrem Gate',
    lede: 'Businesshotel am Flughafen Madrid-Barajas. Kostenloser Shuttle zu allen Terminals ab 05:30, Frühstück ab 05:00, Tagungsräume für bis zu 120 Personen.',
    stars: '{n}-Sterne-Hotel',
  },
  booking: {
    title: 'Zimmer finden',
    checkIn: 'Anreise',
    checkOut: 'Abreise',
    guests: 'Gäste',
    adults: 'Erwachsene',
    children: 'Kinder',
    childAge: 'Alter von Kind {n}',
    rooms: 'Zimmer',
    guestSummary:
      '{adults} Erwachsene, {children} Kinder, {rooms} Zimmer | {adults} Erwachsene, {children} Kinder, {rooms} Zimmer',
    done: 'Fertig',
    submit: 'Verfügbarkeit prüfen',
    searching: 'Preise werden geprüft',
    errors: {
      'check-in-past':
        'Die Anreise darf nicht in der Vergangenheit liegen. Wählen Sie heute oder später.',
      'check-out-before-check-in':
        'Die Abreise muss mindestens eine Nacht nach der Anreise liegen.',
      'too-many-nights': 'Aufenthalte über 30 Nächte bieten wir telefonisch an. Rufen Sie uns an.',
      'no-adults': 'Fügen Sie mindestens einen Erwachsenen hinzu.',
      'child-age-missing': 'Wählen Sie das Alter jedes Kindes.',
      network:
        'Preise wurden nicht geladen. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
    },
  },
  results: {
    title: 'Zimmer für Ihre Daten',
    searching: 'Live-Preise für jedes Zimmer werden geprüft',
    summary: '{nights} Nacht, {guests} Gäste | {nights} Nächte, {guests} Gäste',
    empty:
      'Für diese Daten sind keine Zimmer frei. Versuchen Sie andere Daten oder rufen Sie {phone} an.',
  },
  rates: {
    reserve: 'Reservieren',
    nonRefundable: 'Nicht erstattbar',
    freeCancellation: 'Kostenlose Stornierung',
    freeUntil: 'Kostenlos stornierbar bis {date}',
    forNights: 'Gesamt für {n} Nacht | Gesamt für {n} Nächte',
    payAtHotel: 'zzgl. {amount} im Hotel',
    showMore: '{n} weitere Tarife anzeigen',
  },
  flexible: {
    title: 'Beste Preise in diesem Monat',
    progress: '{done} von {total} Terminen geprüft',
    best: 'Bester Preis',
    unavailable: 'Ausgebucht',
    failed: 'Derzeit nicht verfügbar',
    noResults:
      'An keinem dieser Termine sind Zimmer frei. Versuchen Sie einen anderen Monat oder rufen Sie {phone} an.',
    error:
      'Wir konnten die Preise gerade nicht prüfen. Versuchen Sie es erneut oder rufen Sie {phone} an.',
    tooManyGuests:
      'So viele Gäste können nicht online buchen. Rufen Sie {phone} an, wir finden Zimmer für Sie.',
    noResultsNoPhone:
      'An keinem dieser Termine sind Zimmer frei. Versuchen Sie einen anderen Monat.',
    errorNoPhone: 'Wir konnten die Preise gerade nicht prüfen. Versuchen Sie es erneut.',
    tooManyGuestsNoPhone:
      'So viele Gäste können nicht online buchen. Bitte kontaktieren Sie das Hotel, wir finden Zimmer für Sie.',
    noDates: 'In diesem Monat sind keine Termine mehr frei. Versuchen Sie einen anderen Monat.',
    choose: 'Preise für {range} anzeigen',
  },
  summary: {
    dates: 'Daten',
    room: 'Zimmer',
    cancellation: 'Stornierung',
    total: 'Gesamt',
  },
  checkout: {
    title: 'Buchung abschließen',
    back: 'Zurück zu den Zimmern',
    guestStep: 'Gastdaten',
    paymentStep: 'Zahlung',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phone: 'Telefon',
    toPayment: 'Weiter zur Zahlung',
    priceChanged: 'Das Hotel hat diesen Tarif aktualisiert. Neuer Gesamtpreis: {price}.',
    termsChanged:
      'Verpflegung oder Stornobedingungen haben sich geändert. Prüfen Sie die Übersicht vor dem Bezahlen.',
    payNow: 'Sie zahlen jetzt {price}',
    secure:
      'Kartendaten gehen direkt an den Zahlungsanbieter. Sandbox: Karte 4242 4242 4242 4242 verwenden.',
    payTest: 'Mit Testkarte bezahlen',
    errors: {
      required: 'Füllen Sie dieses Feld aus.',
      email: "Geben Sie eine E-Mail wie name{'@'}beispiel.de ein.",
      phone: 'Geben Sie eine Telefonnummer mit Ländervorwahl ein.',
      'hold-failed':
        'Dieser Tarif ist nicht mehr verfügbar. Gehen Sie zurück und wählen Sie ein anderes Zimmer.',
      'payment-failed': 'Das Zahlungsformular wurde nicht geladen. Laden Sie die Seite neu.',
      'booking-failed':
        'Die Zahlung ging durch, die Buchung wurde aber nicht bestätigt. Rufen Sie uns an, bevor Sie erneut zahlen.',
      'session-lost': 'Dieser Buchungsvorgang ging verloren. Suchen Sie Ihre Daten erneut.',
    },
  },
  complete: {
    confirming: 'Ihre Buchung wird bestätigt',
    title: 'Buchung bestätigt',
    bookingId: 'Buchungsnummer',
    confirmationCode: 'Hotelbestätigung',
    pendingCode: 'Kommt per E-Mail, sobald das Hotel bestätigt',
    emailSent: 'Die Details gingen an {email}.',
    manage: 'Diese Buchung verwalten',
    failedTitle: 'Buchung nicht bestätigt',
    backHome: 'Zurück zum Hotel',
  },
  myBooking: {
    title: 'Meine Buchung',
    lede: 'Geben Sie die Buchungsnummer aus Ihrer Bestätigung und Ihre Buchungs-E-Mail ein.',
    bookingId: 'Buchungsnummer',
    email: 'E-Mail',
    find: 'Buchung suchen',
    notFound: 'Keine Buchung passt zu dieser Nummer und E-Mail.',
    status: {
      confirmed: 'Bestätigt',
      cancelled: 'Storniert',
      pending: 'Ausstehend',
    },
    holder: 'Gebucht von',
    cancel: 'Buchung stornieren',
    confirmFree: 'Diese Buchung stornieren? Es ist kostenlos, der volle Betrag wird erstattet.',
    confirmCharged: 'Dieser Tarif ist nicht erstattbar. Trotzdem stornieren?',
    confirmCancel: 'Ja, stornieren',
    keep: 'Buchung behalten',
    notRefundable: 'Für diese Buchung ist keine kostenlose Stornierung mehr möglich.',
    cancelled: 'Buchung storniert. Erstattung {refund}, Gebühr {fee}.',
    cancelFailed:
      'Die Buchung wurde nicht storniert. Versuchen Sie es erneut oder rufen Sie uns an.',
  },
  rooms: {
    title: 'Zimmer',
    lede: 'Dreifachverglasung, Verdunklungsvorhänge und ein richtiger Schreibtisch in jedem Zimmer.',
    size: '{n} m²',
    guests: 'Bis zu {n} Gäste',
    showAll: 'Alle {n} Zimmer anzeigen',
    showLess: 'Weniger Zimmer anzeigen',
    checkPrices: 'Preise prüfen',
  },
  offers: {
    title: 'Bei Direktbuchung erhalten Sie',
    lede: 'Buchen Sie auf dieser Website, das gehört zu jedem Aufenthalt.',
    benefits: [
      'Kostenloser Shuttle zu allen Terminals und zur IFEMA',
      'Später Check-out auf Anfrage',
      'Frühstückstüte für frühe Flüge',
      'Online ändern oder stornieren bei erstattbaren Tarifen',
    ],
  },
  services: {
    title: 'Services',
    items: {
      shuttle: { name: 'Flughafen-Shuttle', text: 'Kostenlos, zu T4, dann T1 und T2.' },
      breakfast: { name: 'Frühstück ab 05:00', text: 'Lunchpaket, wenn Sie früher fliegen.' },
      meetings: {
        name: 'Tagungsräume',
        text: 'Sieben Räume für 8 bis 120 Personen, alle mit Tageslicht.',
      },
      wifi: { name: 'WLAN', text: 'Überall kostenlos, schnell genug für Videocalls.' },
      pool: { name: 'Außenpool', text: 'Geöffnet von Juni bis September.' },
      gym: { name: 'Fitnessraum', text: 'Rund um die Uhr geöffnet.' },
      parking: {
        name: 'Parken',
        text: 'Überdacht, mit E-Ladestationen. Lassen Sie das Auto während der Reise hier.',
      },
      restaurant: { name: 'Restaurant', text: 'Madrider Küche, geöffnet bis 23:30.' },
    },
  },
  location: {
    title: 'Anreise',
    lede: 'Zwischen Flughafen und IFEMA, 20 Autominuten vom Stadtzentrum.',
    distances: {
      t4: 'Terminal 4',
      t12: 'Terminals 1 und 2',
      ifema: 'Messe IFEMA',
      centre: 'Puerta del Sol',
    },
    minutes: '{n} Min.',
    shuttleTitle: 'Shuttle-Abfahrten ab Hoteltür',
    shuttleNote:
      'Platz an der Rezeption reservieren. Außerhalb der Zeiten rufen wir Ihnen ein Taxi zum Shuttlepreis.',
    openMap: 'In Karten öffnen',
    mapTitle: 'Karte mit dem Hotel Pista Siete am Flughafen Madrid-Barajas',
  },
  reviews: {
    title: 'Gästebewertungen',
    score: '{score} von 10',
    count: 'Aus {count} verifizierten Aufenthalten',
  },
  faq: {
    title: 'Fragen',
    items: [
      {
        q: 'Wie komme ich vom Flughafen zum Hotel?',
        a: 'Unser Shuttle hält an der Ankunft T4, Tür 7, und T2, Tür 4. Rufen Sie nach der Landung die Rezeption an, wir sagen Ihnen, wann der nächste kommt.',
      },
      {
        q: 'Wann sind Check-in und Check-out?',
        a: 'Check-in ab 14:00, Check-out bis 12:00. Die Rezeption ist rund um die Uhr besetzt: Bei früher Ankunft Gepäck abgeben und die Duschen im Fitnessraum nutzen.',
      },
      {
        q: 'Kann ich hier eine Tagung oder Veranstaltung abhalten?',
        a: 'Ja. Sieben Räume für 8 bis 120 Personen, mit Bildschirmen, Videokonferenz und Catering. Schreiben Sie uns Datum und Teilnehmerzahl.',
      },
      {
        q: 'Kann ich während der Reise parken?',
        a: 'Ja. Bei Direktbuchung erhalten Sie 35% Rabatt auf das überdachte Parken für Ihre gesamte Reise, Shuttle inklusive.',
      },
      {
        q: 'Kann ich meine Buchung stornieren?',
        a: 'Flexible Tarife sind bis 18:00 am Vortag kostenlos stornierbar. Frühbuchertarife sind nicht erstattbar.',
      },
    ],
  },
  footer: {
    contact: 'Kontakt',
    legal: 'Rechtliches',
    privacy: 'Datenschutz',
    cookies: 'Cookie-Richtlinie',
    notice:
      '© {year} Hotel Pista Siete. Fiktive Marke; Zimmer, Preise und Buchungen stammen aus der LiteAPI-Sandbox.',
  },
} satisfies MessageSchema
