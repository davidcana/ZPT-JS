/* jshint esversion: 6 */
"use strict";

var Qunit = require( 'qunit' );
var utils = require( './utils.js' );

// jsdom: it is needed when no browser is available
var jsdom = require( 'jsdom' );
var { JSDOM } = jsdom;

// Read the file and print its contents.
var fs = require('fs'), 
    filename = 'test/node.html';

var init = function( assert ){
    
    var done = assert.async(); // QUnit's assert.async() function tells the framework to pause all tests until done() is called.
    
    fs.readFile(
        filename, 
        'utf8', 
        function( err, data ) {
            if ( err ) throw err;
            console.log( filename + ' read succesfully.');
            //console.log( 'data:\n' + data );

            // Build JSDOM instance
            var dom = new JSDOM( data );

            // Init some important vars
            var window = dom.window;
            var document = window.document;
            global.window = window;
            global.document = document;
            //console.log( 'document.body.innerHTML:\n' + document.body.innerHTML );

            // Parse template
            var zpt = require( '../../../index.cjs' );
            zpt.run({
                root: document.body,
                dictionary: {
                    throwError: function(){
                        throw 'An exception';
                    }
                }
            });

            console.log( 'ZPT was executed.' );
            done();
        }
    );
};

QUnit.module( 'module', {  
    before: function( assert ){
        init( assert );
    }
});

runTests();

function runTests(){
    
    QUnit.test( "Node test", function( assert ) {
        
        // Some tests
        var t2_1 = `
<p>
    Before use macro
</p>
<b data-use-macro="'copyright'" style="display: none;" data-id="1">
    Macro goes here
</b>
<p data-mmacro="copyright" data-qdup="1" data-related-id="1">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b data-use-macro="'copyright'" style="display: none;" data-id="2">
    Macro goes here
</b>
<p data-mmacro="copyright" data-qdup="1" data-related-id="2">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
    `;
        utils.assertHtml( assert, 't2-1', t2_1 );

        assert.equal( byId('t3-1').getAttribute('title') , "title in string expression" );
        assert.equal( byId('t3-1').getAttribute('href') , "http://www.xxx.org" );

        assert.equal( byId('t4-1').innerHTML, "yes!" );
        assert.equal( isVisible( byId('t4-1') ), true );
        assert.equal( byId('t4-2').innerHTML, "Bob" );
        assert.equal( isVisible( byId('t4-2') ), true );
        assert.equal( isVisible( byId('t4-3') ), false );
        assert.equal( byId('t4-4').innerHTML, "a name" );
        assert.equal( isVisible( byId('t4-4') ), false );

        assert.equal( byId('t5-1').innerText, "hello" );

        assert.equal( byId('t6-1').innerText , "1" );
        assert.equal( byId('t6-2').innerText , "1.5" );
        assert.equal( byId('t6-3').innerText , "this is a text" );
        assert.equal( byId('t6-4').innerText , "this is a text too" );

        assert.equal( byId('t7-1').innerHTML , "(should omit)" );
        assert.equal( byId('t7-2').innerHTML , "not: lt: 1 0 (should omit)" );
        assert.equal( byId('t7-3').innerHTML , "<span data-omit-tag=\"lt: 1 0\" data-id=\"15\">lt: 1 0 (should not omit)</span>" );

        assert.equal( byId('t8-1').textContent , "1" );
        assert.equal( byId('t8-2').textContent , "Oh, noooo!" );

        assert.equal( getValues( document.querySelectorAll('.t9-1') ) , '10/20/30' );
        assert.equal( getValues( document.querySelectorAll('.t9-2') ) , '7/5/3/1' );

        assert.equal( byId('t10-1').textContent , "replaced text" );

        // Success!
        console.log( 'ZPT working properly in node.js!' );
    });
}

function byId( id ){
    return window.document.getElementById( id );
}
function isVisible( elem ) {
    //console.log( 'display: ' + window.getComputedStyle( elem ).display  === 'none' );
    return window.getComputedStyle( elem ).display !== 'none';
}
/*
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
*/
/*
function isVisible( elem ) {
    return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};
*/

function getValues( elements ){
    
    var result = "";
    for ( var i = 0; i < elements.length; ++i ) {
        if ( i ){
            result += "/";
        }
        result += elements[ i ].textContent;
    }
    return result;
}
