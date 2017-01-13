var Commands = require('../command_handler.js'); // Import list of commands
var serverConfig = require('../serverconfig_handler.js'); // Load list of disabled commands

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	var command = "help"; // For logging purposes
	var commandsExpl = []; 
	// Array which will have all commands and their corresponding explainations
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	var cmdList = Object.keys(Commands.commands); 
	// Get all command names (keys) from commands object
	if(serverConfig.serverConfig[`serverconf_${msg.guild.id}`] == undefined) { 
	// If there are no disabled commands for the server...
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`] = []; 
		// ...define the list of disabled commands as empty array (to avoid crashes).
	}
	for(var i = 0; i < cmdList.length; i++) { 
	// Loop through each command (key)
		commandsExpl.push(`'${cmdList[i]}' -- ${Commands.commands[cmdList[i]].desc}`);
		// Push each command including its description into the commandsExpl array
	}; 
	msg.author.sendMessage(`**__Available commands are:__**\n\n${commandsExpl.join("\n")}\n\n**Commands disabled on the \`\`${msg.guild.name}\`\` server are: ${serverConfig.serverConfig[`serverconf_${msg.guild.id}`].join(",")}**`);
	// Join commandsExpl array with newline seperator and send it all as one message
};
exports.desc = "displays this message"; // Export command description