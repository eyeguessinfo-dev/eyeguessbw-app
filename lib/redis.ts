import { Redis } from '@upstash/redis'

// Simple, direct configuration - no complex functions
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})