var axios = require('axios');

// Send Notifications API
module.exports = function (data, recipient, options, callback) {
    // Keep track of instance 'this'
    var that = this;

    // Support empty options
    options = options || {};

    // Always return a promise
    return new Promise(function (resolve, reject) {
        // Custom callback provided?
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // No data provided?
        if (!data) {
            return reject(new Error('Please provide the push payload to send to devices.'));
        }

        // Data must be an object
        if ((Object.prototype.toString.call(data) !== '[object Object]')) {
            return reject(new Error('Please provide the push payload as an object.'));
        }

        // No recipient provided?
        if (!recipient) {
            return reject(new Error('Please provide the notification recipient.'));
        }

        // Options must be an object
        if (Object.prototype.toString.call(options) !== '[object Object]') {
            return reject(new Error('Please provide the options parameter as an object.'));
        }

        // Prepare JSON post data (defaults to options object)
        var postData = options;

        // Set payload and device tokens
        postData.data = data;

        // Recipient provided as string?
        if (typeof recipient === 'string' || Array.isArray(recipient)) {
            // Set "to" parameter
            postData.to = recipient;
        }
        else {
            // Invalid recipient type
            return reject(new Error('Please provide the notification recipient as a string or an array of strings.'));
        }

        // Callback must be a function (if provided)
        if (callback && typeof callback !== 'function') {
            return reject(new Error('Please provide the callback parameter as a function.'));
        }

        // Make a request to the Send Notifications API
        axios(
            Object.assign({
                url: that.getApiEndpoint() + '/push?api_key=' + that.apiKey,
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

                // Callback?
                if (callback) {
                    // Pass response body to callback with a null error
                    callback(null, body);
                }
                else {
                    // Resolve the promise with response body
                    resolve(body);
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
};