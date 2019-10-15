//Require the filesystem so we can read and write files:
var fs = require('fs');

//Require dotenv so that we can pull in the API keys specific to my user.
require('dotenv').config();
var keys = require('./keys.js');

//Require the spotify api:
var spotify = require('node-spotify-api');

//Require the moment.js node package:
var moment = require('moment');

//Require axios so that we can get things from our apis of interest: 
var axios = require('axios');

//Require inquirer for a sensuous user interface: 
var inquirer = require('inquirer');

var questions = [
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
    }
];

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
            var artist = answers.concert;
            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
                function (response) {
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
                        }
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
            console.log("Song search");
            break;
        case 'File Input':
            console.log("Search from file");
            break;
    }
});




