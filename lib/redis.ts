import { Redis } from '@upstash/redis'

// Use the exact same approach as your working local setup
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export { redis }