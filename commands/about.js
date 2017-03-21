exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "about";
	if(!botPerm.hasPermission('SEND_MESSAGES')) return msg.author.sendMessage("I can't send messages to that channel!");
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	msg.channel.sendMessage(`robbot made by robflop#0200. Made to complement the website <https://megumin.love> also by robflop#0200.\nCheck out the Github repo at <https://github.com/robflop/megumin.love-discordbot>.\nInvite link for the bot: <https://robflop.pw/robbot>.`);
};

exports.desc = "get general info about the bot";
exports.syntax = "";