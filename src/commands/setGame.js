const Command = require('../structures/Command');

class SetGameCommand extends Command {
	constructor() {
		super({
			name: 'setgame',
			description: 'Change robbot\'s game',
			ownersOnly: true,
			aliases: ['sg', 'game'],
			args: [
				{
					type: 'string',
					name: 'newGame'
				}
			]
		});
	}

	async run(message, args) {
		if (args.newGame.length < 2 || args.newGame.length > 32) {
			return message.reply('new game may not be shorter than 2 or longer than 32 characters!');
		}
		message.client.user.setGame(args.newGame).then(user => {
			message.reply(`successfully set my game to ${args.newGame}!`);
		});
		message.client.logger.info(`Game set to '${args.newGame}'`);
	}
}

module.exports = SetGameCommand;