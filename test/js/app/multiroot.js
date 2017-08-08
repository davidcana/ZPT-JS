"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunitjs' );

// Parse template
zpt.run({
    root: [ $( '#t1-1' )[0], $( '#t1-3' )[0] ],
    dictionary: dictionary
});

// Unit tests
QUnit.test( "Multiroot test", function( assert ) {
    assert.equal( $('#t1-1').html() , "hello" );
    assert.equal( $('#t1-2').html() , "not rendered!" );
    assert.equal( $('#t1-3').html() , "hello" );
});
