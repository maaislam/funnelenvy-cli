import shared from '../shared/shared';

const setup = () => {
  const { ID, VARIATION } = shared;
  document.documentElement.classList.add(ID);
  document.documentElement.classList.add(`${ID}-${VARIATION}`);
};

export default setup;
