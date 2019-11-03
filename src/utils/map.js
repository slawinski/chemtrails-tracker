export function mapFlightsData(flightData) {
  const arr = [];
  flightData.data.states.map(item => {
    const obj = {
      icao24: item[0],
      callSign: item[1],
      originCountry: item[2],
      timePosition: item[3],
      lastContact: item[4],
      position: {
        lat: item[6],
        lng: item[5],
      },
      baroAltitude: item[7],
      onGround: item[8],
      velocity: item[9],
      trueTrack: item[10],
      verticalRate: item[11],
      sensors: item[12],
      geoAltitude: item[13],
      squawk: item[14],
      spi: item[15],
      positionSource: item[16],
    };
    arr.push(obj);
  });
  return arr;
}

export function mapAircraftData(aircraftData) {
  return {
    icao24: aircraftData.icao24,
    firstSeen: new Date(aircraftData.firstSeen * 1000),
    estDepartureAirport: aircraftData.estDepartureAirport,
    lastSeen: new Date(aircraftData.lastSeen * 1000),
    estArrivalAirport: aircraftData,
    callsign: aircraftData,
    estDepartureAirportHorizDistance:
      aircraftData.estDepartureAirportHorizDistance,
    estDepartureAirportVertDistance:
      aircraftData.estDepartureAirportVertDistance,
    estArrivalAirportHorizDistance: aircraftData.estArrivalAirportHorizDistance,
    estArrivalAirportVertDistance: aircraftData.estArrivalAirportVertDistance,
    departureAirportCandidatesCount:
      aircraftData.departureAirportCandidatesCount,
    arrivalAirportCandidatesCount: aircraftData.arrivalAirportCandidatesCount,
  };
}
