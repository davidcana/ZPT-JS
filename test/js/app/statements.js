"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunitjs' );

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests!
QUnit.test( "Define test", function( assert ) {
    assert.equal( $('#t1-1').html() , "1" );
    assert.equal( $('#t1-2').html() , "1.5" );
    assert.equal( $('#t1-3').html() , "this is a text" );
    assert.equal( $('#t1-4').html() , "this is a text too" );
    assert.equal( $('#t1-5').html() , "1" );
    assert.equal( $('#t1-6').html() , "1.5" );
    assert.equal( $('#t1-7').html() , "this is a text" );
    assert.equal( $('#t1-8').html() , "this is a text too" );
});

QUnit.test( "Condition test", function( assert ) {
    assert.equal( $('#t2-1').html() , "yes!" );
    assert.ok( $('#t2-1').is(':visible') );
    assert.equal( $('#t2-2').html() , "Bob" );
    assert.ok( $('#t2-2').is(':visible') );
    assert.notOk( $('#t2-3').is(':visible') );
    assert.equal( $('#t2-4').html() , "a name" );
    assert.notOk( $('#t2-4').is(':visible') );
    assert.equal( $('#t2-5').html() , "yes!" );
    assert.ok( $('#t2-5').is(':visible') );
    assert.equal( $('#t2-6').html() , "Bob" );
    assert.ok( $('#t2-6').is(':visible') );
    assert.notOk( $('#t2-7').is(':visible') );
    assert.notOk( $('#t2-8').is(':visible') );
    assert.equal( $('#t2-8').html() , "a name" );
    assert.equal( $('#t2-9').html().trim() , "Bob" );
    assert.ok( $('#t2-9').is(':visible') );
    assert.equal( $('#t2-10').html().trim() , "<span data-treplace=\"user/name\">a name</span>" );
    assert.notOk( $('#t2-10').is(':visible') );
});

QUnit.test( "Attributes test", function( assert ) {
    assert.equal( $('#t3-1').attr('title') , "title in string expression" );
    assert.equal( $('#t3-1').attr('href') , "http://www.xxx.org" );
    assert.equal( $('#t3-2').attr('title') , "title in string expression" );
    assert.equal( $('#t3-2').attr('href') , "http://www.xxx.org" );
});