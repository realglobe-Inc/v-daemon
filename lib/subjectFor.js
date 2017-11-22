/**
 * Define subject for
 * @function subjectFor
 * @param {string} filename
 */
'use strict'

const {execFile} = require('child_process')

function parseJSON (str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

/** @lends subjectFor */
function subjectFor (filename) {
  const target = {}
  return new Proxy(target, {
    get (target, name) {
      const isMethod = ![
        'constructor', 'then', 'catch', 'inspect', 'valueOf'
      ].includes(name)
      if (!isMethod) {
        return target[name]
      }
      if (typeof name === 'symbol') {
        return target[name]
      }
      return async function execFileProxy (...args) {
        return new Promise((resolve, reject) => {
          execFile(filename, [name, ...args], (err, stdout, stderr) => {
            if (stderr || err) {
              reject(stderr || err)
            } else {
              const result = parseJSON(String(stdout))
              resolve(result)
            }
          })
        })
      }
    }
  })
}

module.exports = subjectFor