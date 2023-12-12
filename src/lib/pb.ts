
import PocketBase from 'pocketbase'

export const pb = import.meta.env.DEV? new PocketBase(import.meta.env.PUBLIC_PB_URL): new PocketBase()

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