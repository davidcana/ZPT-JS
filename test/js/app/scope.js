//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests!
QUnit.test( "Not defined var test", function( assert ) {
    assert.equal( zz('#t1-1').text() , "undefined" );
    assert.equal( zz('#t1-2').text() , "OK" );
});

QUnit.test( "Nested vars test", function( assert ) {
    assert.equal( zz('#t2-1').text() , "1" );
    assert.equal( zz('#t2-2').text() , "OK" );
    assert.equal( zz('#t2-3').text() , "OK" );
    assert.equal( zz('#t2-4').text() , "OK" );
    assert.equal( zz('#t2-5').text() , "OK" );
    assert.equal( zz('#t2-6').text() , "OK" );
    assert.equal( zz('#t2-7').text() , "2" );
    assert.equal( zz('#t2-8').text() , "OK" );
    assert.equal( zz('#t2-9').text() , "OK" );
    assert.equal( zz('#t2-10').text() , "three" );
    assert.equal( zz('#t2-11').text() , "OK" );
    assert.equal( zz('#t2-12').text() , "OK" );
    assert.equal( zz('#t2-13').text() , "4" );
    assert.equal( zz('#t2-14').text() , "OK" );
    assert.equal( zz('#t2-15').text() , "OK" );
    assert.equal( zz('#t2-16').text() , "2" );
    assert.equal( zz('#t2-17').text() , "OK" );
    assert.equal( zz('#t2-18').text() , "undefined" );
    assert.equal( zz('#t2-19').text() , "OK" );
    assert.equal( zz('#t2-20').text() , "OK" );
    assert.equal( zz('#t2-21').text() , "1" );
    assert.equal( zz('#t2-22').text() , "OK" );
    assert.equal( zz('#t2-23').text() , "undefined" );
    assert.equal( zz('#t2-24').text() , "var2 does not exist: OK" );
});

QUnit.test( "Out of scope var test", function( assert ) {
    assert.equal( zz('#t3-1').text() , "OK" );
    assert.equal( zz('#t3-2').text() , "undefined" );
    assert.equal( zz('#t3-3').text() , "OK" );
    assert.equal( zz('#t3-4').text() , "undefined" );
});

QUnit.test( "Global vars test", function( assert ) {
    assert.equal( zz('#t4-1').text() , "OK" );
    assert.equal( zz('#t4-2').text() , "OK" );
    assert.equal( zz('#t4-3').text() , "OK" );
    assert.equal( zz('#t4-4').text() , "1" );
    assert.equal( zz('#t4-5').text() , "OK" );
    assert.equal( zz('#t4-6').text() , "OK" );
    assert.equal( zz('#t4-7').text() , "1" );
    assert.equal( zz('#t4-8').text() , "OK" );
    assert.equal( zz('#t4-9').text() , "OK" );
    assert.equal( zz('#t4-10').text() , "OK" );
    assert.equal( zz('#t4-11').text() , "1" );
    assert.equal( zz('#t4-12').text() , "OK" );
    assert.equal( zz('#t4-13').text() , "OK" );
    assert.equal( zz('#t4-14').text() , "2" );
    assert.equal( zz('#t4-15').text() , "OK" );
    assert.equal( zz('#t4-16').text() , "OK" );
    assert.equal( zz('#t4-17').text() , "2" );
    assert.equal( zz('#t4-18').text() , "OK" );
    assert.equal( zz('#t4-19').text() , "OK" );
    assert.equal( zz('#t4-20').text() , "OK" );
    assert.equal( zz('#t4-21').text() , "1" );
    assert.equal( zz('#t4-22').text() , "OK" );
    assert.equal( zz('#t4-23').text() , "OK" );
    assert.equal( zz('#t4-24').text() , "2" );
    assert.equal( zz('#t4-25').text() , "OK" );
    assert.equal( zz('#t4-26').text() , "OK" );
    assert.equal( zz('#t4-27').text() , "1" );
});

QUnit.test( "Loops var test", function( assert ) {
    assert.equal( zz('#t5-1').text() , "OK" );
    assert.equal( zz('#t5-2').text() , "OK" );
});
