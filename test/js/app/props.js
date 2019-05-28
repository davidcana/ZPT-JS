"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );
var context = zpt.context;

var lastPropsErrorsArray;
var processPropsErrorsArray = function( errorsArray ) {
    
    lastPropsErrorsArray = errorsArray;
    /*alert( 
        errorsArray.join( '\n' ) 
    );*/
};
zpt.context.setProcessPropsErrorsArray( processPropsErrorsArray );

var Tree = function( name ) {
    this.name = name;
}

// Run tests!
QUnit.test( "simple not failing test", function( assert ) {
    
    lastPropsErrorsArray = undefined;
    dictionary.myTree = new Tree( 'Oak' );
    
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });
    
    assert.equal( $('#t1-1').text() , "1" );
    assert.equal( $('#t1-2').text() , "this is a text" );
    assert.equal( $('#t1-3').text() , "10,11,12,13,14,15" );
    assert.equal( $('#t1-4').text() , "this is a text too" );
    assert.equal( $('#t1-5').text() , "3" );
    assert.equal( $('#t1-6').text().substring(0,15) , "Mon Dec 24 2018" );
    assert.equal( $('#t1-7').text() , "Bob" );
    assert.equal( $('#t1-8').text() , "Oak" );
    
    assert.equal( lastPropsErrorsArray, undefined );
});

QUnit.test( "simple failing test", function( assert ) {
    
    lastPropsErrorsArray = undefined;
    delete dictionary.myTree;
    
    zpt.run({
        root: document.getElementById( 't2' ),
        dictionary: dictionary
    });
    
    assert.equal( $('#t2-1').text() , "must not be evaluated" );
    assert.equal( $('#t2-2').text() , "must not be evaluated" );
    assert.equal( $('#t2-3').text() , "must not be evaluated" );
    assert.equal( $('#t2-4').text() , "must not be evaluated" );
    assert.equal( $('#t2-5').text() , "must not be evaluated" );
    assert.equal( $('#t2-6').text() , "must not be evaluated" );
    assert.equal( $('#t2-7').text() , "must not be evaluated" );
    assert.equal( $('#t2-8').text() , "must not be evaluated" );
    
    assert.deepEqual( 
        lastPropsErrorsArray, 
        [
            "Expected value type (number) of number1 property does not match type (string), value is \"not number\".",
            "Expected value type (string) of text1 property does not match type (array), value is \"10,11,12,13,14,15\".",
            "Expected value type (array) of array1 property does not match type (string), value is \"not array\".",
            "Expected value type (string) of text2 property does not match type (undefined), value is \"undefined\".",
            "Required value must not be undefined: text2",
            "Expected value type (function) of array1 property does not match type (string), value is \"not array\".",
            "Expected value type (date) of dateValue2 property does not match type (undefined), value is \"undefined\".",
            "Expected value type (object) of user2 property does not match type (undefined), value is \"undefined\".",
            "Expected value type (tree) of myTree property does not match type (undefined), value is \"undefined\".",
            "Required value must not be undefined: aString2"
        ] 
    );
});

QUnit.test( "Default value not failing test", function( assert ) {

    lastPropsErrorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't3' ),
        dictionary: dictionary
    });

    assert.equal( $('#t3-1').text() , "6" );
    assert.equal( $('#t3-2').text() , "1" );
    assert.equal( $('#t3-3').text() , "5" );
    assert.equal( $('#t3-4').text() , "1" );
    
    assert.equal( lastPropsErrorsArray, undefined );
});

QUnit.test( "Default value failing test", function( assert ) {

    lastPropsErrorsArray = undefined;
    dictionary.myFunction = function(){
        return undefined;
    };
    
    zpt.run({
        root: document.getElementById( 't4' ),
        dictionary: dictionary
    });

    assert.equal( $('#t4-1').text() , "must not be evaluated" );
    assert.equal( $('#t4-2').text() , "must not be evaluated" );
    
    assert.deepEqual( 
        lastPropsErrorsArray, 
        [
            "Expected value type (number) of aNumber property does not match type (string), value is \"not a number\".",
            "Expected value type (number) of aString property does not match type (string), value is \"string\".",
            "Expected value type (string) of aValue property does not match type (undefined), value is \"undefined\".",
            "Required value must not be undefined: aValue"
        ] 
    );
});

QUnit.test( "Strict mode using props test", function( assert ) {

    lastPropsErrorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't5' ),
        dictionary: dictionary
    });

    assert.equal( $('#t5-1').text() , "5" );
    assert.equal( $('#t5-2').text() , "undefined" );
    assert.equal( $('#t5-3').text() , "NaN" );
    
    assert.deepEqual( 
        lastPropsErrorsArray, 
        [
            "Not declared variable found using strict mode:nonDefinedNumber"
        ] 
    );
});

QUnit.test( "Strict mode using context test", function( assert ) {

    lastPropsErrorsArray = undefined;
    context.setStrictMode( true );
    
    zpt.run({
        root: document.getElementById( 't6' ),
        dictionary: dictionary
    });

    assert.equal( $('#t6-1').text() , "undefined" );
    assert.equal( $('#t6-2').text() , "NaN" );

    assert.deepEqual( 
        lastPropsErrorsArray, 
        [
            "Not declared variable found using strict mode:nonDefinedNumber"
        ] 
    );
});

