<template>
  <div class="map"/>
</template>

<script>
import gmapsInit from "../utils/gmaps.js";

export default {
  name: "Map",
  async mounted() {
    try {
      const google = await gmapsInit();
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(this.$el);

      geocoder.geocode({ address: "Austria" }, (results, status) => {
        if (status !== "OK" || !results[0]) {
          throw new Error(status);
        }

        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
      });
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style>
.map {
  /* grid-row: 2/3; */
  width: 100vw;
  height: 100vh;
}
</style>
