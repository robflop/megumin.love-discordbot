const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

// INFO: The command will execute whether or not the bot can send messages to the channel.

exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "setNickname";
	if(msg.author.id !== config.ownerID && (!checks.userPerm.hasPermission("KICK_MEMBERS") || !checks.userPerm.hasPermission("BAN_MEMBERS"))) return msg.reply("you are not authorized to use this command!");
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	msgArray.shift(); // remove command call
	const arg = msgArray.join(" "); // join the rest
	if(msg.content.length == config.commandPrefix.length + command.length + 1) return msg.reply("specify a nickname to set the bot to!");
	if(arg.length<2 || arg.length>32) return msg.reply("nickname must be at least 2 characters long but shorter than 32!");
	msg.guild.member(client.user).setNickname(arg);
	fs.appendFileSync(`./${config.logPath}${config.profileLog}`, `\n[${timestamp}][NICKNAME] ${msg.author.tag} set ${client.user.username}'s nickname to '${arg}' on the '${msg.guild}' server!`);
	console.log(`[${timestamp}]${chalk.magenta("[NICKNAME]")} ${client.user.username}'s nickname set to '${arg}' ! (${msg.author.tag} on '${msg.guild}')`);
	msg.reply(`successfully set my nickname to '${arg}' ! \n(May not have worked if the bot isn't allowed to set its own nickname)`);
};

exports.desc = "set the bot's nickname for this server [Bot owner or Kick/Ban Permission required]";
exports.syntax = "<nickname to set the bot to>";