"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests!
QUnit.test( "replace test", function( assert ) {
    assert.equal( $('#t1-1').html() , "replaced text" );
    assert.equal( $('#t1-2').html() , "2" );
});

QUnit.test( "omit-tag test", function( assert ) {
    assert.equal( $('#t2-1').html() , "<span>Not using omit-tag (should not omit)</span>" );
    assert.equal( $('#t2-2').html() , "Void omit-tag (should omit)" );
    assert.equal( $('#t2-3').html() , "'true' literal (should omit)" );
    assert.equal( $('#t2-4').html() , "gt: 1 0 (should omit)" );
    assert.equal( $('#t2-5').html() , "not: lt: 1 0 (should omit)" );
    assert.equal( $('#t2-6').html() , "1 (should omit)" );
    assert.equal( $('#t2-7').html().replace(/(\r\n|\n|\r| )/gm,"") , "Children:<span>1</span><span>2</span><span>3</span>" );
    
    assert.equal( $('#t2-8').html() , "<span data-tomit-tag=\"false\">'false' literal (should not omit)</span>" );
    assert.equal( $('#t2-9').html() , "<span data-tomit-tag=\"lt: 1 0\">lt: 1 0 (should not omit)</span>" );
    assert.equal( $('#t2-10').html() , "<span data-tomit-tag=\"not: gt: 1 0\">not: gt: 1 0 (should not omit)</span>" );
    assert.equal( $('#t2-11').html() , "<span data-tomit-tag=\"0\">1 (should not omit)</span>" );
    assert.equal( $('#t2-12').html().replace(/(\r\n|\n|\r| )/gm,"") , "<spandata-tomit-tag=\"false\">Children:<span>1</span><span>2</span><span>3</span></span>" );
    
});


