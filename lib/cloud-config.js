const appConfig = {};
const getAppConfig = () => {
    return appConfig;
};

const setAppConfigKey = (key, value) => {
    if (key.startsWith('ENV.')) {
        const tempKey = key.replace('ENV.', '');
        process.env[tempKey] = value;
    }
    appConfig[key.trim()] = value.toString().trim();
};

module.exports = {
    getAppConfig,
    setAppConfigKey,
};
