//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';
//import QUnit from '../../../lib/qunit-esm.js';

window.globalVar = 'It works!';

var c = 10;
dictionary.method = function(){
    return c++;
};
dictionary.toEncode1 = '#';

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Unit tests
QUnit.test( "String expressions test", function( assert ) {
    assert.equal( zz('#t1-1').html() , "" );
    assert.equal( zz('#t1-2').html() , "hello" );
    assert.equal( zz('#t1-3').html() , "help my string" );
    assert.equal( zz('#t1-4').html() , "www.string.org" );
    assert.equal( zz('#t1-5').html() , "give me $string or else" );
    assert.equal( zz('#t1-6').html() , "user is Bob" );
    assert.equal( zz('#t1-7').html() , "user is Bob" );
});

QUnit.test( "Exists expressions test", function( assert ) {
    assert.equal( zz('#t2-1').html() , "true" );
    assert.equal( zz('#t2-2').html() , "false" );
    assert.equal( zz('#t2-3').html() , "true" );
    assert.equal( zz('#t2-4').html() , "true" );
    assert.equal( zz('#t2-5').html() , "false" );
    assert.equal( zz('#t2-6').html() , "true" );
    assert.equal( zz('#t2-7').html() , "true" );
    assert.equal( zz('#t2-8').html() , "false" );
    assert.equal( zz('#t2-9').html() , "false" );
});

QUnit.test( "Not expressions test", function( assert ) {
    assert.equal( zz('#t3-1').html() , "0" );
    assert.equal( zz('#t3-2').html() , "true" );
    assert.equal( zz('#t3-3').html() , "1" );
    assert.equal( zz('#t3-4').html() , "false" );
    assert.equal( zz('#t3-5').html() , "false" );
    assert.equal( zz('#t3-6').html() , "true" );
    assert.equal( zz('#t3-7').html() , "true" );
    assert.equal( zz('#t3-8').html() , "false" );
    assert.equal( zz('#t3-9').html() , "false" );
    assert.equal( zz('#t3-10').html() , "true" );
});

QUnit.test( "Javascript expressions test", function( assert ) {
    assert.equal( zz('#t4-1').html() , "9" );
    assert.equal( zz('#t4-2').html() , "1" );
    assert.equal( zz('#t4-3').html() , "20" );
    assert.equal( zz('#t4-4').html() , "23" );
    assert.equal( zz('#t4-5').html() , "2" );
    assert.equal( zz('#t4-6').html() , "true" );
    assert.equal( zz('#t4-7').html() , "true" );
    assert.equal( zz('#t4-8').html() , "false" );
    assert.equal( zz('#t4-9').html() , "101" );
    assert.equal( zz('#t4-10').html() , "%23" );
});

QUnit.test( "Comparison expressions test", function( assert ) {
    assert.equal( zz('#t5-1').html() , "true" );
    assert.equal( zz('#t5-2').html() , "false" );
    assert.equal( zz('#t5-3').html() , "true" );
    assert.equal( zz('#t5-4').html() , "false" );
    assert.equal( zz('#t5-5').html() , "false" );
    assert.equal( zz('#t5-6').html() , "true" );
    assert.equal( zz('#t5-7').html() , "true" );
    assert.equal( zz('#t5-8').html() , "true" );
    assert.equal( zz('#t5-9').html() , "true" );
    assert.equal( zz('#t5-10').html() , "false" );
    assert.equal( zz('#t5-11').html() , "false" );
    assert.equal( zz('#t5-12').html() , "false" );
    assert.equal( zz('#t5-13').html() , "true" );
    assert.equal( zz('#t5-14').html() , "false" );
    assert.equal( zz('#t5-15').html() , "false" );
    assert.equal( zz('#t5-16').html() , "true" );
    assert.equal( zz('#t5-17').html() , "true" );
    assert.equal( zz('#t5-18').html() , "false" );
    assert.equal( zz('#t5-19').html() , "true" );
    assert.equal( zz('#t5-20').html() , "false" );
    assert.equal( zz('#t5-21').html() , "false" );
    assert.equal( zz('#t5-22').html() , "true" );
    assert.equal( zz('#t5-23').html() , "false" );
    assert.equal( zz('#t5-24').html() , "true" );
    assert.equal( zz('#t5-25').html() , "false" );
    assert.equal( zz('#t5-26').html() , "true" );
    assert.equal( zz('#t5-27').html() , "false" );
    assert.equal( zz('#t5-28').html() , "true" );
    assert.equal( zz('#t5-29').html() , "false" );
    assert.equal( zz('#t5-30').html() , "true" );
    assert.equal( zz('#t5-31').html() , "false" );
});

QUnit.test( "Math expressions test", function( assert ) {
    assert.equal( zz('#t6-1').html() , "9" );
    assert.equal( zz('#t6-2').html() , "1" );
    assert.equal( zz('#t6-3').html() , "20" );
    assert.equal( zz('#t6-4').html() , "23" );
    assert.equal( zz('#t6-5').html() , "2" );
    assert.equal( zz('#t6-6').html() , "101" );
    assert.equal( zz('#t6-7').html() , "202" );
});

QUnit.test( "Boolean expressions test", function( assert ) {
    assert.equal( zz('#t7-1').html() , "true" );
    assert.equal( zz('#t7-2').html() , "false" );
    assert.equal( zz('#t7-3').html() , "false" );
    assert.equal( zz('#t7-4').html() , "true" );
    assert.equal( zz('#t7-5').html() , "true" );
    assert.equal( zz('#t7-6').html() , "false" );
    assert.equal( zz('#t7-7').html() , "1" );
    assert.equal( zz('#t7-8').html() , "tree" );
    assert.equal( zz('#t7-9').html() , "tree2" );
    assert.equal( zz('#t7-10').html() , "tree2" );
    assert.equal( zz('#t7-11').html() , "literal with spaces 1" );
    assert.equal( zz('#t7-12').html() , "literal with spaces 1" );
});

QUnit.test( "Path expressions test", function( assert ) {
    assert.equal( zz('#t8-1').html() , "Bob" );
    assert.equal( zz('#t8-2').html() , "no enemies" );
    assert.equal( zz('#t8-3').html() , "no enemies" );
    assert.equal( zz('#t8-4').html() , "no enemies" );
    assert.equal( zz('#t8-5').html() , "Bob" );
    assert.equal( zz('#t8-6').html() , "Bob" );
    assert.equal( zz('#t8-7').html() , "no enemies" );
});


QUnit.test( "Literal expressions test", function( assert ) {
    assert.equal( zz('#t9-1').html() , "this is a string literal" );
    assert.equal( zz('#t9-2').html() , "123" );
    assert.equal( zz('#t9-3').html() , "123.45" );
    assert.equal( zz('#t9-4').html() , "true" );
    assert.equal( zz('#t9-5').html() , "false" );
});

QUnit.test( "Function calls expressions test", function( assert ) {
    assert.equal( zz('#t10-1').html() , "3" );
    assert.equal( zz('#t10-2').html() , "Infinity" );
    assert.equal( zz('#t10-3').html() , "3" );
    assert.equal( zz('#t10-4').html() , "101" );
    assert.equal( zz('#t10-5').html() , "5" );
});

QUnit.test( "Arrays test", function( assert ) {
    assert.equal( zz('#t11-1').html() , "item0" );
    assert.equal( zz('#t11-2').html() , "item1" );
    assert.equal( zz('#t11-3').html() , "item2" );
    assert.equal( zz('#t11-4').html() , "item0,item1,item2" );
    assert.equal( zz('#t11-5').html() , "6" );
    assert.equal( zz('#t11-6').html() , "10" );
    assert.equal( zz('#t11-7').html() , "1,2,3" );
    assert.equal( zz('#t11-8').html() , "1,2,3,1" );
    assert.equal( zz('#t11-9').html() , "7" );
});

QUnit.test( "Methods expressions test", function( assert ) {
    assert.equal( zz('#t12-1').html() , "25" );
    assert.equal( zz('#t12-2').html() , "11" );
    assert.equal( zz('#t12-3').html() , "3" );
});

QUnit.test( "Default expressions test", function( assert ) {
    assert.equal( zz('#t13-1').html() , "string" );
    assert.equal( zz('#t13-2').html() , "Bob" );
});

QUnit.test( "Some complex expressions test", function( assert ) {
    assert.equal( zz('#t14-1').html() , "1977" );
    assert.equal( zz('#t14-2').html() , "yes!" );
    assert.equal( zz('#t14-3').html() , "4" );
});

QUnit.test( "Map test", function( assert ) {
    assert.equal( zz('#t15-1').html() , "item0" );
    assert.equal( zz('#t15-2').html() , "Bob" );
    assert.equal( zz('#t15-3').html() , "Bob" );
});

QUnit.test( "Window object test", function( assert ) {
    assert.equal( zz('#t16-1').html() , 'It works!' );
});

QUnit.test( "Context object test", function( assert ) {
    assert.equal( zz('#t17-1').html() , 'context' );
});

QUnit.test( "Nocall expressions test", function( assert ) {
    assert.equal( zz('#t18-1').html() , '10' );
    assert.equal( zz('#t18-2').html() , '11' );
});

QUnit.test( "Indirection test", function( assert ) {
    assert.equal( zz('#t19-1').html() , "item0" );
    assert.equal( zz('#t19-2').html() , "Bob" );
});
