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
      return [
        {location: new this.google.maps.LatLng(this.emissionPoint.lat, this.emissionPoint.lng), weight: 3},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.1), this.emissionPoint.lng + this.getLng(this.distance*0.1)), weight: 3},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.2), this.emissionPoint.lng + this.getLng(this.distance*0.2)), weight: 2},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.3), this.emissionPoint.lng + this.getLng(this.distance*0.3)), weight: 2},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.4), this.emissionPoint.lng + this.getLng(this.distance*0.4)), weight: 2},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.5), this.emissionPoint.lng + this.getLng(this.distance*0.5)), weight: 1},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.6), this.emissionPoint.lng + this.getLng(this.distance*0.6)), weight: 1},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.7), this.emissionPoint.lng + this.getLng(this.distance*0.7)), weight: 1},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.8), this.emissionPoint.lng + this.getLng(this.distance*0.8)), weight: 1},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance*0.9), this.emissionPoint.lng + this.getLng(this.distance*0.9)), weight: 1},
        {location: new this.google.maps.LatLng(this.emissionPoint.lat + this.getLat(this.distance), this.emissionPoint.lng + this.getLng(this.distance)), weight: 1}
      ];
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