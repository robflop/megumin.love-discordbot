const config = require('../config.json'); // import configuration
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
const ignoreList = require('../ignore.json'); // load array of ignored users
/*
INFO: The ignore command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "ignore"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
		msg.reply("you are not authorized to use this command!"); // ... notify the user...
		fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command, but failed!`); // ... log command use, when and by whom...
		console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried to make the bot ignore a user, but failed!`);
		return; // ... and abort command execution.
	};
	var UserID = msg.content.substr(config.commandPrefix.length + command.length + 2); // Select the mention part of the message (<@(!)..>) for ignoreList purposes
	var match = UserID.match(/<@!?(\d+)>/); // Search for mention syntax, regex courtesy of /u/geo1088 on reddit.
	if(!match) { // If no user mentioned, tell the command caller
		msg.reply('mention a user to put on the list!');	
		return; // abort command execution
	};
	var strippedID = match[1]; // strippedID is now the raw UserID
	var index = ignoreList.indexOf(strippedID); // Get the index of the stripped ID
	if(strippedID !== config.ownerID) { // If the UserID does not correspond to the bot owner ID ...
		if(index == -1) { // 1) ... and is not on the list already ...
			msg.reply(`i am now ignoring ${UserID} !`);
			ignoreList.push(strippedID); // ... push the stripped UserID into the ignore list ... 
			fs.writeFile('ignore.json', JSON.stringify(ignoreList)); // ... and save the array to the file.
			fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully added a user to the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list on the '${msg.guild}' server!`);
		}
		else { // 2) ... but is on the list already ...
			msg.reply(`i am no longer ignoring ${UserID} !`); 
			ignoreList.splice(index, 1); // ... take them out of the list ...
			fs.writeFile('ignore.json', JSON.stringify(ignoreList)); // ... and save the array to the file.
			fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully removed a user from the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list on the '${msg.guild}' server!`);							
		}
	};	
};
exports.desc = "make the bot ignore a user, use a 2nd time to revert [Bot owner only]"; // export command description