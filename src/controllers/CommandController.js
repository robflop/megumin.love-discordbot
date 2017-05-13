const { inspect } = require('util');
const { join } = require('path');
const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

require('../util/prototypes');
const ArgumentParser = require('./ArgumentParser');

class CommandController {
	constructor() {
		this.cooldowns = new Map();
		this.ignoredLists = new Collection();
		this.disabledCommandLists = new Collection();

		const guildDir = join(__dirname, '..', 'data', 'guilds');
		const guildDirFiles = readdirSync(guildDir).filter(file => file.endsWith('.json'));

		const ignoredListFiles = guildDirFiles.filter(file => file.substr(0, 8) === 'ignored_');

		for (const file of ignoredListFiles) {
			const guildID = file.substr(8).slice(0, -5);
			const ignoredList = require(`${guildDir}/${file}`);
			this.ignoredLists.set(guildID, ignoredList);
		}

		const disabledCommandListFiles = guildDirFiles.filter(file => file.substr(0, 8) === 'toggled_');

		for (const file of disabledCommandListFiles) {
			const guildID = file.substr(8).slice(0, -5);
			const disabledCommandList = require(`${guildDir}/${file}`);
			this.disabledCommandLists.set(guildID, disabledCommandList);
		}
	}

	async handleCommand(message) {
		if (message.author.bot || !message.content.startsWith(message.client.config.commandPrefix)) return;
		if ((this.ignoredLists.get(message.guild.id) || []).includes(message.author.id)) return;

		const client = message.client;
		const config = client.config;

		const [name, ...args] = message.content.replace(config.commandPrefix, '').trim().split(/ +/g);
		const command = client.commands.get(name.toLowerCase()) || client.commands.get(client.aliases.get(name.toLowerCase()));

		if (!command) return;

		if (!client.config.owners.includes(message.author.id)) {
			const cooldown = this.cooldownCheck(message.author.id, command);
			if (cooldown) {
				// eslint-disable-next-line max-len
				return message.reply(`please wait ${cooldown} more ${cooldown !== 1 ? 'seconds' : 'second'} before reusing the \`${command.name}\` command.`);
			}
		}

		if (command.guildOnly && message.channel.type !== 'text') {
			return message.channel.send(`The ${command.name} command is only available on servers.`);
		}

		if (command.ownersOnly && !config.owners.includes(message.author.id)) {
			return message.channel.send(`The ${command.name} command is only usable by bot owners.`);
		}

		if ((this.disabledCommandLists.get(message.guild.id) || []).includes(command.name)) return;

		if (command.args.length && args.length < command.args.length && !('defaultVal' in command.args.last())) {
			const correctSyntax = `${client.config.commandPrefix} ${command.name} ${command.args.map(a => `<${a.name}>`).join(' ')}`;
			return message.reply(`you didn't provide enough arguments! The correct format would be:\n\`${correctSyntax}\``);
		}

		const parsedArgs = command.args.length ? await this.parseArguments(args, command, message) : args;

		return command.run(message, parsedArgs).catch(e => {
			client.logger.error(inspect(e));
			return message.reply(`an error occurred while executing the \`${command.name}\` command.`);
		});
	}

	cooldownCheck(id, command) {
		if (!this.cooldowns.has(command.name)) {
			const data = new Map();
			this.cooldowns.set(command.name, data);
		}

		const commandCooldown = this.cooldowns.get(command.name);
		if (!commandCooldown.has(id)) {
			commandCooldown.set(id, Date.now());
			return false;
		}

		const now = Date.now();
		const lastUsage = commandCooldown.get(id) + (command.cooldown * 1000);

		if (lastUsage > now) return Math.ceil((lastUsage - now) / 1000);

		commandCooldown.set(id, Date.now());
		return false;
	}

	async parseArguments(args, command, message) {
		const parsedArgs = {};
		const beginning = args.slice(0, command.args.length - 1);
		const end = args.slice(beginning.length, args.length).join(' ');

		for (const [i, arg] of beginning.concat(end).entries()) {
			const { name, type, defaultVal } = command.args[i];

			parsedArgs[name] = 'defaultVal' in command.args[i] && !arg ? defaultVal : ArgumentParser.parse(type, message, arg);

			if (parsedArgs[name] instanceof Promise) {
				parsedArgs[name] = await parsedArgs[name];
			}

			if (parsedArgs[name] === null) {
				message.reply(`invalid input for the \`${name}\` argument! Expected \`${type}\`.`);
				return undefined;
			}
		}

		return parsedArgs;
	}
}

module.exports = CommandController;