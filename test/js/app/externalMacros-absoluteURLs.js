/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
var utils = require( './utils.js' );

var dictionary = { 
    template: '/test/externalMacros-definitions.html'
};

zpt.run({
    command: 'preload',
    root: document.body,
    dictionary: dictionary,
    declaredRemotePageUrls: [ dictionary.template ],
    callback: function(){
        zpt.run();
        runTests();
    }
});

function runTests(){
    
QUnit.test( "Simple macros test", function( assert ) {
    var t1 = `
        <p>
    Before use macro
</p>
<b style="display: none;" data-use-macro="copyright/externalMacros-definitions.html">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b style="display: none;" data-use-macro="copyright/externalMacros-definitions.html">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
        `;
    utils.assertHtml( assert, '#t1', t1 );
});

}
