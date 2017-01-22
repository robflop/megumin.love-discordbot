const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

// INFO: The command will execute whether or not the bot can send messages to the channel.

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "setUsername"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) {  
		// If the user is not authorized...
		msg.reply("you are not authorized to use this command!"); 
		// ...notify the user...
		return; // ...and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	/* 
	Cut off the command part of the message and set the bot's username. 
	INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
	Example: "robbot, setUsername test" -> cut out the length of the prefix and " setUsername ". 
	*/
	if(msg.content.length == config.commandPrefix.length + command.length + 1) {
	// If there is no argument (only prefix and command)...
		msg.reply("specify a username to set the bot to!");
		// ...notify the user...
		return;	// ...and abort command execution.
	};
	// If there is an argument given,...
	bot.user.setUsername(arg); // ...then set the bot's username to the arg...
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // ...and log command use, when and by whom.
	console.log(`${bot.user.username}'s username set to '${arg}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	msg.reply(`successfully set my username to '${arg}' ! \n(May not have worked if ratelimit capped)`);
	// Notify user of successful command execution
};
exports.desc = "change the bot's username [Bot owner only]"; // Export command description
exports.syntax = "<username to set the bot to>" // Export command syntax