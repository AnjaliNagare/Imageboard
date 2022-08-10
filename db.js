const spicedPg = require("spiced-pg");

const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");

const DATABASE_NAME = "imageboard";

const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

function getData() {
    return db
        .query("SELECT * FROM images")
        .then((result) => result.rows);
}

module.exports = {
    getData,
};
