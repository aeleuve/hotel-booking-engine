import type { HotelProfile, Offer, ReviewSummary, RoomType } from '../model/types'

const eur = (amount: number) => ({ amount, currency: 'EUR' as const })

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`

/** Owned content of the hotel. Makcorps has no listing for it, so it lives here. */
export const hotelProfile: HotelProfile = {
  name: 'Hotel Pista Siete',
  stars: 4,
  address: 'Avenida de Logroño 320, 28042 Madrid',
  phone: '+34 910 000 707',
  whatsapp: '+34 600 000 707',
  email: 'hola@pistasiete.example',
  location: { latitude: 40.4612, longitude: -3.5905 },
  minutesToAirport: 6,
  heroImageUrl: unsplash('1436491865332-7a61a109cc05', 2000),
  shuttleDepartures: ['05:30', '06:30', '07:30', '09:00', '12:00', '15:00', '18:00', '21:00'],
}

export const roomTypes: RoomType[] = [
  {
    id: 'standard',
    sizeM2: 22,
    maxGuests: 2,
    bed: 'double',
    imageUrl: unsplash('1631049307264-da0ec9d70304', 900),
    fromPrice: eur(89),
  },
  {
    id: 'executive',
    sizeM2: 28,
    maxGuests: 2,
    bed: 'king',
    imageUrl: unsplash('1566665797739-1674de7a421a', 900),
    fromPrice: eur(119),
  },
  {
    id: 'suite',
    sizeM2: 45,
    maxGuests: 4,
    bed: 'king',
    imageUrl: unsplash('1590490360182-c33d57733427', 900),
    fromPrice: eur(179),
  },
]

export const offers: Offer[] = [
  {
    id: 'early-booking',
    discountPercent: 20,
    fromPrice: eur(71),
    imageUrl: unsplash('1542314831-068cd1dbfeeb', 900),
  },
  {
    id: 'crew-rest',
    discountPercent: 15,
    fromPrice: eur(76),
    imageUrl: unsplash('1611892440504-42a792e24d32', 900),
  },
  {
    id: 'meeting-day',
    discountPercent: 10,
    fromPrice: eur(39),
    imageUrl: unsplash('1517502884422-41eaead166d4', 900),
  },
]

export const reviewSummary: ReviewSummary = {
  score: 8.7,
  count: 2184,
  quotes: [
    {
      author: 'Marta',
      country: 'ES',
      language: 'es',
      score: 9,
      text: 'Vuelo a las 7:10 y a las 6:00 ya estaba en el shuttle. Habitación silenciosa pese a estar al lado del aeropuerto.',
    },
    {
      author: 'Jonas',
      country: 'DE',
      language: 'en',
      score: 9,
      text: 'Booked the meeting room for a team of twelve. Coffee was refilled before we asked.',
    },
    {
      author: 'Claire',
      country: 'FR',
      language: 'fr',
      score: 8,
      text: 'Parfait pour une escale : navette, petit-déjeuner dès 5h et une vraie piscine.',
    },
  ],
}
