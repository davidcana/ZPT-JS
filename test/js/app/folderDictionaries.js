"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
require( '../../../js/app/jqueryPlugin.js' );
var utils = require( './utils.js' );

QUnit.test( "1 level of folder dictionaries tests", function( assert ) {
    
    var done = assert.async();
    
    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    $( '#t1' ).zpt({
        command: 'preload',
        dictionary: dictionary,
        maxFolderDictionaries: 5,
        callback: function(){

            // Run ZPT
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );
            
            done();
        }
    });
});

QUnit.test( "1 level of folder dictionaries with dictionaryExtension tests", function( assert ) {

    var done = assert.async();

    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    $( '#t1' ).zpt({
        command: 'preload',
        dictionary: dictionary,
        maxFolderDictionaries: 5,
        callback: function(){

            // Run ZPT
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );

            // Second render (defining folderVar1 in dictionaryExtension)
            var dictionaryExtension = { 
                folderVar1: 123
            };
            $( '#t1' ).zpt({
                dictionaryExtension: dictionaryExtension
            });
            runTests( assert, 11, 123, undefined, undefined );

            // Third render (not using dictionaryExtension)
            $( '#t1' ).zpt();
            runTests( assert, 11, 111, undefined, undefined );

            done();
        }
    });
});

QUnit.test( "1 level of folder dictionaries with dictionary tests", function( assert ) {

    var done = assert.async();

    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    $( '#t1' ).zpt({
        command: 'preload',
        dictionary: dictionary,
        maxFolderDictionaries: 5,
        callback: function(){

            // Run ZPT
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );

            // Second render (defining folderVar1 in dictionary)
            dictionary.folderVar1 = 123;
            $( '#t1' ).zpt();
            runTests( assert, 11, 123, undefined, undefined );

            // Third render (deleting folderVar1 in dictionary)
            delete dictionary.folderVar1;
            $( '#t1' ).zpt();
            runTests( assert, 11, 111, undefined, undefined );

            done();
        }
    });
});

var runTests = function( assert ){
    assert.equal( $('#t1-1').html() , '' + arguments[ 1 ] );
    assert.equal( $('#t1-2').html() , '' + arguments[ 2 ] );
    assert.equal( $('#t1-3').html() , '' + arguments[ 3 ] );
    assert.equal( $('#t1-4').html() , '' + arguments[ 4 ] );
}
