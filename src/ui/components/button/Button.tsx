import Preact, { h } from 'preact';

import { ButtonStyles, ButtonType } from 'constants/common';

import './style.scss';

interface ButtonProps {
  type?: ButtonType;
  buttonLabel: string;
  handleButtonClick: (status?) => void;
  width?: string;
  height?: string;
  isDisabled?: boolean;
  fontSize?: string;
  fontWeight?: string;
}

const Button: Preact.FunctionComponent<ButtonProps> = ({
  type = ButtonType.PRIMARY,
  buttonLabel,
  handleButtonClick,
  width,
  height,
  isDisabled
}) => {
  const getButtonStyle = () => ButtonStyles[type];

  return (
    <button className={getButtonStyle()} onClick={handleButtonClick} style={{ width, height }} disabled={isDisabled}>
      {buttonLabel}
    </button>
  );
};

// TODO: issue with default props and types

Button.defaultProps = {
  type: ButtonType.PRIMARY,
  isDisabled: false
};

export default Button;
