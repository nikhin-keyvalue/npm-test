import Preact, { h } from 'preact';

import { LoaderTypes } from 'types';
import { ASSETS_PATH } from 'config';

import './style.scss';

const Loader: Preact.FunctionComponent<LoaderTypes> = ({ type }) => (
  <div className='zamp-loader-wrapper'>
    <img
      src={`${ASSETS_PATH}/public/gif/${type}-loader.gif`}
      className={`zamp-${type}-loader-gif-container`}
      alt='Loading...'
    />
  </div>
);

Loader.defaultProps = {
  type: 'default'
};

export default Loader;
