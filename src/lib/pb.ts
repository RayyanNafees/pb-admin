
import PocketBase from 'pocketbase'
import type { UserCreds } from '../types/auth'

export const pb = import.meta.env.DEV ? new PocketBase(import.meta.env.PUBLIC_PB_URL) : new PocketBase()

export const auth = async (email: string, pass: string) =>
  await pb.collection('users').authWithPassword(email, pass)

export const createUser = async (userData: UserCreds) =>
  await pb.collection('users').create({
    ...userData,
    emailVisibility: true,
  })

export default pb