const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "setGame";
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
	msgArray.shift(); // remove command call
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	const arg = msgArray.join(" "); // join the rest
	client.user.setGame(arg);
	fs.appendFileSync(`./${config.logPath}${config.profileLog}`, `\n[${timestamp}][STATUS] ${msg.author.tag} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // ...and log command use, when and by whom.
	console.log(`[${timestamp}]${chalk.magenta("[STATUS]")} ${client.user.username}'s game set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}'! (${msg.author.tag} on '${msg.guild}')`);
	if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send(`Successfully set my game to '${arg}' ! \n(May not have worked if ratelimit has been capped)`);
	msg.reply(`successfully set my game to '${arg}' ! \n (May not have worked if ratelimit has been capped or input too long)`);
};

exports.desc = "change the bot's playing status [Bot owner only]";
exports.syntax = "<game to set bot status to>";