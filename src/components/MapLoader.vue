<template>
  <div>
      <div class="map" ref="googleMap"></div>
      <Spinner v-if="!(flights.length > 0)"></Spinner>
      <div v-else>
        <MapMarker
          v-for="flight in flights"
          :key="flight.id"
          :flight="flight"
          :google="google"
          :map="map"
        />
        <HeatMap
          :google="google"
          :map="map"
        />
      </div>

    </div>
</template>

<script>
  import gmapsInit from "../utils/gmaps";
  import {getAll} from '../services/flights.service';
  import MapMarker from "./MapMarker";
  import HeatMap from "./Header";
  import Spinner from "./Spinner";

  export default {
    name: 'Map',
    components: {
      MapMarker,
      Spinner,
      HeatMap
    },
    data() {
      return {
        google: null,
        map: null,
        heatMap: null,
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
        this.heatMap = new this.google.maps.visualization.HeatmapLayer({
          data: this.getPoints(),
          map: this.map
        });
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
      },
      getPoints() {
        return [
          new this.google.maps.LatLng(52, 20),
          new this.google.maps.LatLng(52, 21),
          new this.google.maps.LatLng(52, 22),
          new this.google.maps.LatLng(53, 23),
          new this.google.maps.LatLng(53, 24),
          new this.google.maps.LatLng(53, 25)
        ];
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
</style>
