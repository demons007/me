var twilio = require('twilio');

var client = twilio('AC13c142cc4ef2d2f65314c7157e111b0f', '6c22f73ee2094dac2f5f3cc6340746de');

console.log(client.sendMessage)

client.sendMessage({to: '+919831296420',from: '+12053407042',body: 'Hello from Twilio!'},function(success,error){console.log(success);});