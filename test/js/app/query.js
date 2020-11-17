"use strict";

var zz = require( 'zzdom' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests!
QUnit.test( "id reference test", function( assert ) {
    assert.equal( zz('#value1').text() , "10" );
    assert.equal( zz('#t1').text() , "10" );
    assert.equal( zz('#value1').text() , zz('#t1').text() );
});

QUnit.test( "class reference test", function( assert ) {
    assert.equal( zz('#t2').text() , "10,20,30" );
});

QUnit.test( "add of class reference test", function( assert ) {
    assert.equal( zz('#t3').text() , "60" );
    assert.equal( zz('#t4').text() , "160" );
});

QUnit.test( "using vars test", function( assert ) {
    assert.equal( zz('#t5').text() , "20" );
    assert.equal( zz('#t6').text() , "260" );
});
