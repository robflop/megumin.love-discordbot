const request = require('request');
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();


bot.on('ready', () => {
	console.log(bot.user.username + " ready! ");
	bot.user.setGame('on megumin.love');
});

bot.on('message', msg => {
	if(msg.content == "!help") {
		// Todo
	};
    if(msg.content == "!counter") {
        request('https://megumin.love/includes/get_cache.php?update=1', function (error, response, body){
            msg.channel.sendMessage("Current count is: " + body.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."));
        });
    };
	if(msg.content == "!submit") {
		msg.channel.sendMessage("Want to submit a sound for the website/bot? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file! All sounds need to fit the website's theme.");	
	}
	if(msg.content == "!randomsound") {
		if(msg.member.voiceChannel){
			request('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body){}); 
			msg.member.voiceChannel.join().then(connection => {
				console.log(`Connected to ${msg.member.voiceChannel.name}!`);
				var sounds = ["eugh1.mp3", "eugh2.mp3", "eugh3.mp3", "eugh4.mp3", "explosion.mp3", "itai.mp3", "n.mp3", "name.mp3", "plosion.mp3", "pull.mp3", "sion.mp3", "yamero.mp3"]; 
				var sound = sounds[Math.floor(Math.random()*sounds.length)];
				const player = connection.playFile(config.soundPath + sound);
				console.log(`"${config.soundPath + sound}" played in ${msg.member.voiceChannel.name}! (${msg.author.username}#${msg.author.discriminator})`);
				player.on('end', () => {
					msg.member.voiceChannel.leave();
					console.log(`Disconnected from ${msg.member.voiceChannel.name}!`);
				});
				player.on('debug', console.log);
			});
		}
		else{
			msg.reply("join a voice channel first!");
			return;
		};
	};
	if(msg.content.startsWith("!setGame")) {
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to change the bot's game, but failed!`);
			return;
		}
		else {
			bot.user.setGame(msg.content.substr(8));
			msg.reply(`successfully set my game to '${msg.content.substr(8)}' !`);
			console.log(`${bot.user.username}'s game set to '${msg.content.substr(8)} ' ! (${msg.author.username}#${msg.author.discriminator})`)
		};
	};
	if(msg.content == "!clearGame") {
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to clear the bot's game, but failed!`);
			return;
		}
		else {
			bot.user.setGame();	
			console.log(`${bot.user.username}'s game status reset! (${msg.author.username}#${msg.author.discriminator})`);
			msg.reply("game status cleared!");
		};
	};
	if(msg.content == "!shutdown") {
		if(msg.author.id !== config.ownerID){
			msg.reply("you are not authorized to use this command!");
			console.log(`${msg.author.username}#${msg.author.discriminator} tried to shutdown the bot, but failed!`);
			return;
		}
		else {
			msg.reply(`${bot.user.username} shutting down! Bye!`);
			console.log(`${bot.user.username} shutting down! (${msg.author.username}#${msg.author.discriminator})`);
			setTimeout(function(){process.exit(0)}, 1500);
		};
	};
});

bot.login(config.token);