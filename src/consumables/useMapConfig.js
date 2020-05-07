import { reactive, toRefs } from '@vue/composition-api';
import { latLng } from 'leaflet';

export function useMapConfig() {
  const mapConfig = reactive({
    zoom: 10,
    center: latLng(51.789836, 17.041303),
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  });
  return {
    ...toRefs(mapConfig),
  };
}
