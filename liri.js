var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var nodeArg = process.argv[2];
var nodeArg2 = process.argv.slice(3);

var client = new Twitter(keys.twitterKeys);
 
var params = {screen_name: 'jimbohohohoho'};

var myTweets = function() {
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		    tweets.forEach(function(status) {

		    	var output = status.text.toString() + "\n";
		    	var timestamp = status.created_at;
		    	console.log(timestamp);
		    	console.log(output);
		    	
		    });
		  }
	});
	
}


var spotify = function(songName) {
	var spotifyClient = new Spotify(keys.spotifyKeys);
	if (songName == "") {
		spotifyClient
		  .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
		  .then(function(data) {
		  	console.log('Artist Name: '+ data.artists[0].name)
		    console.log('Track Name', data.name)
		    console.log('Preview URL: ' + data.preview_url) 
	  		console.log('Album Name: '+ data.album.name)
	  		 		
		  })
		  .catch(function(err) {
		    console.error('Error occurred: ' + err); 
		  });
	} else {
		spotifyClient.search({type: "track", query: songName, limit: 5}, function(err, data) {
			if (err) {
				return console.log("Error occurred: " + err);
			}
			data.tracks.items.forEach(function(music){
				var artist = "Artist Name: " + music.artists[0].name;
				var songTitle = "Track Title: " + music.name;
				var link = "Preview Link: " + music.preview_url;
				var album = "Album: " + music.album.name;

				console.log(artist+"\n"+songTitle+"\n"+link+"\n"+album+"\n");
			})
		})
	}
}

var moviefunction = function(movieName) {
	var movieData, title, year, imdb, tomatoes, country, language, plot, actors;
	console.log(movieName);
	if (movieName == "") {
			request("http://www.omdbapi.com/?apikey=40e9cece&type=movie&t=Mr.+Nobody",
			function(error, response, body) {
			if (error) {
				return console.log(error);
			}

					movieData = JSON.parse(body);
					title = movieData.Title;
					year = movieData.Year;
					imdb = movieData.Ratings[0].Value;
					tomatoes = movieData.Ratings[1].Value;
					country = movieData.Country;
					language = movieData.Language;
					plot = movieData.Plot;
					actors = movieData.Actors;
					console.log(title+'\n'+year+'\n'+imdb+'\n'+tomatoes+'\n'+country+'\n'+language+'\n'+actors+'\n'+plot);
					});  
		} else {
			request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece",
			function(error, response, body) {
				if (error) {
					return console.log(error);
				}
				
				movieData = JSON.parse(body);
				title = movieData.Title;
				year = movieData.Year;
				imdb = movieData.Ratings[0].Value;
				tomatoes = movieData.Ratings[1].Value;
				country = movieData.Country;
				language = movieData.Language;
				plot = movieData.Plot;
				actors = movieData.Actors;
				console.log(title+'\n'+year+'\n'+imdb+'\n'+tomatoes+'\n'+country+'\n'+language+'\n'+actors+'\n'+plot);

				});
	}
}

var doIt = function() {

	fs.readFile("./random.txt","utf8",function(err,data) {
		if (err) {
			return console.err(err);
		}
		var command = data.split(",")[0];
		var query = data.split(",")[1];
		console.log(command);
		console.log(query);
		if (command === 'my-tweets') {
			myTweets();
		} else if (command === 'spotify-this-song') {
			spotify(query);
		} else if (command === 'movie-this') {
			moviefunction(query);
		} else if(command === 'do-what-it-says') {
			console.log("not gonna do it")
		}

	})
}





if (nodeArg === 'my-tweets') {
	myTweets();
} else if (nodeArg === 'spotify-this-song') {
	spotify(nodeArg2);
} else if (nodeArg === 'movie-this') {
	moviefunction(nodeArg2);
} else if(nodeArg === 'do-what-it-says') {
	doIt();
}