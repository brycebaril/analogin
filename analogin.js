"use strict";

module.exports = AnalogIn

var fs = require("fs")
var isNumber = require("isnumber")
var xtend = require("xtend")

// Right now this only supports BeagleBone Black
var MIN_CHANNEL = 0
var MAX_CHANNEL = 7
var VOLTAGE_SCALE = 1800

var MAGIC_STRING = "cape-bone-iio"
var SLOTMGR = "/sys/devices/bone_capemgr.9/slots"
var PATHPREFIX = "/sys/devices/ocp.3/helper.15/AIN"

function AnalogIn(channel, opts) {
  if (!(this instanceof AnalogIn)) {
    return new AnalogIn(channel, opts)
  }

  if (!isNumber(channel) || channel < MIN_CHANNEL || channel > MAX_CHANNEL) {
    throw new Error("channel must be a number between 0 and 7. (BeagleBone Black only at the moment.)")
  }

  this.opts = xtend({scaled: true}, opts)

  this.channel = parseInt(channel)
  this.path = PATHPREFIX + channel
  this.buffer = new Buffer(4)

  this.bootstrap()

}

AnalogIn.prototype.bootstrap = function bootstrap() {
  if (this.fd != null) {
    return
  }
  if (!fs.existsSync(this.path)) {
    // need to bootstrap the inputs
    fs.writeFileSync(SLOTMGR, MAGIC_STRING)
  }
  this.fd = fs.openSync(this.path, "r")
}

AnalogIn.prototype.getRaw = function getRaw() {
  var str = this.buffer.toString().trim()
  return parseInt(str)
}

AnalogIn.prototype.getScaled = function getScaled() {
  return this.getRaw() / VOLTAGE_SCALE
}

AnalogIn.prototype.get = function get() {
  if (this.opts.scaled) {
    return this.getScaled()
  }
  return this.getRaw()
}

AnalogIn.prototype.read = function read(callback) {
  var self = this
  fs.read(this.fd, this.buffer, 0, 4, 0, function (err, bytes, buf) {
    if (err) {
      return callback(err)
    }
    callback(null, self.get())
  })
}

AnalogIn.prototype.readSync = function readSync() {
  fs.readSync(this.fd, this.buffer, 0, 4, 0)
  return this.get()
}
