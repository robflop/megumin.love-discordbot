const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

// INFO: The command will execute whether or not the bot can send messages to the channel. Erorr messages will be sent via PM if it can't.

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command function
	var command = "setAvatar"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	if(msg.author.id !== config.ownerID) {  
	// If the user is not authorized...
		msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000)); 
		// ...notify the user...
		return; // ...and abort command execution.
	};
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	// Define timestamp
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	/* 
	Cut off the command part of the message and set the bot's avatar. 
	INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
	Example: "robbot, setAvatar test" -> cut out the length of the prefix and " setAvatar ". 
	*/
	if(!arg.startsWith("http")) { 
	// If the argument does not begin with http (is not a link)...
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
	if(arg.substr(-4, 4) !== ".png" && arg.substr(-4, 4) !== ".jpg" && arg.substr(-4, 4) !== ".gif" && arg.substr(-5, 5) !== ".jpeg" && arg.substr(-5, 5) !== ".webp") {
	// If the argument file is not a png, jpg/jpeg, gif or webp, reject it
		msg.reply("invalid file format! Only png, jpg/jpeg, gif and webp are allowed.");
		// ...notify the user of the limitations, set auto-delete to 2s...
		return; // ...and abort command execution.
	};
	bot.user.setAvatar(arg);
	// Set the bot's avatar to the supplied file...
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${timestamp}][AVATAR] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // ... and log command use, when and by whom.
	console.log(`[${timestamp}]${chalk.magenta("[AVATAR]")} ${bot.user.username}'s avatar set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  
	// If the bot can't send to the channel...
		msg.author.sendMessage(`Successfully set my avatar to '${arg}' ! \n(May not have worked if ratelimit has been capped)`); 
		// ...PM the user...
		return; // ...and abort command execution.
	};
	// If the bot can send to the channel...
	msg.reply(`successfully set my avatar to '${arg}' ! \n (May not have worked if ratelimit has been capped)`);
	// ...notify the user of the successful command execution.
};
exports.desc = "change the bot's avatar [Bot owner only]"; // Export command description
exports.syntax = "<url to a picture (png, jpg/jpeg, webp, gif (if nitro))>" // Export command syntax