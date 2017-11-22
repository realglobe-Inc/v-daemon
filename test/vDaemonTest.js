/**
 * Test for vDaemon.
 * Runs with mocha.
 */
'use strict'

const vDaemon = require('../lib/vDaemon')
const vSpotWS = require('v-spot-ws/lib/create')
const asleep = require('asleep')
const aport = require('aport')
const {ok, equal} = require('assert')

describe('v-daemon', () => {
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
      {port}
    )
    await client.connect(`http://localhost:${port}`)

    const example02 = await client.use('jp.realglobe.example02')
    equal(
      (await example02.sayHi('From Test', 'yes')).trim(),
      'Hi, From Test and yes'
    )

    await asleep(100)

    await client.disconnect()
    await close()
    await server.close()
  })
})

/* global describe, before, after, it */
