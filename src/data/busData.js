/**
 * Indian intercity bus data — realistic operators, fares, durations.
 * Key format: "FROM_ID-TO_ID"
 * Replace with API: GET /api/buses?from=...&to=...
 */
export const busData = {
  // ─── Delhi Routes ────────────────────────────────────────
  'DEL-JAI': [
    { id: 'b1', operator: 'RSRTC Volvo', type: 'AC Seater', departure: '06:00', arrival: '11:30', duration: '5h 30m', durationMins: 330, fare: 750, seats: 15 },
    { id: 'b2', operator: 'Zing Bus', type: 'Luxury Coach', departure: '23:30', arrival: '04:45', duration: '5h 15m', durationMins: 315, fare: 1100, seats: 5 },
    { id: 'b3', operator: 'IntrCity SmartBus', type: 'AC Sleeper', departure: '22:00', arrival: '03:30', duration: '5h 30m', durationMins: 330, fare: 950, seats: 10 },
    { id: 'b4', operator: 'RSRTC Semi-Deluxe', type: 'Non-AC Seater', departure: '07:00', arrival: '13:00', duration: '6h', durationMins: 360, fare: 420, seats: 28 },
  ],
  'DEL-AJM': [
    { id: 'b5', operator: 'RSRTC Volvo', type: 'AC Seater', departure: '22:00', arrival: '05:30', duration: '7h 30m', durationMins: 450, fare: 850, seats: 12 },
    { id: 'b6', operator: 'IntrCity SmartBus', type: 'AC Sleeper', departure: '23:00', arrival: '06:00', duration: '7h', durationMins: 420, fare: 1200, seats: 8 },
    { id: 'b7', operator: 'Rajasthan Travels', type: 'Non-AC Seater', departure: '21:00', arrival: '05:00', duration: '8h', durationMins: 480, fare: 480, seats: 22 },
  ],
  'DEL-MUM': [
    { id: 'b8', operator: 'Neeta Travels', type: 'Volvo Multi-Axle', departure: '17:00', arrival: '09:00', duration: '16h', durationMins: 960, fare: 1850, seats: 14 },
    { id: 'b9', operator: 'IntrCity SmartBus', type: 'AC Sleeper', departure: '18:30', arrival: '10:30', duration: '16h', durationMins: 960, fare: 2100, seats: 6 },
  ],
  'DEL-LKO': [
    { id: 'b10', operator: 'UPSRTC Volvo', type: 'AC Seater', departure: '22:30', arrival: '06:00', duration: '7h 30m', durationMins: 450, fare: 850, seats: 20 },
    { id: 'b11', operator: 'IntrCity SmartBus', type: 'Luxury Coach', departure: '23:00', arrival: '05:30', duration: '6h 30m', durationMins: 390, fare: 1100, seats: 8 },
  ],
  'DEL-VNS': [
    { id: 'b12', operator: 'UPSRTC Volvo', type: 'AC Seater', departure: '18:00', arrival: '06:00', duration: '12h', durationMins: 720, fare: 1350, seats: 8 },
  ],
  'DEL-CDG': [
    { id: 'b13', operator: 'HRTC Volvo', type: 'AC Seater', departure: '06:00', arrival: '11:30', duration: '5h 30m', durationMins: 330, fare: 720, seats: 16 },
    { id: 'b14', operator: 'Zing Bus', type: 'AC Seater', departure: '08:00', arrival: '12:30', duration: '4h 30m', durationMins: 270, fare: 680, seats: 12 },
  ],
  'DEL-DHN': [
    { id: 'b15', operator: 'UTC Volvo', type: 'AC Seater', departure: '22:00', arrival: '04:30', duration: '6h 30m', durationMins: 390, fare: 780, seats: 18 },
    { id: 'b16', operator: 'IntrCity SmartBus', type: 'AC Sleeper', departure: '23:00', arrival: '05:00', duration: '6h', durationMins: 360, fare: 1050, seats: 10 },
  ],
  'DEL-ASR': [
    { id: 'b17', operator: 'PEPSU Transport', type: 'AC Seater', departure: '21:00', arrival: '05:00', duration: '8h', durationMins: 480, fare: 900, seats: 14 },
    { id: 'b18', operator: 'Zing Bus', type: 'Luxury Coach', departure: '22:00', arrival: '05:30', duration: '7h 30m', durationMins: 450, fare: 1250, seats: 6 },
  ],
  'DEL-AGR': [
    { id: 'b19', operator: 'UPSRTC Volvo', type: 'AC Seater', departure: '06:00', arrival: '10:00', duration: '4h', durationMins: 240, fare: 520, seats: 22 },
    { id: 'b20', operator: 'IntrCity SmartBus', type: 'AC Seater', departure: '07:30', arrival: '11:00', duration: '3h 30m', durationMins: 210, fare: 650, seats: 16 },
  ],
  'DEL-UDR': [
    { id: 'b21', operator: 'RSRTC Volvo', type: 'AC Sleeper', departure: '18:00', arrival: '06:30', duration: '12h 30m', durationMins: 750, fare: 1450, seats: 8 },
  ],
  'DEL-JDH': [
    { id: 'b22', operator: 'RSRTC Volvo', type: 'AC Seater', departure: '20:00', arrival: '06:30', duration: '10h 30m', durationMins: 630, fare: 1100, seats: 12 },
  ],

  // ─── Mumbai Routes ───────────────────────────────────────
  'MUM-PNE': [
    { id: 'b23', operator: 'Neeta Travels', type: 'AC Sleeper', departure: '22:00', arrival: '01:30', duration: '3h 30m', durationMins: 210, fare: 650, seats: 18 },
    { id: 'b24', operator: 'Purple Travels', type: 'Volvo Multi-Axle', departure: '23:00', arrival: '02:15', duration: '3h 15m', durationMins: 195, fare: 580, seats: 24 },
    { id: 'b25', operator: 'MSRTC Shivshahi', type: 'AC Seater', departure: '08:00', arrival: '12:00', duration: '4h', durationMins: 240, fare: 380, seats: 30 },
    { id: 'b26', operator: 'RedBus Connect', type: 'AC Seater', departure: '06:30', arrival: '10:30', duration: '4h', durationMins: 240, fare: 450, seats: 20 },
  ],
  'MUM-GOA': [
    { id: 'b27', operator: 'Neeta Travels', type: 'Volvo Multi-Axle', departure: '17:00', arrival: '05:00', duration: '12h', durationMins: 720, fare: 1450, seats: 12 },
    { id: 'b28', operator: 'Paulo Travels', type: 'AC Sleeper', departure: '18:30', arrival: '06:30', duration: '12h', durationMins: 720, fare: 1350, seats: 16 },
    { id: 'b29', operator: 'VRL Travels', type: 'AC Seater', departure: '19:00', arrival: '07:30', duration: '12h 30m', durationMins: 750, fare: 980, seats: 20 },
  ],
  'MUM-AMD': [
    { id: 'b30', operator: 'VRL Travels', type: 'Volvo Multi-Axle', departure: '21:00', arrival: '05:00', duration: '8h', durationMins: 480, fare: 850, seats: 16 },
    { id: 'b31', operator: 'Eagle Travels', type: 'AC Sleeper', departure: '22:00', arrival: '06:00', duration: '8h', durationMins: 480, fare: 950, seats: 12 },
  ],
  'MUM-BLR': [
    { id: 'b32', operator: 'VRL Travels', type: 'Volvo Multi-Axle', departure: '17:00', arrival: '09:00', duration: '16h', durationMins: 960, fare: 1650, seats: 14 },
    { id: 'b33', operator: 'SRS Travels', type: 'AC Sleeper', departure: '18:00', arrival: '10:00', duration: '16h', durationMins: 960, fare: 1800, seats: 10 },
  ],
  'MUM-NGP': [
    { id: 'b34', operator: 'Neeta Travels', type: 'AC Sleeper', departure: '18:00', arrival: '06:00', duration: '12h', durationMins: 720, fare: 1150, seats: 12 },
  ],

  // ─── South India Routes ──────────────────────────────────
  'BLR-CHN': [
    { id: 'b35', operator: 'KSRTC Airavat', type: 'Volvo Multi-Axle', departure: '06:00', arrival: '12:00', duration: '6h', durationMins: 360, fare: 850, seats: 20 },
    { id: 'b36', operator: 'SRS Travels', type: 'AC Seater', departure: '23:00', arrival: '05:00', duration: '6h', durationMins: 360, fare: 750, seats: 16 },
  ],
  'BLR-MYS': [
    { id: 'b37', operator: 'KSRTC Airavat', type: 'AC Seater', departure: '07:00', arrival: '10:30', duration: '3h 30m', durationMins: 210, fare: 420, seats: 28 },
    { id: 'b38', operator: 'VRL Travels', type: 'AC Seater', departure: '08:00', arrival: '11:00', duration: '3h', durationMins: 180, fare: 380, seats: 20 },
  ],
  'BLR-GOA': [
    { id: 'b39', operator: 'VRL Travels', type: 'Volvo Multi-Axle', departure: '20:00', arrival: '08:00', duration: '12h', durationMins: 720, fare: 1350, seats: 14 },
    { id: 'b40', operator: 'Paulo Travels', type: 'AC Sleeper', departure: '21:00', arrival: '09:00', duration: '12h', durationMins: 720, fare: 1250, seats: 10 },
  ],
  'CHN-MDR': [
    { id: 'b41', operator: 'SETC Volvo', type: 'AC Seater', departure: '21:00', arrival: '05:30', duration: '8h 30m', durationMins: 510, fare: 780, seats: 18 },
  ],
  'KCH-THN': [
    { id: 'b42', operator: 'KSRTC Volvo', type: 'AC Seater', departure: '08:00', arrival: '12:30', duration: '4h 30m', durationMins: 270, fare: 520, seats: 22 },
  ],
  'HYD-BLR': [
    { id: 'b43', operator: 'KSRTC Airavat', type: 'Volvo Multi-Axle', departure: '22:00', arrival: '06:00', duration: '8h', durationMins: 480, fare: 950, seats: 16 },
    { id: 'b44', operator: 'SRS Travels', type: 'AC Sleeper', departure: '21:00', arrival: '05:30', duration: '8h 30m', durationMins: 510, fare: 1100, seats: 12 },
  ],

  // ─── East India Routes ───────────────────────────────────
  'KOL-PAT': [
    { id: 'b45', operator: 'BSRTC Volvo', type: 'AC Seater', departure: '20:00', arrival: '06:00', duration: '10h', durationMins: 600, fare: 850, seats: 16 },
  ],

  // ─── Rajasthan Routes ────────────────────────────────────
  'JAI-UDR': [
    { id: 'b46', operator: 'RSRTC Volvo', type: 'AC Seater', departure: '22:00', arrival: '05:30', duration: '7h 30m', durationMins: 450, fare: 780, seats: 14 },
    { id: 'b47', operator: 'Rajasthan Travels', type: 'AC Sleeper', departure: '21:00', arrival: '05:00', duration: '8h', durationMins: 480, fare: 950, seats: 10 },
  ],
  'JAI-JDH': [
    { id: 'b48', operator: 'RSRTC Semi-Deluxe', type: 'Non-AC Seater', departure: '06:00', arrival: '12:00', duration: '6h', durationMins: 360, fare: 380, seats: 24 },
    { id: 'b49', operator: 'RSRTC Volvo', type: 'AC Seater', departure: '22:00', arrival: '04:30', duration: '6h 30m', durationMins: 390, fare: 680, seats: 16 },
  ],
}

export default busData
