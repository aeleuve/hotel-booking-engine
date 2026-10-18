import type { BrandContent } from './liteapi-hotel-rows'

/** Brand content LiteAPI doesn't know about: name, contact, shuttle, hero. */
export const brandContent: BrandContent = {
  name: 'Hotel Pista Siete',
  whatsapp: '+34 600 000 707',
  email: 'hola@pistasiete.example',
  heroImageUrl:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=70',
  shuttleDepartures: ['05:30', '06:30', '07:30', '09:00', '12:00', '15:00', '18:00', '21:00'],
}
