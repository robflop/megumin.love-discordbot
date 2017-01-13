const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

// INFO: The command will execute whether or not the bot can send messages to the channel. Erorr messages will be sent via PM if it can't.

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "setAvatar"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	if(msg.author.id !== config.ownerID) {  
		// If the user is not authorized...
		msg.reply("you are not authorized to use this command!"); 
		// ...notify the user...
		return; // ...and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	/* 
	Cut off the command part of the message and set the bot's avatar. 
	INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
	Example: "robbot, setAvatar test" -> cut out the length of the prefix and " setAvatar ". 
	*/
	if(!arg.startsWith("http") && !fs.existsSync(arg)) { 
		// If the argument does not begin with http (is not a link) and is not found locally... 
		if(!botPerm.hasPermission('SEND_MESSAGES')) { 
			// ... 1) and if the bot can't send to the channel ...
			msg.author.sendMessage("Invalid file or URL."); 
			// ...notify the user of the error via PM...
			return; // ...and abort command execution.
		};
		// ... 2) and if the bot send a message to the channel 
		msg.reply("invalid file or URL."); 
		// ...notify the user of the error...
		return; // ...and abort command execution.
	};
	bot.user.setAvatar(arg); // Set the bot's avatar to the arg...
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // ... and log command use, when and by whom.
	console.log(`${bot.user.username}'s avatar set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  // If the bot can't send to the channel...
		msg.author.sendMessage(`Successfully set my game to '${arg}' ! \n(May not have worked if ratelimit has been capped)`); 
		// ...PM the user...
		return; // ...and abort command execution.
	};
	// If the bot can send to the channel...
	msg.reply(`successfully set my game to '${arg}' ! \n (May not have worked if ratelimit has been capped)`);
	// ...notify the user of the successful command execution.
};
exports.desc = "change the bot's avatar [Bot owner only]"; // Export command description