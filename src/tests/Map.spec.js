import { shallowMount } from '@vue/test-utils';
import Map from '../components/Map';

describe('Map component', () => {
  it('should render', () => {
    const wrapper = shallowMount(Map);

    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.is(Map)).toBe(true);
    expect(wrapper.contains('div')).toBe(true);

    // TODO make a smoke check by testing map, marker, marker trigger, heatmap
  });
});
