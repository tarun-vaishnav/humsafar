/**
 * Mock travel data — realistic Indian railway and bus options.
 * Architecture: replace this module with API calls when live integrations are ready.
 */

const ROUTES = {
  'delhi-ajmer': {
    trains: [
      { id: 't1', name: 'Ajmer Shatabdi', number: '12015', departure: '06:10', arrival: '12:40', duration: '6h 30m', classes: [
        { type: 'Chair Car', fare: 785, availability: 'Available' },
        { type: 'Executive', fare: 1490, availability: 'RAC' },
      ]},
      { id: 't2', name: 'Ajmer Superfast', number: '12989', departure: '15:30', arrival: '22:15', duration: '6h 45m', classes: [
        { type: 'Sleeper', fare: 385, availability: 'Available' },
        { type: '3AC', fare: 960, availability: 'Available' },
        { type: '2AC', fare: 1380, availability: 'WL 5' },
      ]},
      { id: 't3', name: 'Garib Rath Express', number: '12983', departure: '23:40', arrival: '06:30', duration: '6h 50m', classes: [
        { type: '3AC', fare: 720, availability: 'Available' },
      ]},
    ],
    buses: [
      { id: 'b1', operator: 'RSRTC Volvo', type: 'AC Seater', departure: '22:00', arrival: '05:30', duration: '7h 30m', fare: 850, seats: 12 },
      { id: 'b2', operator: 'IntrCity SmartBus', type: 'AC Sleeper', departure: '23:00', arrival: '06:00', duration: '7h', fare: 1200, seats: 8 },
      { id: 'b3', operator: 'Rajasthan Travels', type: 'Non-AC Seater', departure: '21:00', arrival: '05:00', duration: '8h', fare: 480, seats: 22 },
    ],
  },
  'delhi-jaipur': {
    trains: [
      { id: 't4', name: 'Double Decker', number: '12985', departure: '06:00', arrival: '10:30', duration: '4h 30m', classes: [
        { type: 'Chair Car', fare: 520, availability: 'Available' },
        { type: 'AC Chair', fare: 875, availability: 'Available' },
      ]},
      { id: 't5', name: 'Jaipur Superfast', number: '12413', departure: '16:55', arrival: '22:10', duration: '5h 15m', classes: [
        { type: 'Sleeper', fare: 290, availability: 'Available' },
        { type: '3AC', fare: 765, availability: 'Available' },
        { type: '2AC', fare: 1120, availability: 'RAC' },
        { type: '1AC', fare: 1850, availability: 'Available' },
      ]},
    ],
    buses: [
      { id: 'b4', operator: 'RSRTC Volvo', type: 'AC Seater', departure: '06:00', arrival: '11:30', duration: '5h 30m', fare: 750, seats: 15 },
      { id: 'b5', operator: 'Zing Bus', type: 'Luxury Coach', departure: '23:30', arrival: '04:45', duration: '5h 15m', fare: 1100, seats: 5 },
    ],
  },
  'mumbai-pune': {
    trains: [
      { id: 't6', name: 'Deccan Express', number: '11007', departure: '07:15', arrival: '10:30', duration: '3h 15m', classes: [
        { type: 'Chair Car', fare: 190, availability: 'Available' },
        { type: '2S', fare: 85, availability: 'Available' },
      ]},
      { id: 't7', name: 'Shatabdi Express', number: '12027', departure: '17:25', arrival: '20:25', duration: '3h', classes: [
        { type: 'Chair Car', fare: 420, availability: 'Available' },
        { type: 'Executive', fare: 850, availability: 'Available' },
      ]},
    ],
    buses: [
      { id: 'b6', operator: 'Neeta Travels', type: 'AC Sleeper', departure: '22:00', arrival: '01:30', duration: '3h 30m', fare: 650, seats: 18 },
      { id: 'b7', operator: 'Purple Travels', type: 'Volvo Multi-Axle', departure: '23:00', arrival: '02:15', duration: '3h 15m', fare: 580, seats: 24 },
      { id: 'b8', operator: 'MSRTC Shivshahi', type: 'AC Seater', departure: '08:00', arrival: '12:00', duration: '4h', fare: 380, seats: 30 },
    ],
  },
  'delhi-varanasi': {
    trains: [
      { id: 't8', name: 'Vande Bharat', number: '22436', departure: '06:00', arrival: '14:00', duration: '8h', classes: [
        { type: 'Chair Car', fare: 1415, availability: 'Available' },
        { type: 'Executive', fare: 2660, availability: 'WL 3' },
      ]},
      { id: 't9', name: 'Kashi Vishwanath', number: '12523', departure: '18:55', arrival: '06:45', duration: '11h 50m', classes: [
        { type: 'Sleeper', fare: 450, availability: 'Available' },
        { type: '3AC', fare: 1185, availability: 'Available' },
        { type: '2AC', fare: 1720, availability: 'Available' },
      ]},
    ],
    buses: [
      { id: 'b9', operator: 'UPSRTC Volvo', type: 'AC Seater', departure: '18:00', arrival: '06:00', duration: '12h', fare: 1350, seats: 8 },
    ],
  },
}

// Popular cities for autocomplete
export const CITIES = [
  'Delhi', 'Mumbai', 'Jaipur', 'Ajmer', 'Pune', 'Varanasi',
  'Lucknow', 'Agra', 'Udaipur', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Bengaluru', 'Hyderabad', 'Chandigarh', 'Amritsar', 'Goa',
]

/**
 * Search for travel options between two cities.
 * Returns { trains: [], buses: [] } or null if no route found.
 * Architecture: replace with fetch(`${API}/routes?from=...&to=...`) later.
 */
export function searchRoutes(from, to) {
  const key = `${from.toLowerCase()}-${to.toLowerCase()}`
  const reverseKey = `${to.toLowerCase()}-${from.toLowerCase()}`
  return ROUTES[key] || ROUTES[reverseKey] || null
}

export default searchRoutes
