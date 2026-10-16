export default {
  topBar: {
    official: 'Official website. Lowest price guaranteed.',
    call: 'Call {phone}',
    whatsapp: 'WhatsApp',
  },
  nav: {
    label: 'Main',
    rooms: 'Rooms',
    offers: 'Offers',
    services: 'Services',
    location: 'Getting here',
    reviews: 'Reviews',
    faq: 'FAQ',
    book: 'Book',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  locale: { label: 'Language' },
  hero: {
    title: 'Sleep six minutes from your gate',
    lede: 'Business hotel at Madrid-Barajas. Free shuttle to every terminal from 05:30, breakfast from 05:00, meeting rooms for up to 120 people.',
    stars: '{n}-star hotel',
  },
  booking: {
    title: 'Find your room',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Guests',
    adults: 'Adults',
    children: 'Children',
    rooms: 'Rooms',
    guestSummary:
      '{adults} adults, {children} children, {rooms} room | {adults} adults, {children} children, {rooms} rooms',
    done: 'Done',
    submit: 'Check availability',
    searching: 'Checking prices',
    errors: {
      'check-in-past': 'Check-in can’t be in the past. Pick today or a later date.',
      'check-out-before-check-in': 'Check-out must be at least one night after check-in.',
      'too-many-nights': 'Stays longer than 30 nights are quoted by phone. Call us.',
      'no-adults': 'Add at least one adult.',
      network: 'Prices didn’t load. Check your connection and try again.',
    },
  },
  availability: {
    summary: '{nights} night, {guests} guests | {nights} nights, {guests} guests',
    direct: 'Our price for your stay',
    taxes: 'Taxes included',
    compare: 'Same stay elsewhere',
    book: 'Request this price by email',
    unpriced: 'No live prices for these dates. Call {phone} and we’ll quote you.',
    edit: 'Change search',
  },
  rooms: {
    title: 'Rooms',
    lede: 'Triple glazing, blackout curtains and a desk you can work at, in every room.',
    size: '{n} m²',
    guests: 'Up to {n} guests',
    bed: { double: 'Double bed', king: 'King bed' },
    from: 'From {price} a night',
    items: {
      standard: {
        name: 'Standard',
        text: 'Quiet room facing the garden. Fits one traveller and a carry-on with room to spare.',
      },
      executive: {
        name: 'Executive',
        text: 'Upper floors, espresso machine and lounge access for breakfast and evening drinks.',
      },
      suite: {
        name: 'Junior suite',
        text: 'Separate living area with a sofa bed. Takes a family or a small working session.',
      },
    },
  },
  offers: {
    title: 'Offers',
    lede: 'Book on this site and they apply on their own.',
    off: '{n}% off',
    from: 'From {price}',
    items: {
      'early-booking': { name: 'Early booking', text: 'Book at least 10 days ahead.' },
      'crew-rest': {
        name: 'Layover rest',
        text: 'Day use or overnight, with check-out until 16:00.',
      },
      'meeting-day': {
        name: 'Meeting day',
        text: 'Room, two coffee breaks and lunch, per person.',
      },
    },
    benefitsTitle: 'Booking here gets you',
    benefits: [
      'The lowest price online, or we match it',
      'Late check-out on request',
      '35% off parking for your whole trip',
      'Free shuttle to the airport and IFEMA',
    ],
  },
  services: {
    title: 'Services',
    items: {
      shuttle: { name: 'Airport shuttle', text: 'Free, to T4 then T1 and T2.' },
      breakfast: { name: 'Breakfast from 05:00', text: 'Takeaway bag if you fly earlier.' },
      meetings: {
        name: 'Meeting rooms',
        text: 'Seven rooms for 8 to 120 people, all with daylight.',
      },
      wifi: { name: 'Wi-Fi', text: 'Free everywhere, fast enough for video calls.' },
      pool: { name: 'Outdoor pool', text: 'Open June to September.' },
      gym: { name: 'Gym', text: 'Open 24 hours.' },
      parking: {
        name: 'Parking',
        text: 'Covered, with EV chargers. Leave the car while you travel.',
      },
      restaurant: { name: 'Restaurant', text: 'Madrid cooking, open until 23:30.' },
    },
  },
  location: {
    title: 'Getting here',
    lede: 'Between the airport and IFEMA, with the city centre a 20-minute drive away.',
    distances: {
      t4: 'Terminal 4',
      t12: 'Terminals 1 and 2',
      ifema: 'IFEMA trade fair',
      centre: 'Puerta del Sol',
    },
    minutes: '{n} min',
    shuttleTitle: 'Shuttle departures from the hotel door',
    shuttleNote:
      'Book your seat at reception. Out of hours, we call you a taxi at the shuttle price.',
    openMap: 'Open in maps',
    mapTitle: 'Map showing Hotel Pista Siete near Madrid-Barajas airport',
  },
  reviews: {
    title: 'Guest reviews',
    score: '{score} out of 10',
    count: 'From {count} verified stays',
  },
  faq: {
    title: 'Questions',
    items: [
      {
        q: 'How do I get from the airport to the hotel?',
        a: 'Our shuttle picks up at T4 arrivals, door 7, and at T2 arrivals, door 4. Call reception when you land and we tell you when the next one arrives.',
      },
      {
        q: 'What time are check-in and check-out?',
        a: 'Check-in from 14:00, check-out until 12:00. Reception is open 24 hours, so early arrivals can leave luggage and use the gym showers.',
      },
      {
        q: 'Can I hold a meeting or event here?',
        a: 'Yes. We have seven rooms for 8 to 120 people, with screens, video conferencing and catering. Write to us with a date and headcount for a quote.',
      },
      {
        q: 'Is parking available while I travel?',
        a: 'Yes. Guests who book here get 35% off covered parking for the length of their trip, with the shuttle included.',
      },
      {
        q: 'Can I cancel my booking?',
        a: 'Flexible rates cancel free until 18:00 the day before arrival. Early booking rates are non-refundable.',
      },
    ],
  },
  footer: {
    contact: 'Contact',
    legal: 'Legal',
    privacy: 'Privacy policy',
    cookies: 'Cookie policy',
    notice: '© {year} Hotel Pista Siete. Fictional hotel built as a demo.',
  },
}
