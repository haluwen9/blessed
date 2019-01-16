/**
 * prompt.js - prompt element for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

var Node = require('./node');
var Box = require('./box');
var Button = require('./button');
var Textbox = require('./textbox');

/**
 * Prompt
 */

function Prompt(options) {
  if (!(this instanceof Node)) {
    return new Prompt(options);
  }

  options = options || {};

  options.hidden = true;

  options.padding = options.padding || {
    left: 1,
    right: 1
  }

  Box.call(this, options);

  this._.input = new Textbox({
    parent: this,
    // bottom: 3,
    height: 1,
    left: 2,
    right: 2,
    bg: 'black',
    censor: options.censor
  });

  this._.okay = new Button({
    parent: this,
    // bottom: 1,
    height: 1,
    left: 5,
    width: 7,
    content: 'Enter',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true
  });

  this._.cancel = new Button({
    parent: this,
    bottom: 1,
    height: 1,
    right: 5,
    width: 8,
    content: 'Cancel',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true
  });
}

Prompt.prototype.__proto__ = Box.prototype;

Prompt.prototype.type = 'prompt';

Prompt.prototype.input =
  Prompt.prototype.setInput =
  Prompt.prototype.readInput = function (text, value, callback) {
    var self = this;
    var okay, cancel, icancel, canceled;

    if (!callback) {
      callback = value;
      value = '';
    }

    // Keep above:
    // var parent = this.parent;
    // this.detach();
    // parent.append(this);

    // Reposition and resize the box to fix content
    var splitted = text.split('\n');
    var line = splitted.length;
    splitted.forEach(str => {
      line += Math.floor(str.length / this.options.position.width || 1);
    });
    this._.input.position.top = line + 1;
    this._.okay.position.top = this._.cancel.position.top = line + 3;
    this.position.height = line + 7;

    this.show();
    this.setContent(text);

    this._.input.value = value;

    this.screen.saveFocus();

    this._.okay.on('press', okay = function () {
      self._.input.submit();
    });

    this._.cancel.on('press', cancel = function () {
      self._.input.cancel();
    });

    this._.input.on('cancel', icancel = function () {
      canceled = true;
    })

    this._.input.readInput(function (err, data) {
      self.hide();
      self.screen.restoreFocus();
      self._.okay.removeListener('press', okay);
      self._.cancel.removeListener('press', cancel);
      self._.input.removeListener('cancel', icancel)
      // self.screen.destroy();
      // console.log(self.screen._events);
      // return;
      self.screen.render();
      return canceled || callback(err, data);
    });

  };

/**
 * Expose
 */

module.exports = Prompt;