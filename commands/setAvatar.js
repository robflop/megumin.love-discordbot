const config = require('../config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
// INFO: The command will execute whether or not the bot can send messages to the channel. Erorr messages will be sent via PM if it can't.
exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "setAvatar"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) {  // If the user is not authorized ...
		msg.reply("you are not authorized to use this command!"); // ... notify the user...
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
		return;  // ... and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2)
	/* 
	Cut off the command part of the message and set the bot's avatar. 
	INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
	Example: "robbot, setAvatar test" -> cut out the length of the prefix and " setAvatar ". 
	*/
	if(!arg.startsWith("http") && !fs.existsSync(arg)) { // If the argument does not begin with http (is not a link) and is not found locally.. 
		if(!permission.hasPermission('SEND_MESSAGES')) { // 1) ...and if the bot can't send to the channel ...
			msg.author.sendMessage("Invalid file or URL."); // ...pm the user the file was not found...
			return; // ...and abort command execution.
		};
		msg.reply("invalid file or URL."); // 2) send a message to the channel notifying the user of the error...
		return; // ... and abort command execution.
	};
	bot.user.setAvatar(arg); // set the bot's avatar to the arg
	msg.reply(`successfully set my avatar to '${arg}' ! \n(May not have worked if ratelimit capped)`);
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	console.log(`${bot.user.username}'s avatar set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
};
exports.desc = "change the bot's Avatar [Bot owner only]"; // export command description