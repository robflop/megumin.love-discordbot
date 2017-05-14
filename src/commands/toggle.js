const Command = require('../structures/Command');

class ToggleCommand extends Command {
	constructor() {
		super({
			name: 'toggle',
			description: 'Toggle a command on or off',
			ownersOnly: true,
			perms: {
				member: ['KICK_MEMBERS', 'BAN_MEMBERS']
			},
			args: [
				{
					type: 'string',
					name: 'targetCommand'
				}
			]
		});
	}

	async run(message, args, guildConfigs) {
		const { logger, config, commands, aliases } = message.client;
		const cb = '```', icb = '``';

		if (['help', 'toggle', 'shutdown'].includes(args.targetCommand)) {
			return message.reply(`the ${icb}${args.targetCommand}${icb} command may not be toggled.`);
		}

		if (!commands.has(args.targetCommand) && !aliases.has(args.targetCommand)) {
			return message.reply(`the ${icb}${args.targetCommand}${icb} command does not exist.`);
		}

		const { disabledCommandLists } = guildConfigs;
		let disabledCommandList = disabledCommandLists.get(message.guild.id);

		if (disabledCommandList) {
			const index = disabledCommandList.indexOf(args.targetCommand);
			if (index === -1) {
				disabledCommandList.push(args.targetCommand);
				logger.writeJSON(disabledCommandList, `./data/guilds/toggled_${message.guild.id}.json`)
				.then(disabledCommandList => message.reply(`the ${icb}${args.targetCommand}${icb} command has been disabled!`))
				.catch(err => message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`));
			}
			else {
				disabledCommandList.splice(index, 1);
				logger.writeJSON(disabledCommandList, `./data/guilds/toggled_${message.guild.id}.json`)
				.then(disabledCommandList => message.reply(`the ${icb}${args.targetCommand}${icb} command has been enabled!`))
				.catch(err => message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`));
			}
		}
		else {
			disabledCommandList = disabledCommandLists.set(message.guild.id, [args.targetCommand]);
			logger.writeJSON(disabledCommandLists.get(message.guild.id), `./data/guilds/toggled_${message.guild.id}.json`)
			.then(disabledCommandList => message.reply(`the ${icb}${args.targetCommand}${icb} command has been disabled!`))
			.catch(err => message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`));
		}
	}
}

module.exports = ToggleCommand;