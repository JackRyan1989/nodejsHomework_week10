
//Require dotenv so that we can pull in the API keys specific to my user.
require('dotenv').config();
var keys = require('./keys.js');

//Require the spotify api:
var spotify = require('node-spotify-api');

//Require the moment.js node package:
var moment = require('moment');

//Require inquirer so that we can have a nice user interface:
var inquirer = require('inquirer');

//Require axios so that we can get things from our apis of interest: 
var axios = require('axios');

//Use inquirer to acquire user input:

inquirer.prompt([
{
    type: 'input',
    message: ''
}


]).then(function(answers){

});






