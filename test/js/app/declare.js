//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
var context = zpt.context;
import { dictionary } from './dictionary.js';

var errorsArray;
var errorFunction = function( _errorsArray ) {
    
    errorsArray = _errorsArray;
    /*alert( 
        errorsArray.join( '\n' ) 
    );*/
};
zpt.context.setErrorFunction( errorFunction );

var Tree = function( name ) {
    this.name = name;
}

// Run tests!
QUnit.test( "simple not failing test", function( assert ) {
    
    errorsArray = undefined;
    context.setStrictMode( true );
    dictionary.myTree = new Tree( 'Oak' );
    
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t1-1').text() , "1" );
    assert.equal( zz('#t1-2').text() , "this is a text" );
    assert.equal( zz('#t1-3').text() , "10,11,12,13,14,15" );
    assert.equal( zz('#t1-4').text() , "this is a text too" );
    assert.equal( zz('#t1-5').text() , "3" );
    assert.equal( zz('#t1-6').text().substring(0,15) , "Mon Dec 24 2018" );
    assert.equal( zz('#t1-7').text() , "Bob" );
    assert.equal( zz('#t1-8').text() , "Oak" );
    
    assert.equal( errorsArray, undefined );
});

QUnit.test( "simple failing test", function( assert ) {
    
    errorsArray = undefined;
    context.setStrictMode( true );
    delete dictionary.myTree;
    
    zpt.run({
        root: document.getElementById( 't2' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t2-1').text() , "must not be evaluated" );
    assert.equal( zz('#t2-2').text() , "must not be evaluated" );
    assert.equal( zz('#t2-3').text() , "must not be evaluated" );
    assert.equal( zz('#t2-4').text() , "must not be evaluated" );
    assert.equal( zz('#t2-5').text() , "must not be evaluated" );
    assert.equal( zz('#t2-6').text() , "must not be evaluated" );
    assert.equal( zz('#t2-7').text() , "must not be evaluated" );
    assert.equal( zz('#t2-8').text() , "must not be evaluated" );
    assert.equal( zz('#t2-9').text() , "must not be evaluated" );
    assert.equal( zz('#t2-10').text() , "must not be evaluated" );

    assert.deepEqual( 
        errorsArray, 
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

    errorsArray = undefined;
    context.setStrictMode( false );
    
    zpt.run({
        root: document.getElementById( 't3' ),
        dictionary: dictionary
    });

    assert.equal( zz('#t3-1').text() , "6" );
    assert.equal( zz('#t3-2').text() , "1" );
    assert.equal( zz('#t3-3').text() , "5" );
    assert.equal( zz('#t3-4').text() , "1" );
    
    assert.equal( errorsArray, undefined );
});

QUnit.test( "Default value failing test", function( assert ) {

    errorsArray = undefined;
    context.setStrictMode( false );
    dictionary.myFunction = function(){
        return undefined;
    };
    
    zpt.run({
        root: document.getElementById( 't4' ),
        dictionary: dictionary
    });

    assert.equal( zz('#t4-1').text() , "must not be evaluated" );
    assert.equal( zz('#t4-2').text() , "must not be evaluated" );
    
    assert.deepEqual( 
        errorsArray, 
        [
            "Expected value type (number) of aNumber property does not match type (string), value is \"not a number\".",
            "Expected value type (number) of aString property does not match type (string), value is \"string\".",
            "Expected value type (string) of aValue property does not match type (undefined), value is \"undefined\".",
            "Required value must not be undefined: aValue"
        ] 
    );
});

QUnit.test( "Strict mode using declare test", function( assert ) {

    errorsArray = undefined;
    context.setStrictMode( false );
    
    zpt.run({
        root: document.getElementById( 't5' ),
        dictionary: dictionary
    });

    assert.equal( zz('#t5-1').text() , "5" );
    assert.equal( zz('#t5-2').text() , "must not be evaluated" );
    assert.equal( zz('#t5-3').text() , "must not be evaluated" );
    
    assert.deepEqual( 
        errorsArray, 
        "Not declared variable found using strict mode:nonDefinedNumber"
    );
});

QUnit.test( "Strict mode using context test", function( assert ) {

    errorsArray = undefined;
    context.setStrictMode( true );
    
    zpt.run({
        root: document.getElementById( 't6' ),
        dictionary: dictionary
    });

    assert.equal( zz('#t6-1').text() , "must not be evaluated" );
    assert.equal( zz('#t6-2').text() , "must not be evaluated" );

    assert.deepEqual( 
        errorsArray, 
        "Not declared variable found using strict mode:nonDefinedNumber"
    );
});

QUnit.test( "undefined type", function( assert ) {

    errorsArray = undefined;
    context.setStrictMode( false );
    
    zpt.run({
        root: document.getElementById( 't7' ),
        dictionary: dictionary
    });

    assert.equal( zz('#t7-1').text() , "it can be of any type" );
    assert.equal( zz('#t7-2').text() , "it can be of any type also" );

    assert.equal( errorsArray, undefined );
});

QUnit.test( "using tal:define in strict mode (not failing)", function( assert ) {
    
    errorsArray = undefined;
    context.setStrictMode( false );
    
    zpt.run({
        root: document.getElementById( 't8' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t8-1').text() , "1" );
    assert.equal( zz('#t8-2').text() , "2" );
    
    assert.equal( errorsArray, undefined );
});

QUnit.test( "using tal:define in strict mode (failing)", function( assert ) {
    
    errorsArray = undefined;
    context.setStrictMode( false );
    
    zpt.run({
        root: document.getElementById( 't9' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t9-1').text() , "1" );
    assert.equal( zz('#t9-2').text() , "must not be evaluated" );
    
    assert.deepEqual( 
        errorsArray, 
        "Not declared variable found using strict mode:number2"
    );
});

