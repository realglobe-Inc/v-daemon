/**
 * @function vDaemon
 * @param {string}
 * @param {Object} - Optional settings
 */
'use strict'

const argx = require('argx')
const aglob = require('aglob')
const path = require('path')
const {format: formatUrl} = require('url')
const subjectFor = require('./subjectFor')
const clientFor = require('./clientFor')

/** @lends vDaemon */
async function vDaemon (filenames, options) {
  const args = argx(arguments)
  options = args.pop('object') || {}
  filenames = args.remain()

  const {
    protocol = 'http',
    hostname = 'localhost',
    port = 8080,
    connector
  } = options
  const client = clientFor(connector || 'ws')

  for (const filename of await aglob(filenames)) {
    const subject = options.id || path.basename(filename)
    client.load(subjectFor(filename), subject)
  }

  const url = formatUrl({protocol, hostname, port})
  await client.connect(url)

  async function close () {
    await client.close()
  }

  return close

}

module.exports = vDaemon
