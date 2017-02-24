const config = require('../config.json'); // Import configuration
var Commands = require('../command_handler.js'); // Import list of commands
var serverConfig = require('../serverconfig_handler.js'); // Load list of disabled commands

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command's function
	var command = "help"; // For logging purposes
	var commandsExpl = []; 
	// Define commandsExpl array which will have all commands and their corresponding explainations
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	var cmdList = Object.keys(Commands.commands); 
	// Get all command names (keys) from commands object
	if(serverConfig.serverConfig[`serverconf_${msg.guild.id}`] == undefined) { 
	// If there are no disabled commands for the server...
		serverConfig.serverConfig[`serverconf_${msg.guild.id}`] = []; 
		// ...define the list of disabled commands as empty array (to avoid crashes).
	};
	var arg = msg.content.substr(config.commandPrefix.length+command.length+2);
    // Get possible argument from message
    if(arg) {
    // If there is an argument...
        if(cmdList.indexOf(arg) !== -1) {msg.author.sendMessage(`**__Syntax for '${arg}' is:__** \`\`\`${config.commandPrefix + " " + arg + " " + Commands.commands[arg].syntax}\`\`\``);};
        // ...and the argument is in the command list, send the syntax help for it and set auto-delete to 10s.
        return; // Abort command execution
    };
	for(var i = 0; i < cmdList.length; i++) { 
	// Loop through each command (key)
		commandsExpl.push(`\`\`'${cmdList[i]}' -- ${Commands.commands[cmdList[i]].desc}\`\``);
		// Push each command including its description into the commandsExpl array
	}; 
	msg.author.sendMessage(`**__Available commands are:__**\n\n${commandsExpl.join("\n")}\n\n\`\`Use '${config.commandPrefix + " " + command} <commandname>' to get syntax help on a command!\`\`\n\n**Commands disabled on the \`\`${msg.guild.name}\`\` server are: ${serverConfig.serverConfig[`serverconf_${msg.guild.id}`].join(", ")}**`);
	// Join commandsExpl array with newline seperator and send it all as one message
};
exports.desc = "displays this message"; // Export command description
exports.syntax = "<command to get help on, optional>" // Export command syntax