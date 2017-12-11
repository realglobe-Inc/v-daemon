/**
 * Daemonize v script
 * @function vDaemon
 * @param {...string} filename - Script file path to daemonize
 * @param {Object} object - Optional settings
 * @returns {Promise}
 */
'use strict'

const argx = require('argx')
const aglob = require('aglob')
const path = require('path')
const asleep = require('asleep')
const {format: formatUrl} = require('url')
const {EOL} = require('os')
const {subjectFromFile} = require('shiba-daemon-util')
const {clientFor} = require('v-connector')
const debug = require('debug')('v:daemon')
const {Defaults} = require('v-constants')

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
    protocol = Defaults.PROTOCOL,
    hostname = Defaults.HOSTNAME,
    port,
    connector,
    quiet,
    verbose,
    retryInterval = 3 * 1000,
    retryMax = 25
  } = options

  const client = clientFor(connector || 'ws')

  const subjects = []
  for (const filename of await aglob(filenames)) {
    const subject = options.id || path.basename(filename)
    const instance = subjectFromFile(filename, {
      subject,
      verbose,
      prefix: '[v-daemon]'
    })
    client.load(instance, subject)
    subjects.push(subject)
  }

  const url = formatUrl({protocol, hostname, port})
  debug('url', url)

  await client.connect(url)

  client.on('error', (e) => debug('error', e))
  client.on('gone', async () => {
    console.warn(`[v-daemon] Client seems gone. Trying to reconnect...`)
    for (let i = 0; i < retryMax; i++) {
      await asleep(retryInterval)
      try {
        await client.connect(url)
        console.log(`[v-daemon] Successfully reconnect to`, url)
        return
      } catch (e) {
        console.warn(`[v-daemon] Failed to connect to`, url)
      }
    }
    throw new Error(`[v-daemon] Failed to reconnect`)
  })

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
