exports.main = function(bot, msg, cooldown, botPerm, userPerm) { // Export command's function
	if(!botPerm.hasPermission('SEND_MESSAGES')) { 
		// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...PM the user...
		return; // ...and abort command execution.
	};
	var command = "kys";
	if (cooldown.onCooldown(msg.author.id) == true) return;
	if(bot.user.presence.status == "invisible") { return; };
	msg.reply('kms');
	bot.user.setStatus("invisible");
	setTimeout(function() {
		bot.user.setStatus('online');
	}, 120000);
};

exports.desc = "kms"; // Export command description
exports.syntax = "" // Export command syntax