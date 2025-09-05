//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';

// Parse template
zpt.run({
    root: [ zz( '#t1-1' )[0], zz( '#t1-3' )[0] ],
    dictionary: dictionary
});

// Unit tests
QUnit.test( "Multiroot test", function( assert ) {
    assert.equal( zz('#t1-1').html() , "hello" );
    assert.equal( zz('#t1-2').html() , "not rendered!" );
    assert.equal( zz('#t1-3').html() , "hello" );
});
