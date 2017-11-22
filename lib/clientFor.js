/**
 * @function clientFor
 */
'use strict'

/** @lends clientFor */
function clientFor (connector) {
  switch (String(connector).toLocaleLowerCase().trim()) {
    case 'ws': {
      const client = require('v-spot-ws').client()
      return client
    }

    default:
      throw new Error(`Unknown connector: ${connector}`)
  }
}

module.exports = clientFor
