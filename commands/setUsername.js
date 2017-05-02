const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

// INFO: The command will execute whether or not the bot can send messages to the channel.

exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "setUsername";
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	msgArray.shift(); // remove command call
	const arg = msgArray.join(" "); // join the rest
	if(msg.content.length == config.commandPrefix.length + command.length + 1) return msg.reply("specify a username to set the bot to!");
	if(arg.length<2 || arg.length>32) return msg.reply("username must be at least 2 characters long but shorter than 32!");
	client.user.setUsername(arg);
	fs.appendFileSync(`./${config.logPath}${config.profileLog}`, `\n[${timestamp}][USERNAME] ${msg.author.tag} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // ...and log command use, when and by whom.
	console.log(`[${timestamp}]${chalk.magenta("[USERNAME]")} ${client.user.username}'s username set to '${arg}' ! (${msg.author.tag} on '${msg.guild}')`);
	msg.reply(`successfully set my username to '${arg}' ! \n(May not have worked if ratelimit capped)`);
};

exports.desc = "change the bot's username [Bot owner only]";
exports.syntax = "<username to set the bot to>";