"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunitjs' );

// Run tests!
QUnit.test( "Before on-error tag test", function( assert ) {
    
    try {
        zpt.run({
            root: $( '#group1' )[0],
            dictionary: dictionary
        });
        assert.equal( "true" , "false" );
    } catch( e ) {
        assert.equal( "true" , "true" );
    }
    
    assert.equal( $('#t1-1').text() , "false" );
});

QUnit.test( "on-error tag test", function( assert ) {
    
    zpt.run({
        root: $( '#group2' )[0],
        dictionary: dictionary
    });
    
    assert.equal( $('#t2-1').text() , "true" );
    assert.equal( $('#t2-2').text() , "1" );
    assert.equal( $('#t2-3').text() , "Oh, noooo!" );
    assert.equal( $('#t2-4').text() , "yes" );
    assert.equal( $('#t2-5').text() , "Infinity" );
});

QUnit.test( "After on-error tag test", function( assert ) {

    try {
        zpt.run({
            root: $( '#group3' )[0],
            dictionary: dictionary
        });
        assert.equal( "true" , "false" );
    } catch( e ) {
        assert.equal( "true" , "true" );
    }

    assert.equal( $('#t3-1').text() , "false" );
});