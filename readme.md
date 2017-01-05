# Megumin.love Discord bot
A Discord bot to go along with my website, [megumin.love](https://megumin.love)!

Written using discord.js, using opusscript, request, moment and prism-media packages (plus some standard node ones).

Add the bot to your server: [Invite me](https://discordapp.com/oauth2/authorize?client_id=257126756069277696&scope=bot&permissions=3230720)

## Self-hosting usage
- Fill out your bot token and change the ownerID in config.json to your devmode discord ID

( Optional: If you use the DiscordBots website, fill out your API Token and activate the POST command.)

- Adjust other config.json settings to your liking
- Run ``npm install`` to install all dependencies
- Start the bot using ``node app.js``!

Optional: Once you've got it running on a linux server, consider installing node-opus for better voice performance than opusscript.

(Opusscript used for development on windows.)

### Adding commands
Adding commands to robbot is very easy. The command handler will automatically register any .js file within the commands folder so
the only thing you have to do is make your command file, write the code for it(*), and restart the bot. 

That's all, now your command is available under the name you gave the js file. 
Use it with ``<prefix> <command>``. It will also be listed in the 'help' command.

###### (**) Your code must export the contents in a function under ``exports.main``, aswell as a command description under ``exports.desc``, see existing commands for examples.*

#### Information
- The default version of the bot loads commands from ``commands/``, uses the ``sounds/`` directory to look for sounds, and saves logs in ``log/``.
- Default names for the log filenames are the respective config names. (serverLog = server.log, shutdownLog = shutdown.log etc).
- By default, a command cooldown of 3 seconds is applied and the default prefix is set to "robbot,".
- Commands require there to be one space to be between the prefix and the command. (See example below).
- DiscordBots integration is disabled by default. Activate the command in the config and set your API token to use it.

-> Command example: Use "robbot, help" instead of "robbot,help" in a scenario in which the prefix is "robbot,".