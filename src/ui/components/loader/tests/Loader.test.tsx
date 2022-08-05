import { h } from 'preact';
import { configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import Loader from '../Loader';

configure({ adapter: new Adapter() });

describe('Loader', () => {
  it('render components', () => {
    const wrapper = mount(<Loader />);
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });
});
