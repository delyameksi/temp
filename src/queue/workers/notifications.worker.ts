import { Worker } from 'bullmq';
import { connection } from '../connection';
import type { ItemCreatedEvent } from '../../events/types';

export const notificationsWorker = new Worker<ItemCreatedEvent>(
  'notifications',
  async (job) => {
    if (job.name === 'task.created') {
      // create in-app notification row, send email, etc.
      console.log(`[worker] processing job ${job.id} (${job.name})`);
      console.log(`[worker] new item created: "${job.data.title}"`);
    }
  },
  { connection }
);

notificationsWorker.on('completed', (job) => {
  console.log(`[worker] job ${job.id} completed`);
});

notificationsWorker.on('failed', (job, err) => {
  console.error(`[worker] job ${job?.id} failed:`, err.message);
});
