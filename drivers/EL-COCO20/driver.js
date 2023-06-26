'use strict';

const { RFDriver, RFUtil } = require('homey-rfdriver');
const ImpulsRFSignal = require('../../lib/impuls/ImpulsRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = ImpulsRFSignal;

  async onPair(session) {
    session.setHandler('showView', async viewId => {
      switch (viewId) {
        case 'rf_transmitter_learn': {
          await this.onPairRFTransmitter(session);
          break;
        }
        case 'rf_dipswitch': {
          await this.onPairRFReceiverDipSwitch(session);
          break;
        }
        default: {
          // Do Nothing
        }
      }
    });
  }

  async onPairRFReceiverDipSwitch(session) {
    let switchesArray;
    const signal = await this.getRFSignal();

    session.setHandler('setDeviceSwitches', async (data) => {
      switchesArray = data;
    });

    session.setHandler('createDevice', async () => {
      if (!switchesArray) {
        throw new Error('Unable to create the device.');
      }
      const name = (this.manifest && this.manifest.name) ? this.homey.__(this.manifest.name) : this.id;

      return {
        name,
        data: {
          uuid: RFUtil.generateUUIDv4(),
          ...signal.constructor.createDipswitchCommand(switchesArray),
        },
      };
    });
  }
};
