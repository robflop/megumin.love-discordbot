const Discord = require('discord.js'); // obvious bot base
const config = require('./config.json'); // import configuration
const commands = require('./commands/'); // import all command files
const ignoreList = require('./ignore.json'); // load array of ignored users
const bot = new Discord.Client(); // initialize bot instance

bot.on('ready', () => { // ready message once bot is loaded 
	commands.otherEvents.ready(bot);
});

bot.on('guildCreate', guild => { // listen to joins
	commands.otherEvents.join(bot);
});

bot.on('guildDelete', guild => { // listen to leaves
	commands.otherEvents.leave(bot);
}); 

var timeout = { // timeout function for command cooldown, courtesy of u/pilar6195 on reddit
	"users": [],
    "check": function(userID, msg) {
        if (timeout.users.indexOf(userID) > -1) { // If the user is on timeout don't let them use the command
			msg.reply(`calm down with the commands for a sec! Please wait ${config.commandCooldown} seconds.`);
            return true;
        } else if (config.ownerID !== userID) { // If the user is not the bot owner and is not on timeout let them use the command and add their user id to the timeout
            timeout.set(userID);
            return false;
        }
    },
    "set": function(userID) {
    	timeout.users.push(userID);
    	setTimeout(function() {
            timeout.users.splice(timeout.users.indexOf(userID), 1);
        }, (config.commandCooldown * 1000)); // Set the cooldown to the configured amount
    }
};

setInterval(function () { 
	if(bot.user.presence.game.name == "try 'robbot, help' !") { // if the current status is ...
		bot.user.setGame("on megumin.love"); //  set it to ...
	}
	else if(bot.user.presence.game.name == "on megumin.love") { // but if the current status is ...
		bot.user.setGame("try 'robbot, help' !"); // then set it to ...
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
	if(msg.content.indexOf("help") - config.commandPrefix.length == 1) { // help command
		commands.help(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("about") - config.commandPrefix.length == 1) { // about command
		commands.about(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("counter") - config.commandPrefix.length == 1) { // counter command
		commands.counter(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("submit") - config.commandPrefix.length == 1) { // submit command
		commands.submit(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("randomsound") - config.commandPrefix.length == 1) { // randomsound command
		commands.randomsound(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("setGame") - config.commandPrefix.length == 1) { // setGame command
		commands.setGame(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("clearGame") - config.commandPrefix.length == 1) { // clearGame command
		commands.clearGame(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("stats") - config.commandPrefix.length == 1) { // stats command
		commands.stats(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("setAvatar") - config.commandPrefix.length == 1) { // setAvatar command
		commands.setAvatar(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("setName") - config.commandPrefix.length == 1) { // setName command
		commands.setName(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("ignore") - config.commandPrefix.length == 1) { // ignore command
		commands.ignore(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("POST") - config.commandPrefix.length == 1) { // POST command
		commands.POST(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("showLog") - config.commandPrefix.length == 1) { // showLog command
		commands.showLog(bot, msg, timeout, permission); // call command from file
	};
	if(msg.content.indexOf("shutdown") - config.commandPrefix.length == 1) { // shutdown command
		commands.shutdown(bot, msg, timeout, permission); // call command from file
	};
});

bot.login(config.token); // Log the bot in with token set in config