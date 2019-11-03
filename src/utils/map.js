import { translateIcao } from './translations';

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

export async function mapRouteData(routeData) {
  return {
    callsign: routeData.callsign,
    route: {
      departure: await translateIcao(routeData.route[0]),
      arrival: await translateIcao(routeData.route[1]),
    },
    updateTime: routeData.updateTime,
    operatorIata: routeData.operatorIata,
    flightNumber: routeData.flightNumber,
  };
}
