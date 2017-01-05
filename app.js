const Discord = require('discord.js'); // obvious bot base
const bot = new Discord.Client(); // initialize bot instance
const config = require('./config.json'); // import configuration
const ignoreList = require('./ignore.json'); // load array of ignored users
var Events = require('./event_handler.js'); // load event handler
var Commands = require('./command_handler.js'); // load command handler

bot.on('ready', () => { // ready message once bot is loaded
	Events.ready(bot);
});

bot.on('guildCreate', guild => { // listen to joins
	Events.join(bot, guild);
});

bot.on('guildDelete', guild => { // listen to leaves
	Events.leave(bot, guild);
});

var timeout = { // timeout function for command cooldown, courtesy of u/pilar6195 on reddit
	"users": [],
    "check": function(userID, msg) {
        if (timeout.users.indexOf(userID) > -1) { // If the user is on timeout don't let them use the command
			msg.reply(`calm down with the commands for a sec! Please wait ${config.commandCooldown} seconds.`);
            return true;
        } else if (config.ownerID !== userID) { // If the user is not the bot owner and is not on timeout let them use the command and add their user id to the timeout
            timeout.set(userID); // use set function on the userID
            return false;
        }
    },
    "set": function(userID) {
    	timeout.users.push(userID); // push the userID into the timeout array
    	setTimeout(function() { // set timeout for, well, the timeout
            timeout.users.splice(timeout.users.indexOf(userID), 1); // take out the user after timeout is up
        }, (config.commandCooldown * 1000)); // Set the cooldown to the configured amount
    }
};

setInterval(function () {
	if(bot.user.presence.game.name == `try '${config.commandPrefix} help' !`) { // if the current status is ...
		bot.user.setGame("on megumin.love"); //  set it to ...
	}
	else if(bot.user.presence.game.name == "on megumin.love") { // but if the current status is ...
		bot.user.setGame(`try '${config.commandPrefix} help' !`); // then set it to ...
	}
	else { // however, if the bot's playing status was changed (is neither of two default) or cleared ...
		return;	// ... leave it unchanged.
	}
}, 300000); // repeat every 5 minutes

bot.on('message', msg => { // listen to all messages sent
	var command = ""; // For ignoring and logging purposes, placeholder at this point 
	if(msg.author.bot) { return; }; // Ignore any bot messages
	if(!msg.content.startsWith(config.commandPrefix)) { return; }; // Don't listen to messages not starting with bot prefix
	if(msg.content == config.commandPrefix) { return; }; // Ignore empty commands (messages containing just the prefix)
	if(ignoreList.indexOf(msg.author.id) !== -1) { return; }; // If user is on the ignore list, ignore him (duh) 
	const permission = msg.channel.permissionsFor(bot.user); // For permission checking on the bot's side later on in the commands
	/*
	INFO: 
	Because the commands are all loaded from external files, "bot", "msg", "timeout" and "permission" are passed
	to every command by default, whether used by the command or not. Other necessary packages are defined in the command files.
	Packages not needed for the base file (this one) are only defined in the commands that need them.
	*/ 
	var actualCmd = msg.content.replace(config.commandPrefix, '').trim().split(' ')[0].toLowerCase();
	/*	
	Replace (cut out) bot prefix, cut out whitespaces at start and end,
	split prefix, command and arg into array and convert to lowercase
	*/
	if (Object.keys(Commands.commands).indexOf(actualCmd) > -1) { 
		// If the given command is an actual command that is available...
		Commands.commands[actualCmd].main(bot, msg, timeout, permission);
		// ...run the command.
	};
	return; // Just in case, return empty for anything else.
});

bot.login(config.token); // Log the bot in with token set in config