const request = require('request');
const fs = require('fs');
const moment = require('moment');
const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();

var timeout = {
  "users": [],
    "check": function(userID, msg) {
        if (timeout.users.indexOf(userID) > -1) {
			msg.reply(`calm down with the commands for a sec! Please wait ${config.commandCooldown} seconds.`);
            return true;
        } else if (config.ownerID !== userID) {
            timeout.set(userID);
            return false;
        }
    },
  "set": function(userID) {
        timeout.users.push(userID);
        setTimeout(function() {
            timeout.users.splice(timeout.users.indexOf(userID), 1);
        }, (config.commandCooldown * 1000));
    }
};

bot.on('ready', () => {
	console.log(`${bot.user.username} ready!`);
	bot.user.setGame('on megumin.love');
});

bot.on('guildCreate', guild => {
	console.log(`${bot.user.username} has joined a new server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][SERVERS] ${bot.user.username} has joined the '${guild.name}' server!`);
	console.log(`Logged into "${config.logPath}${config.serverLog}" !`);
});

bot.on('guildDelete', guild => {
	console.log(`${bot.user.username} has left a server! ("${guild.name}")`);
	fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][SERVERS] ${bot.user.username} has left the '${guild.name}' server!`);
	console.log(`Logged into "${config.logPath}${config.serverLog}" !`);
}); 

bot.on('message', msg => {
	if(msg.content == "!help") {
		if (timeout.check(msg.author.id, msg)) return;
		msg.channel.sendMessage("__**Available commands are:**__ \n\n '!help' -- displays this message \n '!counter' -- display the website's current counter \n '!submit' -- get info on submitting sounds for the website/bot \n '!randomsound' -- Have the bot join the voice channel you are in and it'll play a random sound from the website \n '!setGame' -- sets the bot's playing status [Bot owner only] \n '!clearGame' -- clears the bot's playing status [Bot owner only] \n '!shutdown' -- shuts down the bot [Bot owner only]\n '!stats' -- display various bot stats [Bot owner only] \n '!setAvatar' -- changes the bot's avatar [Bot owner only] \n '!setName' -- changes the bot's username [Bot owner only]");
	}; 
    if(msg.content == "!counter") {
		if (timeout.check(msg.author.id, msg)) return;
        request('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body){
			if(error){
					console.log(`An error has occured during '${msg.content}' on the '${msg.guild}' server: ${error}`);
					fs.appendFileSync(`${config.logPath}${config.errorLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][ERROR]${error}`);
					console.log(`Error during '${msg.content}' on the '${msg.guild}' server logged to ${config.logPath}${config.errorLog}`);
				};
            msg.channel.sendMessage(`Current count is: ${body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`);
        });
    };
	if(msg.content == "!submit") {
		if (timeout.check(msg.author.id, msg)) return;
		msg.reply("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file! All sounds need to fit the website's theme.");
	};
	if(msg.content == "!randomsound") {
		if (timeout.check(msg.author.id, msg)) return;
		if(msg.member.voiceChannel){
			request('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body){
				if(error){
					console.log(`An error has occured during '${msg.content}' on the '${msg.guild}' server: ${error}`);
					fs.appendFileSync(`${config.logPath}${config.errorLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][ERROR]${error}`);
					console.log(`Error during '${msg.content}' on '${msg.guild}' logged to ${config.logPath}${config.errorLog}`);
				};
			}); 
			msg.member.voiceChannel.join().then(connection => {
				console.log(`Connected to '${msg.member.voiceChannel.name}'  on the '${msg.guild}' server!`);
				var sounds = ["eugh1.mp3", "eugh2.mp3", "eugh3.mp3", "eugh4.mp3", "explosion.mp3", "itai.mp3", "n.mp3", "name.mp3", "plosion.mp3", "pull.mp3", "sion.mp3", "yamero.mp3"]; 
				var sound = sounds[Math.floor(Math.random()*sounds.length)];
				const player = connection.playFile(config.soundPath + sound);
				console.log(`"${config.soundPath + sound}" played in '${msg.member.voiceChannel.name}' on the '${msg.guild}' server! (${msg.author.username}#${msg.author.discriminator})`);
				fs.appendFileSync(`${config.logPath}${config.soundLog}`, `\n[${moment().format('DD/MM/YYYY H:mm:ss')}][AUDIO] ${msg.author.username}#${msg.author.discriminator} used the '${msg.content}' command on the '${msg.guild} server!`);
				console.log(`Logged into "${config.logPath}${config.soundLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
				player.on('end', () => {
					msg.member.voiceChannel.leave();
					console.log(`Disconnected from '${msg.member.voiceChannel.name}' on the '${msg.guild}' server!`);
				});
			});
		}
		else{
			msg.reply("join a voice channel first!");
			return;
		};
	};
	if(msg.content.startsWith("!setGame")) {
		if (timeout.check(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to change the bot's game on the '${msg.guild}' server, but failed!`);
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content}" command on the '${msg.guild}' server, but failed!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			return;
		}
		else {
			bot.user.setGame(msg.content.substr(8));
			msg.reply(`successfully set my game to '${msg.content.substr(8)} ' !`);
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content}" command on the '${msg.guild}' server!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			console.log(`${bot.user.username}'s game set to '${msg.content.substr(8)} ' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
		};
	};
	if(msg.content == "!clearGame") {
		if (timeout.check(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content}" command on the '${msg.guild}' server, but failed!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to clear the bot's game on the '${msg.guild}' server, but failed!`);
			return;
		}
		else {
			bot.user.setGame();	
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATUS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content}" command on the '${msg.guild}' server!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			console.log(`${bot.user.username}'s game status reset! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			msg.reply("game status cleared!");
		};
	};
	if(msg.content == "!shutdown") {
		if (timeout.check(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][POWER] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content}" command  on the '${msg.guild}' server, but failed!`);
			console.log(`Logged into "${config.logPath}${config.shutdownLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to shutdown the bot on the '${msg.guild}' server!, but failed!`);
			return;
		}
		else {
			msg.reply(`${bot.user.username} shutting down! Bye!`);
			fs.appendFileSync(`${config.logPath}${config.shutdownLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][POWER] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content}" command on the '${msg.guild}' server!`);
			console.log(`Logged into "${config.logPath}${config.shutdownLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			console.log(`${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			setTimeout(function(){process.exit(0)}, 1500);
		};
	};
	if(msg.content == "!stats") {
		if (timeout.check(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content}" command on the '${msg.guild}' server, but failed!`);
			console.log(`Logged into "${config.logPath}${config.serverLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
		}
		else {
			msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`);
			fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][STATISTICS] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content}" command on the '${msg.guild}' server!`);
			console.log(`Logged into "${config.logPath}${config.serverLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
		};
	};
	if(msg.content.startsWith("!setAvatar")) {
		if (timeout.check(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(0,10)}" command on the '${msg.guild}' server, but failed!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
		}
		else {
			bot.user.setAvatar(msg.content.substr(11));
			msg.reply(`successfully set my avatar to '${msg.content.substr(10)} ' ! \n(May not have worked if ratelimit capped)`);
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][AVATAR] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(0,10)}" command on the '${msg.guild}' server!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			console.log(`${bot.user.username}'s avatar set to '${msg.content.substr(11)} ' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
		};
	};
	if(msg.content.startsWith("!setName")) {
		if (timeout.check(msg.author.id, msg)) return;
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(0,8)}" command on the '${msg.guild}' server, but failed!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
		}
		else {
			bot.user.setUsername(msg.content.substr(9));
			msg.reply(`successfully set my username to '${msg.content.substr(9)} ' ! \n(May not have worked if ratelimit capped)`);
			fs.appendFileSync(`${config.logPath}${config.profileLog}`, `\n[${moment().format('DD/MM/YYYY HH:MM:SS')}][USERNAME] ${msg.author.username}#${msg.author.discriminator} used the "${msg.content.substr(0,8)}" command on the '${msg.guild}' server!`);
			console.log(`Logged into "${config.logPath}${config.profileLog}" ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`);
			console.log(`${bot.user.username}'s username set to ' ${msg.content.substr(9)} ' ! (${msg.author.username}#${msg.author.discriminator} on '${msg.guild}')`)
		}; 
	};
});

bot.login(config.token);