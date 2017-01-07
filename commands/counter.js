const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	var command = "counter"; // For logging purposes
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  
		// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...notify the user...
		return;	// ...and abort command execution.
	}
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	request.get('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) { 
		// GET the counter number
		if(response == undefined) {
		// If 1) the response is undefined...
			console.log(`No response was emitted when GETting the counter -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) Undefined response | ${error}`); 
			// ...log it and the error...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				msg.author.sendMessage(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user...
				return; // ...and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
			// ...notify the user...
			return; // ...and abort command execution.
		};
		if(error || response.statusCode !== 200) { 
		// If 2) There is an error or response code other than 200 (OK)...
			console.log(`An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
			// ...log the unusual request responses/errors...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				msg.author.sendMessage(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user...
				return; // ...and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
			// ...notify the user...
			return; // ...and abort command execution.
		};
		// If there is no error, proceed with the command.
		if(body % 1000000 == 0) {
		// If the current counter is on a full 1-million mark...
			msg.channel.sendMessage(`Current https://megumin.love count is: 🎊🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉🎊`); 
			// ...format counter to x.xxx.xxx and add festive party poppers plus confetti balls.
			return;
		}
		else if(body % 100000 == 0) {
		// If the current counter is on a full 10-thousand mark..
			msg.channel.sendMessage(`Current https://megumin.love count is: 🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉`);
			// ...format counter to x.xxx.xxx and add festive party poppers.
			return;
		};
		// If the current counter is neither on a full 1-million, nor on a full 100-thousand mark...
		msg.channel.sendMessage(`Current https://megumin.love count is: **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}**`); 
		// ...format counter to x.xxx.xxx and send it as-is.
	});
};
exports.desc = "display the website's current counter"; // Export command's description