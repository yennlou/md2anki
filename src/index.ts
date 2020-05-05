import unified = require('unified')
import markdown = require('remark-parse')
import remark2rehype = require('remark-rehype')
import html = require('rehype-stringify')
import { MOCK_DATA } from './mock'
import { Parent, Node } from 'unist'

const isEnd = (node: Node) => node.type === 'end'
const isHeading = (node: Node) => node.type === 'heading' && node.depth < 4
const flushable = (buffer: Node[]) =>
  buffer.length && buffer[buffer.length - 1].type !== 'heading'

const reducer = (state: { buffer: Node[]; newTrees: Node[] }, node: Node) => {
  if (isHeading(node) && flushable(state.buffer)) {
    return {
      newTrees: [
        ...state.newTrees,
        { type: 'root', children: [...state.buffer] }
      ],
      buffer: [node]
    }
  } else if (isEnd(node) && flushable(state.buffer)) {
    return {
      newTrees: [
        ...state.newTrees,
        { type: 'root', children: [...state.buffer] }
      ],
      buffer: []
    }
  }
  return { ...state, buffer: [...state.buffer, node] }
}

const mast = unified().use(markdown).parse(MOCK_DATA) as Parent
const nodes = [...mast.children, { type: 'end' }]
const { newTrees } = nodes.reduce(reducer, { buffer: [], newTrees: [] })

newTrees.map((mast: Parent) => {
  const hast = unified().use(remark2rehype).runSync(mast)
  console.log(unified().use(html).stringify(hast))
  console.log('======')
})
