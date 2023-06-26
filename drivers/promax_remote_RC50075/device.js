'use strict';

const PromaxDevice = require('../../lib/promax/PromaxDevice');

module.exports = class extends PromaxDevice {
  static RX_ENABLED = true;

  async onCommandFirst({ state, unit }) {
    this.homey.flow
      .getDeviceTriggerCard('promax_remote_RC50075:received')
      .trigger(this, {}, { state, unit })
      .catch(err => this.error(err));
  }

  async onCommandMatch(command) {
    if (command === undefined || command === null) {
      return false;
    }
    const { address } = this.getData();
    return address === command.address;
  }
};
