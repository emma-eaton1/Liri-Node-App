require("dotenv").config();
var keys = require("./keys.js")
var fs = require("fs");
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');
var inquirer = require('inquirer');
var found = false
var dataArray = [];
var data = process.argv.slice(3).join("-");
var cmd = ""
var choice = ""
var loopcount = 1
console.log(data)

var concertThis = function(){
//request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function() {
                console.log("Name of venue")
                console.log("Venue location")
                moment(date);
                console.log("Event Date");
}

var movieThis = function(){
if (data === ''){
    request("http://www.omdbapi.com/?t=mr-nobody&y=&plot=short&tomatoes=true&apikey=trilogy", function(error, response, body) {
        console.log("Movie Title "+JSON.parse(body).Title);
        console.log("Release Year "+JSON.parse(body).Year);
        console.log("IMDB Rating " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating " + JSON.parse(body).tomatoRating);
        console.log("Country of production " + JSON.parse(body).Country);
        console.log("Primary language " + JSON.parse(body).Language);
        console.log("Movie plot " + JSON.parse(body).Plot);
        console.log("Actors " + JSON.parse(body).Actors);
    });   
}
request("http://www.omdbapi.com/?t="+data+"&y=&plot=short&tomatoes=true&apikey=trilogy", function(error, response, body) {
if (!error && response.statusCode === 200) {
    console.log("Movie Title "+JSON.parse(body).Title);
    console.log("Release Year "+JSON.parse(body).Year);
    console.log("IMDB Rating " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating " + JSON.parse(body).tomatoRating);
    console.log("Country of production " + JSON.parse(body).Country);
    console.log("Primary language " + JSON.parse(body).Language);
    console.log("Movie plot " + JSON.parse(body).Plot);
    console.log("Actors " + JSON.parse(body).Actors);
    found = true;
    }
});
};

var spotifyThisSong = function() {
    let spotify = new Spotify(keys.spotify);
    if (!data) {
        data = "I want it that way";
    }
    spotify.search({ type: 'track', query: data}, function(error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {
                console.log("Artist name " + data.tracks.items[0].artists[0].name);
                console.log("Song Name " + data.tracks.items[0].name); 
                console.log("Preview Link " + data.tracks.items[0].preview_url);
                console.log("Album Name " + data.tracks.items[0].album.name);
                console.log(" ")
                found = true;
            }
        });
        dataArray = [cmd + " " + data]
        console.log("You looked up information for "+dataArray)
        logToFile();
}

var logToFile = function(){
    fs.appendFile("log.txt", (dataArray+", "), function(err) {
        if (err) {
        console.log(err);
        }
});
};

var doWhatItSays = function(){
    fs.readFile("./random.txt", "utf8", function(err, data) {
                if (err) {
                return console.log(err);
                }
                dataArray = data.split(",");
                cmd = (dataArray[0])
                data = (dataArray[1])
                runTheSearch(cmd);
            });
}

var askLiri = function(){
    inquirer
    .prompt([
        {
        type: "list",
        message: "Which command would you like to select?",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "searchType"
        },
        {
        type: "input",
        message: "What would you like to search for?",
        name: "userData"
        },
        {
        type: "confirm",
        message: "Confirm selection",
        name: "confirm",
        default: true
        }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            cmd = inquirerResponse.searchType
            data = inquirerResponse.userData
        runTheSearch(cmd);
        }
        else {
            console.log("Failed inquiry")
            
        }
});
    }; 
    var runTheSearch =function(cmd){
        console.log(cmd)
        switch (cmd) {
            case "concert-this":
            console.log("Calling the concert-this function to search for "+data)
            concertThis();   
            break;
            case 'spotify-this-song':
            console.log("you want spotify info on the song "+data)
            spotifyThisSong();    
            break;
            case 'movie-this':
            console.log("Details for the movie ",data)
            movieThis();
            break;
            case "do-what-it-says":
            doWhatItSays();
            break;
            default:
            break;
        }
    };
    askLiri();