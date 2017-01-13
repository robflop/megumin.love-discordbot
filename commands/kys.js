exports.main = function(bot, msg, timeout, botPerm, userPerm) {// Export command's function
	if(!botPerm.hasPermission('SEND_MESSAGES')) { 
		// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...PM the user...
		return; // ...and abort command execution.
	};
	var command = "kys";
	if(timeout.check(msg.author.id, msg)) { return; };
	if(bot.user.presence.status == "invisible") { return; };
	msg.reply('kms');
	bot.user.setStatus("invisible");
	setTimeout(function() {
		bot.user.setStatus('online');
	}, 120000);
};

exports.desc = "kms"; // Export command description