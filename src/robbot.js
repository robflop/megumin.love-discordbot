const RobbotClient = require('./structures/RobbotClient');
const CommandController = require('./controllers/CommandController');
const DiscordAPIError = require('discord.js/src/client/rest/DiscordAPIError');

const client = new RobbotClient({
	disabledEvents: ['GUILD_SYNC', 'GUILD_BAN_ADD', 'GUILD_BAN_REMOVE', 'CHANNEL_PINS_UPDATE', 'USER_NOTE_UPDATE',
		'USER_SETTINGS_UPDATE', 'PRESENCE_UPDATE', 'VOICE_STATE_UPDATE', 'TYPING_START', 'VOICE_SERVER_UPDATE',
		'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE']
});
const controller = new CommandController();

client
	.once('ready', () => {
		client.logger.info(`robbot ready! (As ${client.user.tag})`);
		client.user.setGame(`try '${client.config.commandPrefix} help' !`).then(user => {
			client.setInterval(() => {
				if (client.user.presence.game.name === `try '${client.config.commandPrefix} help' !`) {
					client.user.setGame('on megumin.love');
				}
				else if (client.user.presence.game.name === 'on megumin.love') {
					client.user.setGame(`try '${client.config.commandPrefix} help' !`);
				} // leave untouched if neither of the default ones

				// eslint-disable-next-line max-nested-callbacks
				const botGuilds = client.guilds.filter(guild => guild.members.filter(member => member.user.bot) >= (guild.memberCount / 100 * 80))
					.map(guild => guild.leave());
			}, 1000 * 60 * 30);
		});
	})
	.on('message', message => {
		controller.handleCommand(message);
	})
	.login(client.config.token);

process.on('unhandledRejection', err => {
	if (!err) return;

	const errorString = 'Uncaught Promise Error:\n';
	if (err instanceof DiscordAPIError) {
		return client.logger.error(`${errorString}${err.code} - ${err.message}`);
	}

	if (err.method && err.path && err.text) {
		return client.logger.error(`${errorString}${err.method}: ${err.path}\n${err.text}`);
	}

	return client.logger.error(errorString + err.stack);
});