const fs = require("fs");
const { S3 } = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const Bucket = 'spicedling';

const s3 = new S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

function s3Upload(request, response, next) {
    // should the file not be in the request at all
    if (!request.file) {
        console.log("[imageboard:s3] file not there");
        response.sendStatus(500);
        return;
    }

    const {
        filename: Key,
        mimetype: ContentType,
        size: ContentLength,
        path,
    } = request.file;

    console.log("[imageboard:s3] uploading to s3...", {
        Bucket,
        Key,
        ContentType,
        ContentLength,
    });

    s3.putObject({
        Bucket,
        ACL: "public-read",
        Key: request.file.filename,
        Body: fs.createReadStream(path),
        ContentType: request.file.mimetype,
        ContentLength: request.file.size,
    })
        .promise()
        .then(() => {
            console.log("[imageboard:s3] uploaded to s3");
            next();
            // delete original file on upload
            //fs.unlink(path, () => {});
        })
        .catch((error) => {
            console.log("[imageboard:s3] error uploading to s3", error);
            response.sendStatus(500);
        });
}

module.exports = { Bucket, s3Upload };
