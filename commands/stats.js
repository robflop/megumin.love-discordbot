const config = require('../config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing

exports.main = function(bot, msg, timeout, permission) { // export command function
	if(!permission.hasPermission('SEND_MESSAGES')) {  // If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); // ...PM the user...
		return;	// ... and abort command execution.
	};
	var command = "stats"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
		msg.reply("you are not authorized to use this command!");  // ... notify the user...
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
		return;  // ... and abort command execution.
	}
	msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
};
exports.desc = "display various other bot stats [Bot owner only]"; // export command description