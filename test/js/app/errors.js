"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );
var context = require( '../../../js/app/context.js' );

var errorFunction = function( errors ) {
    throw errors;
};
zpt.context.setErrorFunction( errorFunction );

// Unit tests
QUnit.test( "Non existing expressions test", function( assert ) {

    try {
        zpt.run({
            root: $( '#t1' )[0],
            dictionary: dictionary
        });
    } catch ( e ) {
        assert.equal( e , "Unknown expression: strinnnng:" );
    }
    
    assert.equal( $('#t1-1').html() , "not defined expression" );
    assert.equal( $('#t1-2').html() , "not defined expression" );
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

QUnit.test( "External macro in non-existing file test", function( assert ) {
    
    var done = assert.async();
    
    zpt.run({
        command: 'preload',
        root: document.body,
        dictionary: {},
        declaredRemotePageUrls: [],
        callback: function(){
            assert.equal( 0, 1, "Found external file, but it is an error!" );
            done();
        },
        failCallback: function( msg ){
            assert.equal( msg, "Error trying to get notFoundFile.html: Not Found" );
            done();
        }
    });
});

QUnit.test( "Non-existing i18n file test", function( assert ) {

    var done = assert.async();

    zpt.run({
        command: 'preload',
        root: document.body,
        dictionary: {},
        declaredRemotePageUrls: [],
        i18n: {
            urlPrefix: './i18n/',
            files: {
                'es': [ 'es1.json', 'es_notFound.json' ],
                'en': [ 'en1.json', 'en2.json' ]
            }
        },
        callback: function(){
            assert.equal( 0, 1, "Found external file, but it is an error!" );
            done();
        },
        failCallback: function( msg ){
            assert.equal( msg, "Error trying to get ./i18n/es_notFound.json: Not Found" );
            done();
        }
    });
});

QUnit.test( "Using null root test", function( assert ) {

    try {
        zpt.run({
            root: document.getElementById( 'nonExistentId' ),
            dictionary: dictionary
        });
    } catch( e ){
        assert.equal( e , "Unable to process null root or target!" );
    }
});

QUnit.test( "Using null target test", function( assert ) {

    zpt.run({
        root: $( '#t5' )[0],
        dictionary: dictionary
    });
    
    assert.equal( $('#t5-1').html() , "3" );
    
    try {
        zpt.run({
            command: 'partialRender',
            target: document.getElementById( 'nonExistentId' )
        });
        assert.equal( "true" , "false" );
        
    } catch( e ){
        assert.equal( e , "Unable to process null root or target!" );
    }
});
