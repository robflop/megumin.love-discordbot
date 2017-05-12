const { Client, Collection } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');

class RobbotClient extends Client {
	constructor(options) {
		super(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.config = require('../config');
		this.logger = require('../util/Logger');

		const cmdDir = join(__dirname, '..', 'commands');
		const cmdFiles = readdirSync(cmdDir).filter(file => file.endsWith('.js'));

		for (const file of cmdFiles) {
			const CommandClass = require(`${cmdDir}/${file}`);
			const cmd = new CommandClass();

			for (const alias of cmd.aliases) {
				if (this.aliases.has(alias)) {
					throw Error(`Duplicate alias detected in the '${cmd.name}' command ('${alias}').`);
				}

				this.aliases.set(alias, cmd.name);
			}

			if (this.commands.has(cmd.name)) {
				throw Error(`Duplicate command detected at '${cmd.name}'.`);
			}

			this.commands.set(cmd.name, cmd);
		}

		const validEvents = Object.values(require('discord.js/src/util/Constants').Events);
		const eventDir = join(__dirname, '..', 'events');
		const eventFiles = readdirSync(eventDir).filter(file => file.endsWith('.js') && validEvents.includes(file.slice(0, -3)));

		for (const file of eventFiles) {
			const name = file.slice(0, -3);
			const event = require(`${eventDir}/${name}`);
			this.events.set(name, event);
			this.on(name, (...args) => this.events.get(name)(this, ...args));
		}

		const commandPhrase = this.commands.size !== 1 ? 'commands' : 'command';
		const eventPhrase = eventFiles.length !== 1 ? 'events' : 'event';

		this.logger.info(`Loaded ${this.commands.size} ${commandPhrase} and ${eventFiles.length} ${eventPhrase}.`);
	}

	leave(guildIDs = []) {
		const guildPromises = [];
		if (!guildIDs || !guildIDs.length) return Promise.reject(new Error('An array of guild IDs must be provided.'));
		for (const id of guildIDs) {
			const guild = this.guilds.get(id);
			if (guild) guildPromises.push(guild.leave());
			else guildPromises.push(Promise.reject(new Error(`Guild with ID ${id} not found.`)));
		}

		return Promise.all(guildPromises).then(guilds => {
			const g = guilds.map(g => `${g.name} (${g.id})`).join(', ');
			return `Success! The following guilds were left: ${g}`;
		}).catch(err => err);
	}
}

module.exports = RobbotClient;