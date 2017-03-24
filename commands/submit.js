exports.main = function(client, msg, msgArray, checks, chalk) {
	var command = "submit";
	if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("I can't send messages to that channel!");
	msg.reply("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file or contact me on discord at robflop#2174! All sounds need to fit the website's theme.");
};

exports.desc = "get info on how to submit new sounds for the bot/website";
exports.syntax = "";