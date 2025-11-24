// pages/api/env-test.js
export default function handler(req, res) {
  res.status(200).json({
    message: 'Environment test is working!',
    redis: {
      hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      urlLength: process.env.UPSTASH_REDIS_REST_URL ? process.env.UPSTASH_REDIS_REST_URL.length : 0,
      tokenLength: process.env.UPSTASH_REDIS_REST_TOKEN ? process.env.UPSTASH_REDIS_REST_TOKEN.length : 0
    },
    nodeEnv: process.env.NODE_ENV
  })
}
