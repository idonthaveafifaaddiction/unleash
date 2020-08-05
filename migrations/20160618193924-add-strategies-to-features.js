'use strict';

exports.up = function(db, callback) {
    db.runSql(
        `
ALTER TABLE features ADD strategies json;

# UPDATE features
# SET strategies = ('[{"name":"'||f.strategy_name||'","parameters":'||f.parameters||'}]')::json
# FROM features as f
# WHERE f.name = features.name;

ALTER TABLE features DROP COLUMN strategy_name;
ALTER TABLE features DROP COLUMN parameters;
       `,
        callback,
    );
};

exports.down = function(db, callback) {
    db.runSql(
        `
ALTER TABLE features ADD parameters json;
ALTER TABLE features ADD strategy_name varchar(255);


ALTER TABLE features DROP COLUMN "strategies";
    `,
        callback,
    );
};
