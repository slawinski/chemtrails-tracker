<template>
  <div class="map"/>
</template>

<script>
import MarkerClusterer from "@google/markerclusterer";
import gmapsInit from "../utils/gmaps";
import flightData from "../utils/flights.mock";
import planeIcon from "../assets/airplane.png";

const locations = [
  {
    callsign: "DLH722 ",
    origin_country: "Germany",
    position: {
      lng: 22.9349,
      lat: 52.7172
    },
    true_track: 58.05
  },
  {
    callsign: "AUH07 ",
    origin_country: "United Arab Emirates",
    position: {
      lng: 21.1932,
      lat: 51.8919
    },
    true_track: 4.83
  },
  {
    callsign: "ENT7362 ",
    origin_country: "Poland",
    position: {
      lng: 20.9635,
      lat: 52.1743
    },
    true_track: 36
  },
  {
    callsign: "LOT2MF ",
    origin_country: "Poland",
    position: {
      lng: 19.7079,
      lat: 52.3782
    },
    true_track: 95.25
  },
  {
    callsign: "LOT3GP ",
    origin_country: "Poland",
    position: {
      lng: 20.9952,
      lat: 52.1337
    },
    true_track: 331.98
  }
];
export default {
  name: `Map`,
  async mounted() {
    try {
      const google = await gmapsInit();
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(this.$el);
      const address = "Austria";
      geocoder.geocode({ address: address }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results[0]) {
          throw new Error(status);
        }
        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
      });
      const markerClickHandler = marker => {
        map.setZoom(13);
        map.setCenter(marker.getPosition());
      };
      const markers = locations.map(location => {
        const marker = new google.maps.Marker({
          ...location,
          map: map,
          icon: planeIcon
        });
        marker.addListener(`click`, () => markerClickHandler(marker));
        return marker;
      });
      // eslint-disable-next-line no-new
      new MarkerClusterer(map, markers, {
        imagePath: `https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m`
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
};
</script>

<style>
.map {
  grid-row: 2/3;
  height: 100%;
}
</style>
