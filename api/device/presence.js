var axios = require('axios');

// Device Presence API
module.exports = function (deviceTokens, callback) {
    // Keep track of instance 'this'
    var that = this;

    // Always return a promise
    return new Promise(function (resolve, reject) {
        // Custom callback provided?
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // Topics passed in must be in string or array format
        if (!Array.isArray(deviceTokens)) {
            // In case a single token was passed in, convert to array
            if (typeof deviceTokens === 'string') {
                deviceTokens = [deviceTokens];
            }
            else {
                // Throw error for all other input types
                return reject(new Error('Please provide the device token parameter as an array of strings.'));
            }
        }

        // Validate every device token to be a string
        for (var deviceToken of deviceTokens) {
            if (typeof deviceToken !== 'string') {
                return reject(new Error('Please ensure all device tokens passed in are strings.'));
            }
        }

        // Prepare JSON post data
        var postData = {};

        // Add devices tokens to the post body
        postData.tokens = deviceTokens;

        // Make a request to the Device Presence API
        axios(
            Object.assign({
                url: that.getApiEndpoint() + '/devices/presence' + '?api_key=' + that.apiKey,
                method: 'POST',
                data: postData
            }, that.extraRequestOptions || {})).then(function (res) {
                // API response
                var body = res.data;

                // Missing body?
                if (!body) {
                    return reject(new Error('An empty body was received from the Pushy API.'));
                }

                // Pushy error?
                if (body.error) {
                    return reject(new Error(body.error));
                }

                // Check for 200 OK
                if (res.status != 200) {
                    return reject(new Error('An invalid response code was received from the Pushy API.'));
                }

                // Fetch result
                var devicePresence = body.presence;

                // Callback?
                if (callback) {
                    // Invoke callback with device presence result
                    callback(null, devicePresence);
                }
                else {
                    // Resolve the promise
                    resolve(devicePresence);
                }
            }).catch(function (err) {
                // Invoke callback/reject promise with Pushy error
                if (err.response && err.response.data) {
                    reject(err.response.data);
                }
                else {
                    reject(err);
                }
            });
    });
}