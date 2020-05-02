"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var QUnit = require( 'qunit' );
//var context = zpt.context;

var errorsArray;
var errorFunction = function( _errorsArray ) {
    
    errorsArray = _errorsArray;
    //alert( errorsArray );
};
zpt.context.setErrorFunction( errorFunction );

// Run tests!
QUnit.test( "Simple TALContent autoCommit true test", function( assert ) {

    var testNumber = 1;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 1,
            text1: 'test 1'
        }
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-2').text(), "" + arguments[ 1 ] );        
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test 1' );
    
    // Change number1
    dictionary.number1 = 2;
    testFunction( 2, 'test 1' );

    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 2, 'test 2' );
});

QUnit.test( "Simple TALContent autoCommit false test", function( assert ) {

    var testNumber = 2;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 1,
            text1: 'test 1'
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-2').text(), "" + arguments[ 1 ] );        
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test 1' );
    
    // Change number1
    dictionary.number1 = 2;
    testFunction( 1, 'test 1' );

    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 1, 'test 1' );
    
    // Commit changes
    dictionary._commitChanges();
    testFunction( 2, 'test 2' );
});
