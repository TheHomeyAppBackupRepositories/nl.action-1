'use strict';

const { RFSignal, RFUtil, RFError, util } = require('homey-rfdriver');

module.exports = class extends RFSignal {
  static FREQUENCY = '433';
  static ID = 'eurodomest';

  static commandToDeviceData(command) {
    return {
      address: command.address,
      unit: command.unit,
    };
  }

  static commandToPayload({address, unit, state}) {
    if (typeof address !== 'string' || address.length !== 20) {
      throw new RFError(`Invalid Address: ${address}`);
    }

    if (typeof state !== 'boolean') {
      throw new RFError(`Invalid State: ${state}`);
    }

    if (typeof unit !== 'string' || unit.length !== 3) {
      throw new RFError(`Invalid Unit: ${unit}`);
    }

    return [].concat(
      RFUtil.bitStringToBitArray(address),
      RFUtil.bitStringToBitArray(unit),
      state ? 1 : 0,
    );
  }

  static payloadToCommand(payload) {
    if (payload && payload.length === 24) {
      const address = String(payload.slice(0, 20).join(''));
      let unit = String(payload.slice(20, 23).join(''));
      let state = Boolean(payload.slice(23, 24)[0]);
      const id =  `${address}:${unit}`;

      if (unit === '000') {
       state = false;
      } else if (unit === '001') {
        unit = '000';
        state = true;
      }

      return {
        address,
        unit,
        state,
        id
      };
    }
    return null;
  }

  static createPairCommand() {
    const data = {
      address: RFUtil.generateRandomBitString(20),
      unit: RFUtil.generateRandomBitString(3),
      state: false,
    };
    data.unit = (data.unit === '000' || data.unit === '001') ? '010' : data.unit;
    data.id = `${data.address}:${data.unit}`;
    return data;
  }
};
