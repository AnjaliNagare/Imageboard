const path = require("path");
const express = require("express");
const app = express();
 
const { getImages, createImage } = require("./db");
const { Bucket, s3upload } = require("./s3");
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
    s3upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
        console.log('POST /upload', url);
        
        createImage({...request.body, url,})
            .then((newImage) => {
                response.json(newImage);
            })
            .catch((error) => {
                console.log("post /upload error: ", error);
                response.statusCode(500).json({ message: "error uploading image"});
            });
    });


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log(`I'm listening.`));
