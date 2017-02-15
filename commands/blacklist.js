const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const blacklist = require('../serverconf/blacklist.json'); // Load object of ignored users

exports.main = function(bot, msg, cooldown, botPerm, userPerm) { // Export command's function
    var command = "blacklist"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) {
	// If the user is not the bot owner and does not have kick or ban permissions...
		msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000)); 
		// ...notify the user that they are not authorized...
		return; // ...and abort command execution.
	};
    var guildID = msg.content.substr(config.commandPrefix.length + command.length + 2);
    // Define the guildID argument out of the message content
    var index = blacklist.indexOf(guildID);
    // Define the index of the to-be-blacklisted's guildID within the blacklist
	if(index == -1) {
    // If the guildID is not on the blacklist...
			blacklist.push(guildID);
			// ...push the guildID into the blacklist...
			fs.writeFileSync(`serverconf/blacklist.json`, JSON.stringify(blacklist)); 
			// ...save the array to the file...
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][BLACKLIST] ${msg.author.username}#${msg.author.discriminator} successfully added a server to the blacklist.`);
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
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][BLACKLIST] ${msg.author.username}#${msg.author.discriminator} successfully removed a server from the blacklist.`);
		// ...log command use, when and by whom...
		msg.reply(`ID '${guildID}' is no longer blacklisted!`);
		// ...and notify user of the successful removal.
	};
};

exports.desc = "Blacklist a server, making the bot automatically leave it upon joining [BOT OWNER ONLY]"; // Export command description
exports.syntax = "<guildID to blacklist>"; // Export command syntax