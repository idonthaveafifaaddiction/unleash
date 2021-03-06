'use strict';

const cloudClient = require('cloud-config-client');
const unleash = require('./lib/server-impl');
const cloudConfig = require('./lib/cloud-config');
const enableCopartOauth = require('./lib/auth/copart-auth-hook');

if (!process.env.CONFIGSERVER_NAME) {
    throw new Error(`Unleash config server name CONFIGSERVER_NAME to start`);
} else if (process.env.CONFIGSERVER_NAME.indexOf('http') < 0) {
    process.env.CONFIGSERVER_NAME = `http://${process.env.CONFIGSERVER_NAME}`;
}
if (!process.env.CLOUD_CONFIG_USER) {
    throw new Error(`Unleash config user CLOUD_CONFIG_USER to start`);
}
if (!process.env.CONFIGSERVER_PASSWORD) {
    throw new Error(
        `Unleash config server password CONFIGSERVER_PASSWORD to start`,
    );
}
const configParams = {
    application: process.env.APP ? process.env.APP : 'unleash',
    endpoint: process.env.CONFIGSERVER_NAME
        ? process.env.CONFIGSERVER_NAME
        : '',
    profiles: process.env.PROFILES ? process.env.PROFILES.split(',') : [],
    auth: {
        user: process.env.CLOUD_CONFIG_USER
            ? process.env.CLOUD_CONFIG_USER
            : '',
        pass: process.env.CONFIGSERVER_PASSWORD
            ? process.env.CONFIGSERVER_PASSWORD
            : '',
    },
};
cloudClient.load(configParams).then(config => {
    config.forEach((key, value) => cloudConfig.setAppConfigKey(key, value));
    unleash.start({
        adminAuthentication: 'custom',
        preRouterHook: enableCopartOauth,
    });
});
