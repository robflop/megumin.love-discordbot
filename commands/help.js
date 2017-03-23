const config = require('../config.json');
var Commands = require('../commandHandler.js');
var serverConfig = require('../serverconfigHandler.js');

exports.main = function(client, msg, msgArray, cooldown, botPerm, userPerm, chalk) {
	var command = "help";
	var commandsExpl = [];
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	var cmdList = Object.keys(Commands.commands);
	if(serverConfig.serverConfig[`serverconf_${msg.guild.id}`] == undefined) serverConfig.serverConfig[`serverconf_${msg.guild.id}`] = [];
	// If no config present, define empty config to avoid crashes
	var arg = msgArray[1];
	// possible arg to get help on a command
	if(arg && cmdList.includes(arg)) return msg.author.send(`**__Syntax for '${arg}' is:__** \`\`\`${config.commandPrefix + " " + arg + " " + Commands.commands[arg].syntax}\`\`\``);
	for(var i = 0; i < cmdList.length; i++) commandsExpl.push(`\`\`'${cmdList[i]}' -- ${Commands.commands[cmdList[i]].desc}\`\``);
	msg.author.send(`**__Available commands are:__**\n\n${commandsExpl.join("\n")}\n\n\`\`Use '${config.commandPrefix + " " + command} <commandname>' to get syntax help on a command!\`\`\n\n**Commands disabled on the \`\`${msg.guild.name}\`\` server are: ${serverConfig.serverConfig[`serverconf_${msg.guild.id}`].join(", ")}**`);
};

exports.desc = "displays this message";
exports.syntax = "<command to get help on, optional>";