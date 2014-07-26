analogin
=====

[![NPM](https://nodei.co/npm/analogin.png)](https://nodei.co/npm/analogin/)

Read analog inputs on a (currently only) a BeagleBone Black.

Very much a work-in-progress.

```javascript
var AnalogIn = require("analogin")

// after connecting some sort of analog device to the beaglebone
var ain1 = AnalogIn(1)
console.log(ain1.readSync())

```

API
===

`require("analogin")(input[, opts])`
---

input is the Analog input number on the BeagleBone black, 0-7.

options:
  * scaled [true]: scale reads from 0-1 (floating point)

otherwise reads will be an integer between 0 and 1800

`ain.read(callback)`
---

Asynchronously read the value.

`ain.readSync()`
---

Read the value synchronously.

LICENSE
=======

MIT
