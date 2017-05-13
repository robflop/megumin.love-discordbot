const Command = require('../structures/Command');

class PingCommand extends Command {
	constructor() {
		super({
			name: 'ping',
			description: 'Measure the delay between command call and execution.',
			aliases: ['p']
		});
	}

	async run(message, args) {
		return message.channel.send('Pinging...').then(msg => {
			const ping = msg.createdAt - message.createdAt;
			return msg.edit(`P${'o'.repeat(ping / 100)}ng! (${ping}ms)`);
		});
	}
}

module.exports = PingCommand;