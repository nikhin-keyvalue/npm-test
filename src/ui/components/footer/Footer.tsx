import Preact, { h } from 'preact';

import './style.scss';

const Footer: Preact.FunctionComponent = () => (
  <div className='zamp-footer-wrapper'>
    powered by <span className='zamp-footer-name'>ZAMP</span>
  </div>
);

export default Footer;
