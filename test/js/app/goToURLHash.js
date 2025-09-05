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
    root: document.body,
    dictionary: dictionary
});

QUnit.test( "Define test", function( assert ) {
    
    QUnit.config.scrolltop = false;
    
    assert.equal( zz('#t1-1').html() , "1" );
    assert.equal( zz('#t1-2').html() , "1.5" );
    assert.equal( zz('#t1-3').html() , "this is a text" );
    assert.equal( zz('#t1-4').html() , "this is a text too" );
    
    var element = window.document.getElementById( 't1' );
    assert.equal( isInViewport( element ) , true );
});

var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};
