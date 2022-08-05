import { h } from 'preact';
import { configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import PendingScreen from '../PendingScreen';
import { CoinData } from 'types';

configure({ adapter: new Adapter() });
const amount = '0.0001';

describe('Counter', () => {
  it('render components', () => {
    const wrapper = mount(
      <PendingScreen
        selectedCoinObject={{} as CoinData}
        amount={amount}
        handlePaymentCompleted={() => {}}
        selectedAmount={''}
      />
    );
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });
});
