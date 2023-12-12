import { useEffect, useState } from 'preact/hooks'
import pb, {createUser, auth} from '../lib/pb'

export default () => {
  useEffect(()=>{
    
  }, [])  

  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [invalid, setInvalid] = useState<null | 'true' | 'false'>(null)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    setLoading(true)

    const form = e.currentTarget as HTMLFormElement
    const { email, pass } = Object.fromEntries(
      new FormData(form).entries()
    ) as { email: string; pass: string }

      await createUser(email, pass)
        .catch((e) => {
          console.log({ e })
          if (e.code === 400) {
            if (e.data.email.code === 'validation_invalid_email') {
              setInvalid('true')
              setEmailError(e.data.email.message)
            }
          }
        })
        .then((user) => {
          setInvalid('false')
          if (user) {
            console.log('User Created', user)
            return auth(email, pass)
          }
          console.log('Unable to create user', { user })
        })
        .then(() => {
          const {authStore} = pb
          console.log({authStore})
          // if (pb.authStore.isValid) window.location.href = '/'
        })

    setLoading(false)
  }

  return (
    <main className='container'>
      <h1 aria-busy={loading}>Login</h1>
      <form onSubmit={handleSubmit}>
        <input name='email' type='email' aria-invalid={invalid ?? 'grammar'} />
        {invalid === 'true' && (
          <small className='error'>{emailError}</small>
        )}

        <input name='pass' type='password' autoComplete={'true'} />

        {loading && <progress></progress>}
        <input type='submit' disabled={loading} />
      </form>
    </main>
  )
}
