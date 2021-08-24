// Change to require('pushy') to use this code in your own project
var Pushy = require('..');


// Plug in your Secret API Key
// Get it here: https://dashboard.pushy.me/
var pushy = new Pushy('SECRET_API_KEY');


// Fetch device info, presence, undelivered notifications, and more by device token.
pushy.getDeviceInfo('DEVICE_TOKEN', (err, deviceInfo) => {

    // Log errors to console
    if (err) {
        console.log(err);
    }

    // Log Device Information
    console.log('Device Info: ', deviceInfo);
});