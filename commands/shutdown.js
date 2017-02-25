const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
/*
INFO: The shutdown command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command function
	var command = "shutdown"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) {
		// If the user is not authorized...
		return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
		// ...notify the user and abort command execution.
	};
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	// Define timestamp
	msg.reply(`${bot.user.username} shutting down! Bye!`);
	fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${timestamp}][POWER] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	console.log(`[${timestamp}]${chalk.green("[POWER]")} ${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	setTimeout(function(){ 
		bot.destroy().then(()=>{process.exit(0)}); 
		// Sign out robbot and then end the node process
	}, 2000); 
	// Set timeout for shutting down the bot to 2sec after the command is triggered...
};
exports.desc = "shut down the bot remotely [Bot owner only]"; // Export command description
exports.syntax = "" // Export command syntax