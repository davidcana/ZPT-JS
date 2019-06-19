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
    
    var dictionary = {
        number1: 1,
        text1: 'test 1'
    };
    
    errorsArray = undefined;
    
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary,
        indexExpressions: true
    });
    
    var testFunction = function(){
        assert.equal( $('#t1-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t1-2').text() , "" + arguments[ 1 ] );        
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 1, 'test 1' );
    
    var dictionaryChanges = {
        number1: 2
    };
    dictionary.text1 = 'test 2';
    
    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });
    
    testFunction( 2, 'test 1' );
});
