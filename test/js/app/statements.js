"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

// Add some values to dictionary
dictionary.textareaAttrs = {
    rows: 10,
    cols: 100
};
dictionary.formatted = 'This is a <strong>formatted</strong> text';

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
    assert.equal( $('#t2-10').html().trim() , "<span data-replace=\"user/name\">a name</span>" );
    assert.notOk( $('#t2-10').is(':visible') );
});

QUnit.test( "Attributes test", function( assert ) {
    assert.equal( $('#t3-1').attr('placeholder') , "Write something here!" );
    assert.equal( $('#t3-1').attr('rows') , "10" );
    assert.equal( $('#t3-1').attr('cols') , "100" );
    assert.equal( $('#t3-1').attr('maxlength') , "200" );
    assert.equal( $('#t4-1').attr('title') , "title in string expression" );
    assert.equal( $('#t4-1').attr('href') , "http://www.xxx.org" );
    assert.equal( $('#t4-2').attr('title') , "title in string expression" );
    assert.equal( $('#t4-2').attr('href') , "http://www.xxx.org" );
    assert.equal( $('#t5-1').attr('title'), undefined );
    assert.equal( $('#t5-1').attr('href') , "http://www.xxx.org" );
    assert.equal( $('#t5-2').attr('title') , "title in string expression" );
    assert.equal( $('#t5-2').attr('href') , "http://www.xxx.org" );
    assert.equal( $('#t5-3').attr('placeholder') , "Write something here!" );
    assert.equal( $('#t5-3').attr('maxlength') , "200" );
});

QUnit.test( "Content test", function( assert ) {
    assert.equal( $('#t6-1').html() , "This is a &lt;strong&gt;formatted&lt;/strong&gt; text" );
    assert.equal( $('#t6-2').html() , "This is a <strong>formatted</strong> text" );
    assert.equal( $('#t6-3').html() , "a formatted text" );
    assert.equal( $('#t6-4').html() , "" );
});

QUnit.test( "Replace test", function( assert ) {
    assert.equal( $('#t7-1').html() , "This is a &lt;strong&gt;formatted&lt;/strong&gt; text" );
    assert.equal( $('#t7-2').html() , "This is a <strong>formatted</strong> text" );
    assert.equal( $('#t7-3').html() , "<span data-replace=\"default\">a formatted text</span>" );
    assert.equal( $('#t7-4').html() , "" );
});
