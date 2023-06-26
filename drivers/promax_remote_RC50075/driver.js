'use strict';

const { RFDriver } = require('homey-rfdriver');
const PromaxRFSignal = require('../../lib/promax/PromaxRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = PromaxRFSignal;

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('promax_remote_RC50075:received')
      .registerRunListener(async (args, state) => {
        return (args.state === '1') === state.state
          && Number(args.unit) === state.unit;
      });
  }
};
