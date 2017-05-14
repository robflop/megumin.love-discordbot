const Command = require('../structures/Command');
const { RichEmbed } = require('discord.js');
const moment = require('moment');

class InfoCommand extends Command {
	constructor() {
		super({
			name: 'info',
			description: 'Get various bot-related information',
			aliases: ['i'],
			guildOnly: true,
			args: [
				{
					type: 'string',
					name: 'selector',
					defaultVal: 'general',
				},
				{
					type: 'member',
					name: 'targetMember',
					defaultVal: 'self'
				}
			]
		});
	}

	async run(message, args) {
		const client = message.client;
		const embed = new RichEmbed();

		if (args.selector === 'all' && client.config.owners.includes(message.author.id)) {
			const header = '__**robbot is currently on the following servers:**__ \n\n';
			const guilds = client.guilds.map(g => `${g.name} - **${g.memberCount} members**`).join(`\n`);
			return message.channel.send(`${header}${guilds}`, { split: true });
		}

		if (args.selector === 'guild') {
			embed.setAuthor(`Overview for '${message.guild.name}'`, message.guild.iconURL())
			.setColor('RANDOM')
			.addField('Users', message.guild.memberCount, true)
			.addField('Channels', message.guild.channels.size, true)
			.addField('Owner', message.guild.owner.displayName, true)
			.addField('Roles', message.guild.roles.size, true)
			.addField('Server ID', message.guild.id, true)
			.addField('Region', message.guild.region, true);
			return message.channel.send({ embed });
		}

		if (args.selector === 'user') {
			args.targetMember === 'self' ? args.targetMember = message.guild.member(message.author) : null;
			embed.setAuthor(`Overview for '${args.targetMember.user.tag}'`, args.targetMember.user.avatarURL())
			.setColor('RANDOM')
			.addField('Username', args.targetMember.user.username, true)
			.addField('Nickname', args.targetMember.nickname, true)
			.addField('UserID', args.targetMember.user.id, true)
			.addField('Join date', moment(args.targetMember.joinedAt).format('DD/MM/YY'), true)
			.addField('Creation date', moment(args.targetMember.user.createdAt).format('DD/MM/YY'), true)
			.addField('Roles', args.targetMember.roles.array().join(', '), true);
			return message.channel.send({ embed });
		}

		if (args.selector === 'general') {
			embed.setAuthor('robbot Status Overview', client.user.avatarURL())
			.setColor('RANDOM')
			.addField('Total Servers', client.guilds.size, true)
			.addField('Total Users', client.users.size, true)
			.addField('Total TextChannels', client.channels.filter(channel => channel.type === 'text').size, true)
			.addField('Total VoiceChannels', client.channels.filter(channel => channel.type === 'voice').size, true)
			.addField('Websocket Ping', `${Math.round(client.ping)}ms`, true)
			.addField('Bot Uptime', moment.duration(client.uptime).humanize(), true);
			message.channel.send({ embed });
		}
	}
}

module.exports = InfoCommand;