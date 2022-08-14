declare module 'pushy' {
    interface SendPushNotificationOptions {
        /**
         * Specifies how long (in seconds) the push notification should be kept if the device is offline.
         *
         * The default value is 1 month. The maximum value is 1 year.
         */
        time_to_live: number;

        /**
         * Schedule the notification for later by specifying a futuristic Unix timestamp (in seconds).
         *
         * Your scheduled time cannot exceed 1 year.
         */
        schedule: number;

        /**
         * Group notifications by specifying a collapse key. When specified, any undelivered notifications
         * pending for device(s) with the same collapse_key are discarded. Only the last message gets delivered
         * when connectivity can be re-established with the device.
         *
         * Collapse keys should not exceed 32 characters.
         */
        collapse_key: string;

        /** When set to true, your app's notification handler will be invoked even if the app is running
         * in the background, making it possible to fetch updated content from the server or execute other
         * custom logic without necessarily alerting the user.
         *
         * Requires the Background Modes -> Remote Notifications' capability to be enabled.
         */
        content_available: boolean;

        /** When set to true, your app's Notification Service Extension will be invoked even if the app is
         * running in the background, making it possible to download and display rich media attachments
         * within your notification.
         *
         * Requires the Background Modes -> Remote Notifications' capability to be enabled.
         */
        mutable_content: boolean;

        /**  iOS's notification options, such as the alert message, sound, or badge number. */
        notification: {
            /**
             * The main alert message, visible on the lock screen and in other areas on iOS.
             * Supports Apple Emojis via their unicode representation.
             */
            body: string;

            /**  The number to display as the badge of the app icon. */
            badge: number;

            /**
             * The filename of a sound in the app bundle or in the Library/Sounds folder of your app's data
             * container, or a sound dictionary object for critical alerts (iOS 12, more info) .
             */
            sound: unknown;

            /**  A short string describing the purpose of the notification, visible on Apple Watch and iOS 8.2+. */
            title: string;

            /**
             * Your app's Notification Content Extension with the matching category will be invoked in order to
             * display custom notification UI.
             */
            category: string;

            /**
             * The localization key of a string present in your app's Localizable.strings file.
             *
             * Use this parameter to localize the notification body. Refer to the APNs documentation for more
             * information.
             */
            loc_key: string;

            /**
             * The replacement strings to substitute in place of the %@ placeholders of the localization string
             * matching the specified loc_key.
             *
             * Use this parameter to localize the notification body. Refer to the APNs documentation for more
             * information.
             */
            loc_args: Array<string>;

            /**
             * The localization key of a string present in your app's Localizable.strings file.
             *
             * Use this parameter to localize the notification title. Refer to the APNs documentation for more
             * information.
             */
            title_loc_key: string;

            /**
             * The replacement strings to substitute in place of the %@ placeholders of the localization string
             * matching the specified title_loc_key.
             *
             * Use this parameter to localize the notification title. Refer to the APNs documentation for more
             * information.
             */
            title_loc_args: Array<string>;

            /**
             * Indicate the importance and delivery timing of a notification on iOS 15+, with possible values
             * of passive, active, time-sensitive, or critical.
             *
             * Defaults to active. Anything above active requires capabilities to be enabled in your Xcode
             * project. Refer to the APNs documentation for more information.
             */
            interruption_level: string;
        };
    }

    interface SendPushNotificationResult {
        /** Returned if the API request was successful.	 */
        success: boolean;

        /**
         * The push notification unique ID.
         *
         * Use it to check delivery status using the Notification Status API.
         */
        id: string;

        /**
         * Contains additional information about the notification, for debugging purposes.
         */
        info: {
            /**
             * The number of devices that will potentially receive the notification.
             */
            devices: number;

            /**
             * An array of invalid device tokens passed in which could not be found in our
             * database registered under the app with the Secret API Key used to authenticate this request.
             */
            failed: Array<string>;
        };
    }
    interface NotificationStatus {
        /** The creation date of the push notification (unix timestamp). */
        date: number;

        /** The push notification payload data. */
        payload: unknown;

        /** The push notification expiration date (unix timestamp). */
        expiration: number;

        /**
         * An array of device tokens that have not received the push notification yet.
         * Limited to a maximum of 1,000 tokens.
         */
        pending_devices: Array<string>;
    }

    interface DeviceInfo {
        /**  Metadata object for the device. */
        device: {
            /**  The device's registration date (unix timestamp). */
            date: number;

            /**  The device platform string identifier. */
            platform: 'android' | 'ios' | 'web' | 'electron' | 'python';
        };

        /** Information about the device's presence and last communication. */
        presence: {
            /** The device's current connectivity status. */
            online: boolean;

            /** The device's last communication info. */
            last_active: {
                /** The device's last communication date (unix timestamp). */
                date: number;

                /** The device's last communication, in seconds ago. */
                seconds_ago: number;
            };

            /** When returned, the iOS user has uninstalled your app
             * (detected only after sending a failed notification to the device).
             */
            uninstalled?: boolean;

            /**
             * When returned, the Web Push user has unsubscribed from notifications from your website
             * (detected only after sending a failed notification to the device).
             */
            unsubscribed?: boolean;
        };

        /**
         * Pending notifications that have not yet been delivered to the device.
         *
         * Only supported for Android & Electron devices.
         * iOS & Web Push make it impossible to track notification delivery and will always return an empty array.
         * */
        pending_notifications: Array<{
            /** The push notification's unique ID. */
            id: string;

            /** The creation date of the push notification (unix timestamp). */
            date: number;

            /** The push notification payload data. */
            payload: unknown;

            /** The push notification expiration date (unix timestamp). */
            expiration: number;
        }>;

        /** An array of topics the device is subscribed to. */
        subscriptions: Array<string>;
    }

    interface DevicePresenceInfo {
        /** The device token linked to this presence object. */
        id: string;

        /** The device's current connectivity status. */
        online: boolean;

        /** The device's last connection date (unix timestamp). */
        last_active: number;

        /**
         * When returned, the iOS user has uninstalled your app
         * (detected only after sending a failed notification to the device).
         */
        uninstalled?: boolean;

        /**
         * When returned, the Web Push user has unsubscribed from notifications from your website
         * (detected only after sending a failed notification to the device).
         */
        unsubscribed?: boolean;
    }

    interface TopicStatus {
        /** The Pub/Sub topic name. */
        name: string;

        /** The Pub/Sub topic subscriber count. */
        subscribers: number;
    }

    interface TopicSuscribers {
        /** Array of device tokens currently subscribed to the provided Pub/Sub topic, limited to 1,000 per page. */
        subscribers: Array<string>;

        /** A link to fetch the next page of results, in case there are more than 1,000 subscribers for this topic. */
        pagination: string;
    }

    export default class Pushy {
        constructor(apiKey: string);

        /**
         * Send push notification
         * @see {@link https://pushy.me/docs/api/send-notifications}
         *
         * @param data JSON notification data object
         * @param recipient one or array of device token OR one or array of topics
         * @param options Extra options for the notification
         *
         * @returns pushId
         */
        sendPushNotification(
            data: unknown,
            recipient: string | Array<string>,
            options?: Partial<SendPushNotificationOptions>,
            callback?: (error: Error | null, result: SendPushNotificationResult) => void
        ): Promise<SendPushNotificationResult>;

        /**
         * Check the delivery status of your push notifications to Android / Electron recipients.
         * @see {@link https://pushy.me/docs/api/notification-status}
         *
         * @param pushId
         */
        getNotificationStatus(
            pushId: string,
            callback?: (error: Error | null, status: NotificationStatus) => void
        ): Promise<NotificationStatus>;

        /**
         * Permanently delete a pending notification.
         * @see {@link https://pushy.me/docs/api/notification-deletion}
         *
         * @param pushId
         */
        deletePushNotification(pushId: string, callback?: (error: Error | null) => void): Promise<void>;

        /**
         * Check the presence and connectivity status of multiple devices.
         * @see {@link https://pushy.me/docs/api/device-presence}
         *
         * @param deviceTokens
         */
        getDevicePresence(
            deviceTokens: string | Array<string>,
            callback?: (error: Error | null, presence: Array<DevicePresenceInfo>) => void
        ): Promise<Array<DevicePresenceInfo>>;

        /**
         * Fetch device info, presence, undelivered notifications, and more by device token.
         *
         * @see {@link https://pushy.me/docs/api/device}
         *
         * @param deviceToken
         */
        getDeviceInfo(
            deviceToken: string,
            callback?: (error: Error | null, device: DeviceInfo) => void
        ): Promise<DeviceInfo>;

        /**
         * Subscribe a device to one or more topics.
         * @see {@link https://pushy.me/docs/api/pubsub-subscribe}
         *
         * @param topics
         * @param deviceToken
         */
        subscribe(
            topics: string | Array<string>,
            deviceToken: string,
            callback?: (error: Error | null) => void
        ): Promise<void>;

        /**
         * Unsubscribe a device from one or more topics.
         * @see {@link https://pushy.me/docs/api/pubsub-unsubscribe}
         *
         * @param topics
         * @param deviceToken
         */
        unsubscribe(
            topics: string | Array<string>,
            deviceToken: string,
            callback?: (error: Error | null) => void
        ): Promise<void>;

        /**
         * Retrieve a list of your app's topics and subscribers count.
         * @see {@link https://pushy.me/docs/api/pubsub-topics}
         */
        getTopics(): Promise<Array<TopicStatus>>;

        /**
         * Retrieve a list of devices subscribed to a certain topic.
         * @see {@link https://pushy.me/docs/api/pubsub-subscribers}
         *
         * @param topic The Pub/Sub topic to retrieve subscribers for. Topics are case-sensitive and must match the following regular expression: [a-zA-Z0-9-_.]+.
         */
        getSubscribers(
            topic: string,
            callback?: (error: Error | null, subscribers: TopicSuscribers) => void
        ): Promise<TopicSuscribers>;
    }
}
