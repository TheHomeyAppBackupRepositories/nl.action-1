'use strict';

const { RFSignal, RFError } = require('homey-rfdriver');
const PromaxPayload = require('./PromaxPayload');

module.exports = class extends RFSignal {
  static FREQUENCY = '433';
  static ID = 'promax';

  static commandToDeviceData(command) {
    return {
      address: command.address,
      count: command.count,
      unit: command.unit
    };
  }

  static commandToPayload({
                            address,
                            unit,
                            state,
                            count,
                          }) {
    if (typeof address !== 'number') {
      throw new RFError(`Invalid Address: ${address}`);
    }

    if (typeof state !== 'boolean' && typeof state !== 'number') {
      throw new RFError(`Invalid State: ${state}`);
    }

    if (typeof count !== 'number') {
      throw new RFError(`Invalid Count: ${count}`);
    }

    if (typeof unit !== 'number') {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    return PromaxPayload.encryptPayload({address, unit, state, count});
  }

  static payloadToCommand(payload) {
    if (payload.length === 28) {
      const data = PromaxPayload.decryptPayload(payload); // Returns device data in raw form
      data.id = `${data.address}:${data.unit}`;
      return data;
    }
    return null;
  }

  static createPairCommand() {
    const data = {
      address: Math.round(Math.random() * 65535),
      count: 0,
      unit: Math.round(Math.random() * 3),
      state: true,
    };
    data.id = `${data.address}:${data.unit}`;
    return data;
  }
};
