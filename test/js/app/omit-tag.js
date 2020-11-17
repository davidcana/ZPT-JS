"use strict";

var zz = require( 'zzdom' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var QUnit = require( 'qunit' );
var context = zpt.context;

// Run tests!
QUnit.test( "replace test", function( assert ) {
    
    context.setExpressionCounter( 100 );
    
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t1-1').html(), "replaced text" );
    assert.equal( zz('#t1-2').html(), "2" );
});

QUnit.test( "omit-tag test", function( assert ) {
    
    context.setExpressionCounter( 200 );
    
    zpt.run({
        root: document.getElementById( 't2' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t2-1').html(), "<span>Not using omit-tag (should not omit)</span>" );
    assert.equal( zz('#t2-2').html(), "Void omit-tag (should omit)" );
    assert.equal( zz('#t2-3').html(), "'true' literal (should omit)" );
    assert.equal( zz('#t2-4').html(), "gt: 1 0 (should omit)" );
    assert.equal( zz('#t2-5').html(), "not: lt: 1 0 (should omit)" );
    assert.equal( zz('#t2-6').html(), "1 (should omit)" );
    assert.equal( zz('#t2-7').html().replace(/(\r\n|\n|\r| )/gm, ""), "Children:<spandata-qdup=\"1\">1</span><spandata-qdup=\"1\">2</span><spandata-qdup=\"1\">3</span>" );
    assert.equal( zz('#t2-8').html(), "<span data-omit-tag=\"false\" data-id=\"206\">'false' literal (should not omit)</span>" );
    assert.equal( zz('#t2-9').html(), "<span data-omit-tag=\"lt: 1 0\" data-id=\"207\">lt: 1 0 (should not omit)</span>" );
    assert.equal( zz('#t2-10').html(), "<span data-omit-tag=\"not: gt: 1 0\" data-id=\"208\">not: gt: 1 0 (should not omit)</span>" );
    assert.equal( zz('#t2-11').html(), "<span data-omit-tag=\"0\" data-id=\"209\">1 (should not omit)</span>" );
    assert.equal( zz('#t2-12').html().replace(/(\r\n|\n|\r| )/gm, ""), "<spandata-omit-tag=\"false\"data-id=\"210\">Children:<span>1</span><span>2</span><span>3</span></span>" );
});

QUnit.test( "omit-tag and define test", function( assert ) {
    
    context.setExpressionCounter( 300 );
    
    zpt.run({
        root: document.getElementById( 't3' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t3-1').html(), "John" );
});
