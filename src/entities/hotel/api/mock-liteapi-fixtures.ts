import type { LiteApiHotelResponse, LiteApiReviewsResponse } from './liteapi-hotel-rows'

/** Trimmed sandbox capture of `GET /data/hotel?hotelId=lp42e6e` (2026-10-18). */
export const hotelDetailsFixture: LiteApiHotelResponse = {
  data: {
    id: 'lp42e6e',
    name: 'Hotel Maydrit Airport',
    address: 'Piragua, 1',
    zip: '28042',
    city: 'Madrid',
    phone: '+34 911 96 92 00',
    email: '',
    starRating: 4,
    rating: 9,
    reviewCount: 12942,
    location: {
      latitude: 40.451542,
      longitude: -3.592862,
    },
    main_photo: 'https://static.cupid.travel/hotels/220327618.jpg',
    checkinCheckoutTimes: {
      checkin_start: '02:00 PM',
      checkout: '12:00 PM',
    },
    rooms: [
      {
        id: 613061,
        roomName: 'Double or Twin Room',
        roomSizeSquare: 27,
        roomSizeUnit: 'sqm',
        maxOccupancy: 2,
        bedTypes: [
          {
            quantity: 1,
            bedType: 'Double bed',
          },
          {
            quantity: 2,
            bedType: 'Twin bed',
          },
        ],
        photos: [
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220329996.jpg',
            mainPhoto: true,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220330335.jpg',
            mainPhoto: false,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220331723.jpg',
            mainPhoto: false,
          },
        ],
      },
      {
        id: 613063,
        roomName: 'Suite',
        roomSizeSquare: 45,
        roomSizeUnit: 'sqm',
        maxOccupancy: 2,
        bedTypes: [
          {
            quantity: 1,
            bedType: 'Extra-large double bed (Super-king size)',
          },
        ],
        photos: [
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220327630.jpg',
            mainPhoto: true,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220327623.jpg',
            mainPhoto: false,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220329425.jpg',
            mainPhoto: false,
          },
        ],
      },
      {
        id: 613065,
        roomName: 'Basic Double or Twin Room',
        roomSizeSquare: 20,
        roomSizeUnit: 'sqm',
        maxOccupancy: 2,
        bedTypes: [
          {
            quantity: 2,
            bedType: 'Twin bed',
          },
          {
            quantity: 2,
            bedType: 'Twin bed',
          },
          {
            quantity: 1,
            bedType: 'Double bed',
          },
        ],
        photos: [
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220331730.jpg',
            mainPhoto: true,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220334681.jpg',
            mainPhoto: false,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220327598.jpg',
            mainPhoto: false,
          },
        ],
      },
      {
        id: 1459502343,
        roomName: 'Triple Room',
        roomSizeSquare: 28,
        roomSizeUnit: 'm2',
        maxOccupancy: 3,
        bedTypes: [
          {
            quantity: 2,
            bedType: 'Twin bed',
          },
          {
            quantity: 1,
            bedType: 'Murphy bed',
          },
        ],
        photos: [
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/ex_ba2c5b22_z.jpg',
            mainPhoto: true,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/ex_1c64b099_z.jpg',
            mainPhoto: false,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/ex_3069ea5f_z.jpg',
            mainPhoto: false,
          },
        ],
      },
      {
        id: 613062,
        roomName: 'Double Room with Extra Bed',
        roomSizeSquare: 30,
        roomSizeUnit: 'sqm',
        maxOccupancy: 3,
        bedTypes: [
          {
            quantity: 3,
            bedType: 'Twin bed',
          },
          {
            quantity: 1,
            bedType: 'Twin bed',
          },
          {
            quantity: 1,
            bedType: 'Double bed',
          },
        ],
        photos: [
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/15034567.jpg',
            mainPhoto: true,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220331127.jpg',
            mainPhoto: false,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220331282.jpg',
            mainPhoto: false,
          },
        ],
      },
      {
        id: 613066,
        roomName: 'Executive Double Room',
        roomSizeSquare: 30,
        roomSizeUnit: 'sqm',
        maxOccupancy: 2,
        bedTypes: [
          {
            quantity: 1,
            bedType: 'Extra-large double bed (Super-king size)',
          },
        ],
        photos: [
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220327618.jpg',
            mainPhoto: true,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220333568.jpg',
            mainPhoto: false,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220331232.jpg',
            mainPhoto: false,
          },
        ],
      },
      {
        id: 613068,
        roomName: 'Family Room (2 Adults + 2 Children)',
        roomSizeSquare: 27,
        roomSizeUnit: 'm2',
        maxOccupancy: 2,
        bedTypes: [
          {
            quantity: 2,
            bedType: 'Single bed',
          },
          {
            quantity: 2,
            bedType: 'Bunk bed',
          },
        ],
        photos: [
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220327580.jpg',
            mainPhoto: true,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220327598.jpg',
            mainPhoto: false,
          },
          {
            url: 'https://static.cupid.travel/rooms-large-pictures/220331127.jpg',
            mainPhoto: false,
          },
        ],
      },
    ],
  },
}

/** Sandbox capture of `GET /data/reviews?hotelId=lp42e6e&limit=3`. */
export const reviewsFixture: LiteApiReviewsResponse = {
  data: [
    {
      reviewId: 5354221849,
      averageScore: 10,
      country: 'gb',
      name: 'Sarwat',
      headline: 'Amazing location and great hotel',
      language: 'en-gb',
      pros: 'Very close to the airport and very high end hotel',
      cons: 'Nothing',
    },
    {
      reviewId: 5354348229,
      averageScore: 9,
      country: 'es',
      name: 'Jose Pedro',
      headline: '',
      language: 'es',
      pros: 'Todo en general.  Incluida la cena en el restaurante del Hotel.',
      cons: 'Qué teniendo un vuelo muy temprano, no tuvo el hotel traslado tan pronto.',
    },
    {
      reviewId: 5353984145,
      averageScore: 10,
      country: 'es',
      name: 'marcelo gustavo',
      headline: '',
      language: 'es',
      pros: 'Me gustó todo. Ideal para pasajeros en tránsito',
      cons: '',
    },
  ],
  total: 12942,
}
