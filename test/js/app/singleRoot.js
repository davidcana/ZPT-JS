/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );

var dictionary = {};

zpt.run({
    command: 'preload',
    root: [ $( '#m1' )[0], $( '#m2' )[0], $( '#m3' )[0] ],
    dictionary: dictionary,
    declaredRemotePageUrls: [],
    callback: function(){
        zpt.run();
        runMacro();
        runLoop();
    }
});

function runMacro(){
    
    QUnit.test( "Dynamic macros test", function( assert ) {
        var t1 = `
<p>
Before use macro
</p>
<b id="m1" data-muse-macro="'dynamicMacro@externalMacros-definitions.html'" style="display: none;">
Macro goes here
</b><p data-mmacro="dynamicMacro" data-tdefine="externalMacroUrl 'externalMacros-definitions.html'">
Dynamic text: <span data-tcontent="string:A test of a dynamic macro" data-tattributes="id string:t2-1">A test of a dynamic macro</span>
</p>
<p>
After use macro
</p>
`;
        assertHtml( assert, '#t1', t1 );
    });

}

function runLoop(){
    
    QUnit.test( "Dynamic macros test", function( assert ) {
        assert.equal( getAllValues( '.cValue1' ) , '10/20/30' );
    });
}

function getAllValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().join( '/' );
}

function assertHtml( assert, id1, id2 ){
    assert.equal( 
        $( id1 ).text().replace(/\s+/g, ""), 
        $( id2 ).text().replace(/\s+/g, ""), 
        "Passed!" ); 
}
