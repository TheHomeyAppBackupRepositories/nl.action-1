'use strict';

const PromaxDevice = require('../../lib/promax/PromaxDevice');

module.exports = class extends PromaxDevice {
  async onCommandMatch(command) {
    if (command === undefined || command === null) {
      return false;
    }

    // command.unit 0 is the master on/off
    const { address, unit } = this.getData();
    return address === command.address && (unit === command.unit || command.unit === 0);
  }

  /**
   * Sets the capability when the device is triggered by remote for on off
   *
   * @param onoff
   * @returns {Promise<void>}
   */
  async onCommandFirst({ state }) {
    if(this.hasCapability('onoff')) {
      await this.setCapabilityValue('onoff', state);
    }
  }
};
