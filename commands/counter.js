const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

exports.main = function(bot, msg, timeout, permission) { // Export command's function
	var command = "counter"; // For logging purposes
	if(!permission.hasPermission('SEND_MESSAGES')) {  
		// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...notify the user...
		return;	// ...and abort command execution.
	}
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	request.get('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) { 
		// GET the counter number
		if(error || response.statusCode !== 200) { 
			// Check for errors or response codes other than 200 (OK)
			console.log(`An unusual response code was emitted when GETting the counter: ${response.statusCode} -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
			// Log any unusual request responses
			return; // Abort command execution
		};
    	msg.channel.sendMessage(`Current count is: ${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`); 
		// Format counter to x.xxx.xxx 
	});
};
exports.desc = "display the website's current counter"; // Export command's description