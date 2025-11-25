import { redis } from './redis'

export async function setValue(key: string, value: any) {
  return await redis.set(key, JSON.stringify(value))
}

export async function getValue(key: string) {
  const value = await redis.get(key)
  return value ? JSON.parse(value as string) : null
}