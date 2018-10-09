"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

/* Simple tests */
var counter = 4;
var root = $( '#simple' )[0];
var dictionary = { 
    counter: counter
};

QUnit.test( "Rerun simple tests", function( assert ) {
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
