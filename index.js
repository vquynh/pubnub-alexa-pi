require('dotenv').load();	// This loads the environment from hidden file '.env'
var PubNub = require('pubnub'); // Use the Pubnub SDK
var pins = require('bonescript'); // Required for GPIO switching

//LEDs connected to these GPIO pins
HALL_LIGHT = "P8_13"
KITCHEN_LIGHT = "P8_15"
BEDROOM_LIGHT = "P8_17"
var leds = [HALL_LIGHT, KITCHEN_LIGHT, BEDROOM_LIGHT];

try
{
	//Set mode for all GPIO used as output
	for (var i in leds){
		pins.pinMode(leds[i], pins.OUTPUT);
	}

	// Switch off all LEDs initially
	var state = pins.LOW;
	for (var i in leds){
		pins.digitalWrite(leds[i], state);
	}
}
catch (err)
{
	console.log ("Exception occured while setting up GPIO ", err);
}


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
				if (device.includes("hall light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = HALL_LIGHT;
					pin_value = pins.HIGH;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else if (device.includes("kitchen light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = KITCHEN_LIGHT;
					pin_value = pins.HIGH;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else if (device.includes("bedroom light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = BEDROOM_LIGHT;
					pin_value = pins.HIGH;
					pins.digitalWrite(gpio_pin, pin_value);
				}				
				else
				{
					console.log ("Invalid device:   " + device);
				}
			}
			else if (cmd === 'TURN_OFF')
			{
				if (device.includes("hall light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = HALL_LIGHT;
					pin_value = pins.LOW;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else if (device.includes("kitchen light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = KITCHEN_LIGHT;
					pin_value = pins.LOW;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else if (device.includes("bedroom light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = BEDROOM_LIGHT;
					pin_value = pins.LOW;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else
				{
					console.log ("Invalid device:  " + device);
				}								
			}
			else if (cmd === 'SET_VALUE') // TODO: process set value command
			{
				console.log ("Recd setting value command");
				console.log ("Not handled setting value");
			}
			else
			{
				console.log ("Invalid command:   " + cmd);
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