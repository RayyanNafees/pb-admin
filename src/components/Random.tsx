import {  useState } from 'preact/hooks'

export default () => {
  const [state, setState] = useState('')

  return (
    <>
      <h1>Searching for: {state}</h1>
      <input
        placeholder='Type Random Shit'
        value={state}
        onInput={(e) => setState(e.currentTarget.value)}
      />
    </>
  )
}
