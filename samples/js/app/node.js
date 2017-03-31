"use strict";

// node-jsdom: it is needed when no browser is available
var jsdom = require( 'node-jsdom' ).jsdom;

jsdom.env(
    '<!doctype html>'
	+ '<html>'
	+ '<body><h1 id="t1" data-tcontent="string:hello">a text</h1></body>'
	+ '</html>', 
    /*[ '../../../js/lib/jquery-2.0.3.js' ], */
    [ 'http://code.jquery.com/jquery.min.js' ], 
    function( err, window ) {
        
        // Check if an error occurs
        if ( err ) {
            console.error( err );
            return 1;
        }

        // Copy window to global
        global.window = window;
        
        // Copy from window to local vars
        var $ = window.$;
        var document = window.document;
        //console.log( document.body.innerHTML );

        // Parse template
        var zpt = require( '../../../js/app/main.js' );
        
        zpt.run({
            root: document.body,
            dictionary: {},
            callback: function(){
                console.log( 'Done!' );
                //console.log( $('#t1').html() );
            }
        });
        
        // Some tests
        if ( $('#t1').html() !== "hello" ){
            console.log( 'ZPT NOT working properly! ' + $('#t1').html() );
            return 1;
        }

        console.log( 'ZPT working properly!' );
    }
);

