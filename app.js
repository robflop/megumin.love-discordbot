const request = require('request'); // for website interaction
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
const Discord = require('discord.js'); // obvious bot base
const prism = require('prism-media'); // prism for smoother file playing of very short files
const config = require('./config.json'); // import configuration
const ignoreList = require('./ignore.json'); // load array of ignored users
const bot = new Discord.Client(); // initialize bot instance

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

bot.on('ready', () => { // ready message once bot is loaded 
	console.log(`${bot.user.username} ready!`); // console log a ready message
	bot.user.setGame("try 'robbot, help' !"); // set default game status
});

bot.on('guildCreate', guild => { // listen to joins
	console.log(`${bot.user.username} has joined a new server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has joined the '${guild.name}' server!`); 
	// Log which server was joined and when
});

bot.on('guildDelete', guild => { // listen to leaves
	console.log(`${bot.user.username} has left a server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SERVERS] ${bot.user.username} has left the '${guild.name}' server!`); 
	// Log which server was left and when
}); 

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
	if(msg.content.indexOf("help") - config.commandPrefix.length == 1) { // Check if "help" comes right after the bot prefix, with one space inbetween
			var command = "help"; // for logging purposes
			if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
			msg.author.sendMessage("__**Available commands are:**__ \n\n 'help' -- displays this message \n 'about' -- get general bot info \n 'counter' -- display the website's current counter \n 'submit' -- get info on submitting sounds for the website/bot \n 'randomsound' -- Have the bot join the voice channel you are in and it'll play a random sound from the website \n 'setGame' -- sets the bot's playing status [Bot owner only] \n 'clearGame' -- clears the bot's playing status [Bot owner only] \n 'stats' -- display various bot stats [Bot owner only] \n 'setAvatar' -- changes the bot's avatar [Bot owner only] \n 'setName' -- changes the bot's username [Bot owner only] \n 'ignore' -- Make the bot ignore a user, use a 2nd time to revert [Bot owner only] \n 'POST' -- update the server count on the Discord Bots website (enable the command in the config) [Bot owner only] \n 'showLog' -- easily display one of the configured log files [Bot owner only] \n 'shutdown' -- shuts down the bot [Bot owner only]");	
	}; 
	if(msg.content.indexOf("about") - config.commandPrefix.length == 1) { // Check if "about" comes right after the bot prefix, with one space inbetween
		if(!permission.hasPermission('SEND_MESSAGES')) {
			msg.author.sendMessage("I can't send messages to that channel!"); 
			return; 
		}
		var command = "about"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		msg.channel.sendMessage(`robbot made by robflop#2174. Made to complement the website <https://megumin.love> also by robflop#2174.\nCheck out the Github repo at <https://github.com/robflop/megumin.love-discordbot>.`);
	};
	if(msg.content.indexOf("counter") - config.commandPrefix.length == 1) { // Check if "counter" comes right after the bot prefix, with one space inbetween
		var command = "counter"; // for logging purposes
		if(!permission.hasPermission('SEND_MESSAGES')) {  // If it can't send to the channel, PM the user
			msg.author.sendMessage("I can't send messages to that channel!"); 
			return;											  
		}
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
        request.get('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) { // GET the counter number
			if(error || response.statusCode !== 200) { // Check for errors or response codes other than 200 (OK)
				console.log(`An unusual response code was emitted when GETting the counter: ${response.statusCode} -- Refer to request logs`);
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
				// Log any unusual request responses
				return; // abort command execution
			};
            msg.channel.sendMessage(`Current count is: ${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`); // Format counter to x.xxx.xxx 
        });
    };
	if(msg.content.indexOf("submit") - config.commandPrefix.length == 1) { // Check if "submit" comes right after the bot prefix, with one space inbetween
		if(!permission.hasPermission('SEND_MESSAGES')) {
			msg.author.sendMessage("I can't send messages to that channel!"); // If it can't send to the channel, PM the user
			return;
		}
		var command = "submit"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		msg.reply("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file or contact me on discord at robflop#2174! All sounds need to fit the website's theme.");
	};
	if(msg.content.indexOf("randomsound") - config.commandPrefix.length == 1) { // Check if "randomsound" comes right after the bot prefix, with one space inbetween
		var command = "randomsound"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution.
		if(!msg.member.voiceChannel) { // If the user that used the command is not in a voice channel on the server the command came from ...
			if(!permission.hasPermission('SEND_MESSAGES')) {  // 1) ...and the bot can't send to the channel...
				msg.author.sendMessage("Join a voice channel first!"); // ... PM the author of the msg...
				return; // ... and abort command execution.
			} 
			msg.reply("join a voice channel first!"); // 2) ...notify the usero to join a channel...
				return; // ... and abort command execution.
		}
		if(!msg.member.voiceChannel.joinable) { // If the bot can't connect to the voicechannel... 
			msg.author.sendMessage("I can't connect to that voice channel!"); // ... PM the author of the msg...
			return; // ... and abort command execution.
		}
		if(msg.guild.voiceConnection !== null) { // if the bot is already in a voice channel of the server the command came from...
			if(!permission.hasPermission('SEND_MESSAGES')) {  // ... 1) and if the bot can't send to the channel ...
				msg.author.sendMessage('please wait for the current sound to finish!'); // ... PM the author of the msg...
				return; // ... and abort command execution.
			}
			msg.reply('please wait for the current sound to finish!'); // ... 2) notify the user...
			return; // ... and abort command execution.
		}
		// If a voice connection does not exist on the server the command is being used, do the following
		request.get('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body) { // increment the counter on-site
			if(error || response.statusCode !== 200) { // Check for errors or response codes other than 200 (OK)
				console.log(`An unusual response code was emitted when GETting the counter increment script: ${response.statusCode}`);
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
				// Log any unusual request responses
				return; // abort command execution
			};
		}); 
		msg.member.voiceChannel.join().then(connection => { // check if message author is in a voice channel, if true join it
			var sounds = ["eugh1.mp3", "eugh2.mp3", "eugh3.mp3", "eugh4.mp3", "explosion.mp3", "itai.mp3", "n.mp3", "name.mp3", "plosion.mp3", "pull.mp3", "sion.mp3", "yamero.mp3"]; 
			// set available files
			var sound = sounds[Math.floor(Math.random()*sounds.length)]; // randomize which sound gets played 
			const player = connection.playFile(config.soundPath + sound); // play the file
			fs.appendFileSync(`${config.logPath}${config.soundLog}`, `\n[${moment().format('DD/MM/YYYY H:mm:ss')}][AUDIO] ${msg.author.username}#${msg.author.discriminator} used the '${msg.content.substr(config.commandPrefix.length + 1, command.length)}' command on the '${msg.guild}' server!`); // Log command use, which file was played when and by whom
			player.on('end', () => {
				msg.member.voiceChannel.leave(); // leave voice channel after file finishes playing
			});
		});
	};
	if(msg.content.indexOf("setGame") - config.commandPrefix.length == 1) { // Check if "setGame" comes right after the bot prefix, with one space inbetween
		var command = "setGame"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!"); // ... notify the user...
			console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried to change the bot's game, but failed!`);
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
			return; // ... and abort command execution.
		};
		bot.user.setGame(msg.content.substr(config.commandPrefix.length + command.length + 2)); 
		/* 
		Cut off the command part of the message and set the bot's game. 
		INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
		Example: "robbot, setGame test" -> cut out the length of the prefix and " setGame ". 
		*/
		msg.reply(`successfully set my game to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! \n(May not have worked if ratelimit has been capped)`);
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
		console.log(`${bot.user.username}'s game set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}'! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
		if(!permission.hasPermission('SEND_MESSAGES')) {  // If the bot can't send to the channel...
			msg.author.sendMessage(`Successfully set my game to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! \n(May not have worked if ratelimit has been capped)`); 
			// ...PM the user...
			return; // ... and abort command execution.
		};
		msg.reply(`successfully set my game to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! \n (May not have worked if ratelimit has been capped)`);
	};
	if(msg.content.indexOf("clearGame") - config.commandPrefix.length == 1) { // Check if "clearGame" comes right after the bot prefix, with one space inbetween
		var command = "clearGame"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!"); // ... notify the user...
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command, but failed!`); // ... log command use, when and by whom...
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to clear the bot's game on the '${msg.guild}' server, but failed!`);
			return; // ... and abort command execution.
		};
		bot.user.setGame();	// set game to nothing, clearing it
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command!`); // Log command use, when and by whom
		console.log(`${bot.user.username}'s game status reset! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
		if(!permission.hasPermission('SEND_MESSAGES')) {  // If the bot can't send to the channel...
			msg.author.sendMessage("Game status cleared! \n(May not have worked if ratelimit has been capped)");  // ...PM the user...
			return; // ... and abort command execution.
		};
		msg.reply("game status cleared! \n(May not have worked if ratelimit has been capped)");
	};
	if(msg.content.indexOf("stats") - config.commandPrefix.length == 1) { // Check if "stats" comes right after the bot prefix, with one space inbetween
		if(!permission.hasPermission('SEND_MESSAGES')) {  // If the bot can't send to the channel...
			msg.author.sendMessage("I can't send messages to that channel!"); // ...PM the user...
			return;	// ... and abort command execution.
		};
		var command = "stats"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!");  // ... notify the user...
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
			return;  // ... and abort command execution.
		}
		msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
	};
	if(msg.content.indexOf("setAvatar") - config.commandPrefix.length == 1) { // Check if "setAvatar" comes right after the bot prefix, with one space inbetween
		// INFO: The command will execute whether or not the bot can send messages to the channel. Erorr messages will be sent via PM if it can't.
		var command = "setAvatar"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) {  // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!"); // ... notify the user...
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
			return;  // ... and abort command execution.
		};
		var arg = msg.content.substr(config.commandPrefix.length + command.length + 2)
		/* 
		Cut off the command part of the message and set the bot's avatar. 
		INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
		Example: "robbot, setAvatar test" -> cut out the length of the prefix and " setAvatar ". 
		*/
		if(!arg.startsWith("http") && !fs.existsSync(arg)) { // If the argument does not begin with http (is not a link) and is not found locally.. 
			if(!permission.hasPermission('SEND_MESSAGES')) { // 1) ...and if the bot can't send to the channel ...
				msg.author.sendMessage("Invalid file or URL."); // ...pm the user the file was not found...
				return; // ...and abort command execution.
			};
			msg.reply("invalid file or URL."); // 2) send a message to the channel notifying the user of the error...
			return; // ... and abort command execution.
		};
		bot.user.setAvatar(arg); // set the bot's avatar to the arg
		msg.reply(`successfully set my avatar to '${arg}' ! \n(May not have worked if ratelimit capped)`);
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
		console.log(`${bot.user.username}'s avatar set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
	};
	if(msg.content.indexOf("setName") - config.commandPrefix.length == 1) { // Check if "setName" comes right after the bot prefix, with one space inbetween
		// INFO: The command will execute whether or not the bot can send messages to the channel.			
		var command = "setName"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) {  // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!"); // ... notify the user...
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
			return; // ... and abort command execution.
		};
		var arg = msg.content.substr(config.commandPrefix.length + command.length + 2)
		/* 
		Cut off the command part of the message and set the bot's username. 
		INFO: The additional 2 spaces added are the whitespaces between one, the prefix and the command, and two, between the command and the argument.
		Example: "robbot, setName test" -> cut out the length of the prefix and " setName ". 
		*/
		if(msg.content.length == config.commandPrefix.length + command.length + 1) {
			msg.reply("specify a name to set the bot to!");
			return;	
		};
		bot.user.setUsername(arg); // set the bot's username to the arg
		msg.reply(`successfully set my username to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! \n(May not have worked if ratelimit capped)`);
		fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
		console.log(`${bot.user.username}'s username set to '${msg.content.substr(config.commandPrefix.length + command.length + 2)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`) 
	};
	if(msg.content.indexOf('ignore') - config.commandPrefix.length == 1) { // Check if "ignore" comes right after the bot prefix, with one space inbetween
		/*
		INFO: The ignore command goes into effect whether the bot can send the confirmation message or not.
		*/
		var command = "ignore"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!"); // ... notify the user...
			fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command, but failed!`); // ... log command use, when and by whom...
			console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried to make the bot ignore a user, but failed!`);
			return; // ... and abort command execution.
		};
		var UserID = msg.content.substr(config.commandPrefix.length + command.length + 2); // Select the mention part of the message (<@(!)..>) for ignoreList purposes
		var match = UserID.match(/<@!?(\d+)>/); // Search for mention syntax, regex courtesy of /u/geo1088 on reddit.
		if(!match) { // If no user mentioned, tell the command caller
			msg.reply('mention a user to put on the list!');	
			return; // abort command execution
		};
		var strippedID = match[1]; // strippedID is now the raw UserID
		var index = ignoreList.indexOf(strippedID); // Get the index of the stripped ID
		if(strippedID !== config.ownerID) { // If the UserID does not correspond to the bot owner ID ...
			if(index == -1) { // 1) ... and is not on the list already ...
				msg.reply(`i am now ignoring ${UserID} !`);
				ignoreList.push(strippedID); // ... push the stripped UserID into the ignore list ... 
				fs.writeFile('ignore.json', JSON.stringify(ignoreList)); // ... and save the array to the file.
				fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully added a user to the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list on the '${msg.guild}' server!`);
			}
			else { // 2) ... but is on the list already ...
				msg.reply(`i am no longer ignoring ${UserID} !`); 
				ignoreList.splice(index, 1); // ... take them out of the list ...
				fs.writeFile('ignore.json', JSON.stringify(ignoreList)); // ... and save the array to the file.
				fs.appendFileSync(`${config.logPath}${config.ignoreLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][USERS] ${msg.author.username}#${msg.author.discriminator} successfully removed a user from the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" list on the '${msg.guild}' server!`);							
			}
		};		
	};
	if(config.useDiscordBots) {
		if(msg.content.indexOf('POST') - config.commandPrefix.length == 1) { // check if "POST" comes right after the bot prefix with one space inbetween
			/*
			INFO: The POST command goes into action whether the confirmation mesage can be sent or not. 
			Some messages will be PM'd if there is no send permission, some will not be sent at all if there is not.
			*/
			if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
			if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
				msg.reply("you are not authorized to use this command!"); // ... notify the user...
				fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][STATUS] ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command, but failed!`); // ... log command use, when and by whom...
				console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server tried to POST the bot's DiscordBots server list, but failed!`);
				return; // ... and abort command execution.
			};
			var command = "POST"; // for logging purposes
			request.post( // Send POST request
				{
					headers: { // Set discordbots API header and json content type
						'Authorization': `${config.discordBotsAPI}`, // send Discord Bots API Token in auth header
						'Content-type': 'application/json; charset=utf-8' // set encoding to JSON + UTF-8
					},
					url: `https://bots.discord.pw/api/bots/${bot.user.id}/stats`, // set URL to discordbots api stats
					body: `{"server_count": ${bot.guilds.size}}` // send the bot's server count in body
				}, 
				function (error, response, body) {
					if(error || response.statusCode !== 200) { // Check for errors or response codes other than 200 (OK)
						console.log(`An unusual response code was emitted when POSTing the bot stats: ${response.statusCode}`);
						fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); // Log any unusual request responses
						if(!permission.hasPermission('SEND_MESSAGES')) { // If the bot can't send to the channel...
							msg.author.sendMessage(`An error during the POST request has occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
							// ...PM the author of the msg	
							return;	
						};
						msg.reply(`an error during the POST request has occurred. Please refer to '${config.logPath}${config.requestLog}'.`);
						return; // abort command execution
					};
					fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST] POST request successfully sent! (${response.statusCode})`); 
					// Log what was done and when
					console.log(`The '${command}' command was successfully used by ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server!`);
					msg.reply('POST request sent successfully!');
				}
			);
		};
	};
	if(msg.content.indexOf('showLog') - config.commandPrefix.length == 1) {
		var command = "showLog"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { // If the user is not authorized ...
			msg.reply("you are not authorized to use this command!"); // ... notify the user...
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but failed!`); // ... log command use, when and by whom...
			console.log(`${msg.author.username}#${msg.author.discriminator} tried displaying logs on the '${msg.guild}' server, but failed!`);
			return; // ... and abort command execution.
		};
		var arg = msg.content.substr(config.commandPrefix.length + command.length + 2); // cut out the argument of the command
		var file = ""; // placeholder for file to read
		switch(arg) { // Whitelist allowed log files to read
			case config.shutdownLog: var file = config.shutdownLog; break;
			case config.soundLog: var file = config.soundLog; break;
			case config.requestLog: var file = config.requestLog; break;
			case config.serverLog: var file = config.serverLog; break;
			case config.profileLog: var file = config.profileLog; break;
			case config.ignoreLog: var file = config.ignoreLog; break;
			default: msg.author.sendMessage("Not a configured log file."); return; // If anything not on the whitelist is given, notify user and abort command execution
		};
		fs.readFile(`${config.logPath + file}`, "utf-8", (error, data) => { // read the given argument file from the default log path
			if(error) {
				msg.author.sendMessage(`An error has occured: \`\`\`${error}\`\`\``); // notify author of errors
				fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but an error occurred!`); // Log command use, when and by whom
					return; // abort command execution
			}; 
			msg.author.sendMessage(`\`\`\`${data}\`\`\``, {split: {prepend: "\`\`\`", append: "\`\`\`"}});
			console.log(`${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server displayed a log file!`);
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server!`); // Log command use, when and by whom
		});		
	};
	if(msg.content.indexOf("shutdown") - config.commandPrefix.length == 1) { // Check if "shutdown" comes right after the bot prefix, with one space inbetween
		/*
		INFO: The shutdown command goes into effect whether the bot can send the confirmation message or not.
		*/
		var command = "shutdown"; // for logging purposes
		if(timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
		if(msg.author.id !== config.ownerID) { // Check for authorization
			msg.reply("you are not authorized to use this command!");
			fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][POWER] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to shutdown the bot on the '${msg.guild}' server, but failed!`);
			return; // abort command execution
		};
		msg.reply(`${bot.user.username} shutting down! Bye!`);
		fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][POWER] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
		console.log(`${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
		setTimeout(function(){ // set timeout for bot shutdown
			bot.destroy(); //  destroy bot session before killing node process
			process.exit(0); // End the node process
		}, 1500); // set timeout of 1,5 sec	
	};
});

bot.login(config.token); // Log the bot in with token set in config