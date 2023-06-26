'use strict';

const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
  static RX_ENABLED = true;

  async onCommandFirst({ state, unit }) {
    this.homey.flow
      .getDeviceTriggerCard('972080_remote:received')
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
