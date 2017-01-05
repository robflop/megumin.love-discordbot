const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
/*
INFO: The POST command goes into action whether the confirmation mesage can be sent or not. 
Some messages will be PM'd if there is no send permission, some will not be sent at all if there is not.
*/
exports.main = function(bot, msg, timeout, permission) { // Export command function
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
				if(error || response.statusCode !== 200) { 
					// If there is an error or unusual response code...
					console.log(`An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
					fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
					// ...log the unusual request responses/errors...
					if(!permission.hasPermission('SEND_MESSAGES')) { 
						// ... 1) and if the bot can't send to the channel...
						msg.author.sendMessage(`An error during the POST request has occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
						// ...PM the user...
						return; // ...and abort command execution.
					};
					// ... 2) and if the bot can send to the channel...
					msg.reply(`an error during the POST request has occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
					// ...notify the user...
					return; // ...and abort command execution.
				};
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST] POST request successfully sent! (${response.statusCode})`); 
				// Log what was done and when
				msg.reply('POST request sent successfully!'); // Notify the user of the successful code execution
			}
		);
	};
};
exports.desc = "update the server count on the Discord Bots website (enable command in config) [Bot owner only]"; // export command description