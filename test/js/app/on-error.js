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

// Run tests!
QUnit.test( "on-error tag test", function( assert ) {
    assert.equal( $('#t1').text() , "1" );
    assert.equal( $('#t2').text() , "Oh, noooo!" );
    assert.equal( $('#t3').text() , "yes" );
    assert.equal( $('#t4').text() , "Infinity" );
});
