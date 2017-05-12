const Command = require('../structures/Command');

class SetNicknameCommand extends Command {
	constructor() {
		super({
			name: 'setnickname',
			description: 'Change robbot\'s nickname',
			ownersOnly: true,
			aliases: ['sn', 'nickname'],
			args: [
				{
					type: 'string',
					name: 'newNickname'
				}
			]
		});
	}

	async run(message, args) {
		if (args.newNickname.length < 2 || args.newNickname.length > 32) {
			return message.reply('new nickname may not be shorter than 2 or longer than 32 characters!');
		}
		message.guild.member(message.client.user).setNickname(args.newNickname).then(member => {
			message.reply(`successfully set my nickname to ${args.newNickname}!`);
		});
		message.client.logger.info(`Nickname set to '${args.newNickname}' on the '${message.guild.name}' guild`);
	}
}

module.exports = SetNicknameCommand;