"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunitjs' );

/* Simple tests */
var counter = 4;
var root = $( '#simple' )[0];

var zptParser = zpt.buildParser({
    root: root,
    dictionary: {}
});

zptParser.init(
    function(){
        zptParser.run();
        run();
    }
);

function run(){
    
    QUnit.test( "Rerun simple tests sync", function( assert ) {

        while ( counter > 0 ){
            
            var dictionary = { 
                counter: counter
            };
            
            zptParser.run({
                root: root,
                dictionary: dictionary
            });
            
            runTests( counter-- );
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
    });

}