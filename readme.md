# Megumin.love Discord bot
A discord bot to go along with my website, [megumin.love](https://megumin.love)!

Written using discord.js, using opusscript, request, moment and prism-media packages.

Add the bot to your server: [Invite me](https://discordapp.com/oauth2/authorize?&client_id=257126756069277696&scope=bot)

## Self-hosting usage
- Fill out your bot token and change the ownerID in config.json to your devmode discord ID.
- Adjust config.json to your liking
- ``npm install`` to install all dependencies
- Run it!

Optional: Once you've got it running on a linux server, install node-opus for better performance than opusscript.

(Opusscript used for development on windows)

###### Information
- The default version of the bot uses the ``sounds/`` directory to look for sounds.- 
- Shutdown, gamechange, sound logs, error logs and server logs are saved in the ``log/`` directory by default.
- By default, a command cooldown of 3 seconds is applied.
- The default bot prefix is "robbot,". 
- Commands require there to be one space to be between the prefix and the command. Example: "robbot, help" -- "robbot,help" will not work.

Change the configuration to your liking.
