import { h } from 'preact';
import { configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import BottomSheet from '../BottomSheet';

configure({ adapter: new Adapter() });

describe('Counter', () => {
  it('render components', () => {
    const wrapper = mount(
      <BottomSheet isOpen={true} setBottomSheetOpen={() => null}>
        {}
      </BottomSheet>
    );
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });
});
