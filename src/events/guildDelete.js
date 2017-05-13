const blacklist = require('../data/blacklist.json');

function guildDelete(client, guild) {
	if (guild.members.filter(m => m.user.bot).size >= (guild.memberCount / 100 * 80)) return;
	// bot percentage check
	if (blacklist.includes(guild.id)) return;
	// blacklist check
	return client.logger.info(`robbot has left a guild! ('${guild.name}')`);
}

module.exports = guildDelete;