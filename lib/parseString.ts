import Parser from 'rss-parser'

const parser = new Parser()

export const parseString = parser.parseString.bind(parser)
