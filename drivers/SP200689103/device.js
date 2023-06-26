'use strict';

const SelectPlusDevice = require('../../lib/selectplus/SelectPlusDevice');

module.exports = class extends SelectPlusDevice {
  /**
   * Doorbell triggered Flow
   */
  doorbellTriggered() {
    return this.homey.flow.getDeviceTriggerCard('SP200689103:received')
      .trigger(this);
  }
};
