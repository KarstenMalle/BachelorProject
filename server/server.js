var express = require('express');
var cors = require('cors');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args));
var bodyParser = require('body-parser');

const CLIENT_ID = "f05709a4c29009cc4bb443c2d13bcd4d9f457107495c5ebae5af8e8a1bed774d";
const CLIENT_SECRET = "e85ae3fb2e7b72d5f709ae2a0753e89e6ddd2beab9042150a0deb8880b1ab489";
const REDIRECT_URI = 'http://localhost:4000/';

var app = express();

// app.use(cors());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4000',  // replace with the URL of your client-side app
    optionsSuccessStatus: 204
  }));

app.options('*', cors());

// code being passed from the frontend
app.get('/getAccessToken', async function (req, res) {
    
    console.log(req.query.code);

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code + "&grant_type=authorization_code" + "&redirect_uri=" + REDIRECT_URI;

    await fetch("https://gitlab.com/oauth/token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    });
});

// getUserData
// access token is going to be passed in as an Authorization header

app.get('/getUserData', async function (req, res) {
    req.get("Authorization"); // Bearer ACCESSTOKEN
    await fetch("https://api.gitlab.com/user", {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    });
});

app.listen(3000, function () {
    console.log("CORS server running on port 3000");
});