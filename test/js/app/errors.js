"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

// Unit tests
QUnit.test( "Non existing expressions test", function( assert ) {

    zpt.run({
        root: $( '#t1' )[0],
        dictionary: dictionary
    });
    
    assert.equal( $('#t1-1').html() , "undefined" );
    assert.equal( $('#t1-2').html() , "undefined" );
});

QUnit.test( "Using null values in expressions test", function( assert ) {

    try {
        zpt.run({
            root: $( '#t2' )[0],
            dictionary: dictionary
        });
    } catch( e ){
        assert.equal( e , "Error trying doing math operation, value 'null' is not a valid number in expression 'add nullValue'" );
    }
});

QUnit.test( "Using null values in path expressions test", function( assert ) {

    try {
        zpt.run({
            root: $( '#t3' )[0],
            dictionary: dictionary
        });
    } catch( e ){
        assert.equal( e , "Error evaluating \"nullValue/noWay\": \"nullValue\" is null" );
    }
});