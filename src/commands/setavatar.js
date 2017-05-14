const Command = require('../structures/Command');

class SetAvatarCommand extends Command {
	constructor() {
		super({
			name: 'setavatar',
			description: 'Change robbot\'s avatar',
			ownersOnly: true,
			aliases: ['sa', 'avatar'],
			args: [
				{
					type: 'string',
					name: 'imageURL'
				}
			]
		});
	}

	async run(message, args) {
		if (!args.imageURL.startsWith('http')) return message.reply('invalid URL!');
		const validFormats = ['.png', '.jpg', '.gif'];
		if (!validFormats.includes(args.imageURL.substr(-4, 4))) return message.reply('invalid file format! Only pngs, jpgs, gifs are allowed.');
		message.client.user.setAvatar(args.imageURL).then(user => {
			message.reply(`successfully set my avatar to '<${args.imageURL}>'!`);
			message.client.logger.info(`Avatar set to '${args.imageURL}'`);
		});
	}
}

module.exports = SetAvatarCommand;