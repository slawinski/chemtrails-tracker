import { reactive, toRefs } from '@vue/composition-api';
import { latLng } from 'leaflet';

export function useMapConfig() {
  const mapConfig = reactive({
    zoom: 6,
    center: latLng(52, 19),
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  });
  return {
    ...toRefs(mapConfig),
  };
}
