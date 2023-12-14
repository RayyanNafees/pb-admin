import pb from '../lib/pb'
import { z, type ZodTypeAny } from 'astro/zod'

export type ColSchema = { schema: Array<SchemaField>; name: string }

export const cols = async (): Promise<ColSchema[]> =>
  (await pb.collection('cols').getFullList()).map(({ schema, name }) => ({
    schema,
    name,
  }))

export const getSchema = async (col: string) =>
  (await pb.collection('cols').getFirstListItem(`name="${col}"`)).schema

const zodTypeMap = {
  text: (pattern = '', min?: number, max?: number) => {
    let base = z.string()
    if (pattern) base = base.regex(new RegExp(pattern, 'g'))
    if (min) base = base.min(min)
    if (max) base = base.max(max)
    return base
  },
  url: (ssl = true) =>
    z
      .string()
      .url()
      .startsWith(`http${ssl ? 's' : ''}://`),
  date: () =>
    z.preprocess(
      (date) => String(date).replace(' ', 'T'),
      z.string().datetime()
    ),
  bool: () => z.boolean(),
  number: (noDecimal = true, min?: number, max?: number) => {
    let num = z.number()
    if (min) num = num.min(min)
    if (max) num = num.max(max)
    if (noDecimal) num = num.int()
    return num
  },
  editor: () => z.string(),
  json: () => z.record(z.unknown()).nullable(),
  relation: () => z.string(),
  file: () => z.union([z.string(), z.string().array()]),
  email: () => z.string().email(),
  select: (maxSelect: number, values: any) => {
    const base = z.union(values.map((value: any) => z.literal(value)))
    return z.union([base, base.array().length(maxSelect)])
  },
}

export const schemazod = (schema: SchemaField[]) => {
  const zobject = {} as Record<string, ZodTypeAny>

  schema.map((field) => {
    switch (field.type) {
      case 'text':
        {
          // just for scoping min & max
          const { pattern, min, max } = field.options
          zobject[field.name] = zodTypeMap.text(pattern, min, max)
        }
        break
      case 'url':
        zobject[field.name] = zodTypeMap.url()
        break
      case 'date':
        zobject[field.name] = zodTypeMap.date()
        break
      case 'bool':
        zobject[field.name] = zodTypeMap.bool()
        break
      case 'number':
        const { min, max, noDecimal } = field.options
        zobject[field.name] = zodTypeMap.number(noDecimal, min, max)
        break
      case 'email':
        zobject[field.name] = zodTypeMap.email()
        break
      case 'relation':
        zobject[field.name] = zodTypeMap.relation()
        break
      case 'json':
        zobject[field.name] = zodTypeMap.json()
        break
      case 'file':
        zobject[field.name] = zodTypeMap.file()
        break
      case 'select':
        const { maxSelect, values } = field.options
        zobject[field.name] = zodTypeMap.select(maxSelect, values)
        break
      case 'editor':
        zobject[field.name] = zodTypeMap.editor()
        break
    }
  })
  return z.object(zobject)
}

// export const generateCollections = async () => {
//   const allcols = await cols()
//   const defineCollection = await import('astro:content').then(
//     (astroContent) => astroContent.defineCollection
//   )
//   const collections = {} as Record<string, unknown>

//   allcols.map((col: ColSchema) => {
//     collections[col.name] = defineCollection({
//       type: 'content',
//       schema: schemazod(col.schema),
//     })
//   })
//   console.log({collections})
//   return collections
// }
