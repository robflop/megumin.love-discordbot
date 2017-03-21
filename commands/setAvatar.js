const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

// INFO: The command will execute whether or not the bot can send messages to the channel. Erorr messages will be sent via PM if it can't.

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "setAvatar";
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	if(!arg.startsWith("http")) {
		if(!botPerm.hasPermission('SEND_MESSAGES')) return msg.author.sendMessage("Invalid file or URL.");
		else return msg.reply("invalid file or URL.");
	};
	if(arg.substr(-4, 4) !== ".png" && arg.substr(-4, 4) !== ".jpg" && arg.substr(-4, 4) !== ".gif" && arg.substr(-5, 5) !== ".jpeg" && arg.substr(-5, 5) !== ".webp") return msg.reply("invalid file format! Only png, jpg/jpeg, gif and webp are allowed.");
	bot.user.setAvatar(arg);
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${timestamp}][AVATAR] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // ... and log command use, when and by whom.
	console.log(`[${timestamp}]${chalk.magenta("[AVATAR]")} ${bot.user.username}'s avatar set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	if(!botPerm.hasPermission('SEND_MESSAGES')) return msg.author.sendMessage(`Successfully set my avatar to '${arg}' ! \n(May not have worked if ratelimit has been capped)`);
	else msg.reply(`successfully set my avatar to '${arg}' ! \n (May not have worked if ratelimit has been capped)`);
};

exports.desc = "change the bot's avatar [Bot owner only]";
exports.syntax = "<url to a picture (png, jpg/jpeg, webp, gif(if nitro))>";