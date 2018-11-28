"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

window.globalVar = 'It works!';

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Unit tests
QUnit.test( "String expressions test", function( assert ) {
    assert.equal( $('#t1-1').html() , "" );
    assert.equal( $('#t1-2').html() , "hello" );
    assert.equal( $('#t1-3').html() , "help my string" );
    assert.equal( $('#t1-4').html() , "www.string.org" );
    assert.equal( $('#t1-5').html() , "give me $string or else" );
    assert.equal( $('#t1-6').html() , "user is Bob" );
    assert.equal( $('#t1-7').html() , "user is Bob" );
});

QUnit.test( "Exists expressions test", function( assert ) {
    assert.equal( $('#t2-1').html() , "false" );
    assert.equal( $('#t2-2').html() , "true" );
    assert.equal( $('#t2-3').html() , "true" );
    assert.equal( $('#t2-4').html() , "true" );
});

QUnit.test( "Not expressions test", function( assert ) {
    assert.equal( $('#t3-1').html() , "0" );
    assert.equal( $('#t3-2').html() , "true" );
    assert.equal( $('#t3-3').html() , "1" );
    assert.equal( $('#t3-4').html() , "false" );
    assert.equal( $('#t3-5').html() , "false" );
    assert.equal( $('#t3-6').html() , "true" );
    assert.equal( $('#t3-7').html() , "true" );
    assert.equal( $('#t3-8').html() , "false" );
    assert.equal( $('#t3-9').html() , "false" );
    assert.equal( $('#t3-10').html() , "true" );
});

QUnit.test( "Javascript expressions test", function( assert ) {
    assert.equal( $('#t4-1').html() , "9" );
    assert.equal( $('#t4-2').html() , "1" );
    assert.equal( $('#t4-3').html() , "20" );
    assert.equal( $('#t4-4').html() , "23" );
    assert.equal( $('#t4-5').html() , "2" );
    assert.equal( $('#t4-6').html() , "true" );
    assert.equal( $('#t4-7').html() , "true" );
    assert.equal( $('#t4-8').html() , "false" );
    assert.equal( $('#t4-9').html() , "101" );
});

QUnit.test( "Comparison expressions test", function( assert ) {
    assert.equal( $('#t5-1').html() , "true" );
    assert.equal( $('#t5-2').html() , "false" );
    assert.equal( $('#t5-3').html() , "true" );
    assert.equal( $('#t5-4').html() , "false" );
    assert.equal( $('#t5-5').html() , "false" );
    assert.equal( $('#t5-6').html() , "true" );
    assert.equal( $('#t5-7').html() , "true" );
    assert.equal( $('#t5-8').html() , "true" );
    assert.equal( $('#t5-9').html() , "true" );
    assert.equal( $('#t5-10').html() , "false" );
    assert.equal( $('#t5-11').html() , "false" );
    assert.equal( $('#t5-12').html() , "false" );
    assert.equal( $('#t5-13').html() , "true" );
    assert.equal( $('#t5-14').html() , "false" );
    assert.equal( $('#t5-15').html() , "false" );
    assert.equal( $('#t5-16').html() , "true" );
    assert.equal( $('#t5-17').html() , "true" );
    assert.equal( $('#t5-18').html() , "false" );
    assert.equal( $('#t5-19').html() , "true" );
    assert.equal( $('#t5-20').html() , "false" );
    assert.equal( $('#t5-21').html() , "false" );
    assert.equal( $('#t5-22').html() , "true" );
    assert.equal( $('#t5-23').html() , "false" );
    assert.equal( $('#t5-24').html() , "true" );
    assert.equal( $('#t5-25').html() , "false" );
    assert.equal( $('#t5-26').html() , "true" );
    assert.equal( $('#t5-27').html() , "false" );
    assert.equal( $('#t5-28').html() , "true" );
    assert.equal( $('#t5-29').html() , "false" );
    assert.equal( $('#t5-30').html() , "true" );
    assert.equal( $('#t5-31').html() , "false" );
});

QUnit.test( "Math expressions test", function( assert ) {
    assert.equal( $('#t6-1').html() , "9" );
    assert.equal( $('#t6-2').html() , "1" );
    assert.equal( $('#t6-3').html() , "20" );
    assert.equal( $('#t6-4').html() , "23" );
    assert.equal( $('#t6-5').html() , "2" );
    assert.equal( $('#t6-6').html() , "101" );
    assert.equal( $('#t6-7').html() , "202" );
});

QUnit.test( "Boolean expressions test", function( assert ) {
    assert.equal( $('#t7-1').html() , "true" );
    assert.equal( $('#t7-2').html() , "false" );
    assert.equal( $('#t7-3').html() , "false" );
    assert.equal( $('#t7-4').html() , "true" );
    assert.equal( $('#t7-5').html() , "true" );
    assert.equal( $('#t7-6').html() , "false" );
    assert.equal( $('#t7-7').html() , "1" );
    assert.equal( $('#t7-8').html() , "tree" );
    assert.equal( $('#t7-9').html() , "tree2" );
    assert.equal( $('#t7-10').html() , "tree2" );
    assert.equal( $('#t7-11').html() , "literal with spaces 1" );
    assert.equal( $('#t7-12').html() , "literal with spaces 1" );
});

QUnit.test( "Path expressions test", function( assert ) {
    assert.equal( $('#t8-1').html() , "Bob" );
    assert.equal( $('#t8-2').html() , "no enemies" );
    assert.equal( $('#t8-3').html() , "no enemies" );
    assert.equal( $('#t8-4').html() , "no enemies" );
    assert.equal( $('#t8-5').html() , "Bob" );
    assert.equal( $('#t8-6').html() , "Bob" );
    assert.equal( $('#t8-7').html() , "no enemies" );
});


QUnit.test( "Literal expressions test", function( assert ) {
    assert.equal( $('#t9-1').html() , "this is a string literal" );
    assert.equal( $('#t9-2').html() , "123" );
    assert.equal( $('#t9-3').html() , "123.45" );
    assert.equal( $('#t9-4').html() , "true" );
    assert.equal( $('#t9-5').html() , "false" );
});

QUnit.test( "Function calls expressions test", function( assert ) {
    assert.equal( $('#t10-1').html() , "3" );
    assert.equal( $('#t10-2').html() , "Infinity" );
    assert.equal( $('#t10-3').html() , "3" );
    assert.equal( $('#t10-4').html() , "101" );
    assert.equal( $('#t10-5').html() , "5" );
});

QUnit.test( "Arrays test", function( assert ) {
    assert.equal( $('#t11-1').html() , "item0" );
    assert.equal( $('#t11-2').html() , "item1" );
    assert.equal( $('#t11-3').html() , "item2" );
    assert.equal( $('#t11-4').html() , "item0,item1,item2" );
    assert.equal( $('#t11-5').html() , "6" );
    assert.equal( $('#t11-6').html() , "10" );
    assert.equal( $('#t11-7').html() , "1,2,3" );
    assert.equal( $('#t11-8').html() , "1,2,3,1" );
    assert.equal( $('#t11-9').html() , "7" );
});

QUnit.test( "Methods expressions test", function( assert ) {
    assert.equal( $('#t12-1').html() , "25" );
    assert.equal( $('#t12-2').html() , "11" );
    assert.equal( $('#t12-3').html() , "3" );
});

QUnit.test( "Default expressions test", function( assert ) {
    assert.equal( $('#t13-1').html() , "string" );
    assert.equal( $('#t13-2').html() , "Bob" );
});

QUnit.test( "Some complex expressions test", function( assert ) {
    assert.equal( $('#t14-1').html() , "1977" );
    assert.equal( $('#t14-2').html() , "yes!" );
    assert.equal( $('#t14-3').html() , "4" );
});

QUnit.test( "Map test", function( assert ) {
    assert.equal( $('#t15-1').html() , "item0" );
    assert.equal( $('#t15-2').html() , "Bob" );
    assert.equal( $('#t15-3').html() , "Bob" );
});

QUnit.test( "Window object test", function( assert ) {
    assert.equal( $('#t16-1').html() , 'It works!' );
});

QUnit.test( "Context object test", function( assert ) {
    assert.equal( $('#t17-1').html() , 'context' );
});
