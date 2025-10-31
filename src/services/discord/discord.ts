import { Client, GatewayIntentBits, Guild, GuildMember } from 'discord.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.on('clientReady', () => {
  console.log('Discord bot is online!')
})

client.on('error', (error) => {
  console.error('Discord client error:', error)
})

client.login(process.env.DISCORD_TOKEN)

export async function findUserInServer(
  server: Guild,
  username: string
): Promise<GuildMember | undefined> {
  /* TRADEOFF: uncommenting this will fix user mentioning, but this is very expensive step for performance.
    If doing this way, it will be better to cache users as discord can have rate limit/slow performance, or
    if possible having a separate users table with discord ids and usernames.
    The requirement was just to pass username in POST /messages payload, so leaving it commented out
   */
  // await server.members.fetch()

  return server.members.cache.find(
    (member) => member.user.username === username
  )
}

export function createUserMention(
  message: string,
  username: string,
  userId?: string
) {
  if (userId) {
    return message.replace(`@${username}`, `<@${userId}>`)
  }
  return message
}

export async function sendCongratulationMessage(
  serverId: string,
  channelId: string,
  message: string,
  gifUrl: string,
  username: string
) {
  const server = client.guilds.cache.get(serverId)
  if (!server) {
    throw new Error(`Bot is not added to server with ID ${serverId}`)
  }

  const channel = server.channels.cache.get(channelId)
  if (!channel || !channel.isTextBased()) {
    throw new Error(
      `Channel ${channelId} not found in server ${serverId} or channel is not text-based`
    )
  }

  const member = await findUserInServer(server, username)
  const finalMessage = createUserMention(message, username, member?.user.id)

  await channel.send({
    content: finalMessage,
    files: [gifUrl],
  })
}

export default client
