"use strict";

// jsdom: it is needed when no browser is available
var jsdom = require( 'jsdom' );
var { JSDOM } = jsdom;

// Build JSDOM instance
var dom = new JSDOM(
    '<!DOCTYPE html>'
	+ '<html>'
	+ '<body><h1 id="t1" data-content="string:hello">a text</h1></body>'
	+ '</html>'
);

// Init some important vars
var window = dom.window;
var document = window.document;
global.window = window;

// Parse template
var zpt = require( '../../../js/app/main.js' );
zpt.run({
    root: document.body,
    dictionary: {}
});

// Do some tests
var actual = document.getElementById( 't1' ).innerHTML;
var expected = 'hello';
if ( actual !== expected ){
    console.log( 'ZPT NOT working properly using node.js! \nt1.innerHtml = ' + actual );
    return 1;
}

console.log( 'ZPT working properly using node.js!' );
return 0;
