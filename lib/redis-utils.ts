import { redis } from './redis'

// Set a value with optional expiration (in seconds)
export async function setValue(key: string, value: any, expireIn?: number) {
  if (expireIn) {
    return await redis.setex(key, expireIn, JSON.stringify(value))
  }
  return await redis.set(key, JSON.stringify(value))
}

// Get a value
export async function getValue(key: string) {
  const value = await redis.get(key)
  return value ? JSON.parse(value) : null
}

// Delete a key
export async function deleteKey(key: string) {
  return await redis.del(key)
}

// Check if key exists
export async function keyExists(key: string) {
  return await redis.exists(key) === 1
}

// Set with expiration (in seconds)
export async function setWithExpiry(key: string, value: any, seconds: number) {
  return await redis.setex(key, seconds, JSON.stringify(value))
}