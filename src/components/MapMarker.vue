<template>
  <div></div>
</template>

<script>
  import planeIcon from "../assets/airplane24.png";

  export default {
    name: 'MapMarker',
    props: {
      google: {
        type: Object,
        required: true
      },
      map: {
        type: Object,
        required: true
      },
      flight: {
        type: Object,
        required: true
      }
    },

    mounted() {
      new this.google.maps.Marker({
        position: this.flight.position,
        flight: this.flight,
        map: this.map,
        icon: planeIcon
      })
    }
  }
</script>
