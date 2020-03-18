"use strict";

const _ = require("lodash");
const HID = require("node-hid");
const EventEmitter = require("events");
const Frame = require("csafe").Frame;
const FrameReader = require("csafe").FrameReader;

/**
 * Concept2 HID Event Library
 *
 * Provides communication with a connected Concept2
 * HID-compliant performance monitor via the CSAFE
 * communication protocol.
 *
 * @param {int} index - the index of the device to use.
 *  Consult the output of `lsusb`.
 */
class Concept2 extends EventEmitter {
  constructor(index = 0) {
    super();
    this.VENDOR_ID = 6052;
    this.devices = this.getDevices();
    this.frameReader = new FrameReader();
    this.frameCount = 0;

    if (!this.devices.length) {
      throw new Error("No Concept2 devices found.");
    }

    this.hid = new HID.HID(this.devices[index].path);
    this.hid.on("data", this.emitData.bind(this));
    this.frameReader.on("frame", this.emitFrame.bind(this));
  }

  /**
   * Returns a list of connected Concept2 devices.
   */
  getDevices() {
    let allDevices = HID.devices();
    return _.filter(allDevices, { vendorId: this.VENDOR_ID });
  }

  /**
   * Event handler for new response data from the
   * underlying HID.
   */
  emitData(record) {
    let buffer = record.slice(1);

    this.emit("data", buffer);
    this.frameReader.read(buffer);
  }

  /**
   * Event handler for a new CSAFE frame.
   */
  emitFrame(frame) {
    this.frameCount++;
    this.emit("frame", frame);
  }

  /**
   * Generic read callback for the HID.
   *
   * @param {function} callback - data handler callback.
   */
  read(callback) {
    this.hid.read(callback);
  }

  /**
   * Write an array or buffer to the HID.
   *
   * @param {Buffer|Frame} data - the data to write.
   * @param {integer} recordId - the recordId to associate
   *  this write request with.
   */
  write(data, recordId = 1) {
    let buffer = Buffer.alloc(22);

    // For convienience, extract the buffer if a Frame is passed.
    if (data instanceof Frame) {
      data = data.buffer;
    }

    // Write the recordId and copy in the data buffer.
    buffer.writeInt8(recordId);
    data.copy(buffer, 1);

    // Write to the device.
    this.hid.write(Array.from(buffer));
  }
}

module.exports = Concept2;
