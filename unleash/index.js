'use strict';

const unleash = require('unleash-server');
const myCustomAdminAuth = require('./auth-hook.js');

let options = { adminAuthentication: 'custom', preRouteHook: myCustomAdminAuth };

unleash.start(options);
