"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
require( '../../../js/app/jqueryPlugin.js' );

QUnit.test( "Rerun simple tests", function( assert ) {
    
    var counter = 4;
    var root = $( '#simple' )[0];
    var dictionary = { 
        counter: counter
    };
    
    zpt.run({
        root: root,
        dictionary: dictionary
    });

    function continueTesting( root, counter ){
        runTests( counter );
        if ( counter > 1 ){
            var dictionary = { 
                counter: --counter
            };
            zpt.run({
                root: root,
                dictionary: dictionary
            });
            continueTesting( root, counter );
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
    
    continueTesting( root, counter );
});

QUnit.test( "Rerun and check dictionary vars", function( assert ) {

    var dictionary = {};

    $( '#ul1' ).zpt({
        dictionary: dictionary
    });
    runTests();
    
    $( '#ul2' ).zpt({
        dictionary: dictionary
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

