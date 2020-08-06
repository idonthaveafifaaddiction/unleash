'use strict';

const async = require('async');
const flexibleRollout = require('./flexible-rollout-strategy.json');

function insertStrategySQL(strategy) {
    return `
        INSERT INTO strategies (name, description, parameters, built_in)
        SELECT '${strategy.name}', '${strategy.description}', '${JSON.stringify(
        strategy.parameters,
    )}', 1
        FROM strategies
        WHERE
            NOT EXISTS (
                SELECT name FROM strategies WHERE name = '${strategy.name}'
        ) ON DUPLICATE KEY UPDATE description='${strategy.description}',
                        parameters = '${JSON.stringify(strategy.parameters)}';`;
}

function insertEventsSQL(strategy) {
    return `
        INSERT INTO events (type, created_by, data)
        SELECT 'strategy-created', 'migration', '${JSON.stringify(strategy)}'
        FROM strategies
        WHERE
            NOT EXISTS (
                SELECT name FROM strategies WHERE name = '${strategy.name}'
        );`;
}

function removeEventsSQL(strategy) {
    return `
        INSERT INTO events (type, created_by, data)
        SELECT 'strategy-deleted', 'migration', '${JSON.stringify(strategy)}'
        WHERE
            EXISTS (
                SELECT name FROM strategies WHERE name = '${
                    strategy.name
                }' AND built_in = 1
        );`;
}

function removeStrategySQL(strategy) {
    return `
        DELETE FROM strategies
        WHERE name = '${strategy.name}' AND built_in = 1`;
}

exports.up = function(db, callback) {
    async.series(
        [
            db.runSql.bind(db, insertEventsSQL(flexibleRollout)),
            db.runSql.bind(db, insertStrategySQL(flexibleRollout)),
        ],
        callback,
    );
};

exports.down = function(db, callback) {
    async.series(
        [
            db.runSql.bind(db, removeEventsSQL(flexibleRollout)),
            db.runSql.bind(db, removeStrategySQL(flexibleRollout)),
        ],
        callback,
    );
};
