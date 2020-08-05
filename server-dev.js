'use strict';

const unleash = require('./lib/server-impl');

unleash.start({
    db: {
        user: 'root',
        host: 'localhost',
        port: 3306,
        database: 'unleash',
        ssl: false,
    },
    enableRequestLogger: true,
});
