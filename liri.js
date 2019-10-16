//Require the filesystem so we can read and write files:
var fs = require('fs');

//Require dotenv so that we can pull in the API keys specific to my user
require('dotenv').config();
var keys = require('./keys');
//Require the spotify api:
var Spotify = require('node-spotify-api');
var neuSpotify = new Spotify(keys.spotify);

//Require the moment.js node package:
var moment = require('moment');

//Require axios so that we can get things from our apis of interest: 
var axios = require('axios');

//Require inquirer for a sensuous user interface: 
var inquirer = require('inquirer');

function repeatSearch() {
    inquirer.prompt([
        {
            type: 'confirm',
            message: "Would you like to search again?",
            name: 'searchAgain'
        }
    ]).then(function (searchAnswer) {
        if (searchAnswer.searchAgain) {
            switchCase();
        } else {
            return;
        }
    });
}

//Function to write the output of each search operation to a .txt file
writeToLog = function (searchOutput) {
    searchOutput = JSON.stringify(searchOutput);
    fs.writeFile('./log.txt', searchOutput, function (err) {
        if (err) {
            return console.log("Error writing output file.");
        }
    });
};
//Wrap it all in a function so we can call again if we want to ask another question without quiting the program.
switchCase = function () {
    //Ask some questions of the user. These questions dictate the flow of the program. 
    var questions = [
        {
            name: 'intro',
            message: "Hello and welcome to LIRI. Press enter to continue."
        },
        {
            type: "list",
            message: 'What would you like to search for today?',
            choices: ['Movie Info', 'Fav Band Concerts', 'Song Search', 'File Input'],
            default: 'Movie Info',
            name: 'whatDo'
        },
        {
            type: 'input',
            message: 'Please enter a Movie Title:',
            name: 'movieTitle',
            when: function (answers) {
                if (answers.whatDo === 'Movie Info') {
                    return answers.whatDo;
                }
            }
        },
        {
            type: 'input',
            message: 'Please enter a Band:',
            name: 'concert',
            when: function (answers) {
                if (answers.whatDo === 'Fav Band Concerts') {
                    console.log(answers.whatDo);
                    return answers.whatDo;
                }
            }
        },
        {
            type: 'input',
            message: 'Please enter a Song:',
            name: 'song',
            when: function (answers) {
                if (answers.whatDo === 'Song Search') {
                    console.log(answers.whatDo);
                    return answers.whatDo;
                }
            }
        },
        {
            type: 'input',
            message: 'Please enter the File Name:',
            name: 'fileName',
            when: function (answers) {
                if (answers.whatDo === 'File Input') {
                    console.log(answers.whatDo);
                    return answers.whatDo;
                }
            }
        },
    ];

    //When you have the answers to the above questions, switch some cases based on them.
    inquirer.prompt(questions).then(function (answers) {
        var toDo = answers.whatDo;
        switch (toDo) {
            case 'Movie Info':
                axios.get("http://www.omdbapi.com/?t=" + answers.movieTitle + "&y=&plot=short&apikey=42a11145").then(
                    function (response) {
                        if (response.data.Title === undefined) {
                            return console.log("Movie not found. Search again.");
                        } else {
                            console.log("---------------Title---------------");
                            console.log(response.data.Title);
                            console.log("---------------Release Year---------------");
                            console.log(response.data.Year);
                            console.log("---------------IMDB Rating---------------");
                            console.log(response.data.imdbRating);
                            console.log("---------------Rotten Tomatoes Tomatometer---------------");
                            console.log(response.data.Ratings[1].Value);
                            console.log("---------------Country of Production---------------");
                            console.log(response.data.Country);
                            console.log("---------------Language---------------");
                            console.log(response.data.Language);
                            console.log("---------------Plot---------------");
                            console.log(response.data.Plot);
                            console.log("---------------Cast---------------");
                            console.log(response.data.Actors);
                            console.log("                                   ");
                            //Consolidate the responses to put into the .txt file:
                            searchOutput =
                                "Title: " + response.data.Title + " ReleaseYear: " + response.data.Year + " IMDB Rating: " + response.data.imdbRating + " Rotten Tomatoes: " + response.data.Ratings[1].Value +
                                " Country: " + response.data.Country + " Language: " + response.data.Language + " Plot: " + response.data.Plot + " Cast: " + response.data.Actors;
                            //Write out the responses to the .txt file
                            writeToLog(searchOutput);
                            repeatSearch();
                        }
                    })
                    //If something goes wrong:
                    .catch(function (error) {
                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.log("---------------Data---------------");
                            console.log(error.response.data);
                            console.log("---------------Status---------------");
                            console.log(error.response.status);
                            console.log("---------------Status---------------");
                            console.log(error.response.headers);
                        }
                    });
                break;
            //If the user wants to search for their favorite band's upcoming concerts:
            case 'Fav Band Concerts':
                var artist = answers.concert;
                axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
                    function (response) {
                        var output = [];
                        if (response.data === '\n{warn=Not found}\n') {
                            return console.log("Band not found. Try again.");
                        } else {
                            for (i = 0; i < response.data.length; i++) {
                                var mom = moment(response.data[i].datetime).format("MM/DD/YYYY");
                                console.log("                                   ");
                                console.log("---------------Venue---------------");
                                console.log(response.data[i].venue.name);
                                console.log("---------------Location---------------");
                                console.log(response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                                console.log("---------------Date---------------");
                                console.log(mom);
                                console.log("                                   ");
                                var venue = response.data[i].venue.name;
                                var loc = (response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                                var date = mom;
                                output.push(venue, loc, date);
                            }
                            writeToLog(output);
                            repeatSearch();
                        }
                    }).catch(function (error) {
                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.log("---------------Data---------------");
                            console.log(error.response.data);
                            console.log("---------------Status---------------");
                            console.log(error.response.status);
                            console.log("---------------Status---------------");
                            console.log(error.response.headers);
                        }
                    });
                break;
            //If the user wants to search for a song:
            case 'Song Search':
                var song = answers.song;
                neuSpotify
                    .search({ type: 'track', query: song })
                    .then(function (responses) {
                        for (i = 0; i < responses.tracks.items.length; i++) {
                            var output = [];
                            console.log("                                   ");
                            console.log("---------------Song Name---------------");
                            console.log(responses.tracks.items[i].name);
                            console.log("---------------Artist(s)---------------");
                            console.log(responses.tracks.items[i].album.artists[0].name);
                            console.log("---------------Album---------------");
                            console.log(responses.tracks.items[i].album.name);
                            console.log("---------------Link---------------");
                            console.log(responses.tracks.items[i].album.external_urls);
                            console.log("                                   ");
                            var song = responses.tracks.items[i].name;
                            var artists = responses.tracks.items[i].album.artists[0].name;
                            var album = responses.tracks.items[i].album.name;
                            var link = responses.tracks.items[i].album.external_urls;
                            output.push(song, artists, album, link);
                        }
                        writeToLog(output);
                        repeatSearch();
                    }).catch(function (err) {
                        console.log(err);
                    });
                break;
            //If the user wants to call a file with the operation and thing to search for.
            case 'File Input':
                var fileName = answers.fileName;
                fs.readFile('./' + fileName, "utf-8", function (err, data) {
                    if (err) {
                        return console.log("Input file cannot be found or read.");
                    } else {
                        var inputArr = data.split(',');
                        var nextToDo = inputArr[0];
                        var item = inputArr[1];
                        //Nested switch case to do exact same (I know, it's redundant) case switching as above, except based on file input.
                        switch (nextToDo) {
                            case 'Movie Info':
                                axios.get("http://www.omdbapi.com/?t=" + item + "&y=&plot=short&apikey=42a11145").then(
                                    function (response) {
                                        if (response.data.Title === undefined) {
                                            return console.log("Movie not found. Search again.");
                                        } else {
                                            console.log("---------------Title---------------");
                                            console.log(response.data.Title);
                                            console.log("---------------Release Year---------------");
                                            console.log(response.data.Year);
                                            console.log("---------------IMDB Rating---------------");
                                            console.log(response.data.imdbRating);
                                            console.log("---------------Rotten Tomatoes Tomatometer---------------");
                                            console.log(response.data.Ratings[1].Value);
                                            console.log("---------------Country of Production---------------");
                                            console.log(response.data.Country);
                                            console.log("---------------Language---------------");
                                            console.log(response.data.Language);
                                            console.log("---------------Plot---------------");
                                            console.log(response.data.Plot);
                                            console.log("---------------Cast---------------");
                                            console.log(response.data.Actors);
                                            console.log("                                   ");
                                            searchOutput =
                                                "Title: " + response.data.Title + " ReleaseYear: " + response.data.Year + " IMDB Rating: " + response.data.imdbRating + " Rotten Tomatoes: " + response.data.Ratings[1].Value +
                                                " Country: " + response.data.Country + " Language: " + response.data.Language + " Plot: " + response.data.Plot + " Cast: " + response.data.Actors;

                                            writeToLog(searchOutput);
                                            repeatSearch();
                                        }
                                    })
                                    .catch(function (error) {
                                        if (error.response) {
                                            // The request was made and the server responded with a status code
                                            // that falls out of the range of 2xx
                                            console.log("---------------Data---------------");
                                            console.log(error.response.data);
                                            console.log("---------------Status---------------");
                                            console.log(error.response.status);
                                            console.log("---------------Status---------------");
                                            console.log(error.response.headers);
                                        }
                                    });
                                break;
                            case 'Fav Band Concerts':
                                axios.get("https://rest.bandsintown.com/artists/" + item + "/events?app_id=codingbootcamp").then(
                                    function (response) {
                                        var output = [];
                                        if (response.data === '\n{warn=Not found}\n') {
                                            return console.log("Band not found. Try again.");
                                        } else {
                                            for (i = 0; i < response.data.length; i++) {
                                                var mom = moment(response.data[i].datetime).format("MM/DD/YYYY");
                                                console.log("                                   ");
                                                console.log("---------------Venue---------------");
                                                console.log(response.data[i].venue.name);
                                                console.log("---------------Location---------------");
                                                console.log(response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                                                console.log("---------------Date---------------");
                                                console.log(mom);
                                                console.log("                                   ");
                                                var venue = response.data[i].venue.name;
                                                var loc = (response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                                                var date = mom;
                                                output.push(venue, loc, date);
                                            }
                                            writeToLog(output);
                                            repeatSearch();
                                        }
                                    }).catch(function (error) {
                                        if (error.response) {
                                            // The request was made and the server responded with a status code
                                            // that falls out of the range of 2xx
                                            console.log("---------------Data---------------");
                                            console.log(error.response.data);
                                            console.log("---------------Status---------------");
                                            console.log(error.response.status);
                                            console.log("---------------Status---------------");
                                            console.log(error.response.headers);
                                        }
                                    });
                                break;
                            case 'Song Search':
                                neuSpotify
                                    .search({ type: 'track', query: item })
                                    .then(function (responses) {
                                        var output = [];
                                        for (i = 0; i < responses.tracks.items.length; i++) {
                                            console.log("                                   ");
                                            console.log("---------------Song Name---------------");
                                            console.log(responses.tracks.items[i].name);
                                            console.log("---------------Artist(s)---------------");
                                            console.log(responses.tracks.items[i].album.artists[0].name);
                                            console.log("---------------Album---------------");
                                            console.log(responses.tracks.items[i].album.name);
                                            console.log("---------------Link---------------");
                                            console.log(responses.tracks.items[i].album.external_urls);
                                            console.log("                                   ");
                                            var song = responses.tracks.items[i].name;
                                            var artists = responses.tracks.items[i].album.artists[0].name;
                                            var album = responses.tracks.items[i].album.name;
                                            var link = responses.tracks.items[i].album.external_urls;
                                            output.push(song, artists, album, link);
                                        }
                                        writeToLog(output);
                                        repeatSearch();
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });

                                break;

                        }
                    }
                });
                break;
        }
    });
};
switchCase();



