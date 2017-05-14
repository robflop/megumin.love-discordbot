class Command {
	constructor(config) {
		this.name = config.name;
		this.description = config.description || '';
		this.aliases = config.aliases || [];
		this.cooldown = config.cooldown || 3;
		this.guildOnly = config.guildOnly || false;
		this.ownersOnly = config.ownersOnly || false;
		this.args = config.args || [];
		this.perms = config.perms || {};
	}

	async run() {
		throw Error(`Command ${this.name} does not possess a run() method.`);
	}
}

module.exports = Command;