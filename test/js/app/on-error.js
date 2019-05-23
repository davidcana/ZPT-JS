"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

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

QUnit.test( "on-error object tag test", function( assert ) {
    
    dictionary.treatError = function( error ){
        return error.type + '/' + error.value + '/' + error.traceback.substring( 0, 44 );
    };
    
    zpt.run({
        root: $( '#group4' )[0],
        dictionary: dictionary
    });

    //assert.equal( $('#t4-1').text() , "true" );
    assert.equal( $('#t4-2').text() , "1" );
    //assert.equal( $('#t4-3').text() , "TypeError/Cannot set property 'innerHTML' of null/TypeError: Cannot set property 'innerHTML' of null" );
    assert.ok( 
        $('#t4-3').text() == "TypeError/Cannot set property 'innerHTML' of null/TypeError: Cannot set property 'innerHTML' o" 
        || $('#t4-3').text() == "TypeError/document.getElementById(...) is null/fireError@http://127.0.0.1:9966/on-error.js:"
    );
    assert.equal( $('#t4-4').text() , "yes" );
    assert.equal( $('#t4-5').text() , "Infinity" );
});

QUnit.test( "on-error nothing test", function( assert ) {

    zpt.run({
        root: $( '#group5' )[0],
        dictionary: dictionary
    });

    assert.equal( $('#t5-1').text() , "" );
});

QUnit.test( "on-error literal structure test", function( assert ) {
    
    zpt.run({
        root: $( '#group6' )[0],
        dictionary: dictionary
    });

    assert.equal( $('#t6-1').html() , "&lt;strong&gt;Oh, noooo!&lt;/strong&gt;" );
    
    zpt.run({
        root: $( '#group7' )[0],
        dictionary: dictionary
    });

    assert.equal( $('#t7-1').html() , "<strong>Oh, noooo!</strong>" );
});

