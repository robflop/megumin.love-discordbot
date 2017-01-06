const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const ignoreLists = require('../ignore_handler.js'); // Load object of ignored users
/*
INFO: The ignore command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	var command = "ignore"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID && (!userPerm.hasPermission("KICK_MEMBERS") || !userPerm.hasPermission("BAN_MEMBERS"))) {
		// If the user is the bot owner and does not have kick or ban permissions...
		msg.reply("you are not authorized to use this command!"); 
		// ...notify the user that they are not authorized...
		return; // ...and abort command execution.
	};
	var UserID = msg.content.substr(config.commandPrefix.length + command.length + 2); 
	// Select the mention part of the message (<@(!)..>) for ignoreList purposes
	var match = UserID.match(/<@!?(\d+)>/); 
	// Search for mention syntax, regex courtesy of /u/geo1088 on reddit.
	if(!match) { // If noone mentioned...
		msg.reply('mention a user to put on the list!');
		// ...notify the user...
		return; // ...and abort command execution.
	};
	var strippedID = match[1]; 
	// strippedID is now the raw UserID
	if(fs.existsSync(`${config.ignorePath}ignore_${msg.guild.id}.json`)) {
		// If the ignore list (file) for the server the command is called on exists...
		var index = ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].indexOf(strippedID); 
		// ...get the index of the stripped ID on the list. (Check if it is on the list)
		if(strippedID !== config.ownerID) { 
			// If the UserID does not correspond to the bot owner ID...
			if(index == -1) { 
				// 1) ...and is not on the server's list already...
				ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].push(strippedID); 
				// ...push the stripped UserID into the server's ignore list... 
				fs.writeFile(`${config.ignorePath}ignore_${msg.guild.id}.json`, JSON.stringify(ignoreLists.ignoreLists[`ignore_${msg.guild.id}`])); 
				// ...save the object to the server's file...
				fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully added a user to the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list of the '${msg.guild}' server!`);
				msg.reply(`i am now ignoring ${UserID} !`); 
				// ...and notify user of the successful addition.
			}
			else { 
				// 2) ...but is on the server's list already...
				ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].splice(index, 1); 
				// ...take them out of the server's list...
				fs.writeFile(`${config.ignorePath}ignore_${msg.guild.id}.json`, JSON.stringify(ignoreLists.ignoreLists[`ignore_${msg.guild.id}`])); 
				// ...save the object to the server's file...
				fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully removed a user from the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list of the '${msg.guild}' server!`);	
				msg.reply(`i am no longer ignoring ${UserID} !`); 
				// ...and notify user of the successful removal.
			}
		};
	}
	else { // If no ignore list (file) for the server the command came from exists...
		if(strippedID !== config.ownerID) {
		// ...and the UserID does not correspond to the bot owner ID...
			ignoreLists.ignoreLists[`ignore_${msg.guild.id}`] = []; 
			// ...define the ignore list of the server in the ignoreLists object...
			ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].push(strippedID); 
			// ...push the stripped UserID into the now-defined ignore list of the server...
			fs.writeFile(`${config.ignorePath}ignore_${msg.guild.id}.json`, JSON.stringify(ignoreLists.ignoreLists[`ignore_${msg.guild.id}`])); 
			// ...save the file...
			fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully added a user to the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list of the '${msg.guild}' server!`);
			msg.reply(`i am now ignoring ${UserID} !`); 
			// ...and notify user of the successful addition.
		}
	}
};
exports.desc = "make the bot ignore a user, use a 2nd time to revert [Bot owner or Kick/Ban Permission required]"; // Export command description