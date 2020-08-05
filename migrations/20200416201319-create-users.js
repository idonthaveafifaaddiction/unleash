/* eslint camelcase: "off" */

'use strict';

exports.up = function(db, cb) {
    db.runSql(
        `
        CREATE TABLE users
        (
            id             INTEGER AUTO_INCREMENT NOT NULL,
            name           VARCHAR(255),
            username       VARCHAR(255) UNIQUE,
            system_id      VARCHAR(255),
            email          VARCHAR(255) UNIQUE,
            image_url      VARCHAR(255),
            password_hash  VARCHAR(255),
            login_attempts INTEGER   DEFAULT 0,
            created_at     TIMESTAMP DEFAULT now(),
            seen_at        TIMESTAMP,
            CONSTRAINT users_pk PRIMARY KEY (id)
        );
    `,
        cb,
    );
};

exports.down = function(db, cb) {
    return db.dropTable('users', cb);
};
