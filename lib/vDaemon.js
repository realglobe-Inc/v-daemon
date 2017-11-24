/**
 * @function vDaemon
 * @param {string} filename - Script file path to daemonize
 * @param {Object} object - Optional settings
 * @returns {Promise}
 */
'use strict'

const argx = require('argx')
const aglob = require('aglob')
const path = require('path')
const {format: formatUrl} = require('url')
const {EOL} = require('os')
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
    port,
    connector
  } = options
  const client = clientFor(connector || 'ws')
  const subjects = []
  for (const filename of await aglob(filenames)) {
    const subject = options.id || path.basename(filename)
    client.load(subjectFor(filename), subject)
    subjects.push(subject)
  }

  const url = formatUrl({protocol, hostname, port})
  await client.connect(url)

  console.log(`
[v-daemon] V-spot client is connected
  
Spot:
  ${protocol}://${hostname}${port ? ':' + port : ''}

Subject:
${subjects.map((line) => `  ${line}`).join(EOL)}

  `)

  async function close () {
    await client.close()
  }

  return close

}

module.exports = vDaemon
