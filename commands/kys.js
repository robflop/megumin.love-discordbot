exports.main = function(client, msg, msgArray, checks, chalk) {
	if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("I can't send messages to that channel!");
	const command = "kys";
	if(client.user.presence.status == "invisible") { return; };
	msg.reply('kms');
	client.user.setStatus("invisible");
	setTimeout(function() { client.user.setStatus('online'); }, 120000);
};

exports.desc = "kms";
exports.syntax = "";