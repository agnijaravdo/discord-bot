import { describe, it, expect, vi, beforeEach } from 'vitest'
import client, { createUserMention, sendCongratulationMessage } from './discord'

vi.mock('discord.js', () => {
  const login = vi.fn()
  class MockClient {
    guilds = { cache: new Map() }
    on = vi.fn()
    login = login
  }
  return {
    Client: MockClient,
    GatewayIntentBits: {},
  }
})

describe('discord.ts service tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createUserMention should replace inline mention when userId provided', () => {
    expect(
      createUserMention(
        '@testUser has just passed a sprint!',
        'testUser',
        '123'
      )
    ).toBe('<@123> has just passed a sprint!')
  })

  it('createUserMention should not replace inline mention when userId not provided', () => {
    expect(
      createUserMention('@testUser has just passed a sprint!', 'testUser')
    ).toBe('@testUser has just passed a sprint!')
  })

  it('sendCongratulationMessage should send with resolved user id', async () => {
    const send = vi.fn().mockResolvedValue(undefined)
    const channel = { isTextBased: () => true, send }
    const member = { user: { id: '123', username: 'testUser' } }
    const server = {
      channels: { cache: new Map([['c1', channel]]) },
      members: {
        cache: {
          find: (fn: (m: typeof member) => boolean) =>
            fn(member) ? member : undefined,
        },
      },
    }
    // @ts-expect-error inject mock server
    client.guilds.cache.set('s1', server)
    await sendCongratulationMessage(
      's1',
      'c1',
      '@testUser has just passed a sprint!',
      'https://example/gif.gif',
      'testUser'
    )
    expect(send).toHaveBeenCalledWith({
      content: '<@123> has just passed a sprint!',
      files: ['https://example/gif.gif'],
    })
  })

  it('sendCongratulationMessage should error if server missing', async () => {
    await expect(
      sendCongratulationMessage(
        'unknown',
        'c1',
        '@testUser has just passed a sprint!',
        'https://example/gif.gif',
        'testUser'
      )
    ).rejects.toThrow('Bot is not added to server with ID unknown')
  })

  it('sendCongratulationMessage should error if channel missing', async () => {
    await expect(
      sendCongratulationMessage(
        's1',
        'unknown',
        '@testUser has just passed a sprint!',
        'https://example/gif.gif',
        'testUser'
      )
    ).rejects.toThrow(
      'Channel unknown not found in server s1 or channel is not text-based'
    )
  })
})
