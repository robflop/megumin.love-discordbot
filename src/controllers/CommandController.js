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
		if (message.channel.type === 'text' && (this.ignoredLists.get(message.guild.id) || []).includes(message.author.id)) return;

		const { commands, aliases, config, logger } = message.client;

		const [name, ...args] = message.content.replace(config.commandPrefix, '').trim().split(/ +/g);
		const command = commands.get(name.toLowerCase()) || commands.get(aliases.get(name.toLowerCase()));

		if (!command) return;

		if (!config.owners.includes(message.author.id)) {
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

		if (message.channel.type === 'text' && ('client' in command.perms || 'member' in command.perms || 'hasPermission' in command)) {
			const permsCheck = this.permissionsCheck(command, message);
			if (!permsCheck) return;
		}

		if (message.channel.type === 'text' && (this.disabledCommandLists.get(message.guild.id) || []).includes(command.name)) return;

		if (command.args.length && args.length < command.args.length && !('defaultVal' in command.args.last())) {
			const correctSyntax = `${config.commandPrefix} ${command.name} ${command.args.map(a => `<${a.name}>`).join(' ')}`;
			return message.reply(`you didn't provide enough arguments! The correct format would be:\n\`${correctSyntax}\``);
		}

		const parsedArgs = command.args.length ? await this.parseArguments(args, command, message) : args;

		const guildConfigs = ['toggle', 'ignore', 'help'].includes(command.name)
		? { ignoredLists: this.ignoredLists, disabledCommandLists: this.disabledCommandLists }
		: null;

		return command.run(message, parsedArgs, guildConfigs).catch(e => {
			logger.error(inspect(e));
			return message.reply(`an error occurred while executing the \`${command.name}\` command.`);
		});
	}

	permissionsCheck(command, message) {
		let type = '';
		const clientMember = message.guild.member(message.client.user);
		const perms = command.perms;
		const { owners } = message.client.config;

		if ('hasPermission' in command) {
			const result = command.hasPermission(message);
			if (typeof result === 'string' || result === false) {
				message.reply(result || 'you do not have permissions to execute this command.');
				return false;
			}
		}

		if ('client' in perms && !clientMember.permissions.has(perms.client)) type = 'client';
		if ('member' in perms && !message.member.permissions.has(perms.member)) type = 'member';
		if (!type || (owners.includes(message.member.user.id) && type !== 'client')) return true;

		const permissions = perms[type].map(perm => {
			const name = perm.toString().replace(/_/g, ' ').toLowerCase().toTitleCase();
			return `\`${name}\``;
		}).join(', ');

		const permsResult = `${type === 'client' ? 'I' : 'You'} don't have enough permission to execute that command!`;
		const permsDetails = `${type === 'client' ? 'I' : 'You'} need the following permissions: ${permissions}`;

		message.reply(`${permsResult}\n${permsDetails}`);

		return false;
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