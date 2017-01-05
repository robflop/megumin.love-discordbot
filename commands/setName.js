const config = require('../config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
// INFO: The command will execute whether or not the bot can send messages to the channel.
exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "setName"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) {  // If the user is not authorized ...
		msg.reply("you are not authorized to use this command!"); // ... notify the user...
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
		return; // ... and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2)
	/* 
	Cut off the command part of the message and set the bot's username. 
	INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
	Example: "robbot, setName test" -> cut out the length of the prefix and " setName ". 
	*/
	if(msg.content.length == config.commandPrefix.length + command.length + 1) {
		msg.reply("specify a name to set the bot to!");
		return;	
	};
	bot.user.setUsername(arg); // set the bot's username to the arg
	msg.reply(`successfully set my username to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! \n(May not have worked if ratelimit capped)`);
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	console.log(`${bot.user.username}'s username set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`) 
};
exports.desc = "change the bot's username [Bot owner only]"; // export command description