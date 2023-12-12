import { useEffect, useState } from 'preact/hooks'
import PocketBase, { type RecordModel } from 'pocketbase'

const pb = new PocketBase(import.meta.env.PB_HOST)

export default () => {
  const [records, setRecords] = useState<RecordModel[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // if (!pb.authStore.isValid) window.location.assign('/login')
  }, [])

  const handleSearch = async ({
    currentTarget,
  }: {
    currentTarget: HTMLInputElement
  }) => {
    setLoading(true)
    const search = currentTarget!.value

    const users = await pb
      .collection('users')
      .getList(1, 10, {
        filter: `name~"${search}" || email~"${search}"`,
      })
      .catch((e) => {
        alert(e.message)
        return { items: [] }
      })

    setRecords(users.items)
    setLoading(false)
  }

  return (
    <main class='container'>
      <h1>Searching Records</h1>
      <nav>
        <ul>
          <li>
            <strong>
              <input
                type='search'
                id='search'
                name='search'
                placeholder='Search for the record'
                onInput={handleSearch}
                aria-busy={loading}
              />
            </strong>
          </li>
        </ul>
        <ul>
          <li>
            <a href='/login'>Login</a>
            <a href='/logout' role='button'>
              Login
            </a>
          </li>
        </ul>
      </nav>

      {loading && (
        <a href='#' aria-busy='true'>
          Loading Records...
        </a>
      )}

      <main className={'container'}>
        {records.map((rec) => (
          <article>
            <header>
              <hgroup>
                <h1>{rec.name}</h1>
                <h2>{rec.email}</h2>
              </hgroup>
            </header>
            {rec.id}
            <footer>{rec.collectionName}</footer>
          </article>
        ))}
      </main>
    </main>
  )
}
