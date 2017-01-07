const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  
		// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...PM the user...
		return;	// ...and abort command execution.
	};
	var command = "stats"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { 
		// If the user is not authorized ...
		msg.reply("you are not authorized to use this command!");  
		// ...notify the user...
		return;  // ...and abort command execution.
	}
	msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); 
	// Log command use, when and by whom
};
exports.desc = "display various other bot stats [Bot owner only]"; // Export command description