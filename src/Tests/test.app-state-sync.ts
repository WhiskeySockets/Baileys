import { test } from 'node:test';
import assert from 'node:assert';
import { AccountSettings, ChatMutation, Contact, InitialAppStateSyncOptions } from '../Types';
import { processSyncAction, unixTimestampSeconds } from '../Utils';
import { randomJid } from './utils';
import logger from '../Utils/logger';

test('App State Sync Tests', async (t) => {
  const me: Contact = { id: randomJid() };
  
  await t.test('should return archive=false event', () => {
    const jid = randomJid();
    const index = ['archive', jid];

    const CASES: ChatMutation[][] = [
      [
        {
          index,
          syncAction: {
            value: {
              archiveChatAction: {
                archived: false,
                messageRange: {
                  lastMessageTimestamp: unixTimestampSeconds()
                }
              }
            }
          }
        }
      ],
      [
        {
          index,
          syncAction: {
            value: {
              archiveChatAction: {
                archived: true,
                messageRange: {
                  lastMessageTimestamp: unixTimestampSeconds()
                }
              }
            }
          }
        },
        {
          index,
          syncAction: {
            value: {
              archiveChatAction: {
                archived: false,
                messageRange: {
                  lastMessageTimestamp: unixTimestampSeconds()
                }
              }
            }
          }
        }
      ]
    ];

    for (const mutations of CASES) {
			// @ts-ignore
      const events = processSyncAction(mutations, me, undefined, logger);
      assert.strictEqual(events['chats.update'].length, 1, 'Should have one chats.update event');
      const event = events['chats.update']?.[0];
      assert.strictEqual(event.archive, false, 'Archive should be false');
    }
  });

  await t.test('should not fire any archive event', () => {
    const jid = randomJid();
    const index = ['archive', jid];
    const now = unixTimestampSeconds();

    const CASES: ChatMutation[][] = [
      [
        {
          index,
          syncAction: {
            value: {
              archiveChatAction: {
                archived: true,
                messageRange: {
                  lastMessageTimestamp: now - 1
                }
              }
            }
          }
        }
      ],
      [
        {
          index,
          syncAction: {
            value: {
              archiveChatAction: {
                archived: false,
                messageRange: {
                  lastMessageTimestamp: now + 10
                }
              }
            }
          }
        }
      ],
      [
        {
          index,
          syncAction: {
            value: {
              archiveChatAction: {
                archived: true,
                messageRange: {
                  lastMessageTimestamp: now + 10
                }
              }
            }
          }
        },
        {
          index,
          syncAction: {
            value: {
              archiveChatAction: {
                archived: false,
                messageRange: {
                  lastMessageTimestamp: now + 11
                }
              }
            }
          }
        }
      ],
    ];

    const ctx: InitialAppStateSyncOptions = {
      accountSettings: { unarchiveChats: true }
    };

    for (const mutations of CASES) {
			// @ts-ignore
      const events = processSyncAction(mutations, me, ctx, logger);
      assert.strictEqual(events['chats.update']?.length, undefined, 'Should not have chats.update events');
    }
  });

  await t.test('should fire archive=true events', () => {
    const jid = randomJid();
    const index = ['archive', jid];
    const now = unixTimestampSeconds();

    const CASES: { settings: AccountSettings, mutations: ChatMutation[] }[] = [
      {
        settings: { unarchiveChats: true },
        mutations: [
          {
            index,
            syncAction: {
              value: {
                archiveChatAction: {
                  archived: true,
                  messageRange: {
                    lastMessageTimestamp: now
                  }
                }
              }
            }
          }
        ],
      },
      {
        settings: { unarchiveChats: false },
        mutations: [
          {
            index,
            syncAction: {
              value: {
                archiveChatAction: {
                  archived: true,
                  messageRange: {
                    lastMessageTimestamp: now - 10
                  }
                }
              }
            }
          }
        ],
      }
    ];

    for (const { mutations, settings } of CASES) {
      const ctx: InitialAppStateSyncOptions = {
        accountSettings: settings
      };
			// @ts-ignore
      const events = processSyncAction(mutations, me, ctx, logger);
      assert.strictEqual(events['chats.update'].length, 1, 'Should have one chats.update event');
      const event = events['chats.update']?.[0];
      assert.strictEqual(event.archive, true, 'Archive should be true');
    }
  });
});