'use strict';

const { RFDriver } = require('homey-rfdriver');
const ImpulsRFSignal = require('../../lib/impuls/ImpulsRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = ImpulsRFSignal;

  async onRFInit() {
    await super.onRFInit();

    this.homey.flow
      .getDeviceTriggerCard('EL-COCO20R:received')
      .registerRunListener(async (args, state) => {
        return (args.state === '1') === state.state
          && args.unit === state.unit;
      });
  }
};
