const path = require("path");
const express = require("express");
const app = express();
 
const {
    getImages,
    createImage,
    getImageById,
    getCommentsByImageId,
    addComment,
    getmoreImages,
} = require("./db");

const { Bucket, s3Upload } = require("./s3");
const { uploader } = require("./uploader");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/images", (request, response) => {
    getImages().then((result)=>{
        response.json(result);
    });
    
});

app.post("/upload", 
    uploader.single("file"), 
    s3Upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
        console.log('POST /upload', url);
        
        createImage({...request.body, url,})
            .then((newImage) => {
                console.log(newImage);
                response.json(newImage);
            })
            .catch((error) => {
                console.log("post /upload error: ", error);
                response.statusCode(500).json({ message: "error uploading image"});
            });
    });

app.get("/images/:id", (request, response) => {
    getImageById(request.params.id).then((result) => {
        console.log(result);
        response.json(result);
    });
});

app.get("/images/:image_id/comments", (request, response) => {
    const image_id =request.params.image_id;
    getCommentsByImageId(image_id).then(comments => {
        response.json(comments);
    });
});

app.post("/images/:image_id/comments", (request, response) => {
    addComment({...request.body, ...request.params,})
        .then((comment) => {
            console.log(comment);
            response.json(comment);
        });
});

app.get("/more-images", (request,response) => {
    getmoreImages(request.query)
        .then((newImages) => {
            response.json(newImages);
        }).catch((error) => {
            console.log("error", error);
            response.sendStatus(500);
        });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log(`I'm listening.`));
