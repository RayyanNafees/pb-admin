import PocketBase from 'pocketbase'
import { useRef } from 'preact/hooks';

const pb = new PocketBase('http://127.0.0.1:8090')

const auth = async (email: string, pass: string) => await pb.admins.authWithPassword(email, pass);

export default () => {
  const email = useRef<HTMLInputElement>(null)
  const pass = useRef<HTMLInputElement>(null)

  const handleSubmit = (e : SubmitEvent) =>{
    const form = e.target as HTMLFormElement

    form.onformdata = e => {
      console.log('Form Data', e)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><input ref={email} /></p>
      <p><input ref={pass} /></p>
    </form>
  )
}
