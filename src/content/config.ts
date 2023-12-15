import { defineCollection, z } from 'astro:content'
import { cols, schemazod, type ColSchema } from '../utils/content'
import {writeMockContent} from '@/utils/mock'
const collections = {} as Record<string, ReturnType<typeof defineCollection>>

const allcols = (await cols()) as ColSchema[]

allcols.map((col) => {
  collections[col.name] = defineCollection({
    type: 'content',
    schema: schemazod(col.schema),
  })
})
//@ts-ignore
await writeMockContent(collections)
// console.log({ collections })

export { collections }
