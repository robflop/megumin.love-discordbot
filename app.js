const request = require('request'); // for website interaction
const fs = require('fs'); // for log writing
const moment = require('moment'); // part of log writing
const Discord = require('discord.js'); // obvious bot base
const prism = require('prism-media'); // prism for smoother file playing of very short files
const config = require('./config.json'); // import configuration
const bot = new Discord.Client(); // initialize bot instance

var timeout = { // timeout function for command cooldown
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
	bot.user.setGame('on megumin.love'); // set default game status
});

bot.on('guildCreate', guild => { // listen to joins
	console.log(`${bot.user.username} has joined a new server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][SERVERS] ${bot.user.username} has joined the '${guild.name}' server!`); 
	// Log which server was joined and when
	console.log(`Logged into "${config.logPath}${config.serverLog}" !`);
});

bot.on('guildDelete', guild => { // listen to leaves
	console.log(`${bot.user.username} has left a server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][SERVERS] ${bot.user.username} has left the '${guild.name}' server!`); 
	// Log which server was left and when
	console.log(`Logged into "${config.logPath}${config.serverLog}" !`);
}); 

bot.on('message', msg => { // listen to all messages sent
	if(msg.author.bot){ return; };// Ignore any bot messages
	if(msg.content.startsWith(config.commandPrefix)) { // Only listen to messages starting with the bot prefix
		const permission = msg.channel.permissionsFor(bot.user); // For permission checking on the bot's side later on in the commands
		if(msg.content.indexOf("help") - config.commandPrefix.length == 1) { // Check if "help" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) { // Check if bot can send messages to the channel
				var command = "help"; // for logging purposes
				if (timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				msg.channel.sendMessage("__**Available commands are:**__ \n\n 'help' -- displays this message \n 'about' -- get general bot info \n 'counter' -- display the website's current counter \n 'submit' -- get info on submitting sounds for the website/bot \n 'randomsound' -- Have the bot join the voice channel you are in and it'll play a random sound from the website \n 'setGame' -- sets the bot's playing status [Bot owner only] \n 'clearGame' -- clears the bot's playing status [Bot owner only] \n 'stats' -- display various bot stats [Bot owner only] \n 'setAvatar' -- changes the bot's avatar [Bot owner only] \n 'setName' -- changes the bot's username [Bot owner only] \n 'shutdown' -- shuts down the bot [Bot owner only]");
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		}; 
		if(msg.content.indexOf("about") - config.commandPrefix.length == 1) { // Check if "about" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) { // Check if bot can send messages to the channel
				var command = "about"; // for logging purposes
				if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				msg.channel.sendMessage(`robbot made by robflop#2174. Made to complement the website <https://megumin.love> also by robflop#2174.\nCheck out the Github repo at <https://github.com/robflop/megumin.love-discordbot>.`);
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("counter") - config.commandPrefix.length == 1) { // Check if "counter" comes right after the bot prefix, with one space inbetween
			var command = "counter"; // for logging purposes
			if(permission.hasPermission('SEND_MESSAGES')) {  // Check if bot can send messages to the channel 
				if (timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
        		request('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body) { // GET the counter number
					if(error) {
							console.log(`An error has occured during '${msg.content}' on the '${msg.guild}' server: ${error}`);
							fs.appendFileSync(`${config.logPath}${config.errorLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][ERROR]${error}`); // Log any request errors
							console.log(`Error during '${msg.content.substr(config.commandPrefix.length + 1, command.length)}}' on the '${msg.guild}' server logged to ${config.logPath}${config.errorLog}`);
					};
            		msg.channel.sendMessage(`Current count is: ${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`); // Format counter to x.xxx.xxx 
        		});
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
    	};
		if(msg.content.indexOf("submit") - config.commandPrefix.length == 1) { // Check if "submit" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) {  // Check if bot can send messages to the channel 
				var command = "submit"; // for logging purposes
				if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				msg.reply("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file or contact me on discord at robflop#2174! All sounds need to fit the website's theme.");
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("randomsound") - config.commandPrefix.length == 1) { // Check if "randomsound" comes right after the bot prefix, with one space inbetween
			if(msg.member.voiceChannel.joinable) { // Check if bot can connect to the voice channel
				var command = "randomsound"; // for logging purposes
				if (timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				if(msg.member.voiceChannel){ // check if the user that used the command is in a voice channel on the server the command came from
					if(msg.guild.voiceConnection !== null) { // Check if the bot is already in a voice channel of the server the command came from
						if(permission.hasPermission('SEND_MESSAGES')) {  // Check if bot can send messages to the channel
							msg.reply('please wait for the current sound to finish!'); 
							return;  // if a voice connection exists, do nothing (besides sending above message)
						}
						else { 
							msg.author.sendMessage('please wait for the current sound to finish!'); // If it can't PM the author of the msg
							return;
						};
					} 
					else { // if a voice connection on the server the command came from doesn't exist, do the following
					request('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body) { // increment the counter on-site
						if(error) {
							console.log(`An error has occured during '${msg.content}' on the '${msg.guild}' server: ${error}`);
							fs.appendFileSync(`${config.logPath}${config.errorLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][ERROR]${error}`); // Log any request errors 
							console.log(`Error during '${msg.content.substr(config.commandPrefix.length + 1, command.length)}' on '${msg.guild}' logged to ${config.logPath}${config.errorLog}`);
						};
					}); 
					msg.member.voiceChannel.join().then(connection => { // check if message author is in a voice channel, if true join it
						console.log(`Connected to '${msg.member.voiceChannel.name}' on the '${msg.guild}' server!`); 
						var sounds = ["eugh1.mp3", "eugh2.mp3", "eugh3.mp3", "eugh4.mp3", "explosion.mp3", "itai.mp3", "n.mp3", "name.mp3", "plosion.mp3", "pull.mp3", "sion.mp3", "yamero.mp3"]; // set available files
						var sound = sounds[Math.floor(Math.random()*sounds.length)]; // randomize which sound gets played 
						const player = connection.playFile(config.soundPath + sound); // play the file
						console.log(`"${config.soundPath + sound}" played in '${msg.member.voiceChannel.name}' on the '${msg.guild}' server! (${msg.author.username}#${msg.author.discriminator})`);
						fs.appendFileSync(`${config.logPath}${config.soundLog}`, `\n[${moment().format('DD/MM/YYYY H:mm:ss')}][AUDIO] ${msg.author.username}#${msg.author.discriminator} used the '${msg.content.substr(config.commandPrefix.length + 1, command.length)}' command on the '${msg.guild}' server!`); // Log command use, which file was played when and by whom
						console.log(`Logged into "${config.logPath}${config.soundLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
						player.on('end', () => {
							msg.member.voiceChannel.leave(); // leave voice channel after file finishes playing
							console.log(`Disconnected from '${msg.member.voiceChannel.name}' on the '${msg.guild}' server!`);
						});
					})};
				}
				else { // if message author not in a voice channel, tell them to join one
					if(permission.hasPermission('SEND_MESSAGES')) {  // Check if bot can send messages to the channel 
						msg.reply("join a voice channel first!");
						return; // abort command execution
					}
					else { 
						msg.author.sendMessage("Join a voice channel first!"); // If it can't PM the author of the msg
						return; // abort command execution
					};
				};
			}
			else { 
				msg.author.sendMessage("I can't connect to that voice channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("setGame") - config.commandPrefix.length == 1) { // Check if "setGame" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) {  // Check if bot can send messages to the channel 
				var command = "setGame"; // for logging purposes
				if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				if(msg.author.id !== config.ownerID){ // Check for authorization
					msg.reply("you are not authorized to use this command!");
					console.log(`${msg.author.username}#${msg.author.discriminator} tried to change the bot's game on the '${msg.guild}' server, but failed!`);
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
					return; // abort command execution
				}
				else {
					bot.user.setGame(msg.content.substr(config.commandPrefix.length + 9)); 
					/* 
					Cut off the command part of the message and set the bot's game. 
					INFO: "setGame" is 7 long, but there are 2 spaces before the actual status input. These have to be cut out, therefore 9.
					Example: "robbot, setGame test" -> cut out the length of the prefix and " setGame ". 
					*/
					msg.reply(`successfully set my game to '${msg.content.substr(config.commandPrefix.length + 9)}' ! \n (May not have worked if ratelimit has been capped)`);
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
					console.log(`${bot.user.username}'s game set to '${msg.content.substr(config.commandPrefix.length + 9)}'! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
				};
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("clearGame") - config.commandPrefix.length == 1) { // Check if "clearGame" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) {  // Check if bot can send messages to the channel 
				var command = "clearGame"; // for logging purposes
				if (timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				if(msg.author.id !== config.ownerID) { // Check for authorization
					msg.reply("you are not authorized to use this command!");
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
					console.log(`${msg.author.username}#${msg.author.discriminator} tried to clear the bot's game on the '${msg.guild}' server, but failed!`);
					return; // abort command execution
				}
				else {
					bot.user.setGame();	// set game to nothing, clearing it
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
					console.log(`${bot.user.username}'s game status reset! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
					msg.reply("game status cleared! \n (May not have worked if ratelimit has been capped)");
				};
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("stats") - config.commandPrefix.length == 1) { // Check if "stats" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) { // Check if bot can send messages to the channel 
				var command = "stats"; // for logging purposes
				if (timeout.check(msg.author.id, msg)) { return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				if(msg.author.id !== config.ownerID) { // Check for authorization
					msg.reply("you are not authorized to use this command!");
					fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.serverLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				}
				else {
					msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`);
					fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.serverLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				};
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("setAvatar") - config.commandPrefix.length == 1) { // Check if "setAvatar" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) { // Check if bot can send messages to the channel 
				var command = "setAvatar"; // for logging purposes
				if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				if(msg.author.id !== config.ownerID){ // Check for authorization
					msg.reply("you are not authorized to use this command!");
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				}
				else {
					bot.user.setAvatar(msg.content.substr(config.commandPrefix.length + 11));
					/* 
					Cut off the command part of the message and set the bot's avatar. 
					INFO: "setAvatar" is 9 long, but there are 2 spaces before the actual status input. These have to be cut out, therefore 11.
					Example: "robbot, setAvatar test" -> cut out the length of the prefix and " setAvatar ". 
					*/
					msg.reply(`successfully set my avatar to '${msg.content.substr(config.commandPrefix.length + 11)}' ! \n(May not have worked if ratelimit capped)`);
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
					console.log(`${bot.user.username}'s avatar set to '${msg.content.substr(config.commandPrefix.length + 11)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
				};
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("setName") - config.commandPrefix.length == 1) { // Check if "setName" comes right after the bot prefix, with one space inbetween
			if(permission.hasPermission('SEND_MESSAGES')) { // Check if bot can send messages to the channel 
				var command = "setName"; // for logging purposes
				if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
				if(msg.author.id !== config.ownerID){ // Check for authorization
					msg.reply("you are not authorized to use this command!");
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				}
				else {
					bot.user.setUsername(msg.content.substr(config.commandPrefix.length + 9));
					/* 
					Cut off the command part of the message and set the bot's username. 
					INFO: "setName" is 7 long, but there are 2 spaces before the actual status input. These have to be cut out, therefore 9.
					Example: "robbot, setName test" -> cut out the length of the prefix and " setName ". 
					*/
					msg.reply(`successfully set my username to '${msg.content.substr(config.commandPrefix.length + 9)}' ! \n(May not have worked if ratelimit capped)`);
					fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} used the 	"${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
					console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
					console.log(`${bot.user.username}'s username set to '${msg.content.substr(config.commandPrefix.length + 9)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
				}; 
			}
			else { 
				msg.author.sendMessage("I can't send messages to that channel!"); // If it can't PM the author of the msg
			};
		};
		if(msg.content.indexOf("shutdown") - config.commandPrefix.length == 1) { // Check if "shutdown" comes right after the bot prefix, with one space inbetween
			/*
			INFO: The shutdown command goes into effect whether the bot can send the confirmation message or not.
			*/
			var command = "shutdown"; // for logging purposes
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown, if on cooldown notify user of it and abort command execution
			if(msg.author.id !== config.ownerID){ // Check for authorization
				msg.reply("you are not authorized to use this command!");
				fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][POWER] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.shutdownLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				console.log(`${msg.author.username}#${msg.author.discriminator} tried to shutdown the bot on the '${msg.guild}' server!, but failed!`);
				return; // abort command execution
			}
			else {
				msg.reply(`${bot.user.username} shutting down! Bye!`);
				fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][POWER] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.shutdownLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				console.log(`${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				setTimeout(function(){ // set timeout for bot shutdown
					bot.destroy(); //  destroy bot session before killing node process
					process.exit(0); // End the node process
				}, 1500); // set timeout of 1,5 sec
			};	
		};
	}
	else { return; }; // Do nothing if message does not being with configured bot prefix
});

bot.login(config.token); // Log the bot in with token set in config