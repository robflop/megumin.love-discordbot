const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

// INFO: The command will execute whether or not the bot can send messages to the channel.

exports.main = function(client, msg, msgArray, cooldown, botPerm, userPerm, chalk) {
	var command = "setNickname";
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.author.id !== config.ownerID && (!userPerm.hasPermission("KICK_MEMBERS") || !userPerm.hasPermission("BAN_MEMBERS"))) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	msgArray.shift(); // remove command call
	var arg = msgArray.join(" "); // join the rest
	if(msg.content.length == config.commandPrefix.length + command.length + 1) return msg.reply("specify a nickname to set the bot to!");
	if(arg.length<2 || arg.length>32) return msg.reply("username must be longer than 2 characters and shorter than 32!");
	msg.guild.member(client.user).setNickname(arg);
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${timestamp}][NICKNAME] ${msg.author.username}#${msg.author.discriminator} set ${client.user.username}'s nickname to '${arg}' on the '${msg.guild}' server!`);
	console.log(`[${timestamp}]${chalk.magenta("[NICKNAME]")} ${client.user.username}'s nickname set to '${arg}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
	msg.reply(`successfully set my nickname to '${arg}' ! \n(May not have worked if the bot isn't allowed to set its own nickname)`);
};

exports.desc = "set the bot's nickname for this server [Bot owner or Kick/Ban Permission required]";
exports.syntax = "<nickname to set the bot to>";