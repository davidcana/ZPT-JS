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
    
    $( '#ul2' ).zpt({
        command: 'partialRender'
    });
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

QUnit.test( "Rerun and check dictionary vars (more complex)", function( assert ) {
    
    var dictionary = { 
        var: 10
    };
    
    $( '#ul2-1' ).zpt({
        dictionary: dictionary
    });
    runTests( 10, 10, 10 );

    dictionary.var = 20;
    $( '#ul2-2' ).zpt({
        command: 'partialRender'
    });
    runTests( 10, 20, 20 );
    
    dictionary.var = 30;
    $( '#ul2-3' ).zpt({
        command: 'partialRender'
    });
    runTests( 10, 20, 30 );
    
    function runTests( value1, value2, value3 ){

        assert.equal( $('#t3-1-1').html() , "1" );
        assert.equal( $('#t3-1-2').html() , "2" );
        assert.equal( $('#t3-1-3').html() , "" + value1 );
        
        assert.equal( $('#t3-2-1').html() , "1" );
        assert.equal( $('#t3-2-2').html() , "2" );
        assert.equal( $('#t3-2-3').html() , "" + value2 );
        assert.equal( $('#t3-2-4').html() , "" + (value2 + 1 + 2) );
        
        assert.equal( $('#t3-3-1').html() , "1" );
        assert.equal( $('#t3-3-2').html() , "2" );
        assert.equal( $('#t3-3-3').html() , "" + value3 );
        assert.equal( $('#t3-3-4').html() , "" + (value3 + 1 + 2) );
        assert.equal( $('#t3-3-5').html() , "" + (value3 + 2) );
    }
});

