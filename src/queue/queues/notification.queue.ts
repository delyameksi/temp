import { Queue } from 'bullmq';
import { connection } from '../connection';
import type { ItemCreatedEvent } from '../../events/types';

export const notificationsQueue = new Queue<ItemCreatedEvent>('notifications', {
  connection,
});

export async function publishItemCreated(event: ItemCreatedEvent) {
  await notificationsQueue.add('task.created', event, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
}
