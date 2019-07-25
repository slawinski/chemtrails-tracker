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
      chemLng: null,
      distance: 1
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
      const iterations = 10;
      return Array(iterations).fill().map((e, i) => {
          return {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance * i/10), this.emissionPoint.lng + this.getLng(this.distance * i/10)), weight: 10-i}
        }
      );
    },
    toRadians (angle) {
      return angle * (Math.PI / 180);
    },
    getLat(dist){
      if (this.trueTrack > 270 || this.trueTrack <= 90) {
        return this.chemLat = -Math.sqrt(dist**2 * (1 - Math.sin(this.toRadians(this.trueTrack))**2));
      } else {
        return this.chemLat = Math.sqrt(dist**2 * (1 - Math.sin(this.toRadians(this.trueTrack))**2));
      }
    },
    getLng(dist){
      if (this.trueTrack > 0 && this.trueTrack <= 180) {
        return this.chemLng = -Math.sqrt(dist**2 * (1 - Math.cos(this.toRadians(this.trueTrack))**2));
      } else {
        return this.chemLng = Math.sqrt(dist**2 * (1 - Math.cos(this.toRadians(this.trueTrack))**2));
      }
    }
  }

}
</script>

<style scoped>

</style>