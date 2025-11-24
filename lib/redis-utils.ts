import { redis } from './redis'

// Set a value with optional expiration (in seconds)
export async function setValue(key: string, value: any, expireIn?: number) {
  const stringValue = JSON.stringify(value)
  if (expireIn) {
    return await redis.setex(key, expireIn, stringValue)
  }
  return await redis.set(key, stringValue)
}

// Get a value
export async function getValue(key: string): Promise<any> {
  try {
    const value = await redis.get(key)
    // Handle different possible return types from Redis
    if (value === null) return null
    if (typeof value === 'string') {
      return JSON.parse(value)
    }
    // If it's already an object, return as-is
    return value
  } catch (error) {
    console.error('Error parsing Redis value:', error)
    return null
  }
}

// Delete a key
export async function deleteKey(key: string) {
  return await redis.del(key)
}

// Check if key exists
export async function keyExists(key: string): Promise<boolean> {
  return (await redis.exists(key)) === 1
}