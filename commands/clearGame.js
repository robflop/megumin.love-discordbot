const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
const config = require('../config.json'); // import configuration

exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "clearGame"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
		msg.reply("you are not authorized to use this command!"); // ... notify the user...
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command, but failed!`); // ... log command use, when and by whom...
		console.log(`${msg.author.username}#${msg.author.discriminator} tried to clear the bot's game on the '${msg.guild}' server, but failed!`);
		return; // ... and abort command execution.
	};
	bot.user.setGame();	// set game to nothing, clearing it
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command!`); // Log command use, when and by whom
	console.log(`${bot.user.username}'s game status reset! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	if(!permission.hasPermission('SEND_MESSAGES')) {  // If the bot can't send to the channel...
		msg.author.sendMessage("Game status cleared! \n(May not have worked if ratelimit has been capped)");  // ...PM the user...
		return; // ... and abort command execution.
	};
	msg.reply("game status cleared! \n(May not have worked if ratelimit has been capped)");
};
exports.desc = "clears the bot's playing status [Bot owner only]"; // export command description