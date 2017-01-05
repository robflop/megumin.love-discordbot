const config = require('../config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing

exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "showLog"; // for logging purposes
	var possibleLogs = [ // Whitelist of logs allowed to display
		config.shutdownLog,
		config.soundLog,
		config.requestLog,
		config.serverLog,
		config.profileLog,
		config.ignoreLog
	];

	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
		msg.reply("you are not authorized to use this command!"); // ... notify the user...
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
		console.log(`${msg.author.username}#${msg.author.discriminator} tried displaying logs on the '${msg.guild}' server, but failed!`);
		return; // ... and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2); // cut out the argument of the command
	var file = ""; // placeholder for file to read

	if (possibleLogs.indexOf(arg) > -1) { // If argument is a valid filename
		file = possibleLogs[possibleLogs.indexOf(arg)]; // Set file to the given filename
	}
	else {
		msg.author.sendMessage("Not a configured log file."); return; // If anything not on the whitelist is given, notify user and abort command execution
	}

	fs.readFile(`${config.logPath + file}`, "utf-8", (error, data) => { // read the given argument file from the default log path
		if(error) {
			msg.author.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); // notify author of errors
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but an error occurred!`); // Log command use, when and by whom
			return; // abort command execution
		};
		msg.author.sendMessage(`\`\`\`${data}\`\`\``, {split: {prepend: "\`\`\`", append: "\`\`\`"}});
		console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server displayed a log file!`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server!`); // Log command use, when and by whom
	});
};
exports.desc = "easily display one of the configured log files [Bot owner only]"; // export command description