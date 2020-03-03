import Vue from 'vue';
import { useMapConfig } from '../consumables/useMapConfig';
import CompositionApi from '@vue/composition-api';

Vue.use(CompositionApi);

describe('useMapConfig', () => {
  it('should return object', () => {
    const mapConfig = {
      zoom: 6,
      center: { lat: 53, lng: 19 },
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    };
    expect(useMapConfig()).toEqual(mapConfig);
  });
});
