const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "showLog";
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	var possibleLogs = [
		config.shutdownLog,
		config.requestLog,
		config.serverLog,
		config.profileLog,
		config.ignoreLog
	];
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	var file = "";
	if(possibleLogs.indexOf(arg) > -1) file = possibleLogs[possibleLogs.indexOf(arg)];
	else return msg.author.sendMessage(`Not a configured log file. Valid logs are: ${possibleLogs.join(", ")}`);
	fs.readFile(`${config.logPath + file}`, "utf-8", (error, data) => {
		if(error) msg.author.sendMessage(`An error has occured: \`\`\`${error}\`\`\``).then(msg => fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but an error occurred!`));
		msg.author.sendMessage(`\`\`\`${data}\`\`\``, {split: {prepend: "\`\`\`", append: "\`\`\`"}});
		console.log(`[${timestamp}]${chalk.cyan("[SHOWLOG]")} ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server displayed a log file!`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server!`);
	});
};

exports.desc = "easily display one of the configured log files [Bot owner only]";
exports.syntax = "<logFile to display>";