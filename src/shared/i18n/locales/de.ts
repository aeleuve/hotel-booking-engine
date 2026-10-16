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
      network:
        'Preise wurden nicht geladen. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
    },
  },
  availability: {
    summary: '{nights} Nacht, {guests} Gäste | {nights} Nächte, {guests} Gäste',
    direct: 'Unser Preis für Ihren Aufenthalt',
    taxes: 'Inklusive Steuern',
    compare: 'Derselbe Aufenthalt anderswo',
    book: 'Diesen Preis per E-Mail anfragen',
    unpriced:
      'Für diese Daten gibt es keine Live-Preise. Rufen Sie {phone} an, wir machen Ihnen ein Angebot.',
    edit: 'Suche ändern',
  },
  rooms: {
    title: 'Zimmer',
    lede: 'Dreifachverglasung, Verdunklungsvorhänge und ein richtiger Schreibtisch in jedem Zimmer.',
    size: '{n} m²',
    guests: 'Bis zu {n} Gäste',
    bed: { double: 'Doppelbett', king: 'Kingsize-Bett' },
    from: 'Ab {price} pro Nacht',
    items: {
      standard: {
        name: 'Standard',
        text: 'Ruhiges Zimmer zum Garten. Platz für einen Reisenden und sein Handgepäck.',
      },
      executive: {
        name: 'Executive',
        text: 'Obere Etagen, Espressomaschine und Lounge-Zugang für Frühstück und Abenddrinks.',
      },
      suite: {
        name: 'Junior Suite',
        text: 'Separater Wohnbereich mit Schlafsofa. Für eine Familie oder eine kleine Arbeitsrunde.',
      },
    },
  },
  offers: {
    title: 'Angebote',
    lede: 'Buchen Sie auf dieser Website, sie gelten automatisch.',
    off: '{n}% Rabatt',
    from: 'Ab {price}',
    items: {
      'early-booking': { name: 'Frühbucher', text: 'Mindestens 10 Tage im Voraus buchen.' },
      'crew-rest': {
        name: 'Zwischenstopp',
        text: 'Tagesnutzung oder Übernachtung, Check-out bis 16:00.',
      },
      'meeting-day': {
        name: 'Tagungspauschale',
        text: 'Raum, zwei Kaffeepausen und Mittagessen, pro Person.',
      },
    },
    benefitsTitle: 'Bei Direktbuchung erhalten Sie',
    benefits: [
      'Den günstigsten Online-Preis, oder wir gleichen ihn an',
      'Später Check-out auf Anfrage',
      '35% Rabatt aufs Parken während Ihrer Reise',
      'Kostenloser Shuttle zum Flughafen und zur IFEMA',
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
    notice: '© {year} Hotel Pista Siete. Fiktives Hotel als Demo.',
  },
} satisfies MessageSchema
