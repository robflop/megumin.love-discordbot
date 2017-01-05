const config = require('../config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
/*
INFO: The shutdown command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "shutdown"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { // Check for authorization
		msg.reply("you are not authorized to use this command!");
		fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][POWER] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
		console.log(`${msg.author.username}#${msg.author.discriminator} tried to shutdown the bot on the '${msg.guild}' server, but failed!`);
		return; // abort command execution
	};
	msg.reply(`${bot.user.username} shutting down! Bye!`);
	fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][POWER] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	console.log(`${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	setTimeout(function(){ // set timeout for bot shutdown
		bot.destroy(); //  destroy bot session before killing node process
		process.exit(0); // End the node process
	}, 1500); // set timeout of 1,5 sec	
};
exports.desc = "shut down the bot remotely [Bot owner only]"; // export command description