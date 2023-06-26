'use strict';

const { RFDriver } = require('homey-rfdriver');
const PromaxRFSignal = require('../../lib/promax/PromaxRFSignal');

module.exports = class extends RFDriver {
  static SIGNAL = PromaxRFSignal;
};
