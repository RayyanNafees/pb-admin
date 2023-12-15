import { useEffect, useState } from 'preact/hooks'
import pb from '../lib/pb'
import type { RecordModel } from 'pocketbase'
import { z } from 'astro/zod'

const currentUser = pb.authStore.model


export default () => {
  const [records, setRecords] = useState<RecordModel[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')


  useEffect(() => {
    if (!pb.authStore.isValid) window.location.assign('/login')
  }, [])

  useEffect(() => {
    const searching = setTimeout(handleSearch, 500)
    return () => clearTimeout(searching)
  }, [search])

  const handleSearch = async () => {
    if (!search) {
      if (records.length) setRecords([])
      return
    }
    setLoading(true)

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
      <nav>
        <ul>
          <li>
            <h1>Searching Records</h1>
          </li>
        </ul>
        <ul>
          <li>
            {currentUser?.name || currentUser?.email}
          </li>
          <li>
            <a href='/logout' role='button' class='secondary'>
              Log Out
            </a>
          </li>
        </ul>
      </nav>
      <input
        type='search'
        id='search'
        name='search'
        placeholder='Search for the record'
        value={search}
        onInput={(e) => setSearch(e.currentTarget.value)}
        aria-busy={loading}
      />
      {loading && (
        <a href='#' aria-busy='true'>
          Loading Records...
        </a>
      )}

      <main className={'container'}>
        {records.map((rec) => (
          <article>
            <hgroup>
              <h1>{rec.name}</h1>
              <i>
                <small>{rec.id}</small>
              </i>
              <h2>{rec.email}</h2>
            </hgroup>
          </article>
        ))}
        {search && !records.length &&  <i>
          <small
            style={{ display: 'block', width: '100%', textAlign: 'center' }}
          >
            No records for {search}!
          </small>
        </i>}
      </main>
    </main>
  )
}
