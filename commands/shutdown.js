const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
/*
INFO: The shutdown command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "shutdown"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { 
		// If the user is not authorized...
		msg.reply("you are not authorized to use this command!");
		// ...notify the user...
		return; // ...and abort command execution.
	};
	msg.reply(`${bot.user.username} shutting down! Bye!`);
	fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][POWER] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	console.log(`${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	setTimeout(function(){ 
		// Define timeout for bot shutdown, in which...
		bot.destroy(); 
		//  ...the bot session is destroyed before killing the node process...
		process.exit(0); 
		// ...and the node process is ended.
	}, 1500); // Set timeout to 1,5 sec after the command is triggered.
};
exports.desc = "shut down the bot remotely [Bot owner only]"; // Export command description