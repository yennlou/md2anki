import unified = require('unified')
import markdown = require('remark-parse')
import remark2rehype = require('remark-rehype')
import html = require('rehype-stringify')
import { MOCK_DATA } from './mock'
import { Parent, Node } from 'unist'

const mast = unified().use(markdown).parse(MOCK_DATA) as Parent
const nodes = mast.children

let buffer: Node[] = []
let newTrees: Node[] = []

const flushable = (buffer: Node[]) => {
  if (buffer.length && buffer[buffer.length - 1].type !== 'heading') return true
  return false
}

const flush = (buffer: Node[], newTrees) => {
  newTrees.push({ type: 'root', children: [...buffer] })
  buffer.length = 0
}

for (const node of nodes) {
  if (node.type === 'heading' && node.depth < 4) {
    if (flushable(buffer)) flush(buffer, newTrees)
  }
  buffer.push(node)
}

if (flushable(buffer)) flush(buffer, newTrees)

newTrees.map((mast) => {
  const hast = unified().use(remark2rehype).runSync(mast)
  console.log(unified().use(html).stringify(hast))
  console.log('======')
})

// const hast = unified().use(remark2rehype).runSync(mast)
// console.log(unified().use(html).stringify(hast))
