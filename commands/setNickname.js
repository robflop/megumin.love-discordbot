const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

// INFO: The command will execute whether or not the bot can send messages to the channel.

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command's function
	var command = "setNickname"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID && (!userPerm.hasPermission("KICK_MEMBERS") || !userPerm.hasPermission("BAN_MEMBERS"))) {
	// If the user is not the bot owner and does not have kick or ban permissions...
		msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000)); 
		// ...notify the user that they are not authorized...
		return; // ...and abort command execution.
	};
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	// Define timestamp
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	/* 
	Cut off the command part of the message and set the bot's nickname on the server the command is called on. 
	INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
	Example: "robbot, setNickname test" -> cut out the length of the prefix and " setNickname ". 
	*/
	if(msg.content.length == config.commandPrefix.length + command.length + 1) {
	// If there is no argument (only prefix and command)...
		msg.reply("specify a nickname to set the bot to!");
		// ...notify the user...
		return;	// ...and abort command execution.
	};
	// If there is an argument given,...
	msg.guild.member(bot.user).setNickname(arg); 
	// ...then set the bot's nickname to the argument...
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${timestamp}][NICKNAME] ${msg.author.username}#${msg.author.discriminator} set ${bot.user.username}'s nickname to '${arg}' on the '${msg.guild}' server!`); 
	// ...and log command use, when and by whom.
	console.log(`[${timestamp}]${chalk.magenta("[NICKNAME]")} ${bot.user.username}'s nickname set to '${arg}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	msg.reply(`successfully set my nickname to '${arg}' ! \n(May not have worked if the bot isn't allowed to set its own nickname)`);
	// Notify user of successful command execution
};
exports.desc = "set the bot's nickname for this server [Bot owner or Kick/Ban Permission required]"; // Export command description
exports.syntax = "<nickname to set the bot to>" // Export command syntax