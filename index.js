var request = require('request');
var Promise = require('bluebird');

// Pushy API endpoint
var apiEndpoint = 'https://api.pushy.me';

// Package constructor
function Pushy(apiKey) {
    // Make sure the developer provided his/her API key
    if (!apiKey) {
        throw new Error('Please provide your API key to use this package.');
    }

    // Check for alphanumeric API key
    if (!apiKey.match(/^[0-9a-zA-Z]+$/)) {
        throw new Error('Please provide a valid, alphanumeric API key.');
    }

    // Save it for later
    this.apiKey = apiKey;
}

// Send Notifications API
Pushy.prototype.sendPushNotification = function (data, recipient, options, callback) {
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

        // Send push using the "request" package
        request(Object.assign({
            uri: that.getApiEndpoint() + '/push?api_key=' + that.apiKey,
            method: 'POST',
            json: postData
        }, that.extraRequestOptions || {}), function (err, res, body) {
            // Request error?
            if (err) {
                // Send to callback
                return reject(err);
            }

            // Missing body?
            if (!body) {
                return reject(new Error('An empty body was received from the Pushy API.'));
            }

            // Pushy error?
            if (body.error) {
                return reject(new Error(body.error));
            }

            // Check for 200 OK
            if (res.statusCode != 200) {
                return reject(new Error('An invalid response code was received from the Pushy API.'));
            }

            // Fetch push notification ID
            var pushId = body.id;

            // Callback?
            if (callback) {
                // Pass push ID to callback with a null error
                callback(null, pushId);
            }
            else {
                // Resolve the promise
                resolve(pushId);
            }
        });
    });
};

// Notification Deletion API
Pushy.prototype.deletePushNotification = function (pushId, callback) {
    // Keep track of instance 'this'
    var that = this;

    // Always return a promise
    return new Promise(function (resolve, reject) {
        // Custom callback provided?
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // No pushId provided?
        if (!pushId) {
            return reject(new Error('Please provide the notification ID you wish to delete.'));
        }

        // pushId must be an string
        if (typeof pushId !== 'string') {
            return reject(new Error('Please provide the notification ID as a string.'));
        }

        // Callback must be a function (if provided)
        if (callback && typeof callback !== 'function') {
            return reject(new Error('Please provide the callback parameter as a function.'));
        }

        // Delete push using the "request" package
        request(Object.assign({
            uri: that.getApiEndpoint() + '/pushes/' + pushId + '?api_key=' + that.apiKey,
            method: 'DELETE',
        }, that.extraRequestOptions || {}), function (err, res, body) {
            // Request error?
            if (err) {
                // Send to callback
                return reject(err);
            }

            // Check for 200 OK
            if (res.statusCode != 200) {
                return reject(new Error('An invalid response code was received from the Pushy API.'));
            }

            // Callback?
            if (callback) {
                // Invoke callback with a null error
                callback(null);
            }
            else {
                // Resolve the promise
                resolve();
            }
        });
    });
};

/**
 * Get the device tokens how subscribes the provided topic
 * @param {String} topic - The topic to fetch the subscribers for
 * @param {Function} callback - This call back functions should be invoked with the returned body from pushy.
 * @return {Promise}
 */
Pushy.prototype.getTopicSubscribers = function (topic, callback) {
    // Keep track of instance 'this'
    var that = this;

    return new Promise((resolve, reject) => {
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // Check the validity of topic
        if (!topic || typeof topic !== 'string') {
            return reject(new Error('Invalid topic name'));
        }

        // Build the endpoint URI.
        var endPoint = that.getApiEndpoint() + '/topics/' + topic + '?api_key=' + that.apiKey;

        // Make the request
        request.get(endPoint, that.extraRequestOptions, function (err, res, body) {

            // Request error?
            if (err) {
                // Send to callback
                return reject(err);
            }
            // Check for 200 OK
            if (res.statusCode != 200) {
                return reject(new Error('An invalid response code was received from the Pushy API.'));
            }

            // Callback?
            if (callback) {
                // Invoke callback with a body
                callback(null, res.body);
            }
            else {
                // Resolve the promise
                resolve(body);
            }
        });
    });
}

/**
 * Add provided token to subscribers list of a certain topic or a list of topics
 * @param {Array | String} topics
 * @param {String} token
 * @param {Function} callback
 * @returns {Promise}
 */
Pushy.prototype.subscribeTopics = function (topics, token,  callback) {
    var that = this;

    return new Promise(function (resolve, reject) {

        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // Build the endpoint URI.
        var endPoint = that.getApiEndpoint() + '/topics/subscribe/' + '?api_key=' + that.apiKey;

        var postBody = {};

        // Check topics and add it to the body.
        if (Array.isArray(topics)) {
            postBody.topics = topics;
        } else if (typeof topics === 'string') {
            postBody.topics = [topics]
        } else {
            return reject(new Error('[Invalid topics argument] Topics should be an array or a single topic string.'));
        }

        // Check token
        if (typeof token !== 'string') {
            reject(new Error('Invalid token'));
        }

        // add token to the post body
        postBody.token = token;

        request(
            Object.assign({
                uri: endPoint,
                method: 'POST',
                json: postBody
            }, that.extraRequestOptions || {}), function (err, res, body) {
                // Request error?
                if (err) {
                    // Send to callback
                    return reject(err);
                }

                // Missing body?
                if (!body) {
                    return reject(new Error('An empty body was received from the Pushy API.'));
                }

                // Pushy error?
                if (body.error) {
                    return reject(new Error(body.error));
                }

                // Check for 200 OK
                if (res.statusCode != 200) {
                    return reject(new Error('An invalid response code was received from the Pushy API.'));
                }

                // Callback?
                if (callback) {
                    // Pass push ID to callback with a null error
                    callback(null);
                }
                else {
                    // Resolve the promise
                    resolve();
                }
            });

   })


}

// Support for Pushy Enterprise
Pushy.prototype.setEnterpriseConfig = function (endpoint) {
    this.enterpriseEndpoint = endpoint;
}

// API endpoint selector
Pushy.prototype.getApiEndpoint = function () {
    return (this.enterpriseEndpoint) ? this.enterpriseEndpoint : apiEndpoint;
}

// Add extra options that will be passed to the request library
Pushy.prototype.setExtraRequestOptions = function (extraRequestOptions) {
    this.extraRequestOptions = extraRequestOptions;
}

// Expose the Pushy object
module.exports = Pushy;
