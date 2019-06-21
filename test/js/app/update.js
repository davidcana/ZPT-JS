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

// Run tests!

QUnit.test( "simple TALContent test", function( assert ) {
    
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

QUnit.test( "simple TALAttributes test", function( assert ) {

    var dictionary = {
        number1: 100,
        text1: 'test 1'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't2' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( $('#t2-1').attr('maxlength') , "" + arguments[ 0 ] );
        assert.equal( $('#t2-1').attr('placeholder') , "" + arguments[ 1 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 100, 'test 1' );

    var dictionaryChanges = {
        text1: 'test 2'
    };
    dictionary.number1 = 200;

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 100, 'test 2' );
});

QUnit.test( "simple TALDefine test", function( assert ) {

    var dictionary = {
        number1: 1,
        text1: 'test'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't3' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( $('#t3-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t3-2').text() , "" + arguments[ 1 ] );
        assert.equal( $('#t3-3').text() , "" + arguments[ 2 ] );
        assert.equal( $('#t3-4').text() , "" + arguments[ 3 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test', 'test1', 'test100' );
    
    var dictionaryChanges = {
        number1: 2
    };
    
    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });
    
    testFunction( 2, 'test', 'test2', 'test100' );
});

/*
            case TALRepeat.id:

                break;
            case I18NDomain.id:
            case I18NLanguage.id:
            case TALOnError.id:
                attributeInstance.putToAutoDefineHelper( autoDefineHelper );
                break;
            case TALCondition.id:
            
                attributeInstance.process( scope, node );
                break;
            case METALUseMacro.id:

                break;
            case TALDeclare.id:
            
            metalFillSlot
*/

