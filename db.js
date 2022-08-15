const spicedPg = require("spiced-pg");

const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");

const DATABASE_NAME = "imageboard";

const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

function getImages() {
    return db
        .query(
            `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 12`
        ).then((result) => result.rows);
}

function createImage({url, username, title, description}) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
            VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, username, title, description]
    )
        .then((result) => result.rows[0]);
}

function getImageById(id) {
    return db.query(`
    SELECT * FROM images where id = $1`,[id])
        .then((result) => result.rows[0]);
}

function addComment({image_id, username, text}) {
    return db
        .query(
            `INSERT INTO comments (image_id, username, text) VALUES ($1,$2,$3) returning *`,
            [image_id, username, text]
        )
        .then((comments) => {
            return comments.rows[0];
        });
}


function getCommentsByImageId(image_id){
    return db
        .query(`SELECT * FROM comments WHERE image_id = $1`, [image_id])
        .then((result) => {
            return result.rows;
        });
}

function getmoreImages({ limit, lastId}) {
    return db
        .query(`SELECT * FROM images where id > $1
    ORDER BY id DESC LIMIT &2`,[limit,lastId])
        .then((result) => result.rows);
}

module.exports = {
    getImages,
    createImage,
    getImageById,
    getCommentsByImageId,
    addComment,
    getmoreImages,
};
