var common = require('../fixtures/common'),
    assert = require('assert');

var units = [
  { hint: 'only keyword', src: 'ometa', throws: true },
  { hint: 'no closing bracket', src: 'ometa name {', throws: true },
  { hint: '<: without name', src: 'ometa name <: { }', throws: true },
  { hint: 'no keyword', src: 'name {}', throws: true },
  {
    hint: 'empty grammar',
    src: 'ometa name {\n}',
    dst: [ 'topLevel', [ [ 'grammar', 'name', null, [] ] ] ]
  },
  {
    hint: 'two empty grammars',
    src: 'ometa name {\n} ometa name2 <: name {\n}',
    dst: [
      'topLevel',
      [
        [ 'grammar', 'name', null, [] ],
        [ 'grammar', 'name2', 'name', [] ]
      ]
    ]
  },
  {
    hint: 'grammar with one empty rule',
    src: 'ometa name { ruleName }',
    dst: [ 'topLevel', [ [
      'grammar', 'name', null,
      [ [ 'rule', 'ruleName' ] ]
    ] ] ]
  },
  {
    hint: 'grammar with one rule with arg',
    src: 'ometa name { rule :a }',
    dst: [ 'topLevel',
      [ [
        'grammar',
        'name',
        null,
        [ [ 'rule', 'rule', [ 'arg', 'a' ] ] ]
      ] ]
    ]
  },
  {
    hint: 'grammar with one rule and two args',
    src: 'ometa name { rule :a :b }',
    dst: [ 'topLevel',
      [ [
        'grammar',
        'name',
        null,
        [ [ 'rule', 'rule', [ 'arg', 'a' ] , [ 'arg', 'b' ] ] ]
      ] ]
    ]
  },
  {
    hint: 'grammar with two rules',
    src: 'ometa name { rule1 :a :b, rule2 :c :d }',
    dst: [ 'topLevel',
      [ [
        'grammar',
        'name',
        null,
        [
          [ 'rule', 'rule1', [ 'arg', 'a' ] , [ 'arg', 'b' ] ],
          [ 'rule', 'rule2', [ 'arg', 'c' ] , [ 'arg', 'd' ] ]
        ]
      ] ]
    ]
  },
  {
    hint: 'two grammars with one rule and two args',
    src: 'ometa name { rule :a :b } ometa name2 { rule :c :d }',
    dst: [ 'topLevel',
      [
        [
          'grammar',
          'name',
          null,
          [ [ 'rule', 'rule', [ 'arg', 'a' ] , [ 'arg', 'b' ] ] ]
        ],
        [
          'grammar',
          'name2',
          null,
          [ [ 'rule', 'rule', [ 'arg', 'c' ] , [ 'arg', 'd' ] ] ]
        ]
      ]
    ]
  },
  {
    hint: 'grammar with one rule with one left-arg and one right-arg',
    src: 'ometa name { rule :a = :b }',
    dst: [ 'topLevel',
      [ [
        'grammar',
        'name',
        null,
        [ [ 'rule', 'rule', [ 'arg', 'a' ] , [ 'arg', 'b' ] ] ]
      ] ]
    ]
  },
  {
    hint: 'grammar with one rule with one left-arg and one right-arg in parens',
    src: 'ometa name { rule :a = (:b) }',
    dst: [ 'topLevel',
      [ [
        'grammar',
        'name',
        null,
        [ [ 'rule', 'rule', [ 'arg', 'a' ] , [ 'arg', 'b' ] ] ]
      ] ]
    ]
  },
  {
    hint: 'many small grammars',
    src: new Array(10000).join('ometa name { rule :a = (:b) }'),
    dst: false
  }
];

units.forEach(function(unit) {
  exports[unit.hint] = function(test) {
    if (unit.throws) {
      assert.throws(function () { common.parse(unit.src) });
    } else if (unit.dst) {
      assert.deepEqual(common.parse(unit.src), unit.dst);
    } else {
      assert.ok(common.parse(unit.src).length > 0);
    }
    test.done();
  };
});