/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
var utils = require( './utils.js' );

var dictionary = { 
    template: '/test/externalMacros-definitions.html'
};

var init = function( assert ){
    
    var done = assert.async(); // QUnit's assert.async() function tells the framework to pause all tests until done() is called.
    zpt.run({
        command: 'preload',
        root: document.body,
        dictionary: dictionary,
        declaredRemotePageUrls: [ dictionary.template ],
        callback: function(){
            zpt.run();
            done();
        }
    });
}

QUnit.module( 'module', {  
    before: function( assert ){
        init( assert );
    }
});

runTests();

function runTests(){
    
QUnit.test( "Simple macros test", function( assert ) {
    var t1 = `
<p>
    Before use macro
</p>
<b data-use-macro="string:copyright@\${template}" data-id="1" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright" data-tauto-define="_externalMacroUrl '/test/externalMacros-definitions.html'" data-related-id="1" data-qdup="1">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b data-use-macro="'copyright@/test/externalMacros-definitions.html'" data-id="2" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="copyright" data-tauto-define="_externalMacroUrl '/test/externalMacros-definitions.html'" data-related-id="2" data-qdup="1">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
`;
    utils.assertHtml( assert, '#t1', t1 );
});

}
