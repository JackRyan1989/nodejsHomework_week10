### liri-node-app
LIRI is a Node-based application that will take user input and search several apis based on that input. Got a song stuck in your head? Can't think of the voice-actor of Donkey in Shrek? Look no further! 

### Packages required: ###
- Axios
- Dotenv
- Inquirer
- Moment
- Spotify

Package dependencies can be downloaded using the included package.json file. After cloning the repo run - 
``````````
npm install
``````````
to download the required packages.

Note: The npm-spotify-api requires a Spotify Client ID and secret. 
You will need to get your own and place them into a key file (such as 'keys.js') and a .env file. 
To get your client id and secret follow these steps: 
Sign up for a Spotify developer account https://developer.spotify.com/dashboard/login. 
If you already have a Spotify account, you'll just have to log in. A membership can be paid or free, it makes no difference when it comes to using the Spotify API.

Once you're signed up, navigate to https://developer.spotify.com/my-applications/. 

### Usage ###
LIRI queries users regarding 3 topics. LIRI can do this via the command line, or via .txt file input.

- Search topics:

1. Upcoming concerts for a searched for artist via BandsInTown
    a. LIRI returns the concert venue, location of venue and the date of the concert.
2. Song search via Spotify
    a. LIRI returns artists who have recorded a song of the title
    b. The song's name
    c. A preview link to the song
    d. The album that the song is from
3. Movie title Search
    a. LIRI returns:
        * Title of the movie.
        * Year the movie came out.
        * IMDB Rating of the movie.
        * Rotten Tomatoes Rating of the movie.
        * Country where the movie was produced.
        * Language of the movie.
        * Plot of the movie.
        * Actors in the movie.

Procedure:
1. Call Liri in the command line: 
node liri.js
2. Press enter to begin using LIRI
3. Using the arrow keys, press enter to select what you would like to search:
- Movie Info 
- Fav Band Concerts
- Song Search
- File Input
4. For Movie Info, Fav Band Concerts and Song Search you type in the item you want to search (a movie title, band name or song title respectively) and press enter to get your results.
5. If an error is returned double check your spelling and grammar. "A Bug's Life" will work while "A Bugs Life" will not.
6. Results are written out to the 'log.txt' file in addition to being printed to the command line.
7. For file input, just select 'File Input' with the arrow key press enter and then type in the name of the file you would like to load.
8. LIRI expects .txt files and for the contents of the file to be in the following format:
- procedure,search term
For example:
Movie Info,The Shining

Please refer to the video in the repository to get a clearer idea of how to use LIRI.

### Author ###
Jack Ryan
Github: jackryan1989
Email: jack.jackryan@gmail.com