const request = require('request');
const fs = require('fs');
const moment = require('moment');
const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();
// load required files/packages and initialize bot

var timeout = { // timeout function for command cooldown
  "users": [],
    "check": function(userID, msg) {
        if (timeout.users.indexOf(userID) > -1) { // If the user is on timeout don't let them use the command
			msg.reply(`calm down with the commands for a sec! Please wait ${config.commandCooldown} seconds.`);
            return true;
        } else if (config.ownerID !== userID) { // If the user is not on timeout let them use the command and add their user id to the timeout
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

bot.on('message', msg => {// listen to all messages sent
	if(msg.author.bot){ return; };// Ignore any bot messages
	if(msg.content.startsWith(config.commandPrefix)) { // Only listen to messages starting with the bot prefix
		if(msg.content.indexOf("help") - config.commandPrefix.length == 1) { // Check if "help" comes right after the bot prefix, with one space inbetween
			var command = "help";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			msg.channel.sendMessage("__**Available commands are:**__ \n\n 'help' -- displays this message \n 'about' -- get general bot info \n 'counter' -- display the website's current counter \n 'submit' -- get info on submitting sounds for the website/bot \n 'randomsound' -- Have the bot join the voice channel you are in and it'll play a random sound from the website \n 'setGame' -- sets the bot's playing status [Bot owner only] \n 'clearGame' -- clears the bot's playing status [Bot owner only] \n 'stats' -- display various bot stats [Bot owner only] \n 'setAvatar' -- changes the bot's avatar [Bot owner only] \n 'setName' -- changes the bot's username [Bot owner only] \n 'shutdown' -- shuts down the bot [Bot owner only]");
		}; 
		if(msg.content.indexOf("about") - config.commandPrefix.length == 1) { // Check if "about" comes right after the bot prefix, with one space inbetween
			var command = "about";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			msg.channel.sendMessage(`robbot made by robflop#2174. Made to complement the website <https://megumin.love> also by robflop#2174.\nCheck out the Github repo at <https://github.com/robflop/megumin.love-discordbot>.`);
		};
		if(msg.content.indexOf("counter") - config.commandPrefix.length == 1) { // Check if "counter" comes right after the bot prefix, with one space inbetween
			var command = "counter";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
        	request('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body){ // GET the counter number
				if(error){
						console.log(`An error has occured during '${msg.content}' on the '${msg.guild}' server: ${error}`);
						fs.appendFileSync(`${config.logPath}${config.errorLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][ERROR]${error}`); // Log any request errors
						console.log(`Error during '${msg.content.substr(config.commandPrefix.length + 1, command.length)}}' on the '${msg.guild}' server logged to ${config.logPath}${config.errorLog}`);
				};
            	msg.channel.sendMessage(`Current count is: ${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`); // Format counter to x.xxx.xxx 
        	});
    	};
		if(msg.content.indexOf("submit") - config.commandPrefix.length == 1) { // Check if "submit" comes right after the bot prefix, with one space inbetween
			var command = "submit";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			msg.reply("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file or contact me on discord at robflop#2174! All sounds need to fit the website's theme.");
		};
		if(msg.content.indexOf("randomsound") - config.commandPrefix.length == 1) { // Check if "randomsound" comes right after the bot prefix, with one space inbetween
			var command = "randomsound";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			if(msg.member.voiceChannel){
				request('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body){ // increment the counter on-site
					if(error){
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
				});
			}
			else{ // if message author not in a voice channel, tell them to join one
				msg.reply("join a voice channel first!");
				return;
			};
		};
		if(msg.content.indexOf("setGame") - config.commandPrefix.length == 1) { // Check if "setGame" comes right after the bot prefix, with one space inbetween
			var command = "setGame";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			if(msg.author.id !== config.ownerID){ // Check for authorization
				msg.reply("you are not authorized to use this command!");
				console.log(`${msg.author.username}#${msg.author.discriminator} tried to change the bot's game on the '${msg.guild}' server, but failed!`);
				fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				return;
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
		};
		if(msg.content.indexOf("clearGame") - config.commandPrefix.length == 1) { // Check if "clearGame" comes right after the bot prefix, with one space inbetween
			var command = "clearGame";
			console.log(msg.content.substr(config.commandPrefix.length + 1, command.length))
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			if(msg.author.id !== config.ownerID){ // Check for authorization
				msg.reply("you are not authorized to use this command!");
				fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				console.log(`${msg.author.username}#${msg.author.discriminator} tried to clear the bot's game on the '${msg.guild}' server, but failed!`);
				return;
			}
			else {
				bot.user.setGame();	// set game to nothing, clearing it
				fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				console.log(`${bot.user.username}'s game status reset! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				msg.reply("game status cleared! \n (May not have worked if ratelimit has been capped)");
			};
		};
		if(msg.content.indexOf("stats") - config.commandPrefix.length == 1) { // Check if "stats" comes right after the bot prefix, with one space inbetween
			var command = "stats";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			if(msg.author.id !== config.ownerID){ // Check for authorization
				msg.reply("you are not authorized to use this command!");
				fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.serverLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			}
			else {
				msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`);
				fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.serverLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			};
		};
		if(msg.content.indexOf("setAvatar") - config.commandPrefix.length == 1) {
			var command = "setAvatar";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
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
		};
		if(msg.content.indexOf("setName") - config.commandPrefix.length == 1) { // Check if "setName" comes right after the bot prefix, with one space inbetween
			var command = "setName";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
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
				fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				console.log(`${bot.user.username}'s username set to '${msg.content.substr(config.commandPrefix.length + 9)}' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
			}; 
		};
		if(msg.content.indexOf("shutdown") - config.commandPrefix.length == 1) { // Check if "shutdown" comes right after the bot prefix, with one space inbetween
			var command = "shutdown";
			if (timeout.check(msg.author.id, msg)){ return; }; // Check for cooldown
			if(msg.author.id !== config.ownerID){ // Check for authorization
				msg.reply("you are not authorized to use this command!");
				fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][POWER] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but failed!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.shutdownLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				console.log(`${msg.author.username}#${msg.author.discriminator} tried to shutdown the bot on the '${msg.guild}' server!, but failed!`);
				return;
			}
			else {
				msg.reply(`${bot.user.username} shutting down! Bye!`);
				fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][POWER] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command on the '${msg.guild}' server!`); // Log command use, when and by whom
				console.log(`Logged into "${config.logPath}${config.shutdownLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				console.log(`${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				setTimeout(function(){ // set timeout for bot shutdown
					bot.destroy(); //  destroy bot session before killing node process
					process.exit(0);
				}, 1500);
			};
		};
	}
	else { return; }; // Do nothing if message does not being with configured bot prefix
});

bot.login(config.token); // Log the bot in with token set in config