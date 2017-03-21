const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');
var Events = require('./event_handler.js');
var ignoreLists = require('./ignore_handler.js');
var Commands = require('./command_handler.js');
var serverConfig = require('./serverconfig_handler.js');

bot.once('ready', () => {
	Events.ready(bot, chalk);
});

bot.on('error', error => {
	Events.error(bot, error, chalk);
});

bot.on('disconnect', error => {
	Events.disconnect(bot, error, chalk);
});

bot.on('reconnecting', () => {
	Events.reconnecting(bot, chalk);
});

bot.on('guildCreate', guild => {
	Events.join(bot, guild, chalk);
});

bot.on('guildDelete', guild => {
	Events.leave(bot, guild, chalk);
});

let cooldown = {
// Cooldown function courtesy of u/pilar6195 on reddit
	"users": new Set(),
	"onCooldown": function(userID, msg) {
		if(cooldown.users.has(userID)) {
			msg.reply(`calm down with the commands! Please wait ${config.commandCooldown} seconds.`).then(msg => msg.delete(3000));
			return true;
		} else {
			if(config.ownerID == userID) return;
			cooldown.users.add(userID);
			setTimeout(function() { cooldown.users.delete(userID)}, (config.commandCooldown * 1000));
			return false;
		}
	}
};

setInterval(function () {
	if(bot.user.presence.game.name == `try '${config.commandPrefix} help' !`) {
		bot.user.setGame("on megumin.love");
	}
	else if(bot.user.presence.game.name == "on megumin.love") {
		bot.user.setGame(`try '${config.commandPrefix} help' !`);
	}
	else return;
	// leave untouched if neither of the default ones
}, 300000);

bot.on('message', msg => {
	if(msg.author.bot) return;
	if(!msg.content.startsWith(config.commandPrefix)) return;
	if(msg.channel.type !== "text") return msg.channel.sendMessage("Commands via (Group) DM not supported, sorry.");
	if(msg.content == config.commandPrefix) return;
	if(fs.existsSync(`${config.ignorePath}ignore_${msg.guild.id}.json`) && ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].indexOf(`${msg.author.id}`) > -1) return;
	// ignored user check
	const botPerm = msg.channel.permissionsFor(bot.user);
	const userPerm = msg.channel.permissionsFor(msg.member);
	var actualCmd = msg.content.replace(config.commandPrefix, '').trim().split(' ')[0].toLowerCase();
	if(fs.existsSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`) && serverConfig.serverConfig[`serverconf_${msg.guild.id}`].indexOf(actualCmd) > -1) return;
	// disabled commands check
	if(Object.keys(Commands.commands).indexOf(actualCmd) > -1) Commands.commands[actualCmd].main(bot, msg, cooldown, botPerm, userPerm, chalk);
	// run the command
	if(actualCmd == "reload") {
		if(cooldown.onCooldown(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
		var arg = msg.content.substr(config.commandPrefix.length + actualCmd.length + 2);
		if(arg == "") return msg.reply('specify a command to reload!');
		try {
			var cmdFile = Commands.commands[arg.toLowerCase()].filename;
			delete require.cache[require.resolve(`./commands/${cmdFile}`)];
			delete require.cache[require.resolve('./commands/help.js')];
			delete require.cache[require.resolve('./command_handler.js')];
			Commands = require('./command_handler.js');
			// also reload help cmd to update output
		}
		catch(error) { return msg.reply(`error while reloading the '${arg}' command: \`\`\`${error}\`\`\`\n(Command may not exist, check for typos)`); };
		msg.reply(`command '${cmdFile.slice(0, -3)}' successfully reloaded!`);
	};
	return; // Just in case, return empty for anything else.
});

process.on("unhandledRejection", err => {
	console.error("Uncaught Promise Error: \n" + err.stack);
});

bot.login(config.token);