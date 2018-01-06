// yelpfunc.js
var rev = require('./hoffy.js');

let s = "foo=bar\nbaz=qux\nquxx=corge";
//rev.simpleINIParse(s); // {foo: 'bar', baz: 'qux', quxx: 'corge'} 

s = "foo=bar\nbaz=\n=qux";
console.log(rev.simpleINIParse(s)); // {foo: 'bar', baz: '', '': 'qux'}

s = "foo=bar\nbaz\nquxx=corge";
rev.simpleINIParse(s); // {foo: 'bar', quxx: 'corge'};