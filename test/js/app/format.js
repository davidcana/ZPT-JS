"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunitjs' );

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

QUnit.test( "Simple format test", function( assert ) {
    assert.equal( $('#t1-1').html() , "test" );
    assert.equal( $('#t1-2').html() , "TEST" );
    assert.equal( $('#t1-3').html() , "variable test" );
    assert.equal( $('#t1-4').html() , "VARIABLE TEST" );
});

QUnit.test( "Format with arguments test", function( assert ) {
    assert.equal( $('#t2-1').html() , "1.38" );
    assert.equal( $('#t2-2').html() , "1.6" );
    assert.equal( $('#t2-3').html() , "0.33" );
});

QUnit.test( "Custom formatters test", function( assert ) {
    assert.equal( $('#t3-1').html() , "$150" );
    assert.equal( $('#t3-2').html() , "$225" );
    assert.equal( $('#t3-3').html() , "$1225" );
});
