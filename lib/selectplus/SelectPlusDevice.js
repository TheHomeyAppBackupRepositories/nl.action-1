'use strict';

const { RFDevice } = require('homey-rfdriver');

const DOORBELL_TIMEOUT = 4000;

module.exports = class extends RFDevice {

  static RX_ENABLED = true;

  async onRFInit() {
    await super.onRFInit();

    // Disable the alarm if it was enabled
    this.setCapabilityValue('alarm_generic', false)
      .catch(this.error);

    this.deviceTimeout = null;

    this.isDoorbellTriggered = false;
    this.doorbellFlowTimeout = null;
  }

  async onUninit() {
    if (this.deviceTimeout) {
      this.homey.clearTimeout(this.deviceTimeout);
    }

    if (this.doorbellFlowTimeout) {
      this.homey.clearTimeout(this.doorbellFlowTimeout);
    }

    await super.onUninit();
  }

  async onCommandMatch(command) {
    if (command === undefined || command === null) {
      return false;
    }

    const { address } = this.getData();
    return address === command.address;
  }

  /**
   * Triggers the Doorbell flow
   *
   * @returns {Promise<void>}
   */
  async onCommandFirst() {
    if (!this.isDoorbellTriggered) {
      this.isDoorbellTriggered = true;

      this.doorbellTriggered()
        .catch(this.error);

      this.doorbellFlowTimeout = this.homey.setTimeout(() => {
        this.isDoorbellTriggered = false;
      }, DOORBELL_TIMEOUT);

      this.setCapabilityValue('alarm_generic', true)
        .catch(this.error);

      this.resetAlarm();
    }
  }

  /**
   * Resets the alarm after 4 seconds
   */
  resetAlarm() {
    if (this.deviceTimeout) {
      this.homey.clearTimeout(this.deviceTimeout);
    }
    this.deviceTimeout = this.homey.setTimeout(() => {
      this.setCapabilityValue('alarm_generic', false)
        .catch(this.error);
    }, DOORBELL_TIMEOUT);
  }

  /**
   * Override Doorbell triggered Flow
   */
  doorbellTriggered() {

  }

  /**
   *
   * Custom function to trigger the doorbell
   *
   * @returns {Promise<void>}
   */
  async triggerDoorbell() {
    const { address } = this.getData();

    await this.driver.tx({
      address,
    }, { device: this });
  }

};
