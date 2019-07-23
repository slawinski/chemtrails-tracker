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
    },
    trueTrack: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chemLat: null,
      chemLng: null
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
        new this.google.maps.LatLng(this.getLat(), this.getLng())
      ];
    },
    toRadians (angle) {
      return angle * (Math.PI / 180);
    },
    getLat(){
      this.chemLat = this.emissionPoint.lat - Math.sqrt(1**2 * (1 - Math.sin(this.toRadians(this.trueTrack))**2));
      return this.chemLat;
    },
    getLng(){
      this.chemLng = this.emissionPoint.lng - Math.sqrt(1**2 * (1 - Math.cos(this.toRadians(this.trueTrack))**2));
      return this.chemLng;
    }
  }

}
</script>

<style scoped>

</style>