/* eslint camelcase: "off" */

'use strict';

exports.up = function(db, cb) {
    db.runSql(
        `
        CREATE TABLE context_fields
        (
            name         VARCHAR(255) PRIMARY KEY NOT NULL,
            description  TEXT,
            sort_order   INTEGER   DEFAULT 10,
            legal_values TEXT,
            created_at   TIMESTAMP DEFAULT now(),
            updated_at   TIMESTAMP DEFAULT now()
        );
        INSERT INTO context_fields(name, description, sort_order)
        VALUES ('environment', 'Allows you to constrain on application environment', 0);
        INSERT INTO context_fields(name, description, sort_order)
        VALUES ('userId', 'Allows you to constrain on userId', 1);
        INSERT INTO context_fields(name, description, sort_order)
        VALUES ('appName', 'Allows you to constrain on application name', 2);
    `,
        cb,
    );
};

exports.down = function(db, cb) {
    return db.dropTable('context_fields', cb);
};
