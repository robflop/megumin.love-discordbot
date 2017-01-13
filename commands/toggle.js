const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For file writing
const serverConfig = require('../serverconfig_handler.js'); // Load object of ignored users
var Commands = require('../command_handler.js'); // Load command handler (to get list of commands)

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command function
	var command = "toggle";
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID && (!userPerm.hasPermission("KICK_MEMBERS") || !userPerm.hasPermission("BAN_MEMBERS"))) {
		// If the user is the bot owner and does not have kick or ban permissions...
		msg.reply("you are not authorized to use this command!"); 
		// ...notify the user that they are not authorized...
		return; // ...and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2).toLowerCase();
	// Cut out the argument of the command
	if(arg == "toggle") { return; } // Disallow toggling of toggle command 
	if(fs.existsSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`)) {
	// If the server config (file) for the server the command is called on exists...
		if(!serverConfig.serverConfig[`serverconf_${msg.guild.id}`].hasOwnProperty(arg)) { 
		// 1) ...if the command to be toggled does not exist or is not toggleable...
			msg.reply(`command '${arg}' does not exist or is not toggleable.`);
			// ...notify the user...
			return; // ...and abort command execution.
		};
		if(serverConfig.serverConfig[`serverconf_${msg.guild.id}`][arg] == "enabled") {
		// 2) ...if the command to be toggled is enabled...
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`][arg] = "disabled"
			// ...disable it in the object...
			fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`], null, '\t'));
			// ...write the object to the file...
			msg.reply(`command '${arg}' has been disabled!`);
			// ...and notify the user.
		}
		else {
		// 3) ...if the command to be toggled is disabled...
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`][arg] = "enabled"
			// ...enable it in the object...
			fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`], null, '\t')); 
			// ...write the object to the file...
			msg.reply(`command '${arg}' has been enabled!`);
			// ...and notify the user.
		};
	}
	else {
	// If the file doesn't exist...
		var cmdList = Object.keys(Commands.commands);
		// ...define the command list for use later on...
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`] = {};
		// ...define the serverConfig object for the server...
		for(var i = 0; i < cmdList.length; i++) { 
		// ...loop through each command (key)...
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`][cmdList[i]] = "enabled";
		// ...and push each command plus the default enabled value into the serverConfig object.
		}; 
		if(!serverConfig.serverConfig[`serverconf_${msg.guild.id}`].hasOwnProperty(arg)) { 
		// 1) ...if the command to be toggled does not exist or is not toggleable...
			msg.reply(`command '${arg}' does not exist or is not toggleable.`);
			// ...notify the user...
			return; // ...and abort command execution.
		};
		if(serverConfig.serverConfig[`serverconf_${msg.guild.id}`][arg] == "enabled") {
		// 2) ...if the command to be toggled is enabled...
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`][arg] = "disabled"
			// ...disable it in the object...
			fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`], null, '\t'));
			// ...write the object to the file...
			msg.reply(`command '${arg}' has been disabled!`);
			// ...and notify the user.
		}
		else {
		// 3) ...if the command to be toggled is disabled...
			serverConfig.serverConfig[`serverconf_${msg.guild.id}`][arg] = "enabled"
			// ...enable it in the object...
			fs.writeFile(`${config.serverConfPath}serverconf_${msg.guild.id}.json`, JSON.stringify(serverConfig.serverConfig[`serverconf_${msg.guild.id}`], null, '\t')); 
			// ...write the object to the file...
			msg.reply(`command '${arg}' has been enabled!`);
			// ...and notify the user.
		};
	};
};

exports.desc = "toggle a command (on/off)"; // Export command description