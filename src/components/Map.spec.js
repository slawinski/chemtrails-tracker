import { shallowMount } from '@vue/test-utils';
import Map from './Map';

describe('Map component', function() {
  it('should render', function() {
    const wrapper = shallowMount(Map);
    expect(wrapper.vm).toBeCalled();
  });
});
