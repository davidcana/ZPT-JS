"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunitjs' );

// Don't forget to declare to use original tags!
zpt.context.useOriginalTags();

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests!
QUnit.test( "Content test", function( assert ) {
    assert.equal( $('#t1-1').html() , "Bob" );
});

QUnit.test( "Define test", function( assert ) {
    assert.equal( $('#t2-1').html() , "1" );
});

QUnit.test( "Condition test", function( assert ) {
    assert.equal( $('#t3-1').html() , "Bob" );
    assert.notOk( $('#t3-2').is(':visible') );
});

QUnit.test( "Attributes test", function( assert ) {
    assert.equal( $('#t4-1').attr('title') , "title in string expression" );
    assert.equal( $('#t4-1').attr('href') , "http://www.xxx.org" );
});

QUnit.test( "Repeat test", function( assert ) {
    assert.equal( getAllValues( '.cValue1' ) , 'jaja/jeje/jiji' );
});

QUnit.test( "Omit-tag test", function( assert ) {
    assert.equal( $('#t6-1').html() , "Void omit-tag (should omit)" );
});

QUnit.test( "Replace test", function( assert ) {
    assert.equal( $('#t7-1').html() , "replaced text" );
});

QUnit.test( "On-error test", function( assert ) {
    assert.equal( $('#t8-1').text() , "Oh, noooo!" );
});


function getAllValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().join( '/' );
}
