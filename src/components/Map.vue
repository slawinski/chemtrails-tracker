<template>
  <div class="map"/>
</template>

<script>
// import MarkerClusterer from "@google/markerclusterer";
import gmapsInit from "../utils/gmaps";
import planeIcon from "../assets/airplane24.png";
import FlightsService from '../services/flights.service';

const defaultMapsOptions = {
  zoom: 6,
  center: { lat: 52.232222, lng: 21.008333 }
};

export default {
  name: `Map`,
  async mounted() {
    try {
      const google = await gmapsInit();
      const map = new google.maps.Map(this.$el, defaultMapsOptions);
      const markerClickHandler = marker => {
        map.setZoom(13);
        map.setCenter(marker.getPosition());
      };
      const flights = await FlightsService.getAll();
      flights.data.states.map(flight => {
        const marker = new google.maps.Marker({
          position: {
            lat: flight[6],
            lng: flight[5]
          },
          map: map,
          icon: planeIcon
        });
        marker.addListener(`click`, () => markerClickHandler(marker));
        return marker;
      });
      // eslint-disable-next-line no-new
      // new MarkerClusterer(map, markers, {
      //   imagePath: `https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m`
      // });
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
