const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For file writing
const serverConfig = require('../serverconfig_handler.js'); // Load object of ignored users
var Commands = require('../command_handler.js'); // Load command handler (to get list of commands)
/*
INFO: The toggle command goes into effect whether the bot can send the confirmation message or not.
*/
exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "toggle"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID && (!userPerm.hasPermission("KICK_MEMBERS") || !userPerm.hasPermission("BAN_MEMBERS"))) {
		// If the user is not the bot owner and does not have kick or ban permissions...
		msg.reply("you are not authorized to use this command!"); 
		// ...notify the user that they are not authorized...
		return; // ...and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2).toLowerCase();
	// Cut out the argument of the command
	if(arg == "toggle" || arg == "help" || Object.keys(Commands.commands).indexOf(arg) == -1) { return; } 
	// Disallow toggling of the toggle/help command and any non-existing commands
	if(fs.existsSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`)) {
	// If the disabled commands list (file) for the server the command is called on exists...
		var index = serverConfig.serverConfig[`serverconf_${msg.guild.id}`].indexOf(arg);
		// Define index as the position of the command to be disabled/enabled
		if(index == -1) { 
		// 1) If the command isn't on the list of disabled commands...
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`].push(arg);
			// ...put it on the list...
			fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
			// ...save to the file...
			msg.reply(`command '${arg}' has been disabled!`);
			// ...and notify the user.
			return; // Abort command execution to prevent running below code
		};
		// 2) If the command is already on the list of disabled commands...
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`].splice(index, 1); 
		// ...take it out...
		fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
		// ...save to the file...
		msg.reply(`command '${arg}' has been enabled!`);
		// ...and notify the user.	
	}
	else {
	// If the file doesn't exist...
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`] = [];
		// ...define the serverConfig array for the server.
		var index = serverConfig.serverConfig[`serverconf_${msg.guild.id}`].indexOf(arg);
		// Define index as the position of the command to be disabled/enabled
		if(index == -1) { 
		// 1) If the command isn't on the list of disabled commands...
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`].push(arg);
			// ...put it on the list...
			fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
			// ...save to the file...
			msg.reply(`command '${arg}' has been disabled!`);
			// ...and notify the user.
			return; // Abort command execution to prevent running below code
		};
		// 2) If the command is already on the list of disabled commands...
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`].splice(index, 1); 
		// ...take it out...
		fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`]));
		// ...save to the file...
		msg.reply(`command '${arg}' has been enabled!`);
		// ...and notify the user.	
	};
};

exports.desc = "toggle a command server-wide (on/off) [Bot owner or Kick/Ban Permission required]"; // Export command description