"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
require( '../../../js/app/jqueryPlugin.js' );

QUnit.test( "Defining new vars in dictionary extension tests", function( assert ) {
    
    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    $( '#t1' ).zpt({
        dictionary: dictionary
    });
    runTests( assert, 11, undefined, NaN );
    
    // Second render (defining var2 in dictionaryExtension)
    var dictionaryExtension = { 
        var2: 22
    };
    $( '#t1' ).zpt({
        dictionaryExtension: dictionaryExtension
    });
    runTests( assert, 11, 22, 33 );
    
    // Third render (not using dictionaryExtension)
    $( '#t1' ).zpt();
    runTests( assert, 11, undefined, NaN );
    
});

QUnit.test( "Redefining vars in dictionary extension tests", function( assert ) {
    
    // First render (defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11,
        var2: 2
    };
    $( '#t1' ).zpt({
        dictionary: dictionary
    });
    runTests( assert, 11, 2, 13 );
    
    // Second render (redefining var2 in dictionaryExtension)
    var dictionaryExtension = { 
        var2: 22
    };
    $( '#t1' ).zpt({
        dictionaryExtension: dictionaryExtension
    });
    runTests( assert, 11, 22, 33 );
    
    // Third render (not using dictionaryExtension)
    $( '#t1' ).zpt();
    runTests( assert, 11, 2, 13 );

});

var runTests = function( assert ){
    assert.equal( $('#t1-1').html() , '' + arguments[ 1 ] );
    assert.equal( $('#t1-2').html() , '' + arguments[ 2 ] );
    assert.equal( $('#t1-3').html() , '' + arguments[ 3 ] );
}
