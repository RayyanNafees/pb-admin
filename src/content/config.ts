import { defineCollection, z } from 'astro:content'
import { cols, schemazod, type ColSchema } from '../utils/content'

const collections = {} as Record<string, ReturnType<typeof defineCollection>>

const allcols = (await cols()) as ColSchema[]

allcols.map((col) => {
  collections[col.name] = defineCollection({
    type: 'data',
    schema: schemazod(col.schema),
  })
})

// console.log({ collections })

export { collections }
