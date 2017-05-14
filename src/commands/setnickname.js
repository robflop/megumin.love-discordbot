const Command = require('../structures/Command');

class SetNicknameCommand extends Command {
	constructor() {
		super({
			name: 'setnickname',
			description: 'Change robbot\'s nickname',
			ownersOnly: true,
			guildOnly: true,
			aliases: ['sn', 'nickname'],
			args: [
				{
					type: 'string',
					name: 'newNickname',
					defaultVal: ''
				}
			],
			perms: {
				client: ['CHANGE_NICKNAME']
			}
		});
	}

	async run(message, args) {
		if (args.newNickname && (args.newNickname.length < 2 || args.newNickname.length > 32)) {
			return message.reply('new nickname may not be shorter than 2 or longer than 32 characters!');
		}

		const action = args.newNickname !== '' ? `set my nickname to \`${args.newNickname}\`` : `cleared my nickname`;

		message.guild.member(message.client.user).setNickname(args.newNickname).then(member => {
			message.reply(`successfully ${action}!`);
			message.client.logger.info(`${action.capitalize()} on the '${message.guild.name}' guild`);
		});
	}
}

module.exports = SetNicknameCommand;