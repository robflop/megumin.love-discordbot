const config = require('../config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing

exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "setGame"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
		msg.reply("you are not authorized to use this command!"); // ... notify the user...
		console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried to change the bot's game, but failed!`);
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
		return; // ... and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	bot.user.setGame(arg); 
	/* 
	Cut off the command part of the message and set the bot's game. 
	INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
	Example: "robbot, setGame test" -> cut out the length of the prefix and " setGame ". 
	*/
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	console.log(`${bot.user.username}'s game set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}'! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	if(!permission.hasPermission('SEND_MESSAGES')) {  // If the bot can't send to the channel...
		msg.author.sendMessage(`Successfully set my game to '${arg}' ! \n(May not have worked if ratelimit has been capped)`); 
		// ...PM the user...
		return; // ... and abort command execution.
	};
	msg.reply(`successfully set my game to '${arg}' ! \n (May not have worked if ratelimit has been capped)`);
};
exports.desc = "change the bot's playing status [Bot owner only]"; // export command description