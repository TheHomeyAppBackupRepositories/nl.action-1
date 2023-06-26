'use strict';

const { RFDriver } = require('homey-rfdriver');
const EurodomestRFSignal = require('../../lib/eurodomest/EurodomestRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = EurodomestRFSignal;
};
