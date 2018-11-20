/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );
var I18n = require( '../../../js/app/i18n/i18n.js' );
var I18nBundle = require( '../../../js/app/i18n/i18nBundle.js' );

/* I18n maps init */
var msg = {
    en : {},
    es : {}
};

/* English i18n messages */
msg.en[ '/CONF/' ] = {
    language: 'en',
    locale: 'en-US'
};
msg.en[ 'Hello world!' ] = 'Hello world!';

/* Spanish i18n messages */
msg.es[ '/CONF/' ] = {
    language: 'es',
    locale: 'es-ES'
};
msg.es[ 'Hello world!' ] = '¡Hola mundo!';

// Create I18n and I18nBundle instances
var i18nES = new I18n( 'es', msg[ 'es' ] );
var i18nEN = new I18n( 'en', msg[ 'en' ] );
var i18nBundle = new I18nBundle( i18nES, i18nEN );

// Add to dictionary
dictionary.i18nBundle = i18nBundle;

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
    assert.equal( $( '.cValue2' ).length , 0 );
});

QUnit.test( "Omit-tag test", function( assert ) {
    assert.equal( $('#t6-1').html() , "Void omit-tag (should omit)" );
    assert.equal( $('#t6-2').html() , '<span data-tomit-tag="" data-tcontent="c">Void omit-tag (should NOT omit)</span>' );
});

QUnit.test( "Replace test", function( assert ) {
    assert.equal( $('#t7-1').html() , "replaced text" );
    assert.equal( $('#t7-2').html() , "<span data-treplace=\"'replaced text'\">should NOT be replaced</span>" );
});

QUnit.test( "On-error test", function( assert ) {
    assert.equal( $('#t8-1').text() , "Oh, noooo!" );
});

QUnit.test( "Macros test", function( assert ) {

    var t9 = `
<div metal:use-macro="'enhacedSidebar'" style="display: none;">
<em metal:fill-slot="'additional_info'">
Make sure to check out our <a href="/specials">specials</a>.
</em>
</div><div data-mmacro="enhacedSidebar" data-qdup="1">
Links
<div metal:define-slot="links">
<ul>
<li><a href="/">Home</a></li>
<li><a href="/products">Products</a></li>
<li><a href="/support">Support</a></li>
<li><a href="/contact">Contact Us</a></li>
</ul>
</div>
<em>
Make sure to check out our <a href="/specials">specials</a>.
</em>
</div>
`;
    //assert.htmlEqualExt( '#t9', t9 );
    assert.equal( 
        $('#t9').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
        t9.replace(/(\r\n|\n|\r|\t| )/gm,""), 
        "Passed!" );
});

QUnit.test( "I18n test", function( assert ) {
    assert.equal( $('#t10-1').html() , "¡Hola mundo!" );
    assert.equal( $('#t10-2').html() , "Hello world!" );
});

function getAllValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().join( '/' );
}
