<template>
  <div>
    <div class="map" ref="googleMap"></div>
    <MapMarker
            v-for="marker in markers"
            :key="marker.id"
            :marker="marker"
            :google="google"
            :map="map"
    />
  </div>
</template>

  <script>
    import gmapsInit from "../utils/gmaps";
    import planeIcon from "../assets/airplane24.png";
    import FlightsService from '../services/flights.service';
    import MapMarker from "./MapMaker";

    export default {
      name: `Map`,
      components: { MapMarker },
      data() {
        return {
          google: null,
          map: null,
          defaultMapsOptions: {
            zoom: 6,
            center: {lat: 52.232222, lng: 21.008333}
          }
        }
      },
      methods: {
        initializeMap() {
          const mapContainer = this.$refs.googleMap
          this.map = new this.google.maps.Map(mapContainer, this.defaultMapsOptions);
        }
      },
      async mounted() {
        try {
          this.google = await gmapsInit();
          this.initializeMap()

          const markerClickHandler = marker => {
            this.map.setZoom(13);
            this.map.setCenter(marker.getPosition());
          };
          const flights = await FlightsService.getAll();
          flights.data.states.map(flight => {
            const marker = new this.google.maps.Marker({
              position: {
                lat: flight[6],
                lng: flight[5]
              },
              map: this.map,
              icon: planeIcon
            });
            marker.addListener(`click`, () => markerClickHandler(marker));
            return marker;
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
