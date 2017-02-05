const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const config = require('../config.json'); // Import configuration

exports.main = function(bot, msg, cooldown, botPerm, userPerm) { // Export command's function
	var command = "clearGame"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg) == true) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { 
		// If the user is not authorized...
		msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000)); 
		// ...notify the user...
		return; // ...and abort command execution.
	};
	bot.user.setGame();	// Set game to nothing, clearing it
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); 
	// Log command use, when and by whom
	console.log(`${bot.user.username}'s game status reset! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  
	// If the bot can't send to the channel...
		msg.author.sendMessage("Game status cleared! \n(May not have worked if ratelimit has been capped)"); 
		// ...PM the user...
		return; // ...and abort command execution.
	};
	msg.reply("game status cleared! \n(May not have worked if ratelimit has been capped)");
	// Notify the user of the succesful command execution
};
exports.desc = "clears the bot's playing status [Bot owner only]"; // Export command description
exports.syntax = "" // Export command syntax