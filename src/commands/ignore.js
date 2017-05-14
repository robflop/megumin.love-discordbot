const Command = require('../structures/Command');

class IgnoreCommand extends Command {
	constructor() {
		super({
			name: 'ignore',
			description: 'Make robbot ignore a user',
			guildOnly: true,
			perms: {
				member: ['BAN_MEMBERS', 'KICK_MEMBERS'],
			},
			args: [
				{
					type: 'user',
					name: 'targetUser'
				}
			]
		});
	}

	async run(message, args, guildConfigs) {
		const { logger, config } = message.client;
		const cb = '```';

		if ([message.client.user.id, ...config.owners].includes(args.targetUser.id)) {
			const targetIs = message.client.user.id === args.targetUser.id ? 'myself' : 'owners';
			return message.reply(`i can't ignore ${targetIs}!`);
		}
		if (args.targetUser.bot) return message.reply('other bots are already ignored by default.');

		const ignoredLists = guildConfigs.ignoredLists;
		let ignoredList = ignoredLists.get(message.guild.id);

		if (ignoredList) {
			const index = ignoredList.indexOf(args.targetUser.id);
			if (index === -1) {
				ignoredList.push(args.targetUser.id);
				logger.writeJSON(ignoredList, `./data/guilds/ignored_${message.guild.id}.json`)
				.then(ignoredList => message.reply(`i am now ignoring ${args.targetUser.username}!`))
				.catch(err => message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`));
			}
			else {
				ignoredList.splice(index, 1);
				logger.writeJSON(ignoredList, `./data/guilds/ignored_${message.guild.id}.json`)
				.then(ignoredList => message.reply(`i am no longer ignoring ${args.targetUser.username}!`))
				.catch(err => message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`));
			}
		}
		else {
			ignoredList = ignoredLists.set(message.guild.id, [args.targetUser.id]);
			logger.writeJSON(ignoredLists.get(message.guild.id), `./data/guilds/ignored_${message.guild.id}.json`)
			.then(ignoredList => message.reply(`i am now ignoring ${args.targetUser.username}!`))
			.catch(err => message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`));
		}
	}
}

module.exports = IgnoreCommand;