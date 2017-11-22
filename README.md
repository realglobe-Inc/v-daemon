v-daemon
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/realglobe-INc/v-daemon
[bd_travis_url]: http://travis-ci.org/realglobe-INc/v-daemon
[bd_travis_shield_url]: http://img.shields.io/travis/realglobe-INc/v-daemon.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/realglobe-INc/v-daemon
[bd_travis_com_shield_url]: https://api.travis-ci.com/realglobe-INc/v-daemon.svg?token=
[bd_license_url]: https://github.com/realglobe-INc/v-daemon/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/realglobe-INc/v-daemon
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/realglobe-INc/v-daemon.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/realglobe-INc/v-daemon.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/realglobe-INc/v-daemon
[bd_gemnasium_shield_url]: https://gemnasium.com/realglobe-INc/v-daemon.svg
[bd_npm_url]: http://www.npmjs.org/package/v-daemon
[bd_npm_shield_url]: http://img.shields.io/npm/v/v-daemon.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Daemon script for v-spot-client

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>

Installation
-----

```bash
$ npm install v-daemon -g
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>

Usage
---------

Step01: Create script file to run. File basename will be the subject id

**/home/scripts/v/jp.realglobe.example01**

```javascript
#!/usr/bin/env node

/**
 * @file Example script to daemonize
 */
'use strict'

// verb and object passed as process args
const [, , verb, object = '[]'] = process.argv

switch (verb) {
  case 'sayHi': {
    process.stdout.write(`Hi, ${object}`)
    break
  }
  default:
    throw new Error(`Unknown verb: ${verb}`)
}
```


Step02: Daemonize the script

```bash
#!/bin/bash

# Give script path to daemonize

v-daemon /home/scripts/v/jp.realglobe.example01 -H "v-spot.cloud.com"
```

Step03: Call it from another client
```javascript
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
  const example01 = await spot.use('jp.realglobe.example01')
  // Send the signal to daemon script via server
  await example01.sayHi('can you hear me?')
})()

```

<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/10.API Guide.md.hbs" Start -->

<a name="section-doc-guides-10-a-p-i-guide-md"></a>

API Guide
-----

+ [v-daemon@1.0.2](./doc/api/api.md)


<!-- Section from "doc/guides/10.API Guide.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/realglobe-INc/v-daemon/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [v][v_url]
+ [Realglobe, Inc.][realglobe,_inc__url]

[v_url]: https://github.com/realglobe-Inc/v
[realglobe,_inc__url]: http://realglobe.jp

<!-- Links End -->
