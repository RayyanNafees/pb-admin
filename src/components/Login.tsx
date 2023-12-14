import { useEffect, useState } from 'preact/hooks'
import pb, { createUser as loginUser, auth } from '../lib/pb'
import type { ClientResponseError } from 'pocketbase'

export default () => {
  useEffect(() => {
    if (pb.authStore.isValid) window.location.replace('/')
  }, [])

  const [loading, setLoading] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')

  const [invalid, setInvalid] = useState<null | 'true' | 'false'>(null)
  const [invalidPass, setInvalidPass] = useState<null | 'true' | 'false'>(null)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    setLoading(true)

    const form = e.currentTarget as HTMLFormElement
    const { email, pass } = Object.fromEntries(
      new FormData(form).entries()
    ) as { email: string; pass: string }

    await auth(email, pass)
      .then((user) => {
        invalid ?? setInvalid('false')

        console.log({ user, authStore: pb.authStore })
        if (pb.authStore.isValid) window.location.href = '/'
      })
      .catch((e: ClientResponseError) => {
        console.log({ e })
        if (e.status === 400) {
          const { email, password } = e.data.data
          if (email) {
            setInvalid('true')
            setEmailError(email.message)
          }
          if (password) {
            setInvalidPass('true')
            setPassError(password.message)
          }
        }
      })

    setLoading(false)
  }

  return (
    <main className='container' style={{ marginTop: 50 }}>
      <hgroup>
        <h1 aria-busy={loading}>Login</h1>
        <h6>
          <a href='/register'>I dont have an account!</a>
        </h6>
      </hgroup>
      <form onSubmit={handleSubmit}>
        <input
           placeholder='Email'
           aria-placeholder='Email'
          name='email'
          type='email'
          aria-invalid={invalid ?? 'grammar'}
        />
        {invalid === 'true' && <small className='error'>{emailError}</small>}

        <input
          name='pass'
          type='password'
          placeholder='Password'
          aria-placeholder='Password'
          autoComplete={'true'}
          aria-invalid={invalidPass ?? 'grammar'}
        />
        {invalidPass === 'true' && <small className='error'>{passError}</small>}

        {loading && <progress></progress>}
        <input type='submit' disabled={loading} />
      </form>
    </main>
  )
}
