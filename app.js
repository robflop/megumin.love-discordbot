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
		msg.channel.sendMessage("Want to submit a sound for the website? No problem, send me an email at `me@robflop.pw` including your cropped mp3/aac/ogg sound file! All sounds need to fit the website's theme.");	
	}
	if(msg.content == "!randomsound") {
		if(msg.member.voiceChannel){
			request('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body){
			}); 
			msg.member.voiceChannel.join().then(connection => {
				console.log("Connected to " + msg.member.voiceChannel.name + "!");
				const random = Math.floor(Math.random() * 12) + 1;
				var sound;
				switch(random) {
            		case 1:
                		var sound = "yamero.mp3";
                		break;
            		case 2:
                		var sound = "pull.mp3";
						break;
            		case 3:
                		var sound = "explosion.mp3";
                		break;
					case 4:
                		var sound = "itai.mp3";
                		break;
            		case 5:
                		var sound = "name.mp3";
                		break;
            		case 6:
                		var sound = "eugh1.mp3";
                		break;
            		case 7:
                		var sound = "eugh2.mp3";
                		break;
            		case 8: 
						var sound = "eugh3.mp3";
						break;
            		case 9:
						var sound = "eugh4.mp3";
						break;
            		case 10:
						var sound = "n.mp3";
						break;
            		case 11:
						var sound = "plosion.mp3";
						break;
            		case 12:
						var sound = "sion.mp3";
						break;
        		};
				const player = connection.playFile(config.soundPath + sound);
				console.log("'" + config.soundPath + sound + "' played in " + msg.member.voiceChannel.name + "! (" + msg.author.username + "#" + msg.author.discriminator + ")");
				player.on('end', () => {
					msg.member.voiceChannel.leave();
					console.log("Disconnected from " + msg.member.voiceChannel.name + "!");
				});
			});
		}
		else(msg.reply("join a voice channel first!"));
	};
	if(msg.content.startsWith("!setGame")) {
		if(msg.author.id !== "108988529383616512"){
			msg.reply("you are not authorized to use this command!");
			console.log(msg.author.username + "#" + msg.author.discriminator + " tried to change the bot's game, but failed!");
			return;
		}
		else {
			bot.user.setGame(msg.content.substr(8));
			msg.reply("successfully set my game to '" + msg.content.substr(8) + " ' !");
			console.log(bot.user.username + "'s game set to \'" + msg.content.substr(8) + " \' !" + " (" + msg.author.username + "#" + msg.author.discriminator + ")")
		};
	};
	if(msg.content == "!clearGame") {
		bot.user.setGame();	
	};
	if(msg.content == "!shutdown") {
		if(msg.author.id !== "108988529383616512"){
			msg.reply("you are not authorized to use this command!");
			console.log(msg.author.username + "#" + msg.author.discriminator + " tried to shutdown the bot, but failed!");
			return;
		}
		else {
			msg.reply(bot.user.username + " shutting down! Bye!");
			console.log(bot.user.username + " shutting down!" + " (" + msg.author.username + "#" + msg.author.discriminator + ")");
			setTimeout(function(){process.exit(0)}, 1500);
		};
	};
});

bot.login(config.token);