var commands = require('../command_handler.js'); // to be able to send an accurate command list

exports.main = function(bot, msg, timeout, permission) { // export command function
	var command = "help"; // for logging purposes
	var commandsExpl = []; // Array which will have all commands and their corresponding explainations
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	var cmdList = Object.keys(commands.commands); // Get all command names (keys) from commands object
	for(var i = 0; i < cmdList.length; i++) { // loop through each command (key)
		commandsExpl.push(`'${cmdList[i]}' -- ${commands.commands[cmdList[i]].desc}`);
		// push each command including its description into the commandsExpl array
	}; 
	msg.author.sendMessage(`**__Available commands are:__**\n\n${commandsExpl.join("\n")}`);
	// join commandsExpl array with newline seperator and send it all as one message
};
exports.desc = "displays this message"; // export command description