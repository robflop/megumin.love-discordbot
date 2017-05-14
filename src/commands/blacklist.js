const Command = require('../structures/Command');

class BlacklistCommand extends Command {
	constructor() {
		super({
			name: 'blacklist',
			description: 'Blacklist a discord guild',
			ownersOnly: true,
			aliases: ['bl'],
			args: [
				{
					type: 'string',
					name: 'guildIDs'
				},
				{
					type: 'string',
					name: 'searchArg',
					defaultVal: ''
				}
			]
		});
	}

	async run(message, args) {
		const blacklist = require('../data/blacklist.json');
		const icb = '``';

		if (args.guildIDs !== 'find') args.guildIDs += ` ${args.searchArg}`;
		// attach other to-be-blacklisted IDs to the array if no search arg passed

		if (args.guildIDs === 'find') {
			if (args.searchArg === '') return message.reply('provide input to search for!');

			const index = blacklist.indexOf(args.searchArg);
			if (index !== -1) {
				return message.reply(`guild ID ${icb}${args.searchArg}${icb} was found at position ${index} of the blacklist!`);
			}
			else {
				return message.reply(`guild ID ${icb}${args.searchArg}${icb} was not found on the blacklist!`);
			}
		}

		const added = [], removed = [];
		const guildIDs = args.guildIDs.split(' ');
		for (let i = 0; i < guildIDs.length; i++) {
			const index = blacklist.indexOf(guildIDs[i]);
			if (!blacklist.includes(guildIDs[i])) {
				blacklist.push(guildIDs[i]);
				added.push(guildIDs[i]);
			}
			else {
				blacklist.splice(index, 1);
				removed.push(guildIDs[i]);
			}
		}
		let result = '';
		if (added.length > 0) {
			result += `added ${icb}${added.join(', ')}${icb} to the list`;
		}
		if (removed.length > 0) {
			result += `${result.includes('added') ? ' & ' : ''}removed ${icb}${removed.join(', ')}${icb} from the list`;
		}
		return message.client.logger.writeJSON(blacklist, './data/blacklist.json')
		.then(blacklist => message.reply(`successfully ${result}!`));
	}
}

module.exports = BlacklistCommand;