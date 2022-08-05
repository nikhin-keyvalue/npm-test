import Preact, { h } from 'preact';
import { useState } from 'preact/hooks';

import { CLOSE_BLUE_ICON, CLOSE_ICON, NEXT_ICON, PREV_BLUE_ICON, PREV_GREY_ICON } from 'constants/icon';
import {
  STEP_EIGHT,
  STEP_FIVE,
  STEP_FOUR,
  STEP_ONE,
  STEP_SEVEN,
  STEP_SIX,
  STEP_THREE,
  STEP_TWO
} from 'constants/images';
import {
  TUTORIAL_STEP_EIGHT,
  TUTORIAL_STEP_FIVE,
  TUTORIAL_STEP_FOUR,
  TUTORIAL_STEP_ONE,
  TUTORIAL_STEP_SEVEN,
  TUTORIAL_STEP_SIX,
  TUTORIAL_STEP_THREE,
  TUTORIAL_STEP_TWO,
  TUTORIAL_TITLE
} from 'constants/strings';
import { ASSETS_PATH } from 'config';

import './style.scss';

interface TutorialProps {
  handleCloseButtonClick: () => void;
}

const Tutorial: Preact.FunctionComponent<TutorialProps> = ({ handleCloseButtonClick }) => {
  const [currentStep, setStep] = useState(0);

  const steps = [
    TUTORIAL_STEP_ONE,
    TUTORIAL_STEP_TWO,
    TUTORIAL_STEP_THREE,
    TUTORIAL_STEP_FOUR,
    TUTORIAL_STEP_FIVE,
    TUTORIAL_STEP_SIX,
    TUTORIAL_STEP_SEVEN,
    TUTORIAL_STEP_EIGHT
  ];

  const images = [STEP_ONE, STEP_TWO, STEP_THREE, STEP_FOUR, STEP_FIVE, STEP_SIX, STEP_SEVEN, STEP_EIGHT];

  return (
    <div className='zamp-tutorial-modal-wrapper' role='presentation'>
      <div
        className='zamp-tutorial-modal-content'
        role='presentation'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='zamp-tutorial-container'>
          <div className='zamp-left-container'>
            <div className='zamp-tutorial-title'>{TUTORIAL_TITLE}</div>
            <div className='zamp-steps-container'>
              {steps.map((item, index) => {
                return (
                  <div key={index}>
                    <div className='zamp-steps'>
                      <div
                        className={`zamp-step-index ${currentStep === index ? 'zamp-steps-blue' : 'zamp-steps-grey'}`}
                      >
                        {index + 1}
                      </div>
                      <div
                        className={`zamp-step-description ${
                          currentStep === index ? 'zamp-steps-blue' : 'zamp-steps-grey'
                        }`}
                      >
                        {item}
                      </div>
                    </div>
                    <div className={`${index !== steps.length - 1 && `zamp-steps-connect`}`} />
                  </div>
                );
              })}
            </div>
            <div className='zamp-button-container'>
              <button
                className='zamp-button-style'
                disabled={currentStep === 0}
                onClick={() => setStep(currentStep - 1)}
              >
                <img src={`${ASSETS_PATH}/${currentStep === 0 ? PREV_GREY_ICON : PREV_BLUE_ICON}`} alt='Prev' />
                <span className={`zamp-button-text ${currentStep === 0 && 'zamp-button-text-disabled'}`}>Back</span>
              </button>
              {currentStep === steps.length - 1 ? (
                <button className='zamp-button-style' onClick={handleCloseButtonClick}>
                  <span className='zamp-button-text'>Close</span>
                  <img src={`${ASSETS_PATH}/${CLOSE_BLUE_ICON}`} alt='Close' />
                </button>
              ) : (
                <button className='zamp-button-style' onClick={() => setStep(currentStep + 1)}>
                  <span className='zamp-button-text'>Next</span>
                  <img src={`${ASSETS_PATH}/${NEXT_ICON}`} alt='Next' />
                </button>
              )}
            </div>
          </div>
          <div className='zamp-right-container'>
            <div className='zamp-close-icon'>
              <img src={`${ASSETS_PATH}/${CLOSE_ICON}`} alt='Close' onClick={handleCloseButtonClick} />
            </div>
            <div className='zamp-image-conainer'>
              <img src={`${ASSETS_PATH}/${images[currentStep]}`} alt='tutorial-img' className='zamp-tutorial-image' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
