import { h } from 'preact';
import { configure, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import Timer from '../Timer';

configure({ adapter: new Adapter() });

describe('Counter', () => {
  it('render components', () => {
    const wrapper = shallow(<Timer totalTimeDuration={0} startTimer={false} />);
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });

  // TODO: setInterval test cases to be explored
});
