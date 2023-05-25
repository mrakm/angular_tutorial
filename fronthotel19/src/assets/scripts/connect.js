(function () {
    const LOADED_EVENT_TYPE = 'Verix:Loaded';
    const SUCCESS_EVENT_TYPE = 'Verix:Success';
    const CANCEL_EVENT_TYPE = 'Verix:Cancel';
    const CLOSE_EVENT_TYPE = 'Verix:Close';
    const PREPOPULATE_DATA_EVENT_TYPE = 'Verix:PrepopulateData';
    const VERIX_DOMAIN_REGEX = /(https:\/\/([a-zA-Z0-9-]+\.)?(connect\.verixapi\.com)((\/.*)?))/i;
    const HEROKU_DOMAIN_REGEX = /(https:\/\/([a-zA-Z0-9-]+\.)?(herokuapp\.com)((\/.*)?))/i;
    const VERIX_TEST_DOMAIN_REGEX = /http:\/\/localhost/i;
    const DEFAULT_ENVIRONMENT = 'sandbox';
    const DEFAULT_HOSTNAME = 'https://connect.verixapi.com';
    const VERSION_NUMBER = 'c83a19d';

    window.Verix = function (configuration) {
        const eventCallbacks = {};
        let element;
        let frame;

        function receiveMessages(event) {
            const origin = event.origin || event.originalEvent.origin;
            if (!isValidEventOrigin(origin)) { return; }

            if (!isValidEventType(event.data.eventType)) { return; }

            if (event.data.eventType === SUCCESS_EVENT_TYPE) {
                notifySuccessListeners(event.data);
            } else if (event.data.eventType === CANCEL_EVENT_TYPE) {
                notifyCancelListeners(event.data);
            } else if (event.data.eventType === CLOSE_EVENT_TYPE) {
                close();
            } else if (event.data.eventType === LOADED_EVENT_TYPE) {
                if (configuration && configuration.optionalData) {
                    sharePrepopulateData(event.source, configuration.optionalData);
                }
            }
        }

        function addEventCallback(eventType, callback) {
            if (typeof callback === 'function') {
                eventCallbacks[eventType] = eventCallbacks[eventType] || [];
                eventCallbacks[eventType].push(callback);
                return true;
            }
            return false;
        };

        function notifyCancelListeners(data) {
            notifyListeners(CANCEL_EVENT_TYPE, data);
            close();
        };

        function notifySuccessListeners(data) {
            notifyListeners(SUCCESS_EVENT_TYPE, data);
        }

        function isValidEventOrigin(origin) {
            return origin && (VERIX_DOMAIN_REGEX.test(origin) ||
                VERIX_TEST_DOMAIN_REGEX.test(origin) ||
                HEROKU_DOMAIN_REGEX.test(origin));
        }

        function isValidEventType(eventType) {
            return (eventType === LOADED_EVENT_TYPE ||
                eventType === SUCCESS_EVENT_TYPE ||
                eventType === CANCEL_EVENT_TYPE ||
                eventType == CLOSE_EVENT_TYPE);
        }

        function notifyListeners(eventType, data) {
            if (eventCallbacks[eventType]) {
                const listeners = eventCallbacks[eventType];
                for (let i = 0; i < listeners.length; i++) {
                    listeners[i](data);
                }
            }
        };

        function sharePrepopulateData(source, data) {
            source.postMessage({
                eventType: PREPOPULATE_DATA_EVENT_TYPE,
                name: data.name,
                mobileNumber: data.mobileNumber,
                socialSecurityNumber: data.socialSecurityNumber,
                birthdate: data.birthdate,
                filingAddress: data.filingAddress,
                filingStatus: data.filingStatus,
                accountType: data.accountType,
                accountNumber: data.accountNumber,
                externalUserId: data.externalUserId
            }, '*');
        }

        function listen() {
            window.addEventListener("message", receiveMessages, false);
        }

        function close() {
            if (element) {
                element.parentNode.removeChild(element);
                element = null;
            }
        }

        function initialize() {
            listen();
        }

        var object = {
          success: function(callback) {
                return addEventCallback(SUCCESS_EVENT_TYPE, callback);
            },
          cancel: function(callback) {
                return addEventCallback(CANCEL_EVENT_TYPE, callback);
            },
          launch: function() {
                if (element) { return element; }

                const iframe = document.createElement('iframe');
                const environment = configuration.environment ? configuration.environment : DEFAULT_ENVIRONMENT;
                const hostname = configuration.hostname ? configuration.hostname : DEFAULT_HOSTNAME;
                const url = hostname + '/connect' + '?client_id=' + configuration.clientId + '&environment=' + environment + '&version=' + VERSION_NUMBER;
                iframe.src = url;
                frame = iframe;

                const modalContent = document.createElement('div');
                modalContent.className = 'verix-connect-modal-content';
                modalContent.appendChild(iframe);

                const modal = document.createElement('div');
                modal.className = 'verix-connect-modal verix-connect-show-modal';
                modal.appendChild(modalContent);
                element = modal;

                document.body.appendChild(modal);

                return element;
            }
        };

        initialize();
        return object;
    };
})();
