// Change to require('pushy') to use this code in your own project
var Pushy = require('../');

// Plug in your Secret API Key
// Get it from the Pushy Dashboard: https://dashboard.pushy.me/apps
var pushy = new Pushy('SECRET_API_KEY');

// Fetch device info, presence, undelivered notifications, and more by device token
pushy.getDeviceInfo('DEVICE_TOKEN', function (err, deviceInfo) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log device info
    console.log('Device Info: ', JSON.stringify(deviceInfo, null, 2));
});

// Check the presence and connectivity status of multiple devices
pushy.getDevicePresence(['DEVICE_TOKEN', 'DEVICE_TOKEN_2'], function (err, devicePresence) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log device presence array
    console.log('Device Presence: ', JSON.stringify(devicePresence, null, 2));
});