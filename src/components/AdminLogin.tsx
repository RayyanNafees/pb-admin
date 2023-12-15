import { useEffect, useState } from 'preact/hooks'
import pb, { adminAuth } from '../lib/pb'
import type { ClientResponseError } from 'pocketbase'

export default () => {
  useEffect(() => {
    if (pb.authStore.isAdmin) window.location.replace('/admin')
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

    await adminAuth(email, pass)
      .then((user) => {
        invalid ?? setInvalid('false')

        console.log({ user, authStore: pb.authStore })
        if (pb.authStore.isAdmin) window.location.href = '/admin'
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
    <main className='container' style={{ marginTop: 50, width: '30%' }}>
      <h1 aria-busy={loading}>Admin Login</h1>
      <section>
        <h6>Login with github</h6>
        <a
          role='button'
          href={
            'https://github.com/login/oauth/authorize?client_id=' +
            import.meta.env.PUBLIC_GITHUB_OAUTH_CLIENT_ID
          }
        >
          Login with GitHub
        </a>
      </section>
      <hr>OR</hr>
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

        <button
          disabled={loading}
          aria-busy={String(loading) as 'true' | 'false'}
        >
          Login
        </button>
      </form>
    </main>
  )
}
