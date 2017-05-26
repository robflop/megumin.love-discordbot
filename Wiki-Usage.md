# blacklist

#### Description: Blacklist a discord guild.

#### Syntax: `blacklist <guildIDs>`

#### Aliases: `bl`

#### Explanation:
 - guildIDs: An array containing the Discord IDs of the guilds you wish to make robbot leave.

# counter

#### Description: Display various information regarding the counter of <https://megumin.love>.

#### Syntax: `counter <selector> <historyArg>`

#### Aliases: `c`

#### Explanation:
 - selector: Optionally select exactly what you wish to view. Possible arguments are `statistics`, `history` or `general`. 
    * The default value if none is provided is `general`.
 - historyArg: **Only if you selected `history` as the selector:** Here you select what you want to do with the history. Possible arguments are `append`, `revert` and `general`.
    * The default value if none is selected is `general`. Both `append` and `revert` are restricted to owner-only access.

# eval

#### Description: Evaluate javascript code.

#### Syntax: `eval <asyncFlag> <code>`

#### Aliases: `ev`

#### Explanation:
 - asyncFlag: If you provide `async` as the value of this argument, the following code will be executed asynchronically and you will be able to use await/async syntax.
    * If yo do not provide `async` as the value for this argument, it will simply be regarded as part of the `code` argument and will be appended.
 - code: The code you wish to evaluate.

# help

#### Description: Get usage help.

#### Syntax: `help`

#### Aliases: `h`, `commands`

#### Explanation:
 - None

# ignore

#### Description: Make robbot ignore a user.

#### Syntax: `ignore <targetUser>`

#### Aliases: `ig`

#### Explanation:
 - targetUser: A mention, start of the username, or ID of the user that you wish to make robbot ignore.

# info

#### Description: Get various bot-related information.

#### Syntax: `info <selector> <targetMember>`

#### Aliases: `i`

#### Explanation:
 - selector: Optionally select exactly what you wish to receive info on. Possible arguments are `all`, `guild`, `user` and `general`
    * The default value if none is provided is `general`, the `all` selector is restricted to the bot owner.
 - targetMember: **Only if you selected `user` as the selector:** A mention, start of the username, or ID of the user that you wish to get info on.

# ping

#### Description: Measure the delay between command call and execution.

#### Syntax: `ping`

#### Aliases: `delay`

#### Explanation:
 - None

# playSound

#### Description: Play a chosen sound from <https://megumin.love>.

#### Syntax: `playsound <soundName>`

#### Aliases: `ps`

#### Explanation: 
 - soundName: The name of the sound you wish to play. A list of these can either be received by providing an invalid one, or by checking the soundboard at <https://megumin.love/soundboard>.

# post

#### Description: Update the guild count on <https://bots.discord.pw>.

#### Syntax: `post`

#### Aliases: None

#### Explanation:
 - None

# randomSound

#### Description: Play random sound from <https://megumin.love>.

#### Syntax: `randomsound`

#### Aliases: `rs`

#### Explanation:
 - None

# reload

#### Description: Reloads a command.

#### Syntax: `reload <command>`

#### Aliases: `rl`

#### Explanation:
 - command: The name of the command you wish to reload.

# setAvatar

#### Description: Change robbot's avatar.

#### Syntax: `setavatar <imageURL>`

#### Aliases: `sa`

#### Explanation:
 - imageURL: The URL to the image you wish to set robbot's avatar to.

# setGame

#### Description: Change robbot's game.

#### Syntax: `setgame <newGame>`

#### Aliases: `sg`

#### Explanation:
 - newGame: The new game you wish to display robbot to be displaying.

# setNickname

#### Description: Change robbot's nickname.

#### Syntax: `setnickname <newNickname>`

#### Aliases: `sn`

#### Explanation:
 - newNickname: The new nickname you wish robbot to use on the guild this command was used on.

# setUsername

#### Description: Change robbot's username.

#### Syntax: `setusername <newUsername>`

#### Aliases: `su`

#### Explanation:
 - newUsername: The new username you wish robbot to use.

# shutdown

#### Description: Shuts down robbot.

#### Syntax: `shutdown`

#### Aliases: `kill`

#### Explanation:
 - None

# toggle

#### Description: Toggle a command on or off.

#### Syntax: `toggle <targetCommand>`

#### Aliases: `t`

#### Explanation:
 - targetCommand: The command you to disable or enable.