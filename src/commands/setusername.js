const Command = require('../structures/Command');

class SetUsernameCommand extends Command {
	constructor() {
		super({
			name: 'setusername',
			description: 'Change robbot\'s username',
			ownersOnly: true,
			aliases: ['su', 'username'],
			args: [
				{
					type: 'string',
					name: 'newUsername'
				}
			]
		});
	}

	async run(message, args) {
		if (args.newUsername.length < 2 || args.newUsername.length > 32) {
			return message.reply('new username may not be shorter than 2 or longer than 32 characters!');
		}
		message.client.user.setUsername(args.newUsername).then(user => {
			message.reply(`successfully set my username to '${args.newUsername}'!`);
			message.client.logger.info(`Username set to '${args.newUsername}'`);
		});
	}
}

module.exports = SetUsernameCommand;