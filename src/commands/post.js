const Command = require('../structures/Command');
const snekfetch = require('snekfetch');
const { inspect } = require('util');

class PostCommand extends Command {
	constructor() {
		super({
			name: 'post',
			description: 'Update the guild count on <https://bots.discord.pw>',
			ownersOnly: true
		});
	}

	async run(message, args) {
		const { config: { useDiscordBots, discordBotsAPI }, user, guilds, logger } = message.client;
		if (!useDiscordBots) return;
		snekfetch.post(`https://bots.discord.pw/api/bots/${user.id}/stats`)
		.set('Authorization', `${discordBotsAPI}`)
		.set('Content-type', 'application/json; charset=utf-8')
		.send(`{"server_count": ${guilds.size}}`)
		.then(res => message.reply('POST request sent successfully!'))
		.catch(err => {
			const errorDetails = `${err.host ? err.host : ''} ${err.text ? err.text : ''}`.trim();
			message.reply(`an error occurred updating the guild count: \`\`${err.status}: ${errorDetails}\`\``);
			logger.error(inspect(err));
		});
	}
}

module.exports = PostCommand;