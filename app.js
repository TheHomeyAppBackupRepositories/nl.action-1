'use strict';

const Homey = require('homey');

class Action extends Homey.App {
	
	onInit() {
		this.log('Action is running...');
	}
	
}

module.exports = Action;