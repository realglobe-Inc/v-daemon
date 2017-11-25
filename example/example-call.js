#!/usr/bin/env node

/**
 * Example to call daemonized script
 */
'use strict'

const vSpot = require('v-spot')

;(async () => {
  const spot = vSpot().client()

  await spot.connect('v-spot.cloud.com')

  // By default, subject name is generated from script name
  const example01 = await spot.use('jp.realglobe.v-daemon.example01')
  // Send the signal to daemon script via server
  await example01.sayHi('can you hear me?', 'really?')
})()
