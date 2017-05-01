const fs = require('fs');
const moment = require('moment');
const config = require('../config.json');

exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "clearGame";
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
	const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	client.user.setGame();	// Set game to nothing, clearing it
	fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${timestamp}][STATUS] ${msg.author.tag} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`);
	console.log(`[${timestamp}]${chalk.magenta("[STATUS]")} ${client.user.username}'s game status reset! (${msg.author.tag} on '${msg.guild}')`);
	if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("Game status cleared! \n(May not have worked if ratelimit has been capped)");
	msg.reply("game status cleared! \n(May not have worked if ratelimit has been capped)");
};

exports.desc = "clears the bot's playing status [Bot owner only]";
exports.syntax = "";