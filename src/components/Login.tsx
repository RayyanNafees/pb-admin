import PocketBase, { type AuthModel } from 'pocketbase'
import { useState } from 'preact/hooks'

const pb = new PocketBase(import.meta.env.PB_HOST)

const auth = async (email: string, pass: string) =>
  await pb.collection('users').authWithPassword(email, pass)

const createUser = async (email: string, pass: string) =>
  await pb.collection('users').create({
    email,
    password: pass,
    passwordConfirm: pass,
    emailVisibility: true,
  })

const emailExists = async (email: string): Promise<boolean> => {
  const user = await pb.collection('users').getFirstListItem(`email="${email}"`)

  return Boolean(user?.id)
}

export default () => {
  const [loading, setLoading] = useState(false)
  const [emailInfo, setEmailInfo] = useState('')
  const [passInfo, setPassInfo] = useState('')

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    setLoading(true)

    const form = e.currentTarget as HTMLFormElement
    const { email, pass } = Object.fromEntries(
      new FormData(form).entries()
    ) as { email: string; pass: string }

    const userExists = await emailExists(email)
      .then(() => !Boolean(setEmailInfo('User Already Exists')))
      .catch((e) => setEmailInfo('Username Available'))

    if (!userExists)
      await createUser(email, pass)
        .catch(console.error)
        .then((res) => {
          console.log('User Created', res)
          return auth(email, pass)
        })
        .then((authData: AuthModel) => {
          if (pb.authStore.isValid) window.location.assign('/')
        })

    setLoading(false)
  }

  return (
    <main className='container'>
      <form onSubmit={handleSubmit}>
        <input
          name='email'
          type='email'
          aria-invalid={emailInfo.length ? 'true' : 'false'}
          onInput={() => setEmailInfo('')}
        />
        {emailInfo && <small className='error'>{emailInfo}</small>}

        <input name='pass' type='password' autoComplete={'true'} />
        {passInfo && <small className='warning'>{passInfo}</small>}

        <input type='submit' disabled={loading} aria-busy={loading} />
      </form>
    </main>
  )
}
