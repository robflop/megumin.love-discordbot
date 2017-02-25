exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command's function
	if(!botPerm.hasPermission('SEND_MESSAGES')) { 
	// If the bot can't send to the channel...
		return msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...PM the user and abort command execution.
	};
	var command = "kys"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id) == true) return;
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	if(bot.user.presence.status == "invisible") { return; };
	// If the bot is already on the appear-as-offline status abort command execution
	msg.reply('kms');
	// Reply to the command caller
	bot.user.setStatus("invisible");
	// Set the bot's status to appear-as-offine
	setTimeout(function() {
	// Define timeout to switch back statuses
		bot.user.setStatus('online');
		// Once timeout is up, switch back to online status
	}, 120000);
	// Set timeout to 120 seconds
};

exports.desc = "kms"; // Export command description
exports.syntax = "" // Export command syntax