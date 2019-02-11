<template>
  <div class="map"/>
</template>

<script>
import MarkerClusterer from "@google/markerclusterer";
import gmapsInit from "../utils/gmaps";
const locations = [
  {
    position: {
      lat: 48.16091,
      lng: 16.38333
    }
  },
  {
    position: {
      lat: 48.17427,
      lng: 16.32962
    }
  },
  {
    position: {
      lat: 48.14614,
      lng: 16.29703
    }
  },
  {
    position: {
      lat: 48.13583,
      lng: 16.19446
    }
  },
  {
    position: {
      lat: 48.306091,
      lng: 14.28644
    }
  },
  {
    position: {
      lat: 47.50304,
      lng: 9.74707
    }
  }
];
export default {
  name: `Map`,
  async mounted() {
    try {
      const google = await gmapsInit();
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(this.$el);
      geocoder.geocode({ address: `Austria` }, (results, status) => {
        if (status !== `OK` || !results[0]) {
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
        const marker = new google.maps.Marker({ ...location, map });
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
  width: 100vw;
  height: 100vh;
}
</style>
