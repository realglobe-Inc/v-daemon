/**
 * Test for vDaemon.
 * Runs with mocha.
 */
'use strict'

const vDaemon = require('../lib/vDaemon')
const vSpotWS = require('v-spot-ws')
const asleep = require('asleep')
const aport = require('aport')
const {ok, equal} = require('assert')

const vCallBin = require.resolve('v-call/bin/v-call')
const {exec} = require('child_process')

describe('v-daemon', function () {
  this.timeout(80000)
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const port = await aport()
    const server = vSpotWS()
    const client = vSpotWS.client()

    await server.listen(port)

    await asleep(100)

    const close = await vDaemon(
      require.resolve('../example/jp.realglobe.example02'),
      {port, q: true}
    )
    await client.connect(`http://localhost:${port}`)

    {
      const example02 = await client.use('jp.realglobe.example02')
      equal(
        (await example02.sayHi('From Test', 'yes')).trim(),
        'Hi, From Test and yes'
      )
    }

    {
      const example02 = await client.use('jp.realglobe.example02')
      const error = await example02.invalidMethodCall().catch((e) => e)
      console.error(error)
    }

    await asleep(100)

    await client.disconnect()
    await close()
    await server.close()
  })

  it('Use v.realglobe.work', async () => {
    const client = vSpotWS.client()

    const close = await vDaemon(
      require.resolve('../example/jp.realglobe.example01'),
      {protocol: 'https', hostname: 'v.realglobe.work', quiet: true}
    )
    await client.connect(`https://v.realglobe.work`)

    const example01 = await client.use('jp.realglobe.example01')
    equal(
      (await example01.sayHi('From Test', 'yes')).trim(),
      'Hi, From Test and yes'
    )

    await new Promise((resolve) =>
      exec(
        `${vCallBin} jp.realglobe.example01 sayHi foo bar -P https -H v.realglobe.work`,
        (err, stdout, stderr) => {
          equal(stdout.trim(), 'Hi, foo and bar')
          resolve()
        }
      )
    )

    await asleep(1100)

    await client.disconnect()
    await close()
  })
})

/* global describe, before, after, it */
