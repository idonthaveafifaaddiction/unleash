/* eslint camelcase: "off" */

'use strict';

exports.up = function(db, cb) {
    db.runSql(
        `
            CREATE TABLE client_applications
            (
                app_name    VARCHAR(255) PRIMARY KEY NOT NULL,
                created_at  TIMESTAMP DEFAULT now(),
                updated_at  TIMESTAMP DEFAULT now(),
                seen_at     TIMESTAMP,
                strategies  JSON,
                description VARCHAR(255),
                icon        VARCHAR(255),
                url         VARCHAR(255),
                color       VARCHAR(255));`,
        cb,
    );
};

exports.down = function(db, cb) {
    return db.dropTable('client_applications', cb);
};
