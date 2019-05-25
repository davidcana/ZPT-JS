"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

var lastPropsErrorsArray;
var processPropsErrorsArray = function( errorsArray ) {
    
    lastPropsErrorsArray = errorsArray;
    alert( 
        errorsArray.join( '\n' ) 
    );
};
zpt.context.setProcessPropsErrorsArray( processPropsErrorsArray );

// Run tests!
QUnit.test( "simple not failing test", function( assert ) {
    
    lastPropsErrorsArray = undefined;
    
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });
    
    assert.equal( $('#t1-1').text() , "1" );
    assert.equal( $('#t1-2').text() , "this is a text" );
    assert.equal( $('#t1-3').text() , "10,11,12,13,14,15" );
    assert.equal( $('#t1-4').text() , "this is a text too" );
    
    assert.equal( lastPropsErrorsArray, undefined );
});

QUnit.test( "simple failing test", function( assert ) {
    
    lastPropsErrorsArray = undefined;
    
    zpt.run({
        root: document.getElementById( 't2' ),
        dictionary: dictionary
    });
    
    assert.equal( $('#t2-1').text() , "must not be evaluated" );
    assert.equal( $('#t2-2').text() , "must not be evaluated" );
    assert.equal( $('#t2-3').text() , "must not be evaluated" );
    assert.equal( $('#t2-4').text() , "must not be evaluated" );
    
    assert.deepEqual( 
        lastPropsErrorsArray, 
        [
            "Expected value type (number) of number1 property does not match type (string), value is \"not number\".",
            "Expected value type (string) of text1 property does not match type (array), value is \"10,11,12,13,14,15\".",
            "Expected value type (array) of array1 property does not match type (string), value is \"not array\".",
            "Expected value type (string) of text2 property does not match type (undefined), value is \"undefined\".",
            "Required value must not be undefined: text2"
        ] 
    );
});