import { shallowMount } from '@vue/test-utils';
import Map from '../components/Map';

let wrapper = null;

beforeEach(() => {
  wrapper = shallowMount(Map);
});

afterEach(() => {
  wrapper.destroy();
});

describe('Map component', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.is(Map)).toBe(true);
    expect(wrapper.findAll({ ref: 'map' })).toHaveLength(1);
  });
});
