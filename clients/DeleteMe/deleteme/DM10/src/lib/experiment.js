//import { setup, fireEvent } from '../../../../../../globalUtil/trackings/services';
import shared from './shared/shared';

const { ID } = shared;

export default () => {
  //setup(); //use if needed

  console.log(ID);
  //-----------------------------
  //If control, bail out from here
  //-----------------------------
  //if (VARIATION === 'control') {
  //}

  //-----------------------------
  //Write experiment code here
  //-----------------------------
  //...
  const headlineConfig = {
    6492391637: 'The Best Personal Data Removal Company 2022',
    6492391634: 'Opt Out from Data Broker Sites',
    6492391643: 'The Most Trusted Personal Data Removal Company',
    6495930156: 'Remove Personal Information from the Internet Now',
    6492391646: 'Remove Personal Information from Google',
    6492391628: '',
    10652580362: ''
  };

  const urlParams = new URLSearchParams(window.location.search);
  const campaignId = urlParams.get('utm_campaignid');
  //console.log('utm_campaignid:', campaignId);
  const headlineText = campaignId ? headlineConfig[campaignId] : '';
  const headlineHtml = `<h1>${headlineText}</h1>`;

  const anchorElem = document.querySelector('.Fesidediv');
  anchorElem.closest('.container').classList.add(`${ID}__container`);
  anchorElem.classList.add(`${ID}__Fesidediv`);
  anchorElem.insertAdjacentHTML('afterbegin', headlineHtml);
};
