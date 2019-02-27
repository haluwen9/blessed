/**
 * loading.js - loading element for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

var Node = require('./node');
var Box = require('./box');
var Text = require('./text');

/**
 * Loading
 */

function Loading(options) {
  if (!(this instanceof Node)) {
    return new Loading(options);
  }

  options = options || {};

  options.padding = {
    left: 1,
    right: 1
  }

  Box.call(this, options);

  this._.frames = options.icon.frames;

  this._.icon = new Text(Object.assign({
    parent: this,
    bottom: 0,
    style: options.style.icon
  }, options.icon));
}

Loading.prototype.__proto__ = Box.prototype;

Loading.prototype.type = 'loading';

Loading.prototype.load = function (text) {
  var self = this;

  // XXX Keep above:
  // var parent = this.parent;
  // this.detach();
  // parent.append(this);

  // Reposition and resize the box to fix content 
  var splitted = text.split('\n');
  var line = splitted.length;
  splitted.forEach(str => {
    line += Math.floor(str.length / this.position.width || 1);
  });
  // this._.icon.position.top = line + 1;
  this.position.height = line + 3;

  this.show();
  this.setContent(text);

  if (this._.timer) {
    this.stop();
  }

  this.screen.lockKeys = true;

  this._.framesinx = 0;

  this._.timer = setInterval(function () {
    // if (self._.icon.content === '|') {
    //   self._.icon.setContent('/');
    // } else if (self._.icon.content === '/') {
    //   self._.icon.setContent('-');
    // } else if (self._.icon.content === '-') {
    //   self._.icon.setContent('\\');
    // } else if (self._.icon.content === '\\') {
    //   self._.icon.setContent('|');
    // }
    self._.framesinx = (self._.framesinx + 1) % self._.frames.length;
    self._.icon.setContent(self._.frames[self._.framesinx]);
    self.screen.render();
  }, 200);
};

Loading.prototype.stop = function () {
  this.screen.lockKeys = false;
  this.hide();
  if (this._.timer) {
    clearInterval(this._.timer);
    delete this._.timer;
  }
  this.screen.render();
};

/**
 * Expose
 */

module.exports = Loading;