const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const history = require('../counter_history.json') // Load counter history array

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command's function
	var command = "counter"; // For logging purposes
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  
		// If the bot can't send to the channel...
		return msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...notify the user and abort command execution.
	}
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	// Define timestamp
	if(msg.content.substr(config.commandPrefix.length + command.length + 2) == "history") {
	// If the "history" argument is called...
		return fs.readFile("counter_history.json", "utf-8", (error, data) => {
		// ...read the counter history...
			if(error) {
				// ...and if an error occurs...
				return msg.channel.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); 
				// ...then notify author of the error and abort command execution.
			};
			// ...and if there is no error...
			msg.channel.sendMessage(`**__Here is an overview of the counter's saved progress history__**:\n\`\`\`${JSON.parse(data).join("\n")}\`\`\``,  {split: {prepend: "\`\`\`", append: "\`\`\`"}});
			// ...output the parsed counter history to the user.
		}); 
	};
	if(msg.content.substr(config.commandPrefix.length + command.length + 2) == "append") {
	// If the "append" argument is called...
		if(msg.author.id !== config.ownerID) {
		// ...and if the user is not authorized...
			return msg.channel.sendMessage("You are not authorized to modify the counter history.");
			// ...notify the user and abort command execution.
		};
		var newCounter = "";
		// Define placeholder for newest history entry
		return request.get('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) {
		// Get the current counter number from the website 
			if(response == undefined) {
			// If the response is undefined...
				return msg.channel.sendMessage("Response undefined when getting the counter, command execution aborted.");
				// ...notify the user abort command execution.
			};
			if(error || response.statusCode !== 200) {
			// If an error or response code other than 200 (OK) is emitted...
				return msg.channel.sendMessage(`An error has occured or the response code was not "200 OK": \`\`\`${error}\`\`\`\nCommand execution aborted.`);
				// ...notify the user abort command execution.
			};
			newCounter = `${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} ${moment().format('HH:mm')} ${moment().format('DD/MM/YY')}`;
			// Define the new history entry as formatted counter number...
			history.push(newCounter);
			// ...push the new entry into the history array...
			fs.writeFile("counter_history.json", JSON.stringify(history), "utf-8", (error, data) => {
			// ...and write the history to the file.
				if(error) {
					// If an error occurs while writing...
					return msg.channel.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); 
					// ...notify the user of the error and abort command execution.
				};
				// If there is no error...
				msg.channel.sendMessage(`New entry successfully added: \`\`${newCounter}\`\``);
				// ...notify the user of success.
			});
		});	
	};
	if(msg.content.substr(config.commandPrefix.length + command.length + 2) == "revert" ) {
	// If the "revert" argument is called...
		if(msg.author.id !== config.ownerID) {
		// ...and if the user is not authorized...
			return msg.channel.sendMessage("You are not authorized to modify the counter history.");
			// ...notify the user and abort command execution.
		};
		history.pop(); // Remove latest history entry...
		return fs.writeFile("counter_history.json", JSON.stringify(history), "utf-8", (error, data) => {
		// ...and write the history to the file.
			if(error) {
				// If an error occurs while writing...
				return msg.channel.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); 
				// ...notify the user of the error and abort command execution.
			};
			// If there is no error...
			msg.channel.sendMessage("Latest history entry successfully removed.");
			// ...notify the user of success.
		});
	};
	// If no argument is called...
	request.get('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) {
		// ...GET the counter number.
		if(response == undefined) {
		// If 1) the response is undefined...
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} No response was emitted when GETting the counter -- Refer to request logs`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Undefined response | ${error}`); 
			// ...log it and the error...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				return msg.author.sendMessage(`Error contacting the website, response code is undefined. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			return msg.reply("error contacting the website, response is undefined. Please refer to request logs.");
			// ...notify the user and abort command execution.
		};
		if(error || response.statusCode !== 200) { 
		// If 2) There is an error or response code other than 200 (OK)...
			console.log(`[${timestamp}]${chalk.red("[REQUEST-ERROR]")} An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${timestamp}][REQUEST-ERROR] (${command}) Unusual response code | ${response.statusCode}`); 
			// ...log the unusual request responses/errors...
			if(!botPerm.hasPermission('SEND_MESSAGES')) { 
				// ... a) and if the bot can't send to the channel...
				return msg.author.sendMessage(`Error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
				// ...PM the user and abort command execution.
			};
			// ... b) and if the bot can send to the channel...
			return msg.reply("error contacting the website, response code is not 200 (OK) or an error occurred. Please refer to request logs.");
			// ...notify the user and abort command execution.
		};
		// If there is no error, proceed with the command.
		if(body % 1000000 == 0) {
		// If the current counter is on a full 1-million mark...
			return msg.channel.sendMessage(`Current https://megumin.love count is: 🎊🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉🎊`); 
			// ...format counter to x.xxx.xxx and add festive party poppers plus confetti balls.
		}
		else if(body % 100000 == 0) {
		// If the current counter is on a full 100-thousand mark..
			return msg.channel.sendMessage(`Current https://megumin.love count is: 🎉 **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}** 🎉`);
			// ...format counter to x.xxx.xxx and add festive party poppers.
		};
		// If the current counter is neither on a full 1-million, nor on a full 100-thousand mark...
		msg.channel.sendMessage(`Current https://megumin.love count is: **${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}**`); 
		// ...format counter to x.xxx.xxx and send it as-is.
	});
};
exports.desc = "display the website's current counter"; // Export command description
exports.syntax = "<history/append/revert, all optional>" // Export command syntax