var common = require('../fixtures/common'),
    assert = require('assert');

var n = 1000,
    source  = new Array(n).join(
      'if (x) {' +
      '   return function() {' +
      '        var x = y;' +
      '        y += x;' +
      '        return { x:3, y:4 + 6, z:5};' +
      '   };' +
      '   return function() {' +
      '        return { x:3, y:4, z:5};' +
      '   }' +
      '};');
console.log('Source length: %d', source.length);

var grmr = common.require('bs-js-compiler').BSJSParser,
    instance = new grmr(source);

console.time('parse');
instance._rule('topLevel');
console.timeEnd('parse');
