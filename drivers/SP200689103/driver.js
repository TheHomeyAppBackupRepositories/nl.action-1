'use strict';

const { RFDriver } = require('homey-rfdriver');
const SelectPlusRFSignal = require('../../lib/selectplus/SelectPlusRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = SelectPlusRFSignal;

  async onRFInit() {
    await super.onRFInit();

    // This doorbell only has an address
    this.homey.flow
      .getDeviceTriggerCard('SP200689103:received')
      .registerRunListener(async (args, state) => {
        return true;
      });

    this.homey.flow
      .getActionCard('SP200689103:send')
      .registerRunListener(async ({ device }) => device.triggerDoorbell());
  }
};
