// HASH

routerAdd("GET", "/hash", (c) => {
  const dbfilestr = $os.readFile(`${__hooks}/../pb_data/data.db`)

  const hash = $security.md5(dbfilestr)
  return c.string(200, hash)
})

routerAdd('GET', '/hash/:col', c => {
  const col = c.pathParam("col")
  if (!col)
    return c.string(400, '<h1>Invalid Reques</h1><br /><h6>fetch URL: <a href=\'#\'>/hash/&lt;collection&gt;</a></h6>')

  const result = arrayOf(new DynamicModel({
    "id": "",
  }))


  $app.dao().db().select('id').from(col)
    .all(result)

  const ids = result.reduce((prev, current) => prev += current.id, '')

  const idhash = $security.md5(ids)

  return c.string(200, idhash)
})



// Collection Schema
routerAdd('GET', 'schema/:col', c => {
  const col = c.pathParam('col').replace(/\//g, '')
  console.log(col)
  if (!col)
    return c.string(400, `<h1>Invalid Reques</h1><br />
  <h6>fetch URL:<a href=\`#\'>/schema/&lt;collection&gt;</a>
  `)

  const {schema} = $app.dao().findCollectionByNameOrId(col)
  return c.json(200, schema)
})