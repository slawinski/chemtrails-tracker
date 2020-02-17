import { ref } from '@vue/composition-api';
import { latLng } from 'leaflet';

export function useMapConfig() {
  const zoom = ref(6);
  const center = ref(latLng(52, 19));
  const url = ref('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
  return {
    zoom,
    center,
    url,
  };
}
