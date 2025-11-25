import { getRedis } from './redis'

// Set a value with optional expiration (in seconds)
export async function setValue(key: string, value: any, expireIn?: number) {
  const redis = getRedis()
  const stringValue = JSON.stringify(value)
  if (expireIn) {
    return await redis.setex(key, expireIn, stringValue)
  }
  return await redis.set(key, stringValue)
}

// Get a value
export async function getValue(key: string): Promise<any> {
  try {
    const redis = getRedis()
    const value = await redis.get(key)
    if (value === null) return null
    if (typeof value === 'string') {
      return JSON.parse(value)
    }
    return value
  } catch (error) {
    console.error('Error parsing Redis value:', error)
    return null
  }
}

// Delete a key
export async function deleteKey(key: string) {
  const redis = getRedis()
  return await redis.del(key)
}

// Check if key exists
export async function keyExists(key: string): Promise<boolean> {
  const redis = getRedis()
  return (await redis.exists(key)) === 1
}