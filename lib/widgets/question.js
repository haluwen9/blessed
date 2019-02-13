/**
 * question.js - question element for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

var Node = require('./node');
var Box = require('./box');
var Button = require('./button');

/**
 * Question
 */

function Question(options) {
  if (!(this instanceof Node)) {
    return new Question(options);
  }

  options = options || {};
  options.hidden = true;

  options.padding = options.padding || {
    left: 1,
    right: 1
  }

  Box.call(this, options);

  this._.okay = new Button({
    screen: this.screen,
    parent: this,
    // bottom: 1,
    height: 1,
    left: 5,
    width: 7,
    content: 'Yes',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true,
    style: {
      focus: {
        bg: 'red'
      }
    }
  });

  this._.cancel = new Button({
    screen: this.screen,
    parent: this,
    // bottom: 1,
    height: 1,
    right: 5,
    width: 6,
    content: 'No',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true,
    style: {
      focus: {
        bg: 'red'
      }
    }
  });
}


Question.prototype.__proto__ = Box.prototype;

Question.prototype.type = 'question';

Question.prototype.ask = function (text, callback) {
  var self = this;
  var press, okay, cancel;

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
  this._.okay.position.top = this._.cancel.position.top = line + 1;
  this.position.height = line + 5;

  this.show();
  this.setContent(text);

  this.on('element keypress', press = function (el, ch, key) {
    if (['tab', 'up', 'down', 'left', 'right'].includes(key.name)) {
      if (this._.okay.focused) {
        this._.cancel.focus();
      } else {
        this._.okay.focus()
      }
      return;
    }
    if (key.name === 'mouse') return;
    if (key.name !== 'escape' &&
      key.name !== 'y' &&
      key.name !== 'n') {
      return;
    }
    done(null, key.name === 'y');
  });

  this._.okay.on('press', okay = function () {
    done(null, true);
  });

  this._.cancel.on('press', cancel = function () {
    done(null, false);
  });

  this.screen.focusPush();
  this._.okay.focus();
  this.screen.grabKeys = true;

  function done(err, data) {
    self.hide();
    self.screen.grabKeys = false;
    self.screen.rewindFocus();
    self.removeListener('keypress', press);
    self._.okay.removeListener('press', okay);
    self._.cancel.removeListener('press', cancel);
    return callback(err, data);
  }

  this.screen.render();
};

/**
 * Expose
 */

module.exports = Question;