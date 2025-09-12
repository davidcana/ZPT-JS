/* jshint esversion: 6 */

import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';
import { I18n } from '../../../js/app/i18n/i18n.js';
import { I18nBundle } from  '../../../js/app/i18n/i18nBundle.js';
import { utils } from './utils.js';

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
    assert.equal( zz('#t1-1').html() , "Bob" );
});

QUnit.test( "Define test", function( assert ) {
    assert.equal( zz('#t2-1').html() , "1" );
});

QUnit.test( "Condition test", function( assert ) {
    assert.equal( zz('#t3-1').html() , "Bob" );
    assert.notOk( zz('#t3-2').isVisible() );
});

QUnit.test( "Attributes test", function( assert ) {
    assert.equal( zz('#t4-1').attr('title') , "title in string expression" );
    assert.equal( zz('#t4-1').attr('href') , "http://www.xxx.org" );
});

QUnit.test( "Repeat test", function( assert ) {
    assert.equal( utils.getAllValues( '.cValue1' ) , 'jaja/jeje/jiji' );
    assert.equal( zz( '.cValue2' ).length , 0 );
});

QUnit.test( "Omit-tag test", function( assert ) {
    assert.equal( zz('#t6-1').html() , "Void omit-tag (should omit)" );
    assert.equal( zz('#t6-2').html() , '<span data-omit-tag="" data-content="c">Void omit-tag (should NOT omit)</span>' );
});

QUnit.test( "Replace test", function( assert ) {
    assert.equal( zz('#t7-1').html() , "replaced text" );
    assert.equal( zz('#t7-2').html() , "<span data-replace=\"'replaced text'\">should NOT be replaced</span>" );
});

QUnit.test( "On-error test", function( assert ) {
    assert.equal( zz('#t8-1').text() , "Oh, noooo!" );
});

QUnit.test( "Macros test", function( assert ) {

    var t9 = `
<div metal:use-macro="'enhacedSidebar'" data-id=\"18\" style="display: none;">
<em metal:fill-slot="'additional_info'" data-id=\"19\">
Make sure to check out our <a href="/specials">specials</a>.
</em>
</div><div data-mmacro="enhacedSidebar" data-related-id=\"18\" data-qdup="1">
Links
<div metal:define-slot="links">
<ul>
<li><a href="/">Home</a></li>
<li><a href="/products">Products</a></li>
<li><a href="/support">Support</a></li>
<li><a href="/contact">Contact Us</a></li>
</ul>
</div>
<em data-id=\"20\">
Make sure to check out our <a href="/specials">specials</a>.
</em>
</div>
`;
    utils.assertHtml( assert, 't9', t9 );
    //assert.htmlEqualExt( '#t9', t9 );
    /*
    assert.equal( 
        zz('#t9').html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
        t9.replace(/(\r\n|\n|\r|\t| )/gm,""), 
        "Passed!" );
        */
});

QUnit.test( "I18n test", function( assert ) {
    assert.equal( zz('#t10-1').html() , "¡Hola mundo!" );
    assert.equal( zz('#t10-2').html() , "Hello world!" );
});
