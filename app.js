const Discord = require('discord.js'); // Obvious bot base
const bot = new Discord.Client(); // Initialize bot instance
const config = require('./config.json'); // Import configuration
const fs = require('fs'); // For ignore list checking
var Events = require('./event_handler.js'); // Load event handler
var ignoreLists = require('./ignore_handler.js'); // Load ignore handler
var Commands = require('./command_handler.js'); // Load command handler

bot.once('ready', () => { // Ready message once bot is loaded
	Events.ready(bot);
});

bot.on('error', () => { // Listen to errors
	Events.error(bot);
}); 

bot.on('guildCreate', guild => { // Listen to joins
	Events.join(bot, guild);
});

bot.on('guildDelete', guild => { // Listen to leaves
	Events.leave(bot, guild);
});

var timeout = { 
	// Timeout function for command cooldown, courtesy of u/pilar6195 on reddit
	"users": [],
    "check": function(userID, msg) {
        if (timeout.users.indexOf(userID) > -1) { 
			// If the user is on timeout don't let them use the command
			msg.reply(`calm down with the commands for a sec! Please wait ${config.commandCooldown} seconds.`);
            return true;
        } else if (config.ownerID !== userID) { 
			// If the user is not the bot owner and is not on timeout, let them use the command and add their user id to the timeout
            timeout.set(userID); // use set function on the userID
            return false;
        }
    },
    "set": function(userID) {
    	timeout.users.push(userID); 
		// Push the userID into the timeout array
    	setTimeout(function() { 
			// Set timeout for, well, the timeout
            timeout.users.splice(timeout.users.indexOf(userID), 1); 
			// Take out the user after timeout is up
        }, (config.commandCooldown * 1000)); 
		// Set the cooldown to the configured amount
    }
};

setInterval(function () {
	if(bot.user.presence.game.name == `try '${config.commandPrefix} help' !`) { // If the current status is...
		bot.user.setGame("on megumin.love"); //  ...set it to [...].
	}
	else if(bot.user.presence.game.name == "on megumin.love") { // ...but if the current status is...
		bot.user.setGame(`try '${config.commandPrefix} help' !`); // ...then set it to [...].
	}
	else { 
		// however, if the bot's playing status was changed (is neither of two default) or cleared...
		return;	// ...leave it unchanged.
	}
}, 300000); // Repeat every 5 minutes

bot.on('message', msg => { // Listen to all messages sent
	if(msg.author.bot) { return; }; // Ignore any bot messages
	if(!msg.content.startsWith(config.commandPrefix)) { return; }; // Don't listen to messages not starting with bot prefix
	if(msg.channel.type == "dm") {
	// Iff the message is from a private channel...
		msg.channel.sendMessage("Commands via DM not supported, sorry.");
		// ...notify the user...
		return;
		// ...and abort command execution.
	};
	if(msg.content == config.commandPrefix) { return; }; // Ignore empty commands (messages containing just the prefix)
	if(fs.existsSync(`${config.ignorePath}ignore_${msg.guild.id}.json`)) { 
	/* 
	Check if an ignore file for the server the command is used on exists, and if the channel is a DM channel
	(no ignore file exists if the ignore command has not been used yet)
	*/
		if(ignoreLists.ignoreLists[`ignore_${msg.guild.id}`].indexOf(`${msg.author.id}`) > -1) { 
		// Search the ignore list of the server the message came from for the userID of the command caller...
		return; // ... if it is found, ignore the user (duh). (Else proceed as usual.)
		}; 
	} 
	// If no ignore list (file) was found and the guild id is null, proceed without checking for ignored users
	const botPerm = msg.channel.permissionsFor(bot.user); // For permission checking on the bot's side later on in the commands
	const userPerm = msg.channel.permissionsFor(msg.member); // For permission checking on the user's side later on in the commands
	/*
	INFO: 
	Because the commands are all loaded from external files, "bot", "msg", "timeout", "botPerm" and "userPerm" are passed...
	...to every command by default, whether used by the command or not. Other necessary packages are defined in the command files.
	Packages not needed for the base file (this one) are only defined in the commands that need them.
	*/ 
	var actualCmd = msg.content.replace(config.commandPrefix, '').trim().split(' ')[0].toLowerCase();
	/*	
	Replace (cut out) bot prefix, cut out whitespaces at start and end, split prefix, command
	and arg into array, convert to lowercase and select the command part ([0] of the array)
	*/
	if(Object.keys(Commands.commands).indexOf(actualCmd) > -1) { 
	// If the given command is an actual command that is available...
		Commands.commands[actualCmd].main(bot, msg, timeout, botPerm, userPerm);
		// ...run the command.
	};
	if(actualCmd == "reload") {
	// Reload command
		if(timeout.check(msg.author.id, msg)) { return; }; 
		// Check for cooldown, if on cooldown notify user of it and abort command execution.
		if(msg.author.id !== config.ownerID) { 
			// If the user is not authorized...
			msg.reply("you are not authorized to use this command!");
			// ...notify the user...
			return; // ...and abort command execution.
		};
		var arg = msg.content.substr(config.commandPrefix.length + actualCmd.length + 2);
		/* 
		Cut out the name of the command to be reloaded
		INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
		Example: "robbot, reload about" -> cut out the length of the prefix and " reload ". 
		*/
		if(arg == "") {
		// If no command to reload is given...
			msg.reply('specify a command to reload!');
			// ...notify the user to specify a command...
			return; // ...and abort command execution.
		};
		// Otherwise...
		try {
		// ...try reloading the command.
			var cmdFile = Commands.commands[arg.toLowerCase()].filename;
			// Define the file to reload, based on the commands object
			delete require.cache[require.resolve(`./commands/${cmdFile}`)];
			delete require.cache[require.resolve('./commands/help.js')];
			delete require.cache[require.resolve('./command_handler.js')];
			/*
			Delete the command's cache, the 'help' cache and the command handler's cache...
			('help' cache deleted to update the command's info if command added/removed/changed)
			*/
			Commands = require('./command_handler.js');
			// ...then re-require the command handler which then reloads the command.
    	}
		catch(error) {
		// If there is an error while reloading...
			msg.reply(`error while reloading the '${arg}' command: \`\`\`${error}\`\`\`\n(Command may not exist, check for typos)`)
			// ...notify the user...
			return; // ...and abort command execution.
		};
		// If there is no error, notify the user of success.
		msg.reply(`command '${cmdFile.slice(0, -3)}' successfully reloaded!`);
	};
	return; // Just in case, return empty for anything else.
});

bot.login(config.token); // Log the bot in with token set in config