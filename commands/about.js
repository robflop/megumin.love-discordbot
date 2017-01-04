module.exports = function about(bot, msg, timeout, permission) {
	if(!permission.hasPermission('SEND_MESSAGES')) {
		msg.author.sendMessage("I can't send messages to that channel!"); 
		return; 
	}
	var command = "about"; // for logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
	msg.channel.sendMessage(`robbot made by robflop#2174. Made to complement the website <https://megumin.love> also by robflop#2174.\nCheck out the Github repo at <https://github.com/robflop/megumin.love-discordbot>.`);
	msg.reply('boo');
};