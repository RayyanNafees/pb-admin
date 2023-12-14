import { useEffect, useState } from 'preact/hooks'
import pb, { createUser, auth } from '../lib/pb'
import type { ClientResponseError } from 'pocketbase'

type UserCreds = { email: string; pass: string; passwordConfirm?: string }

export default () => {
  useEffect(() => {
    if (pb.authStore.isValid) window.location.replace('/')
  }, [])


  const [loading, setLoading] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const [invalidEmail, setInvalidEmail] = useState<null | 'true' | 'false'>(
    null
  )
  const [invalidPass, setInvalidPass] = useState<null | 'true' | 'false'>(null)
  const [invalidPassConfirm, setInvalidPassConfirm] = useState<
    null | 'true' | 'false'
  >(null)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    setLoading(true)

    const form = e.currentTarget as HTMLFormElement
    const { email, pass, passwordConfirm } = Object.fromEntries(
      new FormData(form).entries()
    ) as UserCreds

    await createUser(email, pass)
      .then((user) => {
        if (user) {
          setInvalidEmail('false')
          console.log('User Created', user)
          return auth(email, pass)
        }
        console.log('Unable to create user')
        setInvalidEmail('true')
      })
      .then(() => {
        const { authStore } = pb
        console.log({ authStore })
        if (authStore.isValid) window.location.href = '/'
      })
      .catch((e: ClientResponseError) => {
        console.log({ e })
        if (e.status === 400) {
          const { email, password, passwordConfirm } = e.data.data
          if (email) {
            setInvalidEmail('true')
            setEmailError(email.message)
          }
          if (password) {
            setInvalidPass('true')
            setPassError(password.message)
          }
          if (passwordConfirm) {
            setInvalidPassConfirm('true')
            setConfirmError(passwordConfirm.message)
          }
        }
      })

    setLoading(false)
  }

  return (
    <main className='container' style={{marginTop: 50}}>
      <hgroup>
      <h1 aria-busy={loading}>Create Account</h1>
      <h6><a href="/login">Already have an account</a></h6>
      </hgroup>
      <form onSubmit={handleSubmit}>
        <input
          name='email'
          type='email'
          placeholder='Email'
          aria-placeholder='Email'
          aria-invalid={invalidEmail ?? 'grammar'}
        />
        {invalidEmail === 'true' && (
          <small className='error'>{emailError}</small>
        )}

        <input
          name='pass'
          type='password'
          placeholder='Password'
          aria-placeholder='Password'
          autoComplete={'true'}
          aria-invalid={invalidPass ?? 'grammar'}
        />
        {invalidPass === 'true' && <small className='error'>{passError}</small>}

        <input
          name='passwordConfirm'
          type='password'
          placeholder='Confirm Password'
          aria-placeholder='Confirm Password'
          autoComplete={'true'}
          aria-invalid={invalidPassConfirm ?? 'grammar'}
        />
        {invalidPassConfirm === 'true' && (
          <small className='error'>{confirmError}</small>
        )}

        {loading && <progress></progress>}
        <input type='submit' disabled={loading} />
      </form>
    </main>
  )
}
