const config = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "info";
	if(!botPerm.hasPermission('SEND_MESSAGES')) return msg.author.send("I can't send messages to that channel!");
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	var embed = new Discord.RichEmbed();
	var arg = msg.content.substring(config.commandPrefix.length + command.length + 2);
	if(arg.startsWith("server")) {
	// server arg
		var arg = "server";
		if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
		return msg.channel.send(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
		// Send a list of the bot's current servers and the amount of their members
	}
	else if(arg.startsWith("this")) {
	// this arg
		var arg = "this";
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
	else if(arg.startsWith("user")) {
	// user arg
		var arg = "user";
		var user = msg.content.substring(msg.content.indexOf(arg)+arg.length+1);
		if(user == "") return msg.reply("Specify a user to get info on!").then(msg => msg.delete(2000));
		user = msg.guild.members.filter(m => m.user.username.startsWith(user) || m.displayName.startsWith(user)).first();
		// reassign user string to filtered guildmember
		if(typeof user == 'string') return msg.reply("user not found!").then(msg => msg.delete(2000));
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
	embed.setAuthor("robbot Status Overview", bot.user.avatarURL)
		.setColor((Math.random() * 10e4).toFixed(5))
		.addField("Total Servers", bot.guilds.size, true)
		.addField("Total Users", bot.users.size, true)
		.addField("Total TextChannels", bot.channels.filter((channel)=>{return channel.type == "text"}).size, true)
		.addField("Total VoiceChannels", bot.channels.filter((channel)=>{return channel.type == "voice"}).size, true)
		.addField("Bot Ping", Math.round(bot.ping)+"ms", true)
		.addField("Bot Uptime", moment.duration(bot.uptime).humanize(), true)
	msg.channel.send('', {embed: embed});
};

exports.desc = "get an Overview of robbot's Server status";
exports.syntax = "<servers/this/user, all optional> <username if user arg is called>";