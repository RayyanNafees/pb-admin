import { generateMock } from '@anatine/zod-mock'
import fs from 'node:fs/promises'
import path from 'node:path'
import { faker } from '@faker-js/faker'
import type { ZodTypeAny } from 'astro/zod'
import YAML from 'yamljs'
import type { RecordModel } from 'pocketbase'

const dirPath = (...dir: string[]) =>
  path.join(process.cwd(), '/src/content/', ...dir)

// CHeck if a directory exists at a given path or not from the base directory of the project
export const exists = async (dir: string) => {
  try {
    await fs.access(dirPath(dir))
    return true
  } catch {
    return false
  }
}

// Checking if the given directory is empty
export const dirEmpty = async (dir: string) => {
  const files = await fs.readdir(dirPath(dir))
  return files.length === 0
}
const MD = { stringify: (content: Record<string, unknown>) => '' }

// Converts the JSON fiels to YAML for markdown frontmatter and takes the body filed as actual markdown content
MD.stringify = (content: Record<string, unknown>) => {
  const { body, ...frontmatter } = content
  return `---
${YAML.stringify(frontmatter)}
---
${body}`
}
// Write mock content to a directory
export const writeMockContent = async (
  collections: Record<string, { type: string; schema: ZodTypeAny }>
) => {
  if (!import.meta.env.DEV) return

  for (const dir in collections) {
    const { schema, type } = collections[dir]
    const folderPath = dirPath(dir)
    const mockObject = generateMock(schema)

    console.log(mockObject)

    const Encoder = collections[dir].type === 'content' ? MD : JSON

    const mockData = Encoder.stringify(mockObject)

    if (!(await exists(dir)) || (await dirEmpty(dir))) {
      const ext = type === 'content' ? '.md' : '.json'
      await fs.mkdir(folderPath, { recursive: true })
      return fs
        .writeFile(
          path.join(folderPath, `${faker.word.noun()}${ext}`),
          mockData,
          'utf8'
        )
        .then((file) => console.log('Created file ', file))
        .catch(console.error)
    }
  }
}

// Syncs Pocketbase Collections data with Astro Content Collections
export const syncPBdata = async (
  collections: Record<string, { type: string; schema: ZodTypeAny }>
) => {
  if (!import.meta.env.DEV) return

  const pb = (await import('@/lib/pb')).default

  for (const dir in collections) {
    const { type } = collections[dir]
    await pb
      .collection(dir)
      .getFullList()
      .then((records) =>
        records.map(async (mockObject: RecordModel) => {
          console.log(mockObject)
          const ext = type === 'content' ? '.md' : '.json'
          const Encoder = collections[dir].type === 'content' ? MD : JSON

          const mockData = Encoder.stringify(mockObject)

          const folderPath = dirPath(dir)
          const filePath = dirPath(dir, `${mockObject.slug || mockObject.id}${ext}`)

          if (!(await exists(filePath))) {
            await fs.mkdir(folderPath, { recursive: true })
            return fs
              .writeFile(filePath, mockData, 'utf8')
              .then((file) => console.log('Created file ', file))
              .catch(console.error)
          }
        })
      )
  }
}
