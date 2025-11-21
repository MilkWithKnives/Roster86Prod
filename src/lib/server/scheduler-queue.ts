import { Queue } from 'bullmq';
import { env } from '$env/dynamic/private';
import IORedis from 'ioredis';

// Use the Vultr Redis URL or fallback to localhost if running Redis locally on the VPS
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

// The Queue Name must match the Worker
export const scheduleQueue = new Queue('roster-generation', { connection });

export async function addScheduleJob(data: {
  rosterId: string;
  startDate: string;
  endDate: string;
  orgId: string;
}) {
  console.log(`[Queue] Adding job for Roster ${data.rosterId}`);
  return await scheduleQueue.add('generate-roster', data, {
    removeOnComplete: true, // Don't clog Redis with old finished jobs
    removeOnFail: 100, // Keep last 100 failed jobs for debugging
  });
}
