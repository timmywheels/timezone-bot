const { send } = require('../actions/replyInChannel')
const defaultServerSettings = require('../scripts/defaultServerSettings')
const Discord = require('discord.js')

module.exports = {
  ignoreAdminOnly: true,
  regex(settings) {
    return new RegExp(
      `^(?:${settings.prefix}|t!)(i|info|help|guide|about)`,
      'gi',
    )
  },
  async action({ msg, settings }) {
    console.log(
      `${msg.guild ? msg.guild.name.substring(0, 20) : 'Private Message'}${
        msg.guild ? ` (${msg.guild.id})` : ''
      } - Info (${msg.author.username})`,
    )
    settings = settings || defaultServerSettings

    const publicCommands = `\`${settings.prefix}time <user or location name>\` - See the current time for a specific user or in a specific place. (Semantic names work fine, i.e. 'lisbon')
\`${settings.prefix}timein <location name>\` - See the current time in a specific place.
\`${settings.prefix}set <location name>\` - Set your own timezone. (UTC+/- codes work too)
\`${settings.prefix}users\` or \`${settings.prefix}all\` - See timezones for all users.
\`${settings.prefix}at <time> <location name>\` to see all users' times from the viewpoint of a specific time and place. (i.e. \`${settings.prefix}at 5PM Cairo\`. Use \`${settings.prefix}at here <time> <location>\` to restrict to the current channel.)
\`${settings.prefix}here\` - See timezones for all users in the current channel.`

    const alwaysAvailableCommands = `\`${settings.prefix}me\` - See your set timezone.
\`${settings.prefix}removeme\` - Delete your set timezone.
\`${settings.prefix}info\` - Show this message.`

    const adminCommands = `\`${settings.prefix}prefix <new prefix>\` - Set the command prefix.
\`${settings.prefix}setuser <@user> <location name>\` - Set the timezone for a user in the server.
\`${settings.prefix}removeuser <@user>\` - Remove the timezone for a user in the server.
\`${settings.prefix}autorespond\` - Toggles auto-responses on/off.
\`${settings.prefix}adminonly\` - Toggles admin mode on/off. (Only server admins can invoke most commands)
\`${settings.prefix}deletecommand\` - Toggles bot command deletion on/off.
\`${settings.prefix}deleteresponse\` - Toggles bot response deletion (after 5 minutes) on/off.
\`${settings.prefix}suppresswarnings\` - Toggles bot admin warnings on/off.`

    const fields1 = []
    const fields2 = []
    const fields3 = []
    const fields4 = []

    if (settings.autoRespond)
      fields1.push({
        name: `**I'll auto-respond to @s with the user's timezone if:**`,
        value: `- The user has a timezone set
- They're not actively sending messages in this server
- Their timezone is at least 2 hours away from yours (if yours is set), and
- Their timezone hasn't been announced in the past 30 minutes.`,
      })
    if (!settings.autoRespond)
      fields1.push({
        name: `Auto-responding is **off.**`,
        value: `I won't reply to @s with users' timezones.`,
      })

    if (!settings.adminOnly)
      fields2.push({
        name: `**Public commands:**`,
        value: publicCommands + '\n' + alwaysAvailableCommands,
      })
    else {
      fields1.push({
        name: `Admin-only mode is **on.**`,
        value: 'Most commands are disabled for non-admins.',
      })
      fields2.push({
        name: `**Public commands:**`,
        value: alwaysAvailableCommands,
      })
    }

    if (settings.adminOnly) {
      fields3.push({
        name: `**Admin commands:**`,
        value: publicCommands,
      })
      fields4.push(
        {
          name: `**Admin commands (cont.):**`,
          value: adminCommands,
        },
        {
          name: `(Most commands can also be used by their first letter, i.e. \`${settings.prefix}set\` → \`${settings.prefix}s\`).`,
          value: '\u200B',
        },
      )
    } else {
      fields3.push(
        {
          name: `**Admin commands:**`,
          value: adminCommands,
        },
        {
          name: `(Most commands can also be used by their first letter, i.e. \`${settings.prefix}set\` → \`${settings.prefix}s\`).`,
          value: '\u200B',
        },
      )
    }

    const richEmbed1 = new Discord.MessageEmbed()
      .setColor('#7B6FE5')
      // .setTitle('TimezoneBot')
      // .setURL('https://github.com/midblue/timezone-bot')
      .setDescription(
        `Hi! I'm TimezoneBot. I let users set their timezone, then passively note timezones when appropriate.`,
      )
      .addFields(...fields1)

    const richEmbed2 = new Discord.MessageEmbed()
      .setColor('#7B6FE5')
      .addFields(...fields2)

    const richEmbed3 = new Discord.MessageEmbed()
      .setColor('#7B6FE5')
      .addFields(...fields3)

    const richEmbed4 = new Discord.MessageEmbed()
      .setColor('#7B6FE5')
      .addFields(...fields4)

    if (fields4.length)
      richEmbed4.setFooter(
        `Made by jasp#8169.
Feedback/Bugs: https://github.com/midblue/timezone-bot/issues`,
      )
    else
      richEmbed3.setFooter(
        `Made by jasp#8169.
Feedback/Bugs: https://github.com/midblue/timezone-bot/issues`,
      )

    send(msg, richEmbed1, false, settings)
    send(msg, richEmbed2, false, settings)
    send(msg, richEmbed3, false, settings)
    fields4.length && send(msg, richEmbed4, false, settings)
  },
}
