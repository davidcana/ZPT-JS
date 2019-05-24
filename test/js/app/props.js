"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

// Run tests!
QUnit.test( "simple test", function( assert ) {
    
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });
    
    assert.equal( $('#t1-1').text() , "1" );
    assert.equal( $('#t1-2').text() , "1.5" );
    assert.equal( $('#t1-3').text() , "this is a text" );

});
