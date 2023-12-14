import { useEffect, useState } from 'preact/hooks'
import pb, { createUser, auth } from '../lib/pb'
import type { ClientResponseError } from 'pocketbase'
import type { UserCreds } from '../types/auth'


export default () => {
  useEffect(() => {
    if (pb.authStore.isValid) window.location.replace('/')
  }, [])

  const [loading, setLoading] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passError, setPassError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const [invalidEmail, setInvalidEmail] = useState<null | 'true' | 'false'>(
    null
  )
  const [invalidUsername, setInvalidUsername] = useState<
    null | 'true' | 'false'
  >(null)
  const [invalidPass, setInvalidPass] = useState<null | 'true' | 'false'>(null)
  const [invalidPassConfirm, setInvalidPassConfirm] = useState<
    null | 'true' | 'false'
  >(null)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const userData = Object.fromEntries(
      new FormData(form).entries()
    ) as UserCreds
      console.log({userData})
    if (userData.password !== userData.passwordConfirm) {
      setInvalidPassConfirm('true')
      setConfirmError('Passwords do not match')
      return
    }

    setLoading(true)

    await createUser(userData)
      .then((user) => {
        if (user) {
          setInvalidEmail('false')
          console.log('User Created', user)
          return auth(userData.email, userData.password)
        }
        console.log('Unable to create user')
        setInvalidEmail('true')
      })
      .then(() => {
        if (pb.authStore.isValid) window.location.href = '/'
      })
      .catch((e: ClientResponseError) => {
        console.log({ e })
        if (e.status === 400) {
          const { email, password, passwordConfirm, username } = e.data.data
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
          if (username) {
            setInvalidUsername('true')
            setUsernameError(username.message)
          }
        }
      })

    setLoading(false)
  }

  return (
    <main className='container' style={{ marginTop: 10, width: '30%' }}>
      <hgroup>
        <h1 aria-busy={loading}>Create Account</h1>
        <h6>
          <a href='/login'>Already have an account</a>
        </h6>
      </hgroup>
      <form onSubmit={handleSubmit}>
        <input
          name='name'
          placeholder='Full name'
          aria-placeholder='Full name'
        />

        <input
          name='username'
          placeholder='Account Username'
          aria-placeholder='Username'
          aria-invalid={invalidUsername ?? 'grammar'}
          onInput={() => setInvalidUsername(null)}
        />
        <small style={{ opacity: +Boolean(invalidUsername) }}>
          {usernameError}
        </small>

        <input
          name='email'
          type='email'
          placeholder='Email'
          aria-placeholder='Email'
          onInput={() => setInvalidEmail(null)}
          aria-invalid={invalidEmail ?? 'grammar'}
        />
        <small style={{ opacity: +Boolean(invalidEmail) }}>{emailError}</small>

        <input
          name='password'
          type='password'
          placeholder='Password'
          aria-placeholder='Password'
          autoComplete={'true'}
          onInput={() => setInvalidPass(null)}
          aria-invalid={invalidPass ?? 'grammar'}
        />
        <small style={{ opacity: +Boolean(invalidPass) }}>{passError}</small>

        <input
          name='passwordConfirm'
          type='password'
          placeholder='Confirm Password'
          aria-placeholder='Confirm Password'
          autoComplete={'true'}
          onInput={() => setInvalidPassConfirm(null)}
          aria-invalid={invalidPassConfirm ?? 'grammar'}
        />
        <small style={{ opacity: +Boolean(invalidPassConfirm) }}>
          {confirmError}
        </small>

        <input type='submit' disabled={loading} />
        <progress style={{ opacity: +loading }}></progress>
      </form>
    </main>
  )
}
