const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
var history = require('../counter_history.json') // For adding/removing from counter history

exports.main = function(bot, msg, timeout, botPerm, userPerm) { // Export command's function
	var command = "counter"; // For logging purposes
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  
		// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...notify the user...
		return;	// ...and abort command execution.
	}
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.content.substr(config.commandPrefix.length + command.length + 2) == "history") {
	// If "history" argument is called..
		fs.readFile("counter_history.json", "utf-8", (error, data) => {
			if(error) {
				// If an error occurs,...
				msg.channel.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); // ...then notify author of the error...
				return; // ...and abort command execution.
			};
			// If there is no error...
			msg.channel.sendMessage(`**__Here is an overview of the counter's saved progress history__**:\n\`\`\`${JSON.parse(data).join("\n")}\`\`\``,  {split: {prepend: "\`\`\`", append: "\`\`\`"}});
			// ...output the parsed counter history to the user.
		});
		return; // Abort command execution to prevent further code execution
	};
	if(msg.content.substr(config.commandPrefix.length + command.length + 2) == "append") {
		if(msg.author.id !== config.ownerID) {
			msg.channel.sendMessage("You are not authorized to modify the counter history.");
			return;
		};
		var newCounter = "";
		// Define placeholder for newest history entry
		request.get('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) {
		// Get the current counter number from the website 
			if(response == undefined) {
			// If the response is undefined...
					msg.channel.sendMessage("Response undefined when getting the counter, command execution aborted.");
					return; // ...abort command execution.
				};
				if(error || response.statusCode !== 200) {
					msg.channel.sendMessage(`An error has occured or the response code was not "200 OK": \`\`\`${error}\`\`\`\nCommand execution aborted.`);
					return; // ...abort command execution.
			};
			newCounter = `${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} ${moment().format('HH:mm')} ${moment().format('DD/MM/YY')}`;
			// Define the new history entry
			history.push(newCounter);
			// Push the new entry into the history
			fs.writeFile("counter_history.json", JSON.stringify(history), "utf-8", (error, data) => {
				if(error) {
					// If an error occurs,...
					msg.channel.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); 
					// ...then notify author of the error...
					return; // ...and abort command execution.
				};
				// If there is no error...
				msg.channel.sendMessage(`New entry successfully added: \`\`${newCounter}\`\``);
				// ...output the parsed counter history to the user.
			});
		});
		return; // Abort command execution to prevent further code execution		
	};
	if(msg.content.substr(config.commandPrefix.length + command.length + 2) == "revert" ) {
		if(msg.author.id !== config.ownerID) {
			msg.channel.sendMessage("You are not authorized to modify the counter history.");
			return;
		};
		history.pop(); // Remove last history entry
		fs.writeFile("counter_history.json", JSON.stringify(history), "utf-8", (error, data) => {
		// Write the new JSON-ified history array to the file
			if(error) {
				// If an error occurs,...
				msg.channel.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); 
				// ...then notify author of the error...
				return; // ...and abort command execution.
			};
			// If there is no error...
			msg.channel.sendMessage("Last history entry successfully removed.");
			// ...output the success message to the user.
		});
		return; // Abort command execution to prevent further code execution
	};
	request.get('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) { 
		// GET the counter number
		if(response == undefined) {
		// If 1) the response is undefined...
			console.log(`No response was emitted when GETting the counter -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) Undefined response | ${error}`); 
			// ...log it and the error...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				msg.author.sendMessage(`Error contacting the website, response code is undefined. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user...
				return; // ...and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
			// ...notify the user...
			return; // ...and abort command execution.
		};
		if(error || response.statusCode !== 200) { 
		// If 2) There is an error or response code other than 200 (OK)...
			console.log(`An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) Unusual response code | ${response.statusCode}`); 
			// ...log the unusual request responses/errors...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				msg.author.sendMessage(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user...
				return; // ...and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
			// ...notify the user...
			return; // ...and abort command execution.
		};
		// If there is no error, proceed with the command.
		if(body % 1000000 == 0) {
		// If the current counter is on a full 1-million mark...
			msg.channel.sendMessage(`Current https://megumin.love count is: 🎊🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉🎊`); 
			// ...format counter to x.xxx.xxx and add festive party poppers plus confetti balls.
			return; // Abort command execution to prevent multiple messages from being sent
		}
		else if(body % 100000 == 0) {
		// If the current counter is on a full 100-thousand mark..
			msg.channel.sendMessage(`Current https://megumin.love count is: 🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉`);
			// ...format counter to x.xxx.xxx and add festive party poppers.
			return; // Abort command execution to prevent multiple messages from being sent
		};
		// If the current counter is neither on a full 1-million, nor on a full 100-thousand mark...
		msg.channel.sendMessage(`Current https://megumin.love count is: **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}**`); 
		// ...format counter to x.xxx.xxx and send it as-is.
	});
};
exports.desc = "display the website's current counter"; // Export command description
exports.syntax = "" // Export command syntax