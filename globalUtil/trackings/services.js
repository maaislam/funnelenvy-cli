import { pollerLite } from '../util';

/**
 * Standard experiment setup
 */

const events = {
  trackerName: false,
  propertyId: false,
  analyticsReference: 'ga',
  eventCache: [],
  sendEvents: true,
  setDefaultCategory(category) {
    this.category = category;
    return this;
  },
  setDefaultAction(action) {
    this.action = action;
    return this;
  },
  setPropertyId(propertyId) {
    //If set, will look for tracker matching given property ID
    this.propertyId = propertyId;
  },
  setTrackerName(trackerName) {
    this.trackerName = trackerName;
  },
  useLegacyTracker() {
    this.analyticsReference = '_gaq';
  },

  /**
   * Shorthand for sending events
   */
  sendAuto(evVariation, evLabel, userOptions) {
    this.send(null, null, evLabel, userOptions, evVariation);
  },

  sendNormalised(evLabel, userOptions) {
    this.send(null, null, evLabel, userOptions);
  },

  /**
   * Send an event
   * @param {string} evCategory
   * @param {string} evAction
   * @param {string} evLabel
   * @param {object} userOptions
   */
  send(evCategory, evAction, evLabel, userOptions, evVariation = null) {
    const options = userOptions || {};
    let label = evLabel;
    const category = evCategory || this.category;
    const action = evAction || this.action;

    let variation = evVariation;

    if (variation != null) {
      if (variation == 0) {
        variation = 'Control';
      }
      label = `Variation: ${variation} - ${evLabel}`;
    }

    if (typeof options === 'object' && options.sendOnce) {
      const eventID = `${category}${action}${label}`;
      //Check eventCache to see if this has already been sent
      if (this.eventCache.indexOf(eventID) > -1) {
        return false;
      }
      //Store event in cache
      this.eventCache.push(eventID);
    }

    const self = this;
    const fire = (tracker) => {
      if (self.analyticsReference === '_gaq') {
        window._gaq.push([
          '_trackEvent',
          category,
          action,
          label,
          null,
          typeof options.nonInteraction !== 'undefined' ? options.nonInteraction : true
        ]);
      } else {
        const opts = {
          nonInteraction: options.nonInteraction ? options.nonInteraction : true
        };

        if (options.opts) {
          for (const k in options.opts) {
            opts[k] = options.opts[k];
          }
        }

        window[self.analyticsReference](`${tracker}.send`, 'event', category, action, label, opts);
      }
    };

    if (self.trackerName) {
      if (this.sendEvents == true) {
        fire(self.trackerName);
      }
    } else {
      //Set trackerName inside polling condition
      pollerLite(
        [
          () => {
            try {
              const trackers = window[self.analyticsReference]?.getAll();

              if (trackers && trackers.length) {
                if (self.propertyId) {
                  for (let i = 0; i < trackers.length; i += 1) {
                    const tracker = trackers[i];
                    if (tracker.get('trackingId') === self.propertyId) {
                      self.trackerName = tracker.get('name');
                      return true;
                    }
                  }
                } else {
                  self.trackerName = trackers[0].get('name');
                  return true;
                }
              }
            } catch (err) {
              console.error(err);
            }
          }
        ],
        () => {
          if (this.sendEvents == true) {
            fire(self.trackerName);
          }
        },
        {
          wait: 150
        }
      );
    }
  }
};
export const setup = (category, action, shared) => {
  const { ID, VARIATION, CLIENT, LIVECODE } = shared;

  //set up events
  events.setDefaultCategory(category);
  events.setDefaultAction(action);

  if (LIVECODE == 'true') {
    events.sendEvents = false;
  } else {
    events.sendEvents = true;
  }

  //adds document body classlist
  document.documentElement.classList.add(ID);
  document.documentElement.classList.add(`${ID}-${VARIATION}`);
};

export const fireEvent = (label, shared, sendOnce = false) => {
  const { ID, VARIATION } = shared;

  const labelMessage =
    //eslint-disable-next-line prefer-template
    'Test ID: ' + ID + ' Variation: ' + VARIATION + ' Label: ' + label;

  events.sendNormalised(labelMessage, {
    sendOnce
  });
};
