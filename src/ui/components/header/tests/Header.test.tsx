import { h } from 'preact';
import { configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import { UserDetails } from 'types';

import Header from '../Header';

configure({ adapter: new Adapter() });

describe('Counter', () => {
  const orderDetailsMock: UserDetails = {
    id: '123',
    name: 'name test',
    logo: 'logo'
  };

  it('render components', () => {
    const wrapper = mount(<Header sourceAmount={'0'} sourceCurrency={'$'} userDetails={orderDetailsMock} />);
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });
});
