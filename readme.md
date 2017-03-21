# Megumin.love Discord bot (Robbot)
A Discord bot to go along with my website, [megumin.love](https://megumin.love)!

Written using discord.js, using opusscript, request, moment and prism-media packages (plus some standard node ones).

Add the bot to your server: [Invite me](https://discordapp.com/oauth2/authorize?client_id=257126756069277696&scope=bot&permissions=70274048)

## Self-hosting usage
(It is assumed you already have a Discord OAuth application and bot account)

- Fill out your bot token and change the ownerID in config.json to your devmode discord ID

( Optional: If you use the DiscordBots website, fill out your API Token and activate the POST command.)

- Adjust other config.json settings to your liking
- Run ``npm install`` to install all dependencies
- Install ffmpeg - if on Windows, add it to your PATH aswell
- Start the bot using ``node robbot.js``!

Optional: If you've got it running on a linux server, consider installing node-opus for better voice performance than opusscript.

(Opusscript used for development on Windows.)

**IMPORTANT INFO:**

If you change one of the folder paths, you actually have to create the folder aswell. 
Otherwise the bot WILL crash. I will not provide support for such cases.

### Adding commands
Adding commands to robbot is very easy. The command handler will automatically register any .js file within the commands folder so
the only thing you have to do is make your command file, write the code for it(*), and restart the bot. 

That's all, now your command is available under the name you gave the js file. 
Use it with ``<prefix> <command>``. It will also be listed in the 'help' command.

###### (**) Your code must export the contents in a function which passes ``client, msg, cooldown, botPerm, userPerm`` under ``exports.main``, aswell as a command description under ``exports.desc`` and a command syntax under ``exports.syntax``, see existing commands for examples.*

#### Information
- The default version of the bot loads commands from ``commands/``, uses the ``sounds/`` directory to look for sounds, saves logs in ``logs/``, loads lists of server-wide ignored users from ``ignores/`` and checks for server-wide disabled commands in ``serverconf/``.
- Default names for the log filenames are the respective config names. (serverLog = server.log, shutdownLog = shutdown.log etc).
- By default, a command cooldown of 3 seconds is applied and the default prefix is set to "robbot,".
- Commands, while case insensitive, require there to be one space to be between the prefix and the command. (See example below).
- DiscordBots integration is disabled by default. Activate the command in the config and set your API token to use it. (Not able to activate using the ``toggle`` command)

-> Command example: Use "robbot, help" instead of "robbot,help" in a scenario in which the prefix is "robbot,".

#### License

Licensed under the [MIT License](https://github.com/robflop/robbot/blob/master/LICENSE.md).

## Out-of-the-box Commands:
| Command     	| Effect                                                                                    	    |
|-------------	|-------------------------------------------------------------------------------------------------	|
| help        	| Make the bot PM the user a list of commands                                                     	|
| about       	| Get information about the bot coder etc                                                         	|
| counter     	| Display the current counter of megumin.love (Arguments ``history``, ``append``, ``revert``)      	|
| submit      	| Get info on how to submit new sounds for the bot/website                                        	|
| randomsound 	| Have the bot join your voice channel and play a random sound from the megumin.love website       	|
| playsound     | Have the bot join your voice channel and play a chosen sound from the megumin.love website        |
| setGame     	| Change the bot's playing status [Bot owner only]                                                	|
| clearGame   	| Clear the bot's playing status [Bot owner only]                                                 	|
| info          | Display various info about the bot                                                 	            |
| setAvatar   	| Change the bot's avatar [Bot owner only]                                                        	|
| setUsername   | Change the bot's username [Bot owner only]                                                      	|
| setNickname   | Change the bot's server nickname [Bot owner or Kick/Ban Permission required]                      |
| ignore      	| Make the bot ignore a user, use a 2nd time to revert [Bot owner or Kick/Ban Permission required]  |
| POST        	| Update the server count on the Discord Bots website (enable command in config) [Bot owner only] 	|
| showLog     	| Easily display one of the configured log files [Bot owner only]                                 	|
| toggle        | Toggle a command server-wide (on/off) [Bot owner or Kick/Ban Permission required]                 |
| kys           | Joke command based on joke by a friend. Sets the bot's status to appear offline for 2,5min.       |
| shutdown    	| Shut down the bot remotely [Bot owner only]                                                     	|
| eval          | Have robbot evaluate javascript input and output the result [Bot owner only]                      |
| blacklist     | Blacklist a discord server so robbot will leave it upon invitation to the server [Bot owner only] |