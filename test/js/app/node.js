"use strict";

// jsdom: it is needed when no browser is available
var jsdom = require( 'node-jsdom' ).jsdom;

jsdom.env(
    '../../node.html',
    /*[ '../lib/jquery-2.0.3.js' ], */
    [ 'http://code.jquery.com/jquery.min.js' ],
    function( err, window ) {
        
        // Check if an error occurs
        if ( err ) {
            console.error( err );
            return 1;
        }

        // Copy window to global
        global.window = window;
        
        // Copy from window to lcal vars
        var $ = window.$;
        var document = window.document;
        //console.log( document.body.innerHTML.trim() );

        // Parse template
        var zpt = require( '../../../js/app/main.js' );
        zpt.run({
            root: document.body,
            dictionary: {
                throwError: function(){
                    throw 'An exception';
                }
            },
            callback: function(){
                console.log( 'Done!' );
            }
        });
        
        // Some tests
        var t2_1 = `
	        <p>
	            Before use macro
	        </p>
	        <b data-muse-macro="'copyright'" style="display: none;">
	            Macro goes here
	        </b><p data-mmacro="copyright">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>
	        <p>
	            In the middle of 2 macros
	        </p>
	        <b data-muse-macro="'copyright'" style="display: none;">
	            Macro goes here
	        </b><p data-mmacro="copyright">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>
	        <p>
	            After use macro
	        </p>`;
        assert( $('#t2-1').html().trim(), t2_1.trim() );
        
        assert( $('#t3-1').attr('title') , "title in string expression" );
        assert( $('#t3-1').attr('href') , "http://www.xxx.org" );
        
        assert( $('#t4-1').html() , "yes!" );
        assert( $('#t4-1').is(':visible'), true );
        assert( $('#t4-2').html() , "Bob" );
        assert( $('#t4-2').is(':visible'), true );
        assert( $('#t4-3').is(':visible'), false );
        assert( $('#t4-4').html() , "a name" );
        assert( $('#t4-4').is(':visible'), false );
        
        assert( $('#t5-1').html(), "hello" );

        assert( $('#t6-1').html() , "1" );
        assert( $('#t6-2').html() , "1.5" );
        assert( $('#t6-3').html() , "this is a text" );
        assert( $('#t6-4').html() , "this is a text too" );
        
        assert( $('#t7-1').html() , "(should omit)" );
        assert( $('#t7-2').html() , "not: lt: 1 0 (should omit)" );
        assert( $('#t7-3').html() , "<span data-tomit-tag=\"lt: 1 0\">lt: 1 0 (should not omit)</span>" );
        
        assert( $('#t8-1').text() , "1" );
        assert( $('#t8-2').text() , "Oh, noooo!" );
        
        assert( getValues( $('.t9-1') ) , '10/20/30' );
        assert( getValues( $('.t9-2') ) , '7/5/3/1' );
        
        assert( $('#t10-1').html() , "replaced text" );
        
        // Success!
        console.log( 'ZPT working properly in node.js!' );
    }
);

function assert( real, expected ){
    
    if ( real !== expected ){
        console.log( 'ZPT NOT working properly! \nReal: \n' + real + '\nExpected: \n' + expected );
        process.exit( 1 );
    }
}

function getValues( elements ){
    return elements.map( function( index, element ) {
        return this.innerHTML;
    } ).get().slice( 1 ).join( '/' );
}
