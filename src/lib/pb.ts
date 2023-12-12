
import PocketBase from 'pocketbase'

export const pb = new PocketBase(import.meta.env.PUBLIC_PB_HOST)

export const auth = async (email: string, pass: string) =>
  await pb.collection('users').authWithPassword(email, pass)

export const createUser = async (email: string, pass: string) =>
  await pb.collection('users').create({
    email,
    password: pass,
    passwordConfirm: pass,
    emailVisibility: true,
  })

export default pb