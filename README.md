# Pubnub subscribing code
This project conatins node js code to run on beaglebone black for subscribing to Pubnub channel. This is part of the code supporting my blog post  ** Voice controlled home automation using Alexa and Pubnub **

* Clone the repository
* Install required dependencies
```shell
 npm install
 ```
* Create a .env file in the same folder with following contents:
  * PUB_NUB_CHANNEL_KEY=alexa_world
  * PUB_NUB_SUBSCRIBE_KEY=YOUR_PUBNUB_SUBSCRIBE_KEY
* Run the code with either
```
npm start
```
OR
```
node index.js
```
* You should see message on console like:
```
Subscribing to channel alexa_world
```
* Start testing with the alexa app and you should see messages on your console
* If you connect LEDs on GPIOs (8_13, 8_15 and 8_17), you should see then turn on/off in response to voice commands spoken into the alexa app.

For details, refer to my blog post on https://abszeroblog.wordpress.com/
