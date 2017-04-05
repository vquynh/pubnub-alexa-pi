require('dotenv').load();	// This loads the environment from hidden file '.env'
var PubNub = require('pubnub'); // Use the Pubnub SDK
var pins = require('bonescript'); // Required for GPIO switching

//LEDs connected to these GPIO pins
GARAGE_LIGHT = "P8_13"
DRAWING_ROOM_LIGHT = "P8_15"
BEDROOM_LIGHT = "P8_17"

//Servo motor 
GARAGE_DOOR = "P9_21"
// Typical servo motor operating at 50Hz
SERVO_FREQ_HZ = 50  // Servo frequency (20 ms)

var leds = [DRAWING_ROOM_LIGHT, GARAGE_LIGHT, BEDROOM_LIGHT];
var doors = [GARAGE_DOOR];	//We can add more servo motors later to control different doors

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

    	//Set the pin as analog output to use PWM for servo motor
	for (var i in doors)
    	{
		pins.pinMode(doors[i],pins.ANALOG_OUTPUT, 6, 0, 0, doInterval);	
    	}

    	function doInterval(x) {
    	if(x.err) {
        	console.log('x.err = ' + x.err);
        	return;
    	}
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
				if (device.includes("drawing room light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = DRAWING_ROOM_LIGHT;
					pin_value = pins.HIGH;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else if (device.includes("garage light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = GARAGE_LIGHT;
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
				if (device.includes("drawing room light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = DRAWING_ROOM_LIGHT;
					pin_value = pins.LOW;
					pins.digitalWrite(gpio_pin, pin_value);
				}
				else if (device.includes("garage light"))
				{
					console.log (msg['message'] + ' ' + device);
					gpio_pin = GARAGE_LIGHT;
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
			else if (cmd === 'OPEN_DOOR')
			{
				if (device.includes("garage door"))
				{
					console.log (msg['message'] + ' ' + device);
					move (0.8);
					
					
				}
				else
				{
					console.log ("Invalid device:  " + device);
				}								
			}
			else if (cmd === 'CLOSE_DOOR')
			{
				if (device.includes("garage door"))
				{
					console.log (msg['message'] + ' ' + device);
					move (2.5);
					
					
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

function move(pos) {
    var dutyCycle = pos/1000*SERVO_FREQ_HZ;
    pins.analogWrite(GARAGE_DOOR, dutyCycle, SERVO_FREQ_HZ);
    console.log('pos = ' + pos + ' duty cycle = ' + dutyCycle);
}
