import {  useState } from 'preact/hooks'

export default () => {
  const [state, setState] = useState('')
  const num = Math.random()

  return (
    <>
      <h1>Random Number: {num}</h1>
      <input
        placeholder='Type Random Shit'
        value={state}
        onInput={(e) => setState(e.currentTarget.value)}
      />
    </>
  )
}
