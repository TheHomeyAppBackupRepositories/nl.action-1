'use strict';

const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
  static CAPABILITIES = {
    onoff({ value, data }) {
      return {
        ...data,
        count: this.increaseCounter(),
        state: !!value,
      }
    },
  };

  async onRFInit() {
    await super.onRFInit();

    //This count is user to make sure the socket accepts the send data.
    this.counter = 0;
  }

  async onAdded() {
    if (this.hasCapability('onoff')) {
      await this.setCapabilityValue('onoff', true);
    }
  }

  /**
   * Increase the counter for sending signals
   * Function used to change count to 0...3 so that the socket will recognize the payload.
   *
   * @returns {number|*}
   */
  increaseCounter() {
    this.counter++;
    if (this.counter > 3) {
      this.counter = 0;
    }
    return this.counter;
  }
};
