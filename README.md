# node-concept2

[![Build Status](https://travis-ci.org/mdeltito/node-concept2.svg?branch=master)](https://travis-ci.org/mdeltito/node-concept2)
[![npm version](https://badge.fury.io/js/concept2.svg)](https://badge.fury.io/js/concept2)

HID library for communicating with Concept2 performance monitor modules.

# Description

This module provides a wrapper for [`node-hid`](https://github.com/node-hid/node-hid) for communicating with Concept2 performance monitors.
It depends on [`node-csafe`](https://github.com/mdeltito/node-csafe) in order to communicate using the CSAFE protocol.

# Installation

```sh
$ npm install --save concept2
```

# Example

```js
import Concept2 from concept2
import { Command } from csafe

// Connect to an available monitor (with vendor ID 6052)
const pm3 = new Concept2

// Listen for error a new-frame events.
pm3.on('error', (err) => {
  console.error(err)
})

pm3.on('frame', (frame) => {
  // Do something with the response!
  console.log(frame)
})

// Write a command to the device.
const getCadenceCmd = new Command('GetCadence')
pm3.write(getCadenceCmd)
```

# Testing

```sh
$ npm test
```

# License

The project is licensed under the MIT license.
