'use strict';

require('db-migrate-shared').log.setLogLevel('debug');

const { getInstance } = require('db-migrate');

function migrateDb({ db, databaseSchema = 'public' }) {
    const custom = { ...db, schema: databaseSchema, multipleStatements: true };
    const dbmigrate = getInstance(true, {
        cwd: __dirname,
        config: { custom },
        env: 'custom',
    });
    return dbmigrate.up();
}

module.exports = migrateDb;
