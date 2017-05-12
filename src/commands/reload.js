const Command = require('../structures/Command');

class ReloadCommand extends Command {
	constructor() {
		super({
			name: 'reload',
			description: 'Reloads a command',
			aliases: ['rl'],
			ownersOnly: true,
			args: [
				{
					type: 'string',
					name: 'command'
				}
			]
		});
	}

	async run(message, args) {
		const client = message.client;
		let command = args.command.toLowerCase();
		if (client.aliases.has(command)) command = client.aliases.get(command);

		return this.reloadCommand(command, message);
	}

	async reloadCommand(command, message) {
		const client = message.client;
		const CommandClass = require(`./${command}.js`);
		const cmd = new CommandClass();

		delete require.cache[require.resolve(`./${command}`)];
		client.commands.delete(command);

		for (const alias of client.aliases.keys()) {
			if (client.aliases.get(alias) === command) client.aliases.delete(alias);
		}

		client.commands.set(cmd.name, cmd);

		for (const alias of cmd.aliases) {
			client.aliases.set(alias, cmd.name);
		}

		return message.reply(`${cmd.name} command reloaded!`);
	}
}

module.exports = ReloadCommand;