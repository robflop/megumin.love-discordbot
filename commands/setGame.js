const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "setGame";
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	bot.user.setGame(arg);
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${timestamp}][STATUS] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // ...and log command use, when and by whom.
	console.log(`[${timestamp}]${chalk.magenta("[STATUS]")} ${bot.user.username}'s game set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}'! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	if(!botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send(`Successfully set my game to '${arg}' ! \n(May not have worked if ratelimit has been capped)`);
	else msg.reply(`successfully set my game to '${arg}' ! \n (May not have worked if ratelimit has been capped)`);
};

exports.desc = "change the bot's playing status [Bot owner only]";
exports.syntax = "<game to set bot status to>";