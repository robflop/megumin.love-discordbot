const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');
/*
INFO: The shutdown command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(client, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "shutdown";
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	msg.reply(`${client.user.username} shutting down! Bye!`);
	fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${timestamp}][POWER] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	console.log(`[${timestamp}]${chalk.green("[POWER]")} ${client.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	setTimeout(function() { client.destroy().then(()=>{process.exit(0)}) }, 2000);
};

exports.desc = "shut down the bot remotely [Bot owner only]";
exports.syntax = "";