'use strict';

const { RFSignal, RFUtil, RFError } = require('homey-rfdriver');

module.exports = class extends RFSignal {
  static FREQUENCY = '433';
  static ID = 'selectplus-2018';

  static commandToDeviceData(command) {
    return {
      address: command.address,
    };
  }

  static commandToPayload({address}) {
    if (typeof address !== 'string' || address.length !== 22) {
      throw new RFError(`Invalid Address: ${address}`);
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
     1,
    );
  }

  static payloadToCommand(payload) {
    if (payload && payload.length === 23) {
      const address = String(payload.slice(0, 22).join(''));
      const state = Boolean(payload.slice(22, 23)[0]);
      const id =  address;

      return {
        address,
        state,
        id
      };
    }
    return null;
  }
};
