const config = require('../config.json'); // Import configuration
const Discord = require('discord.js'); // For using embeds
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

exports.main = function(bot, msg, cooldown, botPerm, userPerm) { // Export command function
	var command = "info"; // For logging purposes
	if(!botPerm.hasPermission('SEND_MESSAGES')) {  
	// If the bot can't send to the channel...
		msg.author.sendMessage("I can't send messages to that channel!"); 
		// ...PM the user...
		return;	// ...and abort command execution.
	};
	if (cooldown.onCooldown(msg.author.id, msg)) return; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	var embed = new Discord.RichEmbed();
	// Define embed as new RichEmbed placeholder
	var arg = msg.content.substring(config.commandPrefix.length + command.length + 2);
	// Define argument out of msg content
	if(arg.startsWith("server")) {
		var arg = "server";
	// If the argument "list" is called...
		if(msg.author.id !== config.ownerID) {
		// ...and if the user is not authorized...
		msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));  
		// ...notify the user...
		return; // ...and abort command execution.
		};
		msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
		// Send a list of the bot's current servers and the amount of their members
		return; // Abort command execution to prevent lower code execution
	}
	else if(arg.startsWith("this")) {
	// If the argument "this" is called...
		var arg = "this";
		embed.setAuthor(`Overview for '${msg.guild.name}'`, msg.guild.iconURL)
			 .addField("Users", msg.guild.memberCount, true)
			 .addField("Channels", msg.guild.channels.size, true)
			 .addField("Owner", msg.guild.owner.displayName, true)
			 .addField("Roles", msg.guild.roles.size, true)
			 .addField("Server ID", msg.guild.id, true)
			 .addField("Region", msg.guild.region, true)
		// Set the embed properties
	    msg.channel.sendEmbed(embed);
		// Send the embed
		return; // Abort command execution to prevent lower code execution
	}
	else if(arg.startsWith("user")) {
	// If the argument "user" is called...
		var arg = "user";
		var user = msg.content.substring(msg.content.indexOf(arg)+arg.length+1);
		// Define selected user
		if(user == "") {msg.reply("Specify a user to get info on!").then(msg => msg.delete(2000)); return;}
		// If no user was selected, notify user, set auto-delete to 2s and abort command execution
		var users = msg.guild.members.array();
		// Get all users of the server to match the requested user
		for(var i=0; i<users.length; i++) {
        // Loop through server users
            if(users[i].displayName.startsWith(user) || users[i].user.username.startsWith(user)) {
            // If the displayName or username of current user in iteration matches the username of the user to get info on...
                user = msg.guild.members.get(users[i].id);
                // ...redefine the user argument as the user object of the current user in iteration.
            };
        };
		if(typeof user == 'string') { msg.reply("user not found!").then(msg => msg.delete(2000)); return; }
		// If no user was matched (input is still a string), abort command execution
		embed.setAuthor(`Overview for '${user.displayName}'`, user.user.avatarURL)
		 .addField("Username", user.user.username, true)
		 .addField("Nickname", user.nickname, true)
		 .addField("UserID", user.user.id, true)
		 .addField("Join date", moment(user.joinedAt).format("DD/MM/YY"), true)
		 .addField("Creation date", moment(user.user.createdAt).format("DD/MM/YY"), true)
		 .addField("Roles", user.roles.array().join(", "), true);
		// Set the embed properties
		msg.channel.sendEmbed(embed);
		// Send the embed
		return; // Abort command execution to prevent lower code execution
	};
	embed.setAuthor("robbot Status Overview", bot.user.avatarURL)
		 .addField("Total Servers", bot.guilds.size, true)
		 .addField("Total Users", bot.users.size, true)
		 .addField("Total TextChannels", bot.channels.filter((channel)=>{return channel.type == "text"}).size, true)
		 .addField("Total VoiceChannels", bot.channels.filter((channel)=>{return channel.type == "voice"}).size, true)
		 .addField("Bot Ping", Math.round(bot.ping)+"ms", true)
		 .addField("Bot Uptime", moment.duration(bot.uptime).humanize(), true)
	// Set the embed properties
	msg.channel.sendEmbed(embed);
	// Send the embed
};
exports.desc = "get an Overview of robbot's Server status"; // Export command description
exports.syntax = "<servers/this/user, all optional> <username if user arg is called>" // Export command syntax