\echo 'Delete and recreate life tracker db?'
\prompt 'Return for yes or control-C to cancel >' answer 

DROP DATABASE IF EXISTS life_tracker; --will see an error first time running this bc we don't have a db to drop
CREATE DATABASE life_tracker;
\connect life_tracker;

\i life-tracker-schema.sql --executes that schema 
\i life-tracker-seed.sql