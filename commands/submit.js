exports.main = function(bot, msg, timeout, permission) { // export command function
	if(!permission.hasPermission('SEND_MESSAGES')) {
		msg.author.sendMessage("I can't send messages to that channel!"); // If it can't send to the channel, PM the user
		return;
	}
	var command = "submit"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	msg.reply("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file or contact me on discord at robflop#2174! All sounds need to fit the website's theme.");
};
exports.desc = "get info on how to submit new sounds for the bot/website"; // export command description