// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  initialState = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const getInitialState = () => {
    const localStorageItem = window.localStorage.getItem(key)
    if (localStorageItem) {
      try {
        return deserialize(localStorageItem)
      } catch {
        window.localStorage.removeItem(key)
      }
    }
    return typeof initialState === 'function' ? initialState() : initialState
  }

  const [state, setState] = React.useState(getInitialState)

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key

    const payload = serialize(state)
    window.localStorage.setItem(key, payload)
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  console.log('rerender')
  const [nameObj, setNameObj] = useLocalStorageState('name', {
    name: initialName,
  })

  function handleChange(event) {
    setNameObj({name: event.target.value})
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={nameObj.name} onChange={handleChange} id="name" />
      </form>
      {nameObj.name ? (
        <strong>Hello {nameObj.name}</strong>
      ) : (
        'Please type your name'
      )}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
