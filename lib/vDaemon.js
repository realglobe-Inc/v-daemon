/**
 * Daemonize v script
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
const {clientFor} = require('v-connector')
const debug = require('debug')('v:daemon')

/** @lends vDaemon */
async function vDaemon (filenames, options) {

  // Parse variadic arguments
  {
    const args = argx(arguments)
    options = args.pop('object') || {}
    filenames = args.remain()

    debug('filenames', filenames)
  }

  const {
    protocol = 'http',
    hostname = 'localhost',
    port,
    connector,
    quiet,
    verbose
  } = options

  const client = clientFor(connector || 'ws')

  const subjects = []
  for (const filename of await aglob(filenames)) {
    const subject = options.id || path.basename(filename)
    const instance = subjectFor(filename, {subject, verbose})
    client.load(instance, subject)
    subjects.push(subject)
  }

  const url = formatUrl({protocol, hostname, port})
  debug('url', url)

  await client.connect(url)

  !quiet && console.log(`
[v-daemon] V-spot client is connected
  
Spot:
  ${protocol}://${hostname}${port ? ':' + port : ''}

Subject:
${subjects.map((line) => `  ${line}`).join(EOL)}

  `)

  async function close () {
    await client.disconnect()
  }

  return close

}

module.exports = vDaemon
