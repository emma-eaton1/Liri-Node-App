require("dotenv").config();
var keys = require("./keys.js")
var fs = require("fs");
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');
var found = false
var dataArray = [];
var data = process.argv.slice(3).join("-");
var inquirer = require('inquirer');
var cmd = ""
var choice = ""
var loopcount = 1
console.log(data)

// Concert this function

var concertThis = function(){
request("https://rest.bandsintown.com/artists/"+data+"/events?app_id=codingbootcamp", function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

        parsedData = (JSON.parse(body));
        if (parsedData.length === 0){
            console.log("Nothing found");
        }

        else {
            for (let i = 0; i < parsedData.length; i++) {
                console.log('EVENT NUMBER ',(i+1))
                console.log("Name of venue - ",parsedData[i].venue.name);
                console.log("Venue location - ",parsedData[i].venue.city);
                var date = (parsedData[i].datetime);
                moment(date, "MM-DD-YYYY");
                console.log("Date of the Event - ",date);
                console.log(" ")
                found = true
            }
        }

        if (found === true){
            dataArray = [cmd + " " + data]
            logToFile();
            
        }

        }
    });
};


// Spotify function
var spotifyThisSong = function() {
    // console.log("you want spotify info on "+ command+","+data)

    let spotify = new Spotify(keys.spotify);
    // If there is no song name, set the song to Backstreet boys "I want it that way"
    if (!data) {
        data = "I want it that way";
    }
    spotify.search({ type: 'track', query: data }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {

                console.log("The artist name is - " + data.tracks.items[0].artists[0].name);
                console.log("The songs name is - " + data.tracks.items[0].name); 
                console.log("A preview link of the song from Spotify - " + data.tracks.items[0].preview_url);
                console.log("The album that the song is from - " + data.tracks.items[0].album.name);
                console.log(" ")
                found = true;
            }
        });
   

        // store the searched for command and song in an array that will be dumped to the log.txt file
        dataArray = [cmd + " " + data]
        console.log("data array is "+dataArray)
        logToFile();

} 

// Movie this function
var movieThis = function(){
if (data === ''){
    request("http://www.omdbapi.com/?t=mr-nobody&y=&plot=short&tomatoes=true&apikey=trilogy", function(error, response, body) {
        console.log("Title of the movie - "+JSON.parse(body).Title);
        console.log("Year the movie came out - "+JSON.parse(body).Year);
        console.log("IMDB Rating of the movie - " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating of the movie - " + JSON.parse(body).tomatoRating);
        console.log("Country where the movie was produced - " + JSON.parse(body).Country);
        console.log("Language of the movie - " + JSON.parse(body).Language);
        console.log("Plot of the movie - " + JSON.parse(body).Plot);
        console.log("Actors in the movie - " + JSON.parse(body).Actors);
    });
    
}
request("http://www.omdbapi.com/?t="+data+"&y=&plot=short&tomatoes=true&apikey=trilogy", function(error, response, body) {

// If the request is successful (i.e. if the response status code is 200)
if (!error && response.statusCode === 200) {

    console.log("Title of the movie - "+JSON.parse(body).Title);
    console.log("Year the movie came out - "+JSON.parse(body).Year);
    console.log("IMDB Rating of the movie - " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating of the movie - " + JSON.parse(body).tomatoRating);
    console.log("Country where the movie was produced - " + JSON.parse(body).Country);
    console.log("Language of the movie - " + JSON.parse(body).Language);
    console.log("Plot of the movie - " + JSON.parse(body).Plot);
    console.log("Actors in the movie - " + JSON.parse(body).Actors);
    found = true;
    }
});
if (found === true){
    dataArray = [cmd + " " + data]
    logToFile();
    
}
};


// This is the function where we store searched for detail into the log.txt file
var logToFile = function(){

    fs.appendFile("log.txt", (dataArray+", "), function(err) {
    
        // If an error was experienced we will log it to the node console.
        if (err) {
          console.log(err);
        }
      
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
          console.log("Detail successfully added to the log.txt file");
        }
      
      });
    };


// This is the do-what-it-says function wihch will read from the random.txt file and "Do what it says"
var doWhatItSays = function(){
    fs.readFile("./random.txt", "utf8", function(err, data) {
                if (err) {
                  return console.log(err);
                }
            
                // Break down the information inside log.txt and then dump it to the runTheSearch function
                dataArray = data.split(",");
                // console.log(dataArray[0])
                // console.log(dataArray[1])
                cmd = (dataArray[0])
                data = (dataArray[1])
                runTheSearch(cmd);
                
            }
                );
    
}

var askLiri = function(){
    // Create a "Prompt" to begin the liri.app application.
    inquirer
      .prompt([
        // User can choose from a list of functions as outlined in the homework assignment.
        {
          type: "list",
          message: "Which search type would you like liri to use?",
          choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
          name: "searchType"
        },
        //  Here we create a text prompt to determine what will be searched for
        {
        type: "input",
        message: "What do you want to search for?",
        name: "userData"
        },
        // Here we ask the user to confirm they want to do the search as is.
        {
          type: "confirm",
          message: "Are you sure:",
          name: "confirm",
          default: true
        }
      ])
      .then(function(inquirerResponse) {
        // If the inquirerResponse confirms, we display the details of the search and kick of the runWithIt function
        if (inquirerResponse.confirm) {
            cmd = inquirerResponse.searchType
            data = inquirerResponse.userData
          console.log("You've Chosen to search type " + cmd + "\n");
          console.log("You've Chosen to search for " + data + "\n");
          runTheSearch(cmd);
          
        }
        else {
            if (loopcount < 3){
                loopcount +=1
                console.log("\nLet's try again then.\n");
                askLiri();
            };
            console.log("Too many failed attempt! Try again later.")
            
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