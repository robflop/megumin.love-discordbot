const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');
const Events = require('./eventHandler.js');
const ignoreLists = require('./ignoreHandler.js');
const serverConfig = require('./serverconfigHandler.js');
let Commands = require('./commandHandler.js');

client.once('ready', () => Events.ready(client, chalk));

client.on('error', error => Events.error(client, error, chalk));

client.on('disconnect', error => Events.disconnect(client, error, chalk));

client.on('reconnecting', () => Events.reconnecting(client, chalk));

client.on('guildCreate', guild => Events.join(client, guild, chalk));

client.on('guildDelete', guild => Events.leave(client, guild, chalk));

const cooldown = {
// Cooldown function courtesy of u/pilar6195 on reddit
	"users": new Set(),
	"onCooldown": function(userID, msg) {
		if(cooldown.users.has(userID)) {
			msg.reply(`calm down with the commands! Please wait ${config.commandCooldown} seconds.`);
			return true;
		} else {
			if(config.ownerID == userID) return;
			cooldown.users.add(userID);
			setTimeout(() => cooldown.users.delete(userID), (config.commandCooldown * 1000));
			return false;
		}
	}
};

setInterval(() => {
	if(client.user.presence.game.name == `try '${config.commandPrefix} help' !`) {
		client.user.setGame("on megumin.love");
	}
	else if(client.user.presence.game.name == "on megumin.love") {
		client.user.setGame(`try '${config.commandPrefix} help' !`);
	}
	else return;
	// leave untouched if neither of the default ones
}, 300000);

Discord.Client.prototype.leave = function leave(guildIDs) {
	const guildPromises = [];
	if(!guildIDs || !guildIDs.length) return Promise.reject(new Error('An array of guild IDs must be provided.'));
	for(const id of guildIDs) {
		const guild = client.guilds.get(id);
		if(guild) guildPromises.push(guild.leave());
		else guildPromises.push(Promise.reject(new Error(`Guild with ID ${id} not found.`)));
	}

	return Promise.all(guildPromises).then(guilds => {
		const g = guilds.map(g => `${g.name} (${g.id})`).join(", ");
		return `Success! The following guilds were left: ${g}`;
	}).catch(err => err);
};
// // shortcut for making bot leave guilds

const handleMsg = (msg) => {
	if(msg.author.bot || !msg.content.startsWith(config.commandPrefix) || msg.content == config.commandPrefix || cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.channel.type !== "text") return msg.channel.send("Commands via (Group) DM not supported, sorry.");
	const msgArray = msg.content.replace(config.commandPrefix, '').trim().split(' ');
	const actualCmd = msgArray[0].toLowerCase();
	if(fs.existsSync(`${config.ignorePath}ignore_${msg.guild.id}.json`) && ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].includes(`${msg.author.id}`)) return;
	// ignored user check
	if(fs.existsSync(`${config.serverConfPath}serverconf_${msg.guild.id}.json`) && serverConfig.serverConfig[`serverconf_${msg.guild.id}`].includes(actualCmd)) return;
	// disabled commands check
	const checks = {'cooldown': cooldown, 'botPerm': msg.channel.permissionsFor(client.user), 'userPerm': msg.channel.permissionsFor(msg.member)};
	if(Object.keys(Commands.commands).includes(actualCmd)) Commands.commands[actualCmd].main(client, msg, msgArray, checks, chalk);
	// run the command
	if(actualCmd == "reload") {
		if(checks.cooldown.onCooldown(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!");
		const arg = msgArray[1];
		if(!arg) return msg.reply('specify a command to reload!');
		try {
			const cmdFile = Commands.commands[arg.toLowerCase()].filename;
			delete require.cache[require.resolve(`./commands/${cmdFile}`)];
			delete require.cache[require.resolve('./commands/help.js')];
			delete require.cache[require.resolve('./commandHandler.js')];
			Commands = require('./commandHandler.js');
			// also reload help cmd to update output
		}
		catch(error) { return msg.reply(`error while reloading the '${arg}' command: \`\`\`${error}\`\`\`\n(Command may not exist, check for typos)`); };
		return msg.reply(`command '${arg}' successfully reloaded!`);
	};
	return; // Just in case, return empty for anything else.
};

client.on('message', msg => handleMsg(msg));

client.on('messageUpdate', (oldMsg, newMsg) => handleMsg(newMsg));
// commands are untested for usage when edited into messages

process.on("unhandledRejection", err => console.error(`[${require('moment')().format('DD/MM/YYYY HH:mm:ss')}] Uncaught Promise Error: \n${err.stack}`));

client.login(config.token);