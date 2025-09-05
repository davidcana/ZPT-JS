//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';

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

QUnit.test( "Define test", function( assert ) {
    assert.equal( zz('#t1-1').html() , "1" );
    assert.equal( zz('#t1-2').html() , "1.5" );
    assert.equal( zz('#t1-3').html() , "this is a text" );
    assert.equal( zz('#t1-4').html() , "this is a text too" );
    assert.equal( zz('#t1-5').html() , "1" );
    assert.equal( zz('#t1-6').html() , "1.5" );
    assert.equal( zz('#t1-7').html() , "this is a text" );
    assert.equal( zz('#t1-8').html() , "this is a text too" );
});

QUnit.test( "Condition test", function( assert ) {
    assert.equal( zz('#t2-1').html() , "yes!" );
    assert.ok( zz('#t2-1').isVisible() );
    assert.equal( zz('#t2-2').html() , "Bob" );
    assert.ok( zz('#t2-2').isVisible() );
    assert.notOk( zz('#t2-3').isVisible() );
    assert.equal( zz('#t2-4').html() , "a name" );
    assert.notOk( zz('#t2-4').isVisible() );
    assert.equal( zz('#t2-5').html() , "yes!" );
    assert.ok( zz('#t2-5').isVisible() );
    assert.equal( zz('#t2-6').html() , "Bob" );
    assert.ok( zz('#t2-6').isVisible() );
    assert.notOk( zz('#t2-7').isVisible() );
    assert.notOk( zz('#t2-8').isVisible() );
    assert.equal( zz('#t2-8').html() , "a name" );
    assert.equal( zz('#t2-9').html().trim() , "Bob" );
    assert.ok( zz('#t2-9').isVisible() );
    assert.equal( zz('#t2-10').html().trim() , "<span data-replace=\"user/name\">a name</span>" );
    assert.notOk( zz('#t2-10').isVisible() );
});

QUnit.test( "Attributes test", function( assert ) {
    assert.equal( zz('#t3-1').attr('placeholder') , "Write something here!" );
    assert.equal( zz('#t3-1').attr('rows') , "10" );
    assert.equal( zz('#t3-1').attr('cols') , "100" );
    assert.equal( zz('#t3-1').attr('maxlength') , "200" );
    assert.equal( zz('#t4-1').attr('title') , "title in string expression" );
    assert.equal( zz('#t4-1').attr('href') , "http://www.xxx.org" );
    assert.equal( zz('#t4-2').attr('title') , "title in string expression" );
    assert.equal( zz('#t4-2').attr('href') , "http://www.xxx.org" );
    assert.equal( zz('#t5-1').attr('title'), undefined );
    assert.equal( zz('#t5-1').attr('href') , "http://www.xxx.org" );
    assert.equal( zz('#t5-2').attr('title') , "title in string expression" );
    assert.equal( zz('#t5-2').attr('href') , "http://www.xxx.org" );
    assert.equal( zz('#t5-3').attr('placeholder') , "Write something here!" );
    assert.equal( zz('#t5-3').attr('maxlength') , "200" );
});

QUnit.test( "Content test", function( assert ) {
    assert.equal( zz('#t6-1').html() , "This is a &lt;strong&gt;formatted&lt;/strong&gt; text" );
    assert.equal( zz('#t6-2').html() , "This is a <strong>formatted</strong> text" );
    assert.equal( zz('#t6-3').html() , "a formatted text" );
    assert.equal( zz('#t6-4').html() , "" );
});

QUnit.test( "Replace test", function( assert ) {
    assert.equal( zz('#t7-1').html() , "This is a &lt;strong&gt;formatted&lt;/strong&gt; text" );
    assert.equal( zz('#t7-2').html() , "This is a <strong>formatted</strong> text" );
    assert.equal( zz('#t7-3').html() , "<span data-replace=\"default\" data-id=\"36\">a formatted text</span>" );
    assert.equal( zz('#t7-4').html() , "" );
});
