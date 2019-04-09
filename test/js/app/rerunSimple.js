"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
require( '../../../js/app/jqueryPlugin.js' );

QUnit.test( "Rerun simple tests", function( assert ) {
    
    var $root = $( '#simple' );
    var dictionary = { 
        counter: 4
    };
    
    $root.zpt({
        dictionary: dictionary
    });

    function continueTesting(){
        runTests( dictionary.counter );
        if ( dictionary.counter-- > 1 ){
            $root.zpt();
            continueTesting();
        }
    }

    function runTests( counter ){
        assert.equal( $('#t1-1').attr('title') , "counter=" + counter );

        if ( counter % 2 == 0 ){
            assert.ok( $('#t1-2').is(':visible') );
        } else {
            assert.notOk( $('#t1-2').is(':visible') );
        }

        assert.equal( $('#t1-3').html() , "counter=" + counter );
        assert.equal( $('#t1-4').html() , "counter=" + counter );
    }
    
    continueTesting();
});

QUnit.test( "Rerun and check dictionary vars", function( assert ) {

    $( '#ul1' ).zpt();
    runTests();
    
    $( '#ul2' ).zpt();
    runTests();
    
    function runTests(){
        
        assert.equal( $('#t2-1-1').html() , "1" );
        assert.equal( $('#t2-1-2').html() , "OK" );
        assert.equal( $('#t2-1-3').html() , "OK" );
        assert.equal( $('#t2-2-1').html() , "OK" );
        assert.equal( $('#t2-3-1').html() , "1" );
        assert.equal( $('#t2-3-2').html() , "OK" );
        assert.equal( $('#t2-3-3').html() , "OK" );
        assert.equal( $('#t2-4-1').html() , "2" );
        assert.equal( $('#t2-4-2').html() , "OK" );
        assert.equal( $('#t2-4-3').html() , "OK" );
    }
});

