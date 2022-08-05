import { h } from 'preact';
import { configure, mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import ErrorScreen from '../ErrorScreen';

configure({ adapter: new Adapter() });

describe('Counter', () => {
  const onHandleButtonClickMock = jest.fn();

  it('render components', () => {
    const wrapper = mount(<ErrorScreen onHandleButtonClick={onHandleButtonClickMock} />);
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });

  it('handle back click', () => {
    const wrapper = shallow(<ErrorScreen onHandleButtonClick={onHandleButtonClickMock} />);

    wrapper.find('button.button-container').simulate('click');
    expect(onHandleButtonClickMock).toHaveBeenCalled();
  });
});
