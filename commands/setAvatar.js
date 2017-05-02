const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

// INFO: The command will execute whether or not the bot can send messages to the channel. Erorr messages will be sent via PM if it can't.

exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "setAvatar";
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	if(msg.content.length == config.commandPrefix.length + 1 + command.length) return msg.reply("specify a picture (URL) to set the bot's avatar to!");
	const arg = msgArray[1];
	if(!arg.startsWith("http")) {
		if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("Invalid URL!");
		return msg.reply("invalid URL!");
	};
	const validFormats = [".png", ".jpg", ".gif", ".webp"];
	if(!validFormats.includes(arg.substr(-4, 4))) return msg.reply("invalid file format! Only png, jpg, gif and webp are allowed.");
	client.user.setAvatar(arg);
	fs.appendFileSync(`./${config.logPath}${config.profileLog}`, `\n[${timestamp}][AVATAR] ${msg.author.tag} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`);
	console.log(`[${timestamp}]${chalk.magenta("[AVATAR]")} ${client.user.username}'s avatar set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.tag} on '${msg.guild}')`);
	if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send(`Successfully set my avatar to '${arg}' ! \n(May not have worked if ratelimit has been capped)`);
	msg.reply(`successfully set my avatar to '${arg}' ! \n (May not have worked if ratelimit has been capped)`);
};

exports.desc = "change the bot's avatar [Bot owner only]";
exports.syntax = "<url to a picture (png, jpg/jpeg, webp, gif(if nitro))>";