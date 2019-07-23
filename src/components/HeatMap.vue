<template>
  <div></div>
</template>

<script>

export default {
  name: 'HeatMap',
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    emissionPoint: {
      type: Object,
      required: true
    }
  },
  mounted() {
    new this.google.maps.visualization.HeatmapLayer({
      data: this.getPoint(),
      map: this.map
    });
  },
  methods: {
    getPoint() {
      return [
        new this.google.maps.LatLng(this.emissionPoint.lat, this.emissionPoint.lng),
      ];
    }
  }

}
</script>

<style scoped>

</style>