const Command = require('../structures/Command');
const snekfetch = require('snekfetch');
const { inspect } = require('util');
const { join } = require('path');

class PlaySoundCommand extends Command {
	constructor() {
		super({
			name: 'playsound',
			description: 'Play a chosen sound from <https://megumin.love>',
			guildOnly: true,
			aliases: ['ps'],
			perms: {
				client: ['CONNECT', 'SPEAK']
			},
			args: [
				{
					type: 'string',
					name: 'sound'
				}
			]
		});
	}

	async run(message, args) {
		if (!message.member.voiceChannel) {
			return message.reply('join a voice channel first!');
		}

		if (!message.member.voiceChannel.joinable) return message.reply("i can't connect to that voice channel!");

		if (message.guild.voiceConnection !== null) {
			return message.reply('please wait for the current sound to finish!');
		}

		snekfetch.get('https://megumin.love/counter?inc=1')
		.catch(err => message.client.logger.error(inspect(err)));

		const sounds = require('../data/sounds');
		const soundsList = `\`\`\`${sounds.join(',\n')}\`\`\``;
		if (!sounds.includes(args.sound)) {
			return message.reply('you provided an invalid sound name, check your PMs for a full list of sounds!')
			.then(msg => message.author.send(`Choose one of the following: ${soundsList}`).catch(() => {
				message.reply('i ran into an error DM\'ing you!');
			}));
		}

		const soundPath = join(__dirname, '..', 'data', 'sounds', args.sound);
		const voiceChannel = message.member.voiceChannel;

		voiceChannel.join().then(connection => {
			const player = connection.playFile(`${soundPath}.mp3`);
			connection.on('error', () => message.reply('an error related to the voiceChannel connection itself occurred, sorry! (Try again, maybe?)')
			.then(message => voiceChannel.leave()));

			player.on('end', () => voiceChannel.leave());
			player.on('error', () => message.reply('an error occurred playing the sound file, sorry! (Try again, maybe?)'));
		// Since 'error' emits an 'end' event, this will result in the voiceconnection being terminated
		}).catch(error => message.reply('an error occurred while connecting to the voiceChannel, sorry! (Try again, maybe?)')
		.then(message => voiceChannel.leave()));
	}
}

module.exports = PlaySoundCommand;