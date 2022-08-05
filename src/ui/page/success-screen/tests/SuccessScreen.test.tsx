import { h } from 'preact';
import { configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import SuccessScreen from '../SuccessScreen';

configure({ adapter: new Adapter() });

describe('Counter', () => {
  it('render components', () => {
    const wrapper = mount(<SuccessScreen handlePaymentCompleted={() => {}} orderId={''} account={''} />);
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });
});
