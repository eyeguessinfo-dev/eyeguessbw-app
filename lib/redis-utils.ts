import { redis } from './redis'

export async function setValue(key: string, value: any, expireIn?: number) {
  const stringValue = JSON.stringify(value)
  if (expireIn) {
    return await redis.setex(key, expireIn, stringValue)
  }
  return await redis.set(key, stringValue)
}

export async function getValue(key: string): Promise<any> {
  try {
    const value = await redis.get(key)
    if (value === null) return null
    return JSON.parse(value as string)
  } catch (error) {
    console.error('Error parsing Redis value:', error)
    return null
  }
}

export async function deleteKey(key: string) {
  return await redis.del(key)
}

export async function keyExists(key: string): Promise<boolean> {
  return (await redis.exists(key)) === 1
}