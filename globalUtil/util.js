/**
 * Returns a function to get current time
 * @returns {Function}
 */
export const getNow =
  Date.now ||
  function getNow() {
    return new Date().getTime();
  };

/**
 * Merge together two objects with properties of the source object taking priority
 * The function is called recursively for properties that are also objects to avoid
 * overwriting the entire source object
 * @param {object} target Base object
 * @param {object} source Object with properties that will overwrite target
 * @returns {object}
 */
export const mergeObjects = (target, source) => {
  const merged = target;
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = merged[key];
    const isObject =
      targetValue && typeof targetValue === 'object' && !(targetValue instanceof Array);

    if (isObject) {
      // If object, call function recursively to overwrite subproperties individually
      merged[key] = mergeObjects(targetValue, sourceValue);
    } else {
      // Overwrite default with value from options
      merged[key] = sourceValue;
    }
  });
  return merged;
};

/**
 * @desc Lightweight version of the poller that doesn't include some advanced functionality
 *  Check the existence of elements or some other logic.
 * @param {array} conditions
 * @param {function} callback
 * @param {options} userOptions
 */
export const pollerLite = (conditions, callback, userOptions) => {
  /**
   * Default options
   */
  let options = {
    wait: 50,
    multiplier: 1.1,
    timeout: 0,
  };

  // Overwrite any default options with user supplied options
  if (userOptions) {
    options = mergeObjects(options, userOptions);
  }

  const { multiplier, wait } = options;

  /**
   * A date object created from the timeout option for easier comparison
   * @type {Date}
   */
  const timeout = options.timeout ? new Date(getNow() + options.timeout) : null;

  /**
   * Check if the poller has timed out
   * @returns {boolean}
   */
  const isTimedOut = () => timeout && getNow() > timeout;

  /**
   * Any successful polling conditions are pushed here to keep track of progress
   * @type {array}
   */
  const successfulConditions = [];

  /**
   * Check if a condition has passed
   * Conditions are evaluated differently depending on the type
   * Functions must return true and strings should be CSS selectors present in the DOM
   * @param {*} condition
   * @returns {boolean}
   */
  const evaluateCondition = (condition) => {
    if (!condition) {
      return false;
    }

    const types = {
      function: () => condition(),
      string: () => document.querySelector(condition),
    };

    const evaluate = types[typeof condition];
    return evaluate ? evaluate() : true;
  };

  /**
   * Check if all the conditions have passed
   * @returns {boolean}
   */
  const allConditionsPassed = () => successfulConditions.length === conditions.length;

  /**
   * Recursive poll for a condition until it returns true
   * @param {*} condition
   * @param {number} waitTime Time before next polling attempt
   * @param {boolean} skipWait Bypasses the wait period if true
   */
  const pollForCondition = (condition, waitTime, skipWait) => {
    // End recursion if timeout has passed
    if (timeout && isTimedOut()) {
      return false;
    }

    const result = evaluateCondition(condition);

    if (result) {
      successfulConditions.push(result);
      if (allConditionsPassed()) {
        // Run the callback and pass the results as the first argument
        callback(successfulConditions);
      }
    } else {
      setTimeout(
        () => {
          pollForCondition(condition, waitTime * multiplier);
        },
        skipWait ? 0 : waitTime
      );
    }
  };

  // Start polling for all conditions
  for (let i = 0; i < conditions.length; i += 1) {
    if (typeof conditions[i] != 'string' && typeof conditions[i] != 'function') {
      throw 'Every item in the poller array should be a function or a string';
    }
    pollForCondition(conditions[i], wait, true);
  }
};

export const formatPrice = (amount, code = 'en-GB', currency = 'GBP') =>
  new Intl.NumberFormat(code, {
    style: 'currency',
    currency,
  }).format(amount);

export const observeDOM = (targetSelectorString, callbackFunction, configObject) => {
  const target = document.querySelector(`${targetSelectorString}`);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(function (mutation) {
      callbackFunction(mutation);
    });
  });

  // configuration of the observer:

  const config = configObject || {
    attributes: true,
    childList: true,
    characterData: false,
    subtree: true,
  };

  target && observer.observe(target, config);
};

export const obsIntersection = (target, config, callback) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // if (entry.intersectionRatio > 0 && entry.isIntersecting && entry.boundingClientRect.y > 0) {

      // }
      callback(entry);
    });
  }, config);
  if (!target) {
    return;
  }

  observer?.observe(target);
};

export const localStorageSave = (key, value) => {
  localStorage.setItem(key, value);
};

/**
 * Remove element from local storage.
 * @param string key
 */
export const localStorageRemove = (key) => {
  localStorage.removeItem(key);
};

/**
 * Retrive an object from local storage.
 * @param  string key
 * @return mixed
 */
export const localStorageGet = (key) => {
  const item = localStorage.getItem(key);

  if (!item) return;

  if (item[0] === '{' || item[0] === '[') return JSON.parse(item);

  return item;
};

export const getCurrMonth = () => {
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date();
  return month[date.getMonth()];
};

/***********************************************************/

//for DY only
function triggerEvent(eventName, eventProperties, isDelayed) {
  const eventData = {
    name: eventName,
    properties: eventProperties,
  };
  // eslint-disable-next-line no-undef
  if (isDelayed && DY.Detectors && DY.Detectors.ua && DY.Detectors.ua().safari) {
    // eslint-disable-next-line no-undef
    DY.ServerUtil.delayedLogEvent(eventData);
  } else {
    // eslint-disable-next-line no-undef
    DY.API('event', eventData);
  }
}

//for DY only

/***********************************************************/

/***********************************************************/

export const setCookie = (cName, cValue, expDays) => {
  let date = new Date();

  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);

  let expires = `expires= ${date.toUTCString()}`;

  // eslint-disable-next-line prefer-template
  document.cookie = cName + '=' + cValue + '; ' + expires;
};

export const getCookie = (name) => {
  let value = `; ${document.cookie}`;

  let parts = value.split(`; ${name}=`);

  if (parts.length == 2) {
    return parts.pop().split(';').shift();
  }
};
