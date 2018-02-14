/* global beforeAll, afterAll, describe, test, expect */

import fetchApi from '@ewoken/backend-common/lib/fetchApi';
import getBaseUrl from '@ewoken/backend-common/lib/getBaseUrl';

import launchApp from '../../server';

let server;
beforeAll(async () => {
  server = await launchApp();
});

afterAll(
  () =>
    new Promise(resolve => {
      server.unref();
      server.destroy(resolve);
    }),
);

describe('event api', () => {
  const baseUrl = () => getBaseUrl(server);

  describe('POST /events', () => {
    const postEvent = event =>
      fetchApi(`${baseUrl()}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
      });

    test('should accept event', async () => {
      const testEvent = {
        type: 'EVENT_TEST',
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        authorUserId: 'userId',
      };
      const returnedEvent = await postEvent(testEvent);
      expect(returnedEvent).toMatchObject(testEvent);
    });

    test('should reject bad event', async () => {
      const badEvent = {
        // no type
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        authorUserId: 'userId',
      };

      await expect(postEvent(badEvent)).rejects.toThrow(/400/);
    });
  });
});
