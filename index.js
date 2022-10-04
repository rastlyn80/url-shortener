const validator = require("valid-url");

require("dotenv").config();
const bodyParser = require("body-parser");

const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

const urlShorts = [];

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.post("/api/shorturl", (req, res) => {
  if (validator.isWebUri(req.body.url)) {
    urlShorts.push(req.body.url);
    return res.json({
      original_url: req.body.url,
      short_url: urlShorts.length - 1,
    });
  } else {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  if (req.params.id <= urlShorts.length) {
    res.status(301).redirect(urlShorts[req.params.id]);
  }
});
