'use strict';

const { RFSignal, RFUtil, RFError } = require('homey-rfdriver');

module.exports = class extends RFSignal {
  static FREQUENCY = '433';
  static ID = 'selectplus';

  static commandToDeviceData(command) {
    return {
      address: command.address,
    };
  }

  static commandToPayload({address}) {
    if (typeof address !== 'string' || address.length !== 16) {
      throw new RFError(`Invalid Address: ${address}`);
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
     1,
    );
  }

  static payloadToCommand(payload) {
    if (payload && payload.length === 17) {
      const address = String(payload.slice(0, 16).join(''));
      const state = Boolean(payload.slice(16, 17)[0]);
      const id =  address;

      return {
        address,
        state,
        id
      };
    }
    return null;
  }

  static createPairCommand() {
    const data = {
      address: RFUtil.generateRandomBitString(16),
      state: 0,
    };
    data.id = data.address;
    return data;
  }
};
