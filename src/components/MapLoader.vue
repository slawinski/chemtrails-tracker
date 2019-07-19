<template>
  <div>
    <div>
      <div class="map" ref="googleMap"></div>
      <div>
        <img class="spinner rotate" src="../assets/return.svg" alt="">
      </div>
    </div>

    <MapMarker
            v-for="flight in flights"
            :key="flight.id"
            :flight="flight"
            :google="google"
            :map="map"
    />
  </div>
</template>

<script>
  import gmapsInit from "../utils/gmaps";
  import {getAll} from '../services/flights.service';
  import MapMarker from "./MapMarker";

  export default {
    name: `Map`,
    components: {MapMarker},
    data() {
      return {
        google: null,
        map: null,
        defaultMapsOptions: {
          zoom: 6,
          center: {lat: 52, lng: 19}
        },
        flights: []
      }
    },
    methods: {
      initializeMap() {
        const mapContainer = this.$refs.googleMap
        this.map = new this.google.maps.Map(mapContainer, this.defaultMapsOptions);
      },
      mapFlightDataToFlights(flightData) {
        flightData.data.states.map((item) => {
          const obj = {
            id: item[0],
            callSign: item[1],
            originCountry: item[2],
            position: {
              lat: item[6],
              lng: item[5]
            },
            onGround: item[8],
            velocity: item[9],
            trueTrack: item[10],
          };
          this.flights.push(obj)
        });
      }
    },
    async mounted() {
      try {
        this.google = await gmapsInit();
        this.initializeMap();

        const flightData = await getAll();

        this.mapFlightDataToFlights(flightData);


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

  .spinner {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .rotate {
    transform-origin: 50% 50%;
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    to {
      transform: rotate(360deg);
    }
  }
</style>
