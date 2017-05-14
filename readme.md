# Robbot

A Discord bot to go along with my website, [megumin.love](https://megumin.love).

Written using discord.js, using opusscript, snekfetch, moment and prism-media packages (plus some standard node ones).

Add the bot to your server: [Invite me](https://discordapp.com/oauth2/authorize?client_id=257126756069277696&scope=bot&permissions=70274048)

## Self-hosting usage

(It is assumed you already have a Discord OAuth application and bot account aswell as [node.js](https://nodejs.org/en/) on version 7.6+ installed)

- Rename `config.example.json` to `config.json`
- Populate the owners array in config.json with your ID(s)
- Adjust other config settings to your liking
- Run `npm install` to install all dependencies
- Install ffmpeg - if on Windows, add it to your PATH aswell
- Start the bot using `node robbot.js`!

Optional: If you've got the bot running on a linux server, consider installing node-opus for better voice performance than opusscript.

(Opusscript used for development on Windows.)

### Adding commands

Adding commands to robbot is very easy. The command handler will automatically register any .js file within the commands folder so
the only thing you have to do is make your command file, write the code for it (*), and restart the bot.

That's all, now your command is available under the name you gave the js file.
Use it with `<prefix> <command>`. It will also be listed in the `help` command.

(\*) *Commands extend the Command class located in `structures/` and must at least provide the name property in the constructor aswell as a `run()` function outside the constructor or errors will happen. See existing commands for usage examples.*

#### Information

- By default, a command cooldown of 3 seconds is applied and the default prefix is set to `robbot,`.
- DiscordBots integration is disabled by default. Activate the command in the config and set your API token to use it. (Not able to activate using the `toggle` command)
- The `eval` command is also disabled by default for safety reasons. Enable it in the config. (Neither able to activate using `toggle` before this change)
- To make the bot use PM2 (relevant for `shutdown` command aswell as `disconnect` handling), switch the config setting to true. It will then kill the pm2 process on usage of the `shutdown` command and restart the process on disconnect.

#### License

Licensed under the [MIT License](https://github.com/robflop/robbot/blob/master/LICENSE.md).

## Out-of-the-box Commands

| Command       | Effect                                                                                             |
|-------------  |----------------------------------------------------------------------------------------------------|
| help          | Make the bot PM the user a list of commands                                                        |
| counter       | Display the current counter of megumin.love (Arguments `history`, `append`, `revert`, `statistics`)|
| randomsound   | Have the bot join your voice channel and play a random sound from the megumin.love website         |
| playsound     | Have the bot join your voice channel and play a chosen sound from the megumin.love website         |
| setGame       | Change the bot's playing status [Bot owner only]                                                   |
| info          | Display various info about the bot (Arguments `guild`, `user`, `all`)                              |
| setAvatar     | Change the bot's avatar [Bot owner only]                                                           |
| setUsername   | Change the bot's username [Bot owner only]                                                         |
| setNickname   | Change the bot's server nickname [Bot owner or Kick/Ban Permission required]                       |
| ignore        | Make the bot ignore a user, use a 2nd time to revert [Bot owner or Kick/Ban Permission required]   |
| POST          | Update the server count on the Discord Bots website (enable command in config) [Bot owner only]    |
| toggle        | Toggle a command server-wide (on/off) [Bot owner or Kick/Ban Permission required]                  |
| shutdown      | Shut down the bot remotely [Bot owner only]                                                        |
| eval          | Have robbot evaluate javascript input and output the result [Bot owner only]                       |
| blacklist     | Blacklist a discord server so robbot will leave it upon invitation to the server [Bot owner only]  |
| ping          | Measure the delay between command call and execution                                               |
| reload        | Reload a command for easy command updating without restarting the bot [Bot owner only]             |