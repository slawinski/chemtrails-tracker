<script>
import planeIcon from "../assets/airplane24.png";

export default {
  name: 'MapMaker',
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  mounted() {
    new this.google.maps.Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      icon: planeIcon
    })
  }
}
</script>
