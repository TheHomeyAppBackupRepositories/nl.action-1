'use strict';

const { RFDriver } = require('homey-rfdriver');
const SelectPlus2018RFSignal = require('../../lib/selectplus/SelectPlus2018RFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = SelectPlus2018RFSignal;

  async onRFInit() {
    await super.onRFInit();

    // This doorbell only has an address
    this.homey.flow
      .getDeviceTriggerCard('SP200689101:received')
      .registerRunListener(async (args, state) => {
        return true;
      });

    this.homey.flow
      .getActionCard('SP200689101:send')
      .registerRunListener(async ({ device }) => device.triggerDoorbell());
  }
};
