/**
 * Indian railway data — realistic routes, fares, durations.
 * Key format: "FROM_ID-TO_ID"
 * Replace with API: GET /api/trains?from=...&to=...
 */
export const trainData = {
  // ─── Delhi Routes ────────────────────────────────────────
  'DEL-JAI': [
    { id: 't1', name: 'Ajmer Shatabdi', number: '12015', departure: '06:10', arrival: '10:40', duration: '4h 30m', durationMins: 270, classes: [{ type: 'Chair Car', fare: 625, availability: 'Available' }, { type: 'Executive', fare: 1290, availability: 'RAC' }] },
    { id: 't2', name: 'Double Decker', number: '12985', departure: '06:00', arrival: '10:30', duration: '4h 30m', durationMins: 270, classes: [{ type: 'Chair Car', fare: 520, availability: 'Available' }, { type: 'AC Chair', fare: 875, availability: 'Available' }] },
    { id: 't3', name: 'Jaipur Superfast', number: '12413', departure: '16:55', arrival: '22:10', duration: '5h 15m', durationMins: 315, classes: [{ type: 'Sleeper', fare: 290, availability: 'Available' }, { type: '3AC', fare: 765, availability: 'Available' }, { type: '2AC', fare: 1120, availability: 'RAC' }, { type: '1AC', fare: 1850, availability: 'Available' }] },
    { id: 't4', name: 'Ashram Express', number: '12915', departure: '15:50', arrival: '21:20', duration: '5h 30m', durationMins: 330, classes: [{ type: 'Sleeper', fare: 265, availability: 'Available' }, { type: '3AC', fare: 695, availability: 'WL 12' }] },
  ],
  'DEL-AJM': [
    { id: 't5', name: 'Ajmer Shatabdi', number: '12015', departure: '06:10', arrival: '12:40', duration: '6h 30m', durationMins: 390, classes: [{ type: 'Chair Car', fare: 785, availability: 'Available' }, { type: 'Executive', fare: 1490, availability: 'RAC' }] },
    { id: 't6', name: 'Ajmer Superfast', number: '12989', departure: '15:30', arrival: '22:15', duration: '6h 45m', durationMins: 405, classes: [{ type: 'Sleeper', fare: 385, availability: 'Available' }, { type: '3AC', fare: 960, availability: 'Available' }, { type: '2AC', fare: 1380, availability: 'WL 5' }] },
    { id: 't7', name: 'Garib Rath', number: '12983', departure: '23:40', arrival: '06:30', duration: '6h 50m', durationMins: 410, classes: [{ type: '3AC', fare: 720, availability: 'Available' }] },
  ],
  'DEL-MUM': [
    { id: 't8', name: 'Rajdhani Express', number: '12951', departure: '16:55', arrival: '08:35', duration: '15h 40m', durationMins: 940, classes: [{ type: '3AC', fare: 1980, availability: 'Available' }, { type: '2AC', fare: 2850, availability: 'RAC' }, { type: '1AC', fare: 4740, availability: 'Available' }] },
    { id: 't9', name: 'August Kranti', number: '12953', departure: '17:40', arrival: '10:55', duration: '17h 15m', durationMins: 1035, classes: [{ type: '3AC', fare: 1870, availability: 'Available' }, { type: '2AC', fare: 2650, availability: 'Available' }] },
    { id: 't10', name: 'Golden Temple Mail', number: '12903', departure: '21:25', arrival: '16:20', duration: '18h 55m', durationMins: 1135, classes: [{ type: 'Sleeper', fare: 580, availability: 'Available' }, { type: '3AC', fare: 1540, availability: 'Available' }, { type: '2AC', fare: 2260, availability: 'Available' }] },
  ],
  'DEL-VNS': [
    { id: 't11', name: 'Vande Bharat', number: '22436', departure: '06:00', arrival: '14:00', duration: '8h', durationMins: 480, classes: [{ type: 'Chair Car', fare: 1415, availability: 'Available' }, { type: 'Executive', fare: 2660, availability: 'WL 3' }] },
    { id: 't12', name: 'Kashi Vishwanath', number: '12523', departure: '18:55', arrival: '06:45', duration: '11h 50m', durationMins: 710, classes: [{ type: 'Sleeper', fare: 450, availability: 'Available' }, { type: '3AC', fare: 1185, availability: 'Available' }, { type: '2AC', fare: 1720, availability: 'Available' }] },
  ],
  'DEL-LKO': [
    { id: 't13', name: 'Lucknow Shatabdi', number: '12003', departure: '06:10', arrival: '12:40', duration: '6h 30m', durationMins: 390, classes: [{ type: 'Chair Car', fare: 865, availability: 'Available' }, { type: 'Executive', fare: 1730, availability: 'Available' }] },
    { id: 't14', name: 'Swarna Shatabdi', number: '12005', departure: '15:15', arrival: '21:30', duration: '6h 15m', durationMins: 375, classes: [{ type: 'Chair Car', fare: 790, availability: 'Available' }, { type: 'Executive', fare: 1550, availability: 'RAC' }] },
  ],
  'DEL-AGR': [
    { id: 't15', name: 'Gatimaan Express', number: '12049', departure: '08:10', arrival: '09:50', duration: '1h 40m', durationMins: 100, classes: [{ type: 'Chair Car', fare: 690, availability: 'Available' }, { type: 'Executive', fare: 1365, availability: 'Available' }] },
    { id: 't16', name: 'Bhopal Shatabdi', number: '12001', departure: '06:00', arrival: '07:57', duration: '1h 57m', durationMins: 117, classes: [{ type: 'Chair Car', fare: 545, availability: 'Available' }, { type: 'Executive', fare: 1105, availability: 'Available' }] },
  ],
  'DEL-CDG': [
    { id: 't17', name: 'Shatabdi Express', number: '12005', departure: '07:40', arrival: '10:55', duration: '3h 15m', durationMins: 195, classes: [{ type: 'Chair Car', fare: 580, availability: 'Available' }, { type: 'Executive', fare: 1165, availability: 'Available' }] },
    { id: 't18', name: 'Jan Shatabdi', number: '12057', departure: '14:20', arrival: '18:10', duration: '3h 50m', durationMins: 230, classes: [{ type: '2S', fare: 215, availability: 'Available' }, { type: 'Chair Car', fare: 440, availability: 'Available' }] },
  ],
  'DEL-ASR': [
    { id: 't19', name: 'Swarna Shatabdi', number: '12029', departure: '07:20', arrival: '13:35', duration: '6h 15m', durationMins: 375, classes: [{ type: 'Chair Car', fare: 795, availability: 'Available' }, { type: 'Executive', fare: 1575, availability: 'Available' }] },
    { id: 't20', name: 'Shan-e-Punjab', number: '12497', departure: '16:50', arrival: '22:55', duration: '6h 05m', durationMins: 365, classes: [{ type: 'Sleeper', fare: 310, availability: 'Available' }, { type: '3AC', fare: 810, availability: 'Available' }, { type: '2AC', fare: 1190, availability: 'RAC' }] },
  ],
  'DEL-DHN': [
    { id: 't21', name: 'Nanda Devi Express', number: '12401', departure: '23:00', arrival: '05:25', duration: '6h 25m', durationMins: 385, classes: [{ type: 'Sleeper', fare: 265, availability: 'Available' }, { type: '3AC', fare: 710, availability: 'Available' }, { type: '2AC', fare: 1035, availability: 'Available' }] },
    { id: 't22', name: 'Shatabdi Express', number: '12017', departure: '06:45', arrival: '12:30', duration: '5h 45m', durationMins: 345, classes: [{ type: 'Chair Car', fare: 635, availability: 'Available' }, { type: 'Executive', fare: 1280, availability: 'RAC' }] },
  ],
  'DEL-KOL': [
    { id: 't23', name: 'Rajdhani Express', number: '12301', departure: '16:55', arrival: '10:00', duration: '17h 05m', durationMins: 1025, classes: [{ type: '3AC', fare: 2150, availability: 'Available' }, { type: '2AC', fare: 3180, availability: 'Available' }, { type: '1AC', fare: 5350, availability: 'WL 2' }] },
    { id: 't24', name: 'Purushottam Express', number: '12801', departure: '22:00', arrival: '21:25', duration: '23h 25m', durationMins: 1405, classes: [{ type: 'Sleeper', fare: 620, availability: 'Available' }, { type: '3AC', fare: 1680, availability: 'Available' }] },
  ],
  'DEL-CHN': [
    { id: 't25', name: 'Rajdhani Express', number: '12433', departure: '15:55', arrival: '20:05', duration: '28h 10m', durationMins: 1690, classes: [{ type: '3AC', fare: 2780, availability: 'Available' }, { type: '2AC', fare: 4050, availability: 'RAC' }, { type: '1AC', fare: 6890, availability: 'Available' }] },
    { id: 't26', name: 'Tamil Nadu Express', number: '12621', departure: '22:30', arrival: '07:10', duration: '32h 40m', durationMins: 1960, classes: [{ type: 'Sleeper', fare: 730, availability: 'Available' }, { type: '3AC', fare: 1950, availability: 'Available' }, { type: '2AC', fare: 2890, availability: 'Available' }] },
  ],
  'DEL-BLR': [
    { id: 't27', name: 'Rajdhani Express', number: '22691', departure: '20:50', arrival: '06:40', duration: '33h 50m', durationMins: 2030, classes: [{ type: '3AC', fare: 2650, availability: 'Available' }, { type: '2AC', fare: 3950, availability: 'Available' }, { type: '1AC', fare: 6580, availability: 'RAC' }] },
    { id: 't28', name: 'Karnataka Express', number: '12627', departure: '21:20', arrival: '05:50', duration: '32h 30m', durationMins: 1950, classes: [{ type: 'Sleeper', fare: 680, availability: 'Available' }, { type: '3AC', fare: 1820, availability: 'Available' }, { type: '2AC', fare: 2680, availability: 'Available' }] },
  ],
  'DEL-HYD': [
    { id: 't29', name: 'Rajdhani Express', number: '12437', departure: '15:10', arrival: '13:20', duration: '22h 10m', durationMins: 1330, classes: [{ type: '3AC', fare: 2250, availability: 'Available' }, { type: '2AC', fare: 3380, availability: 'Available' }, { type: '1AC', fare: 5680, availability: 'RAC' }] },
    { id: 't30', name: 'Telangana Express', number: '12723', departure: '06:50', arrival: '08:20', duration: '25h 30m', durationMins: 1530, classes: [{ type: 'Sleeper', fare: 580, availability: 'Available' }, { type: '3AC', fare: 1520, availability: 'Available' }, { type: '2AC', fare: 2290, availability: 'Available' }] },
  ],
  'DEL-GOA': [
    { id: 't31', name: 'Goa Express', number: '12779', departure: '15:00', arrival: '05:30', duration: '38h 30m', durationMins: 2310, classes: [{ type: 'Sleeper', fare: 720, availability: 'Available' }, { type: '3AC', fare: 1930, availability: 'Available' }, { type: '2AC', fare: 2860, availability: 'WL 8' }] },
  ],
  'DEL-UDR': [
    { id: 't32', name: 'Mewar Express', number: '12963', departure: '19:05', arrival: '06:50', duration: '11h 45m', durationMins: 705, classes: [{ type: 'Sleeper', fare: 410, availability: 'Available' }, { type: '3AC', fare: 1080, availability: 'Available' }, { type: '2AC', fare: 1560, availability: 'Available' }] },
    { id: 't33', name: 'Chetak Express', number: '12981', departure: '20:15', arrival: '08:40', duration: '12h 25m', durationMins: 745, classes: [{ type: 'Sleeper', fare: 395, availability: 'Available' }, { type: '3AC', fare: 1045, availability: 'Available' }] },
  ],
  'DEL-JDH': [
    { id: 't34', name: 'Mandore Express', number: '12461', departure: '21:00', arrival: '07:10', duration: '10h 10m', durationMins: 610, classes: [{ type: 'Sleeper', fare: 360, availability: 'Available' }, { type: '3AC', fare: 955, availability: 'Available' }, { type: '2AC', fare: 1390, availability: 'RAC' }] },
  ],
  'DEL-JMU': [
    { id: 't35', name: 'Rajdhani Express', number: '12425', departure: '20:30', arrival: '06:15', duration: '9h 45m', durationMins: 585, classes: [{ type: '3AC', fare: 1350, availability: 'Available' }, { type: '2AC', fare: 2010, availability: 'Available' }, { type: '1AC', fare: 3450, availability: 'Available' }] },
  ],

  // ─── Mumbai Routes ───────────────────────────────────────
  'MUM-PNE': [
    { id: 't36', name: 'Deccan Express', number: '11007', departure: '07:15', arrival: '10:30', duration: '3h 15m', durationMins: 195, classes: [{ type: 'Chair Car', fare: 190, availability: 'Available' }, { type: '2S', fare: 85, availability: 'Available' }] },
    { id: 't37', name: 'Shatabdi Express', number: '12027', departure: '17:25', arrival: '20:25', duration: '3h', durationMins: 180, classes: [{ type: 'Chair Car', fare: 420, availability: 'Available' }, { type: 'Executive', fare: 850, availability: 'Available' }] },
    { id: 't38', name: 'Pragati Express', number: '12125', departure: '06:40', arrival: '10:20', duration: '3h 40m', durationMins: 220, classes: [{ type: 'Chair Car', fare: 165, availability: 'Available' }, { type: '2S', fare: 75, availability: 'Available' }] },
  ],
  'MUM-GOA': [
    { id: 't39', name: 'Jan Shatabdi', number: '12051', departure: '05:05', arrival: '16:50', duration: '11h 45m', durationMins: 705, classes: [{ type: '2S', fare: 355, availability: 'Available' }, { type: 'Chair Car', fare: 690, availability: 'Available' }] },
    { id: 't40', name: 'Konkan Kanya', number: '10111', departure: '23:00', arrival: '10:30', duration: '11h 30m', durationMins: 690, classes: [{ type: 'Sleeper', fare: 380, availability: 'Available' }, { type: '3AC', fare: 985, availability: 'Available' }] },
  ],
  'MUM-AMD': [
    { id: 't41', name: 'Karnavati Express', number: '12933', departure: '23:50', arrival: '06:00', duration: '6h 10m', durationMins: 370, classes: [{ type: 'Sleeper', fare: 250, availability: 'Available' }, { type: '3AC', fare: 660, availability: 'Available' }, { type: '2AC', fare: 965, availability: 'Available' }] },
    { id: 't42', name: 'Shatabdi Express', number: '12009', departure: '06:25', arrival: '12:35', duration: '6h 10m', durationMins: 370, classes: [{ type: 'Chair Car', fare: 640, availability: 'Available' }, { type: 'Executive', fare: 1280, availability: 'Available' }] },
  ],
  'MUM-BLR': [
    { id: 't43', name: 'Udyan Express', number: '11301', departure: '08:05', arrival: '08:15', duration: '24h 10m', durationMins: 1450, classes: [{ type: 'Sleeper', fare: 520, availability: 'Available' }, { type: '3AC', fare: 1390, availability: 'Available' }, { type: '2AC', fare: 2060, availability: 'RAC' }] },
  ],
  'MUM-NGP': [
    { id: 't44', name: 'Duronto Express', number: '12289', departure: '14:00', arrival: '01:30', duration: '11h 30m', durationMins: 690, classes: [{ type: '3AC', fare: 1290, availability: 'Available' }, { type: '2AC', fare: 1890, availability: 'Available' }] },
  ],

  // ─── South India Routes ──────────────────────────────────
  'BLR-CHN': [
    { id: 't45', name: 'Shatabdi Express', number: '12007', departure: '06:00', arrival: '10:55', duration: '4h 55m', durationMins: 295, classes: [{ type: 'Chair Car', fare: 545, availability: 'Available' }, { type: 'Executive', fare: 1095, availability: 'Available' }] },
    { id: 't46', name: 'Vande Bharat', number: '20607', departure: '05:50', arrival: '10:30', duration: '4h 40m', durationMins: 280, classes: [{ type: 'Chair Car', fare: 615, availability: 'Available' }, { type: 'Executive', fare: 1190, availability: 'RAC' }] },
  ],
  'BLR-MYS': [
    { id: 't47', name: 'Tippu Express', number: '12613', departure: '14:15', arrival: '16:30', duration: '2h 15m', durationMins: 135, classes: [{ type: 'Chair Car', fare: 185, availability: 'Available' }, { type: '2S', fare: 75, availability: 'Available' }] },
  ],
  'CHN-MDR': [
    { id: 't48', name: 'Vaigai Express', number: '12635', departure: '12:25', arrival: '20:30', duration: '8h 05m', durationMins: 485, classes: [{ type: 'Chair Car', fare: 350, availability: 'Available' }, { type: '2S', fare: 155, availability: 'Available' }] },
  ],
  'KCH-THN': [
    { id: 't49', name: 'Venad Express', number: '12075', departure: '11:05', arrival: '15:35', duration: '4h 30m', durationMins: 270, classes: [{ type: 'Sleeper', fare: 195, availability: 'Available' }, { type: '3AC', fare: 520, availability: 'Available' }] },
  ],

  // ─── East India Routes ───────────────────────────────────
  'KOL-PAT': [
    { id: 't50', name: 'Rajdhani Express', number: '12309', departure: '06:05', arrival: '13:25', duration: '7h 20m', durationMins: 440, classes: [{ type: '3AC', fare: 1180, availability: 'Available' }, { type: '2AC', fare: 1750, availability: 'Available' }] },
  ],
  'KOL-BBS': [
    { id: 't51', name: 'Dhauligiri Express', number: '12073', departure: '21:15', arrival: '04:10', duration: '6h 55m', durationMins: 415, classes: [{ type: 'Sleeper', fare: 265, availability: 'Available' }, { type: '3AC', fare: 710, availability: 'Available' }] },
  ],
  'KOL-GHY': [
    { id: 't52', name: 'Saraighat Express', number: '12345', departure: '15:50', arrival: '08:30', duration: '16h 40m', durationMins: 1000, classes: [{ type: 'Sleeper', fare: 450, availability: 'Available' }, { type: '3AC', fare: 1190, availability: 'Available' }, { type: '2AC', fare: 1750, availability: 'RAC' }] },
  ],

  // ─── Cross-country ───────────────────────────────────────
  'JAI-UDR': [
    { id: 't53', name: 'Mewar Express', number: '12963', departure: '03:30', arrival: '11:15', duration: '7h 45m', durationMins: 465, classes: [{ type: 'Sleeper', fare: 280, availability: 'Available' }, { type: '3AC', fare: 740, availability: 'Available' }] },
  ],
  'JAI-JDH': [
    { id: 't54', name: 'Intercity Express', number: '14853', departure: '06:00', arrival: '12:30', duration: '6h 30m', durationMins: 390, classes: [{ type: '2S', fare: 175, availability: 'Available' }, { type: 'Sleeper', fare: 235, availability: 'Available' }] },
  ],
  'LKO-VNS': [
    { id: 't55', name: 'Kashi Express', number: '14235', departure: '23:30', arrival: '06:30', duration: '7h', durationMins: 420, classes: [{ type: 'Sleeper', fare: 235, availability: 'Available' }, { type: '3AC', fare: 620, availability: 'Available' }] },
  ],
  'AMD-JAI': [
    { id: 't56', name: 'Aravali Express', number: '19707', departure: '17:45', arrival: '06:15', duration: '12h 30m', durationMins: 750, classes: [{ type: 'Sleeper', fare: 345, availability: 'Available' }, { type: '3AC', fare: 910, availability: 'Available' }] },
  ],
  'HYD-BLR': [
    { id: 't57', name: 'Rajdhani Express', number: '22691', departure: '23:00', arrival: '06:40', duration: '7h 40m', durationMins: 460, classes: [{ type: '3AC', fare: 1050, availability: 'Available' }, { type: '2AC', fare: 1560, availability: 'Available' }] },
  ],
  'BPL-DEL': [
    { id: 't58', name: 'Shatabdi Express', number: '12001', departure: '14:35', arrival: '23:15', duration: '8h 40m', durationMins: 520, classes: [{ type: 'Chair Car', fare: 775, availability: 'Available' }, { type: 'Executive', fare: 1560, availability: 'Available' }] },
  ],
}

export default trainData
