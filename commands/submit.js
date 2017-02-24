exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command function
	var command = "submit"; // For logging purposes
	if(!botPerm.hasPermission('SEND_MESSAGES')) {
	// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!");
		// ...PM the user...
		return; // ...and abort command execution.
	}
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	msg.reply("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file or contact me on discord at robflop#2174! All sounds need to fit the website's theme.");
};
exports.desc = "get info on how to submit new sounds for the bot/website"; // Export command description
exports.syntax = "" // Export command syntax