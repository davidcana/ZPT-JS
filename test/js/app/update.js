"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );
var context = zpt.context;

var errorsArray;
var errorFunction = function( _errorsArray ) {
    
    errorsArray = _errorsArray;
    /*alert( 
        errorsArray.join( '\n' ) 
    );*/
};
//zpt.context.setErrorFunction( errorFunction );

var Tree = function( name ) {
    this.name = name;
}

// Run tests!
QUnit.test( "simple not failing test", function( assert ) {
    
    errorsArray = undefined;
    dictionary.myTree = new Tree( 'Oak' );
    
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary,
        indexExpressions: true
    });
    
    assert.equal( $('#t1-1').text() , "1" );
    assert.equal( $('#t1-2').text() , "this is a text" );
    assert.equal( $('#t1-3').text() , "10,11,12,13,14,15" );
    assert.equal( $('#t1-4').text() , "this is a text too" );
    assert.equal( $('#t1-5').text() , "3" );
    assert.equal( $('#t1-6').text().substring(0,15) , "Mon Dec 24 2018" );
    assert.equal( $('#t1-7').text() , "Bob" );
    assert.equal( $('#t1-8').text() , "Oak" );
    
    assert.equal( errorsArray, undefined );
});
