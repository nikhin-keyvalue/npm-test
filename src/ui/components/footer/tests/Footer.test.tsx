import { h } from 'preact';
import { configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import Footer from '../Footer';

configure({ adapter: new Adapter() });

describe('Counter', () => {
  it('render components', () => {
    const wrapper = mount(<Footer />);
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });
});
