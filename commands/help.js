var commands = require('../command_handler.js'); // Import list of commands

exports.main = function(bot, msg, timeout, permission) { // Export command's function
	var command = "help"; // For logging purposes
	var commandsExpl = []; 
	// Array which will have all commands and their corresponding explainations
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	var cmdList = Object.keys(commands.commands); 
	// Get all command names (keys) from commands object
	for(var i = 0; i < cmdList.length; i++) { 
		// Loop through each command (key)
		commandsExpl.push(`'${cmdList[i]}' -- ${commands.commands[cmdList[i]].desc}`);
		// Push each command including its description into the commandsExpl array
	}; 
	msg.author.sendMessage(`**__Available commands are:__**\n\n${commandsExpl.join("\n")}`);
	// Join commandsExpl array with newline seperator and send it all as one message
};
exports.desc = "displays this message"; // Export command's description