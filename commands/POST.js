const config = require('../config.json'); // import configuration
const request = require('request'); // for website interaction
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
/*
INFO: The POST command goes into action whether the confirmation mesage can be sent or not. 
Some messages will be PM'd if there is no send permission, some will not be sent at all if there is not.
*/
exports.main = function(bot, msg, timeout, permission) { // export command function
	if(config.useDiscordBots) {
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!"); // ... notify the user...
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command, but failed!`); // ... log command use, when and by whom...
			console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried to POST the bot's DiscordBots server list, but failed!`);
			return; // ... and abort command execution.
		};
		var command = "POST"; // for logging purposes
		request.post( // Send POST request
			{
				headers: { // Set discordbots API header and json content type
					'Authorization': `${config.discordBotsAPI}`, // send Discord Bots API Token in auth header
					'Content-type': 'application/json; charset=utf-8' // set encoding to JSON + UTF-8
				},
				url: `https://bots.discord.pw/api/bots/${bot.user.id}/stats`, // set URL to discordbots api stats
				body: `{"server_count": ${bot.guilds.size}}` // send the bot's server count in body
			}, 
			function (error, response, body) {
				if(error || response.statusCode !== 200) { // Check for errors or response codes other than 200 (OK)
					console.log(`An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
					fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
					// Log any unusual request 	responses
					if(!permission.hasPermission('SEND_MESSAGES')) { // If the bot can't send to the channel...
						msg.author.sendMessage(`An error during the POST request has occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
						// ...PM the author of the msg	
						return;	
					};
					msg.reply(`an error during the POST request has occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
					return; // abort command execution
				};
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST] POST request successfully sent! (${response.statusCode})`); 
				// Log what was done and when
				console.log(`The '${command}' command was successfully used by ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server!`);
				msg.reply('POST request sent successfully!');
			}
		);
	};
};
exports.desc = "update the server count on the Discord Bots website (enable command in config) [Bot owner only]"; // export command description