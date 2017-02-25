const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const blacklist = require('../serverconf/blacklist.json'); // Load object of ignored users

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command's function
    var command = "blacklist"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) {
	// If the user is not the bot owner and does not have kick or ban permissions...
		return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000)); 
		// ...notify the user that they are not authorized and abort command execution.
	};
    var guildID = msg.content.substring(config.commandPrefix.length + command.length + 2);
	// Define the guildID argument out of the message content
	var toFind; 
    // Define the toFind placeholder
    var index = blacklist.indexOf(guildID);
    // Define the index of the to-be-blacklisted's guildID within the blacklist
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss'); 
	// Define timestamp
	if(guildID.startsWith("find")) {
	// If the guildID argument starts with "find", use the index to notify the user if an ID is on the blacklist
		guildID = "find";
		toFind = msg.content.substring(msg.content.indexOf(guildID)+guildID.length+1);
		// Assign the toFind argument out of the msg content
		index = blacklist.indexOf(toFind);
		// Redefine the index to search the blacklist for the to-be-located guildID
		if(index == -1) {msg.reply(`Guild ID '${toFind}' was not found on the blacklist!`); return;};
		// If a guildID is not on the blacklist, tell the user and abort command execution
		return msg.reply(`Guild ID '${toFind}' was found at position ${index} of the blacklist!`);
		// If a guildID is on the blacklist, tell the user the position and abort command execution to prevent below code execution
	};
	if(index == -1) {
    // If the guildID is not on the blacklist...
			blacklist.push(guildID);
			// ...push the guildID into the blacklist...
			fs.writeFileSync(`serverconf/blacklist.json`, JSON.stringify(blacklist)); 
			// ...save the array to the file...
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][BLACKLIST] ${msg.author.username}#${msg.author.discriminator} successfully added a server to the blacklist.`);
			// ...log command use, when and by whom...
			msg.reply(`ID '${guildID}' is now blacklisted!`); 
			// ...and notify user of the successful addition.
	}
	else {
	// If the guildID is on the blacklist...
		blacklist.splice(index, 1);
		// ...take it out of the blacklist...
		fs.writeFileSync(`serverconf/blacklist.json`, JSON.stringify(blacklist));
		// ...save the array to the file...
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][BLACKLIST] ${msg.author.username}#${msg.author.discriminator} successfully removed a server from the blacklist.`);
		// ...log command use, when and by whom...
		msg.reply(`ID '${guildID}' is no longer blacklisted!`);
		// ...and notify user of the successful removal.
	};
};

exports.desc = "Blacklist a server, making the bot automatically leave it upon joining [Bot owner only]"; // Export command description
exports.syntax = "<guildID to blacklist or 'find' argument> <guildID to search for if using 'find' arg>"; // Export command syntax