import { redis, getRedis } from './redis'

export async function setValue(key: string, value: any, expireIn?: number) {
  const stringValue = JSON.stringify(value)
  const client = redis ?? getRedis()
  if (expireIn) {
    return await client.setex(key, expireIn, stringValue)
  }
  return await client.set(key, stringValue)
}

export async function getValue(key: string): Promise<any> {
  try {
    const client = redis ?? getRedis()
    const value = await client.get(key)
    if (value === null) return null
    return JSON.parse(value as string)
  } catch (error) {
    console.error('Error parsing Redis value:', error)
    return null
  }
}