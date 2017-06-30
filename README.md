# Home automation demo on Raspberry using Alexa and PubNub
This project conatins node js code to run on raspberry pi for subscribing to Pubnub channel. This is one part of the project **Voice controlled home automation using Alexa and PubNub** where raspberry pi catch the message from pubnub and execute it on the pins.
The other part includes functions for the alexa skill to work with user voice and message publishing to the subcribed pubnub channel.

Steps to follow:

* Clone the repository
* Install required dependencies
```shell
 npm install
 ```
 If you want to install modules locally only specific for the project, use the --save option. 
 ```shell
 npm install --save
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
* If you connect LEDs on GPIOs (1_11, 1_13 and 1_15), you should see then turn on/off in response to voice commands spoken into the alexa app.

For more details on the original project from Gopal Amlekar on how to automate your home with voice using alexa, beaglebone, pubnub and raspberry pi, refer to the author's blog post on https://abszeroblog.wordpress.com/
