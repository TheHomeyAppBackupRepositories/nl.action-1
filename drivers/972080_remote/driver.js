'use strict';

const { RFDriver } = require('homey-rfdriver');
const EurodomestRFSignal = require('../../lib/eurodomest/EurodomestRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = EurodomestRFSignal;

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('972080_remote:received')
      .registerRunListener(async (args, state) => {
        return (args.state === '1') === state.state
          && args.unit === state.unit;
      });
  }
};
