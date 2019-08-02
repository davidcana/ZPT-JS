/* jshint esversion: 6 */
"use strict";

var utils = require( './utils.js' );

// jsdom: it is needed when no browser is available
var jsdom = require( 'jsdom' );
var { JSDOM } = jsdom;

// Read the file and print its contents.
var fs = require('fs'), 
    filename = 'test/node.html';
fs.readFile(
    filename, 
    'utf8', 
    function( err, data ) {
        if ( err ) throw err;
        console.log( 'OK: ' + filename );
        console.log( 'data:\n' + data );

        // Build JSDOM instance
        var dom = new JSDOM( 
            data,
            /*{
                beforeParse( window ) {
                    window.alert = window.console.log.bind( window.console );
                }
            }*/
        );

        // Init some important vars
        var window = dom.window;
        var document = window.document;
        global.window = window;
        console.log( 'document.body.innerHTML:\n' + document.body.innerHTML );
        
        // Parse template
        var zpt = require( '../../../js/app/main.js' );
        zpt.run({
            root: document.body,
            dictionary: {
                throwError: function(){
                    throw 'An exception';
                }
            }
        });

        console.log( 'Done!' );

        // Some tests
        var t2_1 = `
<p>
    Before use macro
</p>
<b data-use-macro="'copyright'" style="display: none;" data-id="1">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b data-use-macro="'copyright'" style="display: none;" data-id="2">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
`;
        //utils.assertHtml( assert, '#t2-1', t2_1 );
        //assert( byId('t2-1').innerHTML.trim(), t2_1.trim() );

        assert( byId('t3-1').getAttribute('title') , "title in string expression" );
        assert( byId('t3-1').getAttribute('href') , "http://www.xxx.org" );

        assert( byId('t4-1').innerHTML, "yes!" );
        //assert( isVisible ( byId('t4-1') ), true );
        assert( byId('t4-2').innerHTML, "Bob" );
        //assert( isVisible ( byId('t4-2') ), true );
        //assert( isVisible ( byId('t4-3') ), false );
        assert( byId('t4-4').innerHTML, "a name" );
        //assert( isVisible ( byId('t4-4') ), false );

        assert( byId('t5-1').innerText, "hello" );

        assert( byId('t6-1').innerText , "1" );
        assert( byId('t6-2').innerText , "1.5" );
        assert( byId('t6-3').innerText , "this is a text" );
        assert( byId('t6-4').innerText , "this is a text too" );

        assert( byId('t7-1').innerHTML , "(should omit)" );
        assert( byId('t7-2').innerHTML , "not: lt: 1 0 (should omit)" );
        assert( byId('t7-3').innerHTML , "<span data-omit-tag=\"lt: 1 0\" data-id=\"15\">lt: 1 0 (should not omit)</span>" );

        assert( byId('t8-1').textContent , "1" );
        assert( byId('t8-2').textContent , "Oh, noooo!" );

        assert( getValues( document.querySelectorAll('.t9-1') ) , '10/20/30' );
        assert( getValues( document.querySelectorAll('.t9-2') ) , '7/5/3/1' );

        assert( byId('t10-1').textContent , "replaced text" );

        // Success!
        console.log( 'ZPT working properly in node.js!' );
    }
);

function byId( id ){
    return window.document.getElementById( id );
}

function isVisible(elem) {
    //if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = window.getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
}
/*
function isVisible( elem ) {
    return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};
*/
function assert( real, expected ){
    
    if ( real != expected ){
        console.log( 'ZPT NOT working properly! \nReal: \n' + real + '\nExpected: \n' + expected );
        process.exit( 1 );
    }
}

function getValues( elements ){
    
    var result = "";
    for ( var i = 0; i < elements.length; ++i ) {
        if ( i ){
            result += "/";
        }
        result += elements[ i ].textContent;
    }
    return result;
    /*
    return elements.map( function( index, element ) {
        return this.innerHTML;
    } ).get().slice( 1 ).join( '/' );*/
}
