const blacklist = require('../data/blacklist.json');

function guildCreate(client, guild) {
	if (guild.members.filter(m => m.user.bot).size >= (guild.memberCount / 100 * 80)) return guild.leave();
	// bot percentage check
	if (blacklist.includes(guild.id)) return guild.leave();
	// blacklist check
	return client.logger.info(`robbot has joined a new guild! ('${guild.name}')`);
}

module.exports = guildCreate;