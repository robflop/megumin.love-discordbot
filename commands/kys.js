exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) {
	if(!botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("I can't send messages to that channel!");
	var command = "kys";
	if(cooldown.onCooldown(msg.author.id) == true) return;
	if(bot.user.presence.status == "invisible") { return; };
	msg.reply('kms');
	bot.user.setStatus("invisible");
	setTimeout(function() { bot.user.setStatus('online'); }, 120000);
};

exports.desc = "kms";
exports.syntax = "";