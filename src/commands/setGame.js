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
					name: 'newGame',
					defaultVal: ''
				}
			]
		});
	}

	async run(message, args) {
		if (args.newGame && (args.newGame.length < 2 || args.newGame.length > 32)) {
			return message.reply('new game may not be shorter than 2 or longer than 32 characters!');
		}

		const action = args.newGame !== '' ? `set my game to \`${args.newGame}\`` : `cleared my game`;

		message.client.user.setGame(args.newGame).then(user => {
			message.reply(`successfully ${action}!`);
			message.client.logger.info(action.capitalize());
		});
	}
}

module.exports = SetGameCommand;