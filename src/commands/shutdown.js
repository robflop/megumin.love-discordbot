const { exec } = require('child_process');
const Command = require('../structures/Command');

class ShutdownCommand extends Command {
	constructor() {
		super({
			name: 'shutdown',
			description: 'Shuts down robbot',
			aliases: ['kill'],
			ownersOnly: true,
		});
	}

	async run(message, args) {
		message.reply('robbot shutting down! Bye!');
		message.client.logger.info(`robbot shutting down! (${message.author.tag} on '${message.guild}')`);

		if (message.client.config.pm2) {
			setTimeout(() => exec('pm2 stop robbot'), 2000);
		}
		else {
			setTimeout(() => process.exit(0), 2000);
		}
	}
}

module.exports = ShutdownCommand;