require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("home");
});

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${process.env.API_KEY}`;    

    https.get(url, (response) => {
        console.log(response.statusCode);   // check HTTP status code of request made to a server

        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const weatherDescription = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const windSpeed = weatherData.wind.speed;
            const humidity = weatherData.main.humidity;
            const icon = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.render("weather", {
                    description: weatherDescription, 
                    query: query, 
                    temp: temp, 
                    feelsLike: feelsLike, 
                    windSpeed: windSpeed, 
                    humidity: humidity, 
                    imgUrl: imageUrl, 
                });
        });
    });
});

app.listen(3000, () => console.log("Server is running on port 3000."));
