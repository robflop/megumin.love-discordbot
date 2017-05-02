const config = require('../config.json');
const request = require('request');
const fs = require('fs');
const moment = require('moment');
/*
INFO: The POST command goes into action whether the confirmation mesage can be sent or not.
Some messages will be PM'd if there is no send permission, some will not be sent at all if there is not.
*/
exports.main = function(client, msg, msgArray, checks, chalk) {
	if(config.useDiscordBots) {
		const command = "POST";
		if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
		const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
		request.post(
			{ headers: { 'Authorization': `${config.discordBotsAPI}`, 'Content-type': 'application/json; charset=utf-8' },
				url: `https://bots.discord.pw/api/bots/${client.user.id}/stats`,
				body: `{"server_count": ${client.guilds.size}}`
			},
			function (error, response, body) {
				if(response == undefined) {
					console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} No response was emitted when POSTing to the website -- Refer to request logs`);
					fs.appendFileSync(`./${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Undefined response | ${error}`);
					if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send(`Error contacting the website, response code is undefined. Please refer to '${config.logPath}${config.requestLog}'.`);
					return msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
				};
				if(error || response.statusCode !== 200) {
					console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
					fs.appendFileSync(`./${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Unusual response code | ${response.statusCode}`);
					if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
					return msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
				};
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST] POST request successfully sent! (${response.statusCode})`);
				msg.reply('POST request sent successfully!');
			}
		);
	};
};

exports.desc = "update the server count on the Discord Bots website (enable command in config) [Bot owner only]";
exports.syntax = "";