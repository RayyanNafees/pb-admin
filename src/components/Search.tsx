import {  useEffect, useState } from 'preact/hooks'
import PocketBase from 'pocketbase'
const pb = new PocketBase()
export default () => {
  const [state, setState] = useState('')

  useEffect(()=>{
    pb.authStore.isValid
  }, [])

  return (
    <div class="grid">
      <h1>Searching for: {state}</h1>
      <input
        placeholder='Type Random Shit'
        value={state}
        onInput={(e) => setState(e.currentTarget.value)}
      />
    </div>
  )
}
