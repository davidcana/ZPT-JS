"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );
var utils = require( './utils.js' );
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
QUnit.test( "simple METALUseMacro test", function( assert ) {
    
    var done = assert.async();
    
    var dictionary = {
        externalMacro: 'copyright@externalMacros-definitions.html'
    };

    errorsArray = undefined;

    zpt.run({
        command: 'preload',
        root: document.getElementById( 't5' ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            
            zpt.run({
                indexExpressions: true
            });
            
            var t5 = 
`<div data-use-macro=\"externalMacro\" data-id=\"1\" style=\"display: none;\">
                Macro goes here
            </div><p data-mmacro=\"copyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"1\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>`;
            assert.equal( $('#t5').html().trim(), t5 );

            var dictionaryChanges = {
                externalMacro: 'enhancedCopyright@externalMacros-definitions.html'
            };

            debugger;
            
            zpt.run({
                command: 'update',
                dictionaryChanges: dictionaryChanges
            });
            
            t5 = 
`<div data-use-macro=\"externalMacro\" data-id=\"1\" style=\"display: none;\">
                Macro goes here
            </div><div data-mmacro=\"enhancedCopyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"1\" data-qdup=\"1\">
            <p>
                This macro calls another macro.
            </p>
            <p data-use-macro=\"'copyright'\" data-id=\"2\" style=\"display: none;\">
                Macro goes here
            </p><p data-mmacro=\"copyright\" data-related-id=\"2\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>
        </div>`;
            assert.equal( $('#t5').html().trim(), t5 );
            
            done();
        }
    });
});

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
/*
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
*/
QUnit.test( "simple TALRepeat test", function( assert ) {

    var dictionary = {
        items: [ 1, 4, 9 ]
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't4' ),
        dictionary: dictionary,
        indexExpressions: true
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    var dictionaryChanges = {
        items: [ 2, 6, 8 ]
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( '2/6/8' );
});
