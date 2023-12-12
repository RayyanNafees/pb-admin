routerAdd("GET", "/hash", (c) => {
  const dbfilestr = $os.readFile(`${__hooks}/../pb_data/data.db`)

  const hash = $security.md5(dbfilestr)
  return c.string(200, hash)
})

routerAdd('GET', '/hash/:col', c => {
  let col = c.pathParam("col") || 'users'

  const result = arrayOf(new DynamicModel({
    "id": "",
  }))


  $app.dao().db().select('id').from(col)
    .all(result)

  const ids = result.reduce((prev, current) => prev += current.id, '')

  const idhash = $security.md5(ids)

  return c.string(200, idhash)
})

