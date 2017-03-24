const config = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');

exports.main = function(client, msg, msgArray, checks, chalk) {
	var command = "info";
	if(!checks.botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("I can't send messages to that channel!");
	var embed = new Discord.RichEmbed();
	var arg = msgArray[1];
	if(arg == "server") {
	// server arg
		if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this argument!").then(msg => msg.delete(2000));
		return msg.channel.send(`__**${client.user.username} is currently on the following servers:**__ \n\n${client.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
		// Send a list of the bot's current servers and the amount of their members
	}
	else if(arg == "this") {
	// this arg
		embed.setAuthor(`Overview for '${msg.guild.name}'`, msg.guild.iconURL)
			.setColor((Math.random() * 10e4).toFixed(5))
			.addField("Users", msg.guild.memberCount, true)
			.addField("Channels", msg.guild.channels.size, true)
			.addField("Owner", msg.guild.owner.displayName, true)
			.addField("Roles", msg.guild.roles.size, true)
			.addField("Server ID", msg.guild.id, true)
			.addField("Region", msg.guild.region, true)
		return msg.channel.send('', {embed: embed});
	}
	else if(arg == "user") {
	// user arg
		var user = msg.content.substring(msg.content.indexOf(arg)+arg.length+1);
		if(user == "") return msg.reply("Specify a user to get info on!");
		user = msg.guild.members.filter(m => m.user.username.toLowerCase().startsWith(user) || m.displayName.toLowerCase().startsWith(user)).first();
		// reassign user string to filtered guildmember
		if(typeof user == 'string') return msg.reply("user not found!");
		// If no user was matched (input is still a string), abort command execution
		embed.setAuthor(`Overview for '${user.displayName}#${user.user.discriminator}'`, user.user.avatarURL)
			.setColor((Math.random() * 10e4).toFixed(5))
			.addField("Username", user.user.username, true)
			.addField("Nickname", user.nickname, true)
			.addField("UserID", user.user.id, true)
			.addField("Join date", moment(user.joinedAt).format("DD/MM/YY"), true)
			.addField("Creation date", moment(user.user.createdAt).format("DD/MM/YY"), true)
			.addField("Roles", user.roles.array().join(", "), true);
		return msg.channel.send('', {embed: embed});
	};
	embed.setAuthor("robbot Status Overview", client.user.avatarURL)
		.setColor((Math.random() * 10e4).toFixed(5))
		.addField("Total Servers", client.guilds.size, true)
		.addField("Total Users", client.users.size, true)
		.addField("Total TextChannels", client.channels.filter((channel)=>{return channel.type == "text"}).size, true)
		.addField("Total VoiceChannels", client.channels.filter((channel)=>{return channel.type == "voice"}).size, true)
		.addField("Bot Ping", Math.round(client.ping)+"ms", true)
		.addField("Bot Uptime", moment.duration(client.uptime).humanize(), true)
	msg.channel.send('', {embed: embed});
};

exports.desc = "get an Overview of robbot's Server status";
exports.syntax = "<servers/this/user, all optional> <username if user arg is called>";