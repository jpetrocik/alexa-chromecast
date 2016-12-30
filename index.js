var alexa = require('alexa-app');
var Chromecast = require('./chromecast');


module.change_code = 1;

var chromecast = new Chromecast();
var chromecastApp = new alexa.app('chromecast');

chromecastApp.launch(function(request, response) {
	response.say("You can ask me to play, pause, or stop your chromecast");
	response.shouldEndSession(false);
});

chromecastApp.error = function(e, request, response) {
	response.say("Sorry, " + e.message);
};

function handleResponse(status, response, successMessage, failedMessage){
	if (status)
		response.say(successMessage);
	else
		response.say(failedMessage);

}
 
 /*
chromecastApp.intent('crackle',
	{
	"slots":{"show":"LIST_OF_SHOWS"},
	"utterances":[ "play {show}" ]
	},
	function(request,response) {
		var show = request.slot('show');
		crackle.search(show, function(results, statusCode) {
			console.log( "Channel " + results.Items[0].ChannelInfo.ShortName + " (" + results.Items[0].ChannelInfo.Id + ")");
			
			crackle.channel(results.Items[0].ChannelInfo.ShortName, function(channel, statusCode) {
				console.log("Movie " + channel.FeaturedMedia.Title + " (" + channel.FeaturedMedia.ID + ")");
			
				crackle.details(channel.FeaturedMedia.ID, function(movie, statusCode) {
					crackle.playMovie(movie, function(status){
						handleResponse(status, response, "Playing " + show, "Sorry I was unable to play " + show );
					});
				});
			}); 
		});
		
		return false;
	}
);
 */

chromecastApp.intent('pause',
	{
	"utterances":[ "pause" ]
	},
	function(request,response) {
		chromecast.pausePlayback();
		console.log("Pasued");
		handleResponse(true, response, "Paused", "Sorry I was unable to pause chromecast" );
	}
);

chromecastApp.intent('stop',
	{
	"utterances":[ "stop" ]
	},
	function(request,response) {
		chromecast.stopPlayback();
		handleResponse(true, response, "Stopped", "Sorry I was unable to stop chromecast" );
	}
);

chromecastApp.intent('resume',
	{
	"utterances":[ "resume" ]
	},
	function(request,response) {
		chromecast.playPlayback();
		handleResponse(true, response, "Playing", "Sorry I was unable to start playing" );
	}
);


module.exports = chromecastApp;


