require('dotenv').load();	// This loads the environment from hidden file '.env'
var PubNub = require('pubnub'); // Use the Pubnub SDK
const raspi = require('raspi-io');
const pwm = require('raspi-pwm');
const five = require('johnny-five');
const board = new five.Board({
  io: new raspi()
});

//LEDs connected to these GPIO pins
LIGHT_ONE = "P1_11"
LIGHT_TWO = "P1_13"
LIGHT_THREE = "P1_15"

var leds = [LIGHT_ONE, LIGHT_TWO, LIGHT_THREE];

try
{
	// Instantiate a new Pubnub. Only Subscribe is needed. We will not publish.
	var pn = new PubNub({
		subscribeKey: process.env.PUB_NUB_SUBSCRIBE_KEY,
		ssl: true
	});
	
	// A listener event fired when a message is received on subscribed channel
	pn.addListener({
		message: function (m)
		{
			var msg = m.message;
			var cmd = msg['command'];
			var device = msg ['gadget'];
			// TODO: Add error checks if cmd and device exist
			
			//console.log ("Message recd: ", msg);
			console.log ("Command recd: ", cmd);
			console.log ("Device : ", device);
				
			if (cmd === 'TURN_ON')
			{
				if (device.includes("light one"))
				{
					console.log (msg['message'] + ' ' + device);
					raspi.init(() => {
  						const led = new pwm.PWM(LIGHT_ONE);
  						led.write(0.5); // 50% Duty Cycle, aka half brightness
					});
				}
				else
				{
					console.log ("Invalid device:   " + device);
				}
			}
			else if (cmd === 'TURN_OFF')
			{
				if (device.includes("light one"))
				{
					console.log (msg['message'] + ' ' + device);
					raspi.init(() => {
  						const led = new pwm.PWM(LIGHT_ONE);
  						led.write(0.5); // 50% Duty Cycle, aka half brightness
					});
					gpio_pin = LIGHT_ONE;
					pin_value = pins.LOW;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else
				{
					console.log ("Invalid device:  " + device);
				}								
			}
		}
	});
	
	console.log ('Subscribing to channel: ', process.env.PUB_NUB_CHANNEL_KEY);
	
	// Subscribe to channel so the listener is fired on receiving message
	// Channel name picked up from .env file
	pn.subscribe({
		channels: [process.env.PUB_NUB_CHANNEL_KEY]
	});
}
catch (err)
{
	console.log ('Exception occured processing Pubnub ', err);
}
