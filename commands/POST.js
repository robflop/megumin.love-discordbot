const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
/*
INFO: The POST command goes into action whether the confirmation mesage can be sent or not. 
Some messages will be PM'd if there is no send permission, some will not be sent at all if there is not.
*/
exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	if(config.useDiscordBots) {
		if(timeout.check(msg.author.id, msg)) { return; }; 
		// Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { 
			// If the user is not authorized...
			msg.reply("you are not authorized to use this command!"); 
			// ...notify the user...
			return; // ...and abort command execution.
		};
		var command = "POST"; // For logging purposes
		request.post( // Send POST request
			{
				headers: { 
					// Set discordbots API header and json content type
					'Authorization': `${config.discordBotsAPI}`, 
					// Send Discord Bots API Token in the auth header
					'Content-type': 'application/json; charset=utf-8' 
					// Set encoding to JSON + UTF-8
				},
				url: `https://bots.discord.pw/api/bots/${bot.user.id}/stats`, 
				// Set URL to discordbots stats api
				body: `{"server_count": ${bot.guilds.size}}` 
				// Send the bot's server count in the body
			}, 
			function (error, response, body) {
				if(response == undefined) {
					// If 1) the response is undefined...
					console.log(`No response was emitted when POSTing to the website -- Refer to request logs`);
					fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) Undefined response | ${error}`); 
					// ...log it and the error...
					if(!botPerm.hasPermission('SEND_MESSAGES')) { 
						// ... a) and if the bot can't send to the channel...
						msg.author.sendMessage(`Error contacting the website, response code is undefined. Please refer to '${config.logPath}${config.requestLog}'.`);
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
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST] POST request successfully sent! (${response.statusCode})`); 
				// Log what was done and when
				msg.reply('POST request sent successfully!'); // Notify the user of the successful code execution
			}
		);
	};
};
exports.desc = "update the server count on the Discord Bots website (enable command in config) [Bot owner only]"; // Export command description
exports.syntax = "" // Export command syntax