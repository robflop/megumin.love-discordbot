exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command's function
	if(!botPerm.hasPermission('SEND_MESSAGES')) { 
		// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...PM the user...
		return; // ...and abort command execution.
	}
	var command = "about"; // For logging purposes
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	msg.channel.sendMessage(`robbot made by robflop#2174. Made to complement the website <https://megumin.love> also by robflop#2174.\nCheck out the Github repo at <https://github.com/robflop/megumin.love-discordbot>.\nInvite link for the bot: <https://robflop.pw/robbot>.`);
};
exports.desc = "get general info about the bot"; // Export command description
exports.syntax = "" // Export command syntax