import unified = require('unified')
import markdown = require('remark-parse')
import remark2rehype = require('remark-rehype')
import html = require('rehype-stringify')

unified()
  .use(markdown)
  .use(remark2rehype)
  .use(html)
  .process('# Hello', (err, file) => {
    console.log(String(file))
  })
