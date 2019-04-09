"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var Qunit = require( 'qunit' );

/* Macro tests */
var root = $( '#macro' )[0];
var dictionary = { 
    counter: 4
};

QUnit.test( "Rerun macro tests", function( assert ) {
    zpt.run({
        root: root,
        dictionary: dictionary
    });

    function continueTesting(){
        runTests( dictionary.counter );
        if ( dictionary.counter-- > 1 ){
            zpt.run();
            continueTesting();
        }
    }

    function runTests( counter ){
        assert.equal( $('#t2-1').attr('title') , "counter=" + counter );

        if ( counter % 2 == 0 ){
            assert.ok( $('#t2-2').is(':visible') );
        } else {
            assert.notOk( $('#t2-2').is(':visible') );
        }

        assert.equal( $('#t2-3').html() , "counter=" + counter );
        assert.equal( $('#t2-4').html() , "counter=" + counter );

        var omitHtml =  $('#t2-5').html().trim();
        if ( counter % 2 == 0 ){
            assert.equal( omitHtml, "yes!" );
        } else{
            assert.ok( omitHtml.startsWith( "<span " ) );
            assert.ok( omitHtml.includes( "yes!" ) );
            assert.ok( omitHtml.endsWith( "</span>" ) );
        }

        assert.equal( $('#t2-6').html().trim() , "counter=" + counter );
    }
    
    continueTesting();
});
