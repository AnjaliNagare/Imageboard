const path = require("path");
const express = require("express");
const app = express();

const { getData } = require('./db');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/images", (request, response) => {
    getData().then((result)=>{
        response.json(result);
    });
    
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log(`I'm listening.`));
