var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var Controller            = require('castv2-client').Controller;
var mdns                  = require('mdns');

DefaultMediaReceiver.APP_ID = "233637DE";

var sequence = [
mdns.rst.DNSServiceResolve()
, mdns.rst.getaddrinfo({families: [4] })
];
var browser = mdns.createBrowser(mdns.tcp('googlecast'),{resolverSequence: sequence});


function Chromecast() {
	var client,
		application;

	function handleAppStatus(status){
		console.log("Application status");
		console.log(status);
	}

	function handleClientStatus(status){
		console.log("Client status");
		console.log(status);

		if (status.applications == undefined)
			return;

		var session = status.applications[0];

		client.join(session, DefaultMediaReceiver, function(empty, status){
			application = status;
			application.on('status', handleAppStatus);
			application.getStatus(function(err, status) { handleAppStatus(status)});
		});

	}

	function createClient(host) {
		console.log('Creating client to ' + host);
		client = new Client();

		client.on('status', handleClientStatus);

		client.on('error', function(err) {
			console.log('Error: %s', err.message);
			client.close();
			setTimeout(function() {createClient(host)}, 30000);
		});

		client.connect(host, function() {
			client.getStatus(function(err, status) { handleClientStatus(status)});
		});

	}

	this.playPlayback = function(callback){
		console.log("Playing");
		application.play(function(err, status) {
			//callback(status);
		});

	};

	this.pausePlayback = function(callback){
		console.log("Pausing");
		application.pause(function(err, status) {
			//callback(true);
		});

	};

	this.stopPlayback = function(callback){
		console.log("Stopping");
		application.stop(function(err, status) {
			//callback(status);
		});
	};

	var onCreate = createClient.bind(this);
	browser.on('serviceUp', function(service) {
		if (service.name == "Chromecast-f122835469502c563f917db70437d040") {
			console.log("Casting to " + service.txtRecord.fn);
			onCreate(service.addresses[0]);
			browser.stop();
		}
	});

	browser.start();


}

// var cc = new Chromecast();
// setTimeout(
// 	function() {
// 		cc.pause(function(stauts){
// 			console.log("worked");
// 		})
// 	}
// 	, 5000);
module.exports = Chromecast;
